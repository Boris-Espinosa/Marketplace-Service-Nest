import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import 'dotenv/config';
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async validateUser(email: string, pass: string) {
    const user = await this.usersRepository
      .findOne({
        where: { email },
        select: ['id', 'email', 'password', 'role'],
      })
      .then(async (userFound) => {
        if (!userFound) throw new NotFoundException('User not found');
        const isMatch = await bcrypt.compare(pass, userFound.password);
        if (!isMatch) throw new UnauthorizedException('Invalid credentials');
        const { password, ...user } = userFound;
        return user;
      });
    return user;
  }

  async login(user: any) {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    return {
      userId: payload.id,
      token: await this.jwtService.signAsync(payload),
      refreshToken: await this.jwtService.signAsync(payload, {
        expiresIn: '7d',
        secret: process.env.REFRESH_JWT_PASSWORD,
      }),
    };
  }

  async refresh(user: any) {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    return {
      userId: payload.id,
      token: await this.jwtService.signAsync(payload),
    };
  }
}
