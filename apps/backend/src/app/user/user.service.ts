import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>) {
  }

  async findOrCreate(userData: { id: string; name: string; username: string; email: string; picture: string }) {
    let user = await this.userRepository.findOne({ where: { id: userData.id } });

    if (!user) {
      user = this.userRepository.create(userData);
      await this.userRepository.save(user);
    }
    return user;
  }
}
