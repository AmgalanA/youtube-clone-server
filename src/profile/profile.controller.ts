import {
  Controller,
  Put,
  UseInterceptors,
  UploadedFile,
  Body,
  Param,
  Patch,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { updateProfileDto } from './dtos/update-profile.dto';
import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Put('update')
  @UseInterceptors(FileInterceptor('file'))
  update(
    @Body() dto: updateProfileDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.profileService.updateProfile(dto, file);
  }

  @Patch('toggle-online/:id')
  toggleOnline(@Param('id') id: string) {
    return this.profileService.toggleIsOnline(+id);
  }
}
