import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateProposalDto } from './dto/create-proposal.dto';
import { UpdateProposalDto } from './dto/update-proposal.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Proposal } from './entities/proposal.entity';
import { Repository } from 'typeorm';
import { ProposalStatus } from '../common/enums/proposal-status.enum';
import { Service } from '../services/entities/service.entity';
import { ClientUser } from '../common/interfaces/client-user.interface';
import { Role } from '../common/enums/roles.enum';

@Injectable()
export class ProposalsService {
  constructor(
    @InjectRepository(Proposal)
    private proposalsRepository: Repository<Proposal>,
    @InjectRepository(Service)
    private servicesRepository: Repository<Service>,
  ) {}

  async create(createProposalDto: CreateProposalDto, freelancerId: number) {
    const service = await this.servicesRepository.findOneBy({
      id: createProposalDto.serviceId,
    });
    if (!service) throw new NotFoundException('Service not found');

    const existingProposal = await this.proposalsRepository.findOne({
      where: {
        serviceId: createProposalDto.serviceId,
        freelancerId,
      },
    });
    if (existingProposal) {
      throw new HttpException(
        'You already have a proposal for this service',
        HttpStatus.BAD_REQUEST,
      );
    }

    const newProposal = this.proposalsRepository.create({
      ...createProposalDto,
      freelancerId,
    });
    return await this.proposalsRepository.save(newProposal);
  }

  async findAll() {
    return await this.proposalsRepository.find({
      relations: ['service', 'freelancer', 'contract'],
    });
  }

  async findOne(id: number, clientUser: ClientUser) {
    const proposal = await this.proposalsRepository.findOne({
      where: { id },
      relations: ['service', 'freelancer', 'contract'],
    });
    if (!proposal) throw new NotFoundException('Proposal not found');

    if (clientUser.role === Role.CLIENT) {
      const service = await this.servicesRepository.findOne({
        where: { clientId: clientUser.id, proposals: proposal },
      });
      if (!service)
        throw new UnauthorizedException(
          'You are not authorized to get this proposal',
        );
    } else if (
      clientUser.role !== Role.ADMIN &&
      clientUser.id !== proposal.freelancerId
    )
      throw new UnauthorizedException(
        'You are not authorized to get this proposal',
      );

    return proposal;
  }

  async findByFreelancer(freelancerId: number) {
    return await this.proposalsRepository.find({
      where: { freelancerId },
      relations: ['service', 'contract'],
    });
  }

  async findByService(serviceId: number, clientUser: ClientUser) {
    const proposals = await this.proposalsRepository.find({
      where: { serviceId },
      relations: ['freelancer'],
    });
    if (proposals.length <= 0)
      throw new NotFoundException('No proposals found for this service id');

    const isFreelancer = proposals.some(
      (proposal) => proposal.freelancerId === clientUser.id,
    );
    if (clientUser.role === Role.CLIENT) {
      const service = await this.servicesRepository.findOne({
        where: {
          id: serviceId,
          clientId: clientUser.id,
          proposals: proposals,
        },
      });
      if (!service)
        throw new UnauthorizedException(
          'You are not authorized to get this proposals',
        );
    } else if (clientUser.role !== Role.ADMIN && !isFreelancer)
      throw new UnauthorizedException(
        'You are not authorized to get this proposals',
      );
    if (isFreelancer)
      return proposals.filter(
        (proposal) => proposal.freelancerId === clientUser.id,
      );
    return proposals;
  }

  async update(
    id: number,
    updateProposalDto: UpdateProposalDto,
    clientUser: ClientUser,
  ) {
    const proposal = await this.proposalsRepository.findOneBy({ id });
    if (!proposal) throw new NotFoundException('Proposal not found');

    if (
      clientUser.role !== Role.ADMIN &&
      proposal.freelancerId !== clientUser.id
    ) {
      throw new HttpException(
        'You are not authorized to update this proposal',
        HttpStatus.FORBIDDEN,
      );
    }

    if (proposal.status !== ProposalStatus.PENDING) {
      throw new HttpException(
        'Cannot update a proposal that is not pending',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hasValidFields = Object.entries(updateProposalDto).some(
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

    const updates = { ...updateProposalDto };

    await this.proposalsRepository.update({ id }, updates);
    return await this.findOne(id, clientUser);
  }

  async updateStatus(
    id: number,
    status: ProposalStatus,
    clientUser: ClientUser,
  ) {
    const proposal = await this.proposalsRepository.findOne({
      where: { id },
      relations: ['service'],
    });
    if (!proposal) throw new NotFoundException('Proposal not found');

    if (proposal.service.clientId !== clientUser.id) {
      throw new HttpException(
        'You are not authorized to update this proposal status',
        HttpStatus.FORBIDDEN,
      );
    }

    await this.proposalsRepository.update(id, { status });
    return await this.findOne(id, clientUser);
  }

  async remove(id: number, clientUser: ClientUser) {
    const proposal = await this.proposalsRepository.findOneBy({ id });
    if (!proposal) throw new NotFoundException('Proposal not found');

    if (
      clientUser.role !== Role.ADMIN &&
      proposal.freelancerId !== clientUser.id
    ) {
      throw new HttpException(
        'You are not authorized to delete this proposal',
        HttpStatus.FORBIDDEN,
      );
    }

    if (proposal.status !== ProposalStatus.PENDING) {
      throw new HttpException(
        'Cannot delete a proposal that is not pending',
        HttpStatus.BAD_REQUEST,
      );
    }

    const affected = await this.proposalsRepository.delete({ id });
    if (!affected.affected)
      throw new InternalServerErrorException(
        'Something went wrong trying to delete the proposal',
      );
    return { message: 'Proposal deleted successfully' };
  }
}
