import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as uuid from 'uuid';
import * as path from 'path';
import * as fs from 'fs';

export enum FileType {
  VIDEO_URL = 'video-url',
  THUMBNAIL_URL = 'thumbnail-url',
  AVATAR = 'avatar',
}

@Injectable()
export class FileService {
  createFile(type: FileType, file: Express.Multer.File) {
    try {
      const fileExtension = file.originalname.split('.').pop();

      const fileName = uuid.v4() + '.' + fileExtension;

      const filePath = path.resolve(__dirname, '..', 'static', type);

      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
      }

      fs.writeFileSync(path.resolve(filePath, fileName), file.buffer);

      return type + '/' + fileName;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
