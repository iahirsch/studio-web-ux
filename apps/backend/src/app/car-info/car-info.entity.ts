import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class CarInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  availableSeats: number;

  @Column({ type: 'varchar', length: 200 })
  seatComment: string;

  @Column()
  numberPlate: number;

  @Column()
  color: string;

  @Column({ type: 'varchar', length: 100 })
  description: string;

  @ManyToOne(() => User, (user) => user.id)
  user: string;
}
