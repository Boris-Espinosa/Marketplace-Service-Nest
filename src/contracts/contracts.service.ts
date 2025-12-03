import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateContractDto } from './dto/create-contract.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Contract } from './entities/contract.entity';
import { Repository } from 'typeorm';
import { Proposal } from '../proposals/entities/proposal.entity';
import { ProposalStatus } from '../common/enums/proposal-status.enum';
import { ContractStatus } from '../common/enums/contract-status.enum';
import { ClientUser } from '../common/interfaces/client-user.interface';
import { Role } from '../common/enums/roles.enum';

@Injectable()
export class ContractsService {
  constructor(
    @InjectRepository(Contract)
    private contractsRepository: Repository<Contract>,
    @InjectRepository(Proposal)
    private proposalsRepository: Repository<Proposal>,
  ) {}

  async create(createContractDto: CreateContractDto, clientId: number) {
    const proposal = await this.proposalsRepository.findOne({
      where: { id: createContractDto.proposalId },
      relations: ['service'],
    });

    if (!proposal) throw new NotFoundException('Proposal not found');

    if (proposal.service.clientId !== clientId) {
      throw new HttpException(
        'You are not authorized to create a contract for this proposal',
        HttpStatus.FORBIDDEN,
      );
    }

    if (proposal.status !== ProposalStatus.ACCEPTED) {
      throw new HttpException(
        'Proposal must be accepted before creating a contract',
        HttpStatus.BAD_REQUEST,
      );
    }

    const existingContract = await this.contractsRepository.findOneBy({
      proposalId: createContractDto.proposalId,
    });
    if (existingContract) {
      throw new HttpException(
        'A contract already exists for this proposal',
        HttpStatus.BAD_REQUEST,
      );
    }

    const newContract = this.contractsRepository.create({
      proposalId: proposal.id,
      freelancerId: proposal.freelancerId,
      clientId: proposal.service.clientId,
    });

    return await this.contractsRepository.save(newContract);
  }

  async findAll() {
    return await this.contractsRepository.find({
      relations: ['proposal', 'freelancer', 'client'],
    });
  }

  async findOne(id: number, clientUser: ClientUser) {
    const contract = await this.contractsRepository.findOne({
      where: { id },
      relations: ['proposal', 'freelancer', 'client'],
    });
    if (!contract) throw new NotFoundException('Contract not found');
    if (
      clientUser.role !== Role.ADMIN &&
      clientUser.id !== contract.clientId &&
      clientUser.id !== contract.freelancerId
    )
      throw new UnauthorizedException(
        'You are not authorized to get this contract',
      );
    return contract;
  }

  async findByFreelancer(freelancerId: number) {
    return await this.contractsRepository.find({
      where: { freelancerId },
      relations: ['proposal', 'client'],
    });
  }

  async findByClient(clientId: number) {
    return await this.contractsRepository.find({
      where: { clientId },
      relations: ['proposal', 'freelancer'],
    });
  }

  async updateStatus(
    id: number,
    status: ContractStatus,
    clientUser: ClientUser,
  ) {
    const contract = await this.contractsRepository.findOneBy({ id });
    if (!contract) throw new NotFoundException('Contract not found');

    if (
      contract.clientId !== clientUser.id &&
      contract.freelancerId !== clientUser.id
    ) {
      throw new HttpException(
        'You are not authorized to update this contract',
        HttpStatus.FORBIDDEN,
      );
    }

    await this.contractsRepository.update(id, { status });
    return await this.findOne(id, clientUser);
  }

  async remove(id: number, clientUser: ClientUser) {
    const contract = await this.contractsRepository.findOneBy({ id });
    if (!contract) throw new NotFoundException('Contract not found');

    if (clientUser.role !== Role.ADMIN && contract.clientId !== clientUser.id) {
      throw new HttpException(
        'You are not authorized to delete this contract',
        HttpStatus.FORBIDDEN,
      );
    }

    if (contract.status !== ContractStatus.PENDING) {
      throw new HttpException(
        'Cannot delete a contract that is not pending',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.contractsRepository.delete(id);
    return { message: 'Contract deleted successfully' };
  }
}
