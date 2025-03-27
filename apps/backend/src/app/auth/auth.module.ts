import { Module } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { UsersModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './jwt-strategy.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    UsersModule
  ],
  controllers: [],
  providers: [JwtService, UserService, JwtStrategy],
  exports: [PassportModule]
})
export class AuthModule {
}
