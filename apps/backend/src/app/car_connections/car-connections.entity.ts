import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class CarConnections {
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

  @Column('simple-array')
  passengers: string[];

  @Column()
  availableSeats: number;
  length: 4;

  @ManyToOne(() => User, (user) => user.id)
  user: User;
}
