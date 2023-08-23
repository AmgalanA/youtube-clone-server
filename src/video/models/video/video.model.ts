import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { ProfileModel } from 'src/profile/models/profile.model';
import { CommentModel } from '../comment/comment.model';
import { LikeModel } from '../like/like.model';
import { IVideoCreatingAttrs } from './video.interface';

@Table({ tableName: 'video' })
export class VideoModel extends Model<VideoModel, IVideoCreatingAttrs> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    unique: true,
  })
  id: number;

  @Column({ type: DataType.STRING })
  caption: string;

  @Column({ type: DataType.STRING })
  videoUrl: string;

  @Column({ type: DataType.STRING })
  thumbnail: string;

  @HasMany(() => LikeModel, {
    foreignKey: 'videoId',
  })
  likes: LikeModel[];

  @HasMany(() => CommentModel, {
    foreignKey: 'videoId',
  })
  comments: CommentModel[];

  @ForeignKey(() => ProfileModel)
  senderId: number;

  @BelongsTo(() => ProfileModel)
  sender: ProfileModel;
}
