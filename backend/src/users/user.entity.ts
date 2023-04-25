import { Column, Entity } from 'typeorm';
import AbstractEntity from '../common/entities/abstract.entity';

@Entity()
class UserEntity extends AbstractEntity {
  @Column()
  public name: string;

  @Column({ unique: true })
  public email: string;

  @Column({ select: false })
  public password: string;
}

export default UserEntity;
