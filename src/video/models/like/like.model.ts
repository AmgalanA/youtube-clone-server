import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { ProfileModel } from 'src/profile/models/profile.model';
import { VideoModel } from '../video/video.model';
import { ILikeCreatingAttrs } from './like.interface';

@Table({ tableName: 'like' })
export class LikeModel extends Model<LikeModel, ILikeCreatingAttrs> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  })
  id: number;

  @ForeignKey(() => ProfileModel)
  @Column({ type: DataType.INTEGER })
  profileId: number;

  @BelongsTo(() => ProfileModel)
  profile: ProfileModel;

  @ForeignKey(() => VideoModel)
  @Column({ type: DataType.INTEGER })
  videoId: number;

  @BelongsTo(() => VideoModel)
  video: VideoModel;
}
