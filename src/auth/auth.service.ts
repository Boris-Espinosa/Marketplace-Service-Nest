import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
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
      token: await this.jwtService.signAsync(payload),
    };
  }
}
