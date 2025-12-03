import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { Repository } from 'typeorm';
import { Role } from '../common/enums/roles.enum';
import { ClientUser } from '../common/interfaces/client-user.interface';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private servicesRepository: Repository<Service>,
  ) {}

  async create(createServiceDto: CreateServiceDto, clientId: number) {
    const newService = this.servicesRepository.create({
      ...createServiceDto,
      clientId,
    });
    return await this.servicesRepository.save(newService);
  }

  async findAll() {
    return await this.servicesRepository.find({
      relations: ['client', 'proposals'],
    });
  }

  async findOne(id: number, clientUser: ClientUser) {
    const service = await this.servicesRepository.findOne({
      where: { id },
      relations: ['client', 'proposals'],
    });
    if (!service) throw new NotFoundException('Service not found');

    if (clientUser.role !== Role.ADMIN && clientUser.id !== service.clientId)
      throw new UnauthorizedException(
        'You are not authorized to get this service',
      );

    return service;
  }

  async findByClient(clientId: number) {
    return await this.servicesRepository.find({
      where: { clientId },
      relations: ['proposals'],
    });
  }

  async update(
    id: number,
    updateServiceDto: UpdateServiceDto,
    clientUser: ClientUser,
  ) {
    const service = await this.servicesRepository.findOneBy({ id });
    if (!service) throw new NotFoundException('Service not found');

    if (clientUser.role !== Role.ADMIN && service.clientId !== clientUser.id)
      throw new HttpException(
        'You are not authorized to update this service',
        HttpStatus.FORBIDDEN,
      );

    const hasValidFields = Object.entries(updateServiceDto).some(
      ([key, value]) =>
        key !== null &&
        value !== null &&
        key !== undefined &&
        value !== undefined &&
        key !== '' &&
        value !== '',
    );

    if (!hasValidFields)
      throw new BadRequestException('Please enter at least 1 valid field');

    const updates = { ...updateServiceDto };

    await this.servicesRepository.update({ id }, updates);
    return await this.findOne(id, clientUser);
  }

  async remove(id: number, clientUser: ClientUser) {
    const service = await this.servicesRepository.findOneBy({ id });
    if (!service) throw new NotFoundException('Service not found');

    if (clientUser.role !== Role.ADMIN && service.clientId !== clientUser.id)
      throw new HttpException(
        'You are not authorized to delete this service',
        HttpStatus.FORBIDDEN,
      );

    const affected = await this.servicesRepository.delete({ id });
    if (!affected.affected)
      throw new InternalServerErrorException(
        'Something went wrong trying to delete the service',
      );
    return { message: 'Service deleted successfully' };
  }
}
