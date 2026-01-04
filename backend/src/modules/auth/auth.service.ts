import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entity/user.entity';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { Role } from '../user/entity/role.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const isUserExists = await this.userRepository.existsBy({
      email: registerDto.email,
    });

    if (isUserExists) {
      throw new ConflictException('Email already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(registerDto.password, salt);

    const user = this.userRepository.create({
      email: registerDto.email,
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      password: hashedPassword,
      role: Role.USER,
    });
    await this.userRepository.save(user);

    const jwt = await this.generateJwt(user.id, user.email, user.role);

    return {
      accessToken: jwt,
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.userRepository.findOneBy({
      email: loginDto.email,
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordMatch = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const jwt = await this.generateJwt(user.id, user.email, user.role);

    return {
      accessToken: jwt,
    };
  }

  private async generateJwt(
    id: number,
    email: string,
    role: string,
  ): Promise<string> {
    const payload = {
      sub: id,
      email: email,
      role: role,
    };

    return this.jwtService.signAsync(payload);
  }
}
