import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ContractsService } from './contracts.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RoleGuard } from '../common/guards/role.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/roles.enum';
import { ContractStatus } from '../common/enums/contract-status.enum';

@Controller('contracts')
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  @Roles(Role.CLIENT)
  @UseGuards(RoleGuard)
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createContractDto: CreateContractDto, @Req() { user }) {
    return this.contractsService.create(createContractDto, user.id);
  }

  @Roles(Role.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.contractsService.findAll();
  }

  @Roles(Role.FREELANCER)
  @UseGuards(RoleGuard)
  @UseGuards(JwtAuthGuard)
  @Get('freelancer/my-contracts')
  findMyContractsAsFreelancer(@Req() { user }) {
    return this.contractsService.findByFreelancer(user.id);
  }

  @Roles(Role.CLIENT)
  @UseGuards(RoleGuard)
  @UseGuards(JwtAuthGuard)
  @Get('client/my-contracts')
  findMyContractsAsClient(@Req() { user }) {
    return this.contractsService.findByClient(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Req() { user }) {
    return this.contractsService.findOne(+id, user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/in-progress')
  activate(@Param('id') id: string, @Req() { user }) {
    return this.contractsService.updateStatus(
      +id,
      ContractStatus.INPROGRESS,
      user.id,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/complete')
  complete(@Param('id') id: string, @Req() { user }) {
    return this.contractsService.updateStatus(
      +id,
      ContractStatus.COMPLETED,
      user.id,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/cancel')
  cancel(@Param('id') id: string, @Req() { user }) {
    return this.contractsService.updateStatus(
      +id,
      ContractStatus.CANCELED,
      user.id,
    );
  }

  @Roles(Role.CLIENT)
  @UseGuards(RoleGuard)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() { user }) {
    return this.contractsService.remove(+id, user.id);
  }
}
