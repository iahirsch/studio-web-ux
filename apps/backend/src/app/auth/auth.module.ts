import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GithubStrategyService } from './github.strategy.service';
import { JwtStrategyService } from './jwt.strategy.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [JwtModule.registerAsync({
    useFactory: async (configService: ConfigService) => ({
      signOptions: { expiresIn: '8h' },
      secret: configService.get<string>('JWT_SECRET')
    }),
    inject: [ConfigService]
  })],
  controllers: [AuthController],
  providers: [AuthService, GithubStrategyService, JwtStrategyService],
  exports: [AuthService]
})
export class AuthModule {}
