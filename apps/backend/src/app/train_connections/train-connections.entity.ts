import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class TrainConnections {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  from: string;

  @Column()
  to: string;

  @Column({ type: 'timestamptz' })
  date: Date;

  @Column({ type: 'time' })
  departure: string;

  @Column({ type: 'time' })
  arrival: string;

  @Column()
  duration: number;

  @Column('simple-array')
  names: string[];

  @Column()
  passengers: number;

  @ManyToOne(() => User, (user) => user.id)
  user: string;
}
