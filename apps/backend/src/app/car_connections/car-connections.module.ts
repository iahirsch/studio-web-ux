import { Module } from '@nestjs/common';
import { CarConnectionsService } from './car-connections.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarConnections } from './car-connections.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CarConnections])],
  providers: [CarConnectionsService],
  exports: [TypeOrmModule, CarConnectionsService]
})
export class CarConnectionsModule {
}
