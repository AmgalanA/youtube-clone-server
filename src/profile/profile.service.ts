import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FileService, FileType } from 'src/file/file.service';

import { createProfileDto } from './dtos/create-profile.dto';
import { updateProfileDto } from './dtos/update-profile.dto';
import { ProfileModel } from './models/profile.model';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(ProfileModel) private profileRepository: typeof ProfileModel,
    private fileService: FileService,
  ) {}

  async create(dto: createProfileDto) {
    const candidate = await this.profileRepository.findOne({
      where: { userId: dto.userId },
    });

    if (candidate) {
      return candidate;
    }

    if (!dto.name || !dto.secondName) {
      throw new BadRequestException(
        `Please provide name and secondName for user.`,
      );
    }

    const profile = await this.profileRepository.create({
      name: dto.name,
      secondName: dto.secondName,
      userId: dto.userId,
    });

    return profile;
  }

  async byId(id: number) {
    const profile = await this.profileRepository.findOne({
      where: { id },
      include: { all: true },
    });

    if (!profile) {
      throw new BadRequestException(`No profile with id: ${id}.`);
    }

    return profile;
  }

  async byUserId(userId: number) {
    const profile = await this.profileRepository.findOne({
      where: { userId },
      include: { all: true },
    });

    if (!profile) {
      throw new BadRequestException(`No profile with user id: ${userId}.`);
    }

    return profile;
  }

  async updateProfile(dto: updateProfileDto, file?: Express.Multer.File) {
    let avatarUrl = '';

    const profile = await this.byId(dto.id);

    if (file) {
      avatarUrl = this.fileService.createFile(FileType.AVATAR, file);
    }

    if (dto.name) {
      profile.name = dto.name;
    }

    if (dto.status) {
      profile.status = dto.status;
    }

    if (dto.secondName) {
      profile.secondName = dto.secondName;
    }

    if (avatarUrl) {
      profile.avatarUrl = avatarUrl;
    }

    return profile.save();
  }

  async toggleIsOnline(id: number) {
    const profile = await this.byId(id);

    if (profile.isOnline) {
      profile.isOnline = false;
      profile.lastSeen = new Date(Date.now()).getTime().toString();
    } else {
      profile.isOnline = true;
    }

    return profile.save();
  }
}
