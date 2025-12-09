import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import 'dotenv/config';
import { ClientUser } from 'src/common/interfaces/client-user.interface';
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
        try {
          const isMatch = await bcrypt.compare(pass, userFound.password);
          if (!isMatch) throw new UnauthorizedException('Invalid credentials');
        } catch (error) {
          throw new InternalServerErrorException();
        }
        const { password, ...user } = userFound;
        return user;
      });
    return user;
  }

  async login(user: ClientUser) {
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
        secret: process.env.REFRESH_JWT_SECRET,
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
