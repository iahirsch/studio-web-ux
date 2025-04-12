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

  @OneToMany(() => TrainConnections, (trainConnections) => trainConnections.id)
  trainConnections: TrainConnections[];

  @OneToMany(() => CarConnections, (carConnections) => carConnections.id)
  carConnections: CarConnections[];

  @OneToMany(() => CarInfo, (carInfo) => carInfo.id)
  carInfo: CarInfo[];
}
