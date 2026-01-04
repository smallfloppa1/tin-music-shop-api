import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getById(id: number): Promise<UserDto> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return UserDto.fromEntity(user);
  }

  async updateUser(id: number, user: UpdateUserDto): Promise<UserDto> {
    const existingUser = await this.userRepository.findOne({
      where: { id },
    });

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    if (user.email && user.email !== existingUser.email) {
      const emailExists = await this.userRepository.existsBy({
        email: user.email,
      });

      if (emailExists) {
        throw new ConflictException('User with this email already exists');
      }
    }

    const updatedUser = this.userRepository.merge(existingUser, user);
    const savedUser = await this.userRepository.save(updatedUser);

    return UserDto.fromEntity(savedUser);
  }

  async deleteUser(id: number): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('User not found');
    }
  }
}
