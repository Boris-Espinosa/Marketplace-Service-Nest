import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProposalsService } from './proposals.service';
import { ProposalsController } from './proposals.controller';
import { Proposal } from './entities/proposal.entity';
import { Service } from '../services/entities/service.entity';
import { ContractsModule } from 'src/contracts/contracts.module';

@Module({
  imports: [TypeOrmModule.forFeature([Proposal, Service]), ContractsModule],
  controllers: [ProposalsController],
  providers: [ProposalsService],
  exports: [ProposalsService],
})
export class ProposalsModule {}
