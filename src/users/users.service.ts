import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const userFound = await this.usersRepository.findOneBy({
      email: createUserDto.email,
    });
    if (userFound)
      throw new HttpException('Email already in use', HttpStatus.BAD_REQUEST);
    const newUser = this.usersRepository.create(createUserDto);
    const passwordHash = await bcrypt.hash(createUserDto.password, 10);
    newUser.password = passwordHash;
    const { password, ...user } = await this.usersRepository.save(newUser);
    return user;
  }

  async findAll() {
    return `This action returns all users`;
  }

  async findOne(email: string) {
    const userFound = await this.usersRepository.findOneBy({ email });
    if (!userFound) return null;
    return userFound;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
