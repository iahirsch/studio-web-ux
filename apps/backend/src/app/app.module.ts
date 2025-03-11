import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        signOptions: { expiresIn: '8h' },
        secret: configService.get<string>('JWT_SECRET')
      }),
      inject: [ConfigService]
    })],
  controllers: [AppController],
  providers: [AppService, AuthService],
  exports: [AuthService, JwtModule]
})
export class AppModule {
}
