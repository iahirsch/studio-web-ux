import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { CarInfo } from '../car-info/car-info.entity';

@Entity()
export class CarConnections {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('jsonb')
  from: object;

  @Column('jsonb')
  to: object;

  @Column({ type: 'timestamp' })
  date: Date;

  @Column({ type: 'time', precision: 0 })
  departure: string;

  @Column({ type: 'time', precision: 0 })
  arrival: string;

  @Column()
  duration: string;

  @ManyToMany(() => User)
  @JoinTable()
  passengers: User[];

  @ManyToOne(() => User, (user) => user.carConnections)
  user: User;

  @ManyToOne(() => CarInfo, (carInfo) => carInfo.carConnections)
  carInfo: CarInfo;
}
