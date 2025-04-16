import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { TrainConnections } from '../train_connections/train-connections.entity';
import { CarConnections } from '../car_connections/car-connections.entity';
import { CarInfo } from '../car-info/car-info.entity';

@Entity()
export class User {
  @PrimaryColumn()
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  picture: string;

  @OneToMany(() => TrainConnections, (trainConnections) => trainConnections.user)
  trainConnections: TrainConnections[];

  @OneToMany(() => CarConnections, (carConnections) => carConnections.user)
  carConnections: CarConnections[];

  @OneToMany(() => CarInfo, (carInfo) => carInfo.user)
  carInfo: CarInfo[];
}
