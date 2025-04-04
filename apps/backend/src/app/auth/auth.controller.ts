import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {
  }

  @Post('save-user')
  async saveUser(@Body('idToken') idToken: string) {


    const decodedToken = this.jwtService.decode(idToken) as any;

    if (!decodedToken) {
      throw new Error('Invalid ID Token');
    }

    const userData = await this.userService.findOrCreate({
      id: decodedToken.sub,
      name: decodedToken.name,
      username: decodedToken.nickname,
      email: decodedToken.email,
      picture: decodedToken.picture
    });

    const user = await this.userService.findOrCreate(userData);

    return { message: 'User saved', user };
  }
}
