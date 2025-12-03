import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from '../common/enums/roles.enum';

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
    return await this.usersRepository.find({
      relations: {
        proposals: true,
        services: true,
        contractsAsClient: true,
        contractsAsFreelancer: true,
      },
    });
  }

  async findOne(email: string) {
    const userFound = await this.usersRepository.findOneBy({ email });
    if (!userFound) return null;
    return userFound;
  }

  async update(id: number, updateUserDto: UpdateUserDto, clientUser: any) {
    if (clientUser.role !== Role.ADMIN && clientUser.id !== id)
      throw new UnauthorizedException();

    const userFound = await this.usersRepository.findOneBy({ id });

    if (!userFound)
      throw new HttpException('User does not exists', HttpStatus.BAD_REQUEST);

    const hasValidFields = Object.entries(updateUserDto).some(
      ([key, value]) =>
        key !== null &&
        value !== null &&
        key !== undefined &&
        value !== undefined &&
        key !== '' &&
        value !== '',
    );

    if (!hasValidFields)
      throw new HttpException(
        'Please enter at least 1 valid field',
        HttpStatus.BAD_REQUEST,
      );

    const updates = { ...updateUserDto };

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    try {
      await this.usersRepository.update({ id }, updates);
      const userUpdated = await this.usersRepository.findOneBy({ id });
      if (!userUpdated) throw new NotFoundException('User not found');
      return { message: 'User updated succesfully', user: userUpdated };
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY')
        throw new HttpException(
          'The email is already in use',
          HttpStatus.BAD_REQUEST,
        );

      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: number, clientUser: any) {
    if (clientUser.role !== Role.ADMIN && clientUser.id !== id)
      throw new UnauthorizedException();

    const userFound = await this.usersRepository.findOneBy({ id });

    if (!userFound)
      throw new HttpException('User does not exists', HttpStatus.BAD_REQUEST);

    const affected = await this.usersRepository.delete({ id });
    if (!affected.affected) {
      throw new HttpException(
        'Something went wrong trying to delete the user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return { id, message: 'user deleted successfully' };
  }
}
