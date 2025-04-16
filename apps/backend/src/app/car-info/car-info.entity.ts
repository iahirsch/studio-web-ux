import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { CarConnections } from '../car_connections/car-connections.entity';

@Entity()
export class CarInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  availableSeats: number;

  @Column({ type: 'varchar', length: 200, nullable: true })
  seatComment: string;

  @Column()
  numberPlate: string;

  @Column()
  color: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  description: string;

  @ManyToOne(() => User, (user) => user.carInfo)
  user: User;

  @OneToMany(() => CarConnections, (carConnection) => carConnection.carInfo)
  carConnections: CarConnections[];
}
