import { Module } from '@nestjs/common';
import { TrainConnectionsService } from './train-connections.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrainConnections } from './train-connections.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TrainConnections])],
  providers: [TrainConnectionsService],
  exports: [TypeOrmModule, TrainConnectionsService]
})
export class TrainConnectionsModule {
}
