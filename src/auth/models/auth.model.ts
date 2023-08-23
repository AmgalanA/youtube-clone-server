import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { IAuthCreatingAttrs } from './auth.interface';

@Table({ tableName: 'auth' })
export class AuthModel extends Model<AuthModel, IAuthCreatingAttrs> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    unique: true,
  })
  id: number;

  @Column({ type: DataType.STRING, unique: true })
  email: string;

  @Column({ type: DataType.STRING })
  password: string;
}
