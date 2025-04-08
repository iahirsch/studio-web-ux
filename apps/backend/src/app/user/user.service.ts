import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { Profile } from 'passport-github2';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>) {
  }

  async findOrCreate(profile: Profile): Promise<User> {
    let user = await this.userRepository.findOne({ where: { id: profile.id } });

    if (!user) {
      console.log(profile);
      user = this.userRepository.create(
        {
          id: profile.id,
          username: profile.username || '',
          name: profile.displayName || ''
        }
      );
      await this.userRepository.save(user);
    }
    return user;
  }
}
