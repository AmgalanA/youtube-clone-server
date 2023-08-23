import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';

import { IGenerateTokensDto } from './dtos/generate-tokens.dto';
import { TokenModel } from './models/token.model';

@Injectable()
export class TokenService {
  constructor(
    @InjectModel(TokenModel) private tokenRepository: typeof TokenModel,
    private jwtService: JwtService,
  ) {}

  generateTokens(dto: IGenerateTokensDto) {
    const accessToken = this.jwtService.sign(dto, {
      secret: process.env.ACCESS_SECRET || 'access_secret',
      expiresIn: '30m',
    });

    const refreshToken = this.jwtService.sign(dto, {
      secret: process.env.REFRESH_SECRET || 'refresh_secret',
      expiresIn: '24h',
    });

    return { accessToken, refreshToken };
  }

  async saveToken(token: string, userId: number) {
    const candidate = await this.tokenRepository.findOne({ where: { userId } });

    if (candidate) {
      candidate.refreshToken = token;

      return candidate.save();
    }

    const tokenFromDB = await this.tokenRepository.create({
      refreshToken: token,
      userId,
    });

    return tokenFromDB;
  }

  async getOne(refreshToken: string) {
    const token = await this.tokenRepository.findOne({
      where: { refreshToken },
    });

    if (!token) return null;

    return token;
  }

  async verifyAccessToken(token: string) {
    const tokenData = await this.jwtService.verify(token, {
      secret: process.env.ACCESS_SECRET || 'access_secret',
    });

    if (!tokenData) return null;

    return tokenData;
  }

  async verifyRefreshToken(
    token: string,
  ): Promise<{ userId: number; email: string }> {
    const tokenData = await this.jwtService.verify(token, {
      secret: process.env.REFRESH_SECRET || 'refresh_secret',
    });

    if (!tokenData) return null;

    return tokenData;
  }

  async handleTokens(dto: IGenerateTokensDto) {
    const tokens = this.generateTokens(dto);

    await this.saveToken(tokens.refreshToken, dto.userId);

    return tokens;
  }

  async delete(refreshToken: string) {
    const token = await this.tokenRepository.destroy({ where: { refreshToken }})
  
    return token;
  } 
}
