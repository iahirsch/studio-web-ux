import { Module } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { UsersModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './jwt-strategy.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([User]),
    UsersModule
  ],
  controllers: [AuthController],
  providers: [JwtService, UserService, JwtStrategy],
  exports: [PassportModule]
})
export class AuthModule {
}
