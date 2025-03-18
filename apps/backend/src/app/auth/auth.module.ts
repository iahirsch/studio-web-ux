import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GithubStrategyService } from './github.strategy.service';
import { JwtStrategyService } from './jwt.strategy.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { UsersModule } from '../user/user.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        signOptions: { expiresIn: '8h' },
        secret: configService.get<string>('JWT_SECRET')
      }),
      inject: [ConfigService]
    }),
    UsersModule
  ],
  controllers: [AuthController],
  providers: [AuthService, GithubStrategyService, JwtStrategyService, UserService],
  exports: [AuthService]
})
export class AuthModule {
}
