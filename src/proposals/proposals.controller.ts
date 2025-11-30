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
import { ProposalsService } from './proposals.service';
import { CreateProposalDto } from './dto/create-proposal.dto';
import { UpdateProposalDto } from './dto/update-proposal.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/roles.enum';
import { ProposalStatus } from 'src/common/enums/proposal-status.enum';

@Controller('proposals')
export class ProposalsController {
  constructor(private readonly proposalsService: ProposalsService) {}

  @Roles(Role.FREELANCER)
  @UseGuards(RoleGuard)
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createProposalDto: CreateProposalDto, @Req() { user }) {
    return this.proposalsService.create(createProposalDto, user.id);
  }

  @Roles(Role.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.proposalsService.findAll();
  }

  @Roles(Role.FREELANCER)
  @UseGuards(RoleGuard)
  @UseGuards(JwtAuthGuard)
  @Get('freelancer/my-proposals')
  findMyProposals(@Req() { user }) {
    return this.proposalsService.findByFreelancer(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('service/:serviceId')
  findByService(@Param('serviceId') serviceId: string, @Req() { user }) {
    return this.proposalsService.findByService(+serviceId, user);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Req() { user }) {
    return this.proposalsService.findOne(+id, user);
  }

  @Roles(Role.FREELANCER, Role.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProposalDto: UpdateProposalDto,
    @Req() { user },
  ) {
    return this.proposalsService.update(+id, updateProposalDto, user);
  }

  @Roles(Role.CLIENT)
  @UseGuards(RoleGuard)
  @UseGuards(JwtAuthGuard)
  @Patch(':id/accept')
  accept(@Param('id') id: string, @Req() { user }) {
    return this.proposalsService.updateStatus(
      +id,
      ProposalStatus.ACCEPTED,
      user,
    );
  }

  @Roles(Role.CLIENT)
  @UseGuards(RoleGuard)
  @UseGuards(JwtAuthGuard)
  @Patch(':id/reject')
  reject(@Param('id') id: string, @Req() { user }) {
    return this.proposalsService.updateStatus(
      +id,
      ProposalStatus.REJECTED,
      user,
    );
  }

  @Roles(Role.FREELANCER, Role.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() { user }) {
    return this.proposalsService.remove(+id, user);
  }
}
