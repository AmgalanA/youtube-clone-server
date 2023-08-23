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
import { VideoModel } from '../video/video.model';
import { ICommentCreatingAttrs } from './comment.interface';

@Table({ tableName: 'Comment' })
export class CommentModel extends Model<CommentModel, ICommentCreatingAttrs> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    unique: true,
  })
  id: number;

  @Column({ type: DataType.STRING })
  text: string;

  @Column({ type: DataType.ARRAY(DataType.STRING), defaultValue: [] })
  likes: number[];

  @ForeignKey(() => ProfileModel)
  senderId: number;

  @BelongsTo(() => ProfileModel)
  sender: ProfileModel;

  @ForeignKey(() => VideoModel)
  videoId: number;

  @BelongsTo(() => VideoModel)
  video: VideoModel;
}
