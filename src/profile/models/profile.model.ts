import {
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { AuthModel } from 'src/auth/models/auth.model';
import { CommentModel } from 'src/video/models/comment/comment.model';
import { VideoModel } from 'src/video/models/video/video.model';
import { IProfileCreatingAttrs } from './profile.interface';

@Table({ tableName: 'profile' })
export class ProfileModel extends Model<ProfileModel, IProfileCreatingAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({ type: DataType.STRING })
  name: string;

  @Column({ type: DataType.STRING })
  secondName: string;

  @ForeignKey(() => AuthModel)
  @Column({ type: DataType.INTEGER })
  userId: number;

  @Column({ type: DataType.STRING, defaultValue: '' })
  status: string;

  @Column({ type: DataType.STRING, defaultValue: '' })
  avatarUrl: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  isOnline: boolean;

  @Column({ type: DataType.STRING, defaultValue: Date.now().toString() })
  lastSeen: string;

  @HasMany(() => VideoModel, {
    foreignKey: 'senderId',
  })
  videos: VideoModel[];

  @HasMany(() => CommentModel, {
    foreignKey: 'senderId',
  })
  comments: CommentModel[];
}
