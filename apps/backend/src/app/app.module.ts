// apps/backend/src/app/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from './user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './user/user.module';
import { TrainConnectionsService } from './train_connections/train-connections.service';
import { TrainConnectionsModule } from './train_connections/train-connections.module';
import { CarConnectionsModule } from './car_connections/car-connections.module';
import { CarConnectionsService } from './car_connections/car-connections.service';
import { CarInfoModule } from './car-info/car-info.module';
import { CarInfoService } from './car-info/car-info.service';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    PassportModule,
    JwtModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('DATABASE_URL'),
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    TrainConnectionsModule,
    CarConnectionsModule,
    CarInfoModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    UserService,
    TrainConnectionsService,
    CarConnectionsService,
    CarInfoService,
  ],
  exports: [JwtModule],
})
export class AppModule {}
