import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { TokenService } from './token.service';
import { TokenController } from './token.controller';
import { TokenModel } from './models/token.model';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [TokenController],
  providers: [TokenService],
  imports: [SequelizeModule.forFeature([TokenModel]), JwtModule.register({})],
  exports: [TokenService],
})
export class TokenModule {}
