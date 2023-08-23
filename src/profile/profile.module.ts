import { SequelizeModule } from '@nestjs/sequelize';
import { Module } from '@nestjs/common';

import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { ProfileModel } from './models/profile.model';
import { FileModule } from 'src/file/file.module';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService],
  exports: [ProfileService],
  imports: [SequelizeModule.forFeature([ProfileModel]), FileModule],
})
export class ProfileModule {}
