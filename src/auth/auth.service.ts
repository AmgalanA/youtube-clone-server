import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { hash, compare } from 'bcryptjs';

import { ProfileModel } from 'src/profile/models/profile.model';
import { ProfileService } from 'src/profile/profile.service';
import { TokenService } from 'src/token/token.service';
import { loginUserDto } from './dtos/login-user.dto';

import { registerUserDto } from './dtos/register-user.dto';
import { AuthModel } from './models/auth.model';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(AuthModel) private authRepository: typeof AuthModel,
    private profileService: ProfileService,
    private tokenService: TokenService,
  ) {}

  async register(dto: registerUserDto) {
    const candidate = await this.authRepository.findOne({
      where: { email: dto.email },
    });

    if (candidate) {
      throw new BadRequestException(
        `User with email: ${dto.email} already registered.`,
      );
    }

    const hashPassword = await hash(dto.password, 5);

    const user = await this.authRepository.create({
      email: dto.email,
      password: hashPassword,
    });

    const getProfilePayload = {
      name: dto.name,
      secondName: dto.secondName,
    };

    const payload = await this.handleGettingProfile(user, getProfilePayload);

    return payload;
  }

  async handleGettingProfile(
    user: AuthModel,
    dto?: { secondName?: string; name?: string },
  ) {
    let profile: ProfileModel;

    const tokenPayload = {
      userId: user.id,
      email: user.email,
    };

    const tokens = await this.tokenService.handleTokens(tokenPayload);

    if (dto) {
      const payload = {
        name: dto.name,
        secondName: dto.secondName,
        userId: user.id,
      };

      profile = await this.profileService.create(payload);
    } else {
      profile = await this.profileService.byUserId(user.id);
    }

    return { tokens, profile };
  }

  async login(dto: loginUserDto) {
    const user = await this.authRepository.findOne({
      where: { email: dto.email },
    });

    if (!user) {
      throw new BadRequestException(`No user with email: ${dto.email}`);
    }

    const isPassEquals = await compare(dto.password, user.password);

    if (!isPassEquals) {
      throw new BadRequestException(`Passwords do not match.`);
    }

    const payload = await this.handleGettingProfile(user);

    return payload;
  }

  async byId(id: number) {
    const user = await this.authRepository.findOne({
      where: { id },
      include: { all: true },
    });

    if (!user) {
      throw new BadRequestException(`No user with id: ${id}.`);
    }

    return user;
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException(`Not Authorized.`);
    }

    const tokenData = await this.tokenService.verifyRefreshToken(refreshToken);
    const tokenFromDB = await this.tokenService.getOne(refreshToken);

    if (!tokenData || !tokenFromDB) {
      throw new UnauthorizedException(`Not Authorized.`);
    }

    const user = await this.byId(tokenData.userId);

    const payload = await this.handleGettingProfile(user);

    return payload;
  }

  async logout(refreshToken: string) {
    const token = await this.tokenService.delete(refreshToken);

    return token;
  }
}
