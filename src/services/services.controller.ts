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
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/roles.enum';
import { CacheInterceptor, CacheKey } from '@nestjs/cache-manager';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body(new ValidationPipe({ whitelist: true }))
    createServiceDto: CreateServiceDto,
    @Req() { user },
  ) {
    return this.servicesService.create(createServiceDto, user.id);
  }
  @UseInterceptors(CacheInterceptor)
  @CacheKey('all_services')
  @Roles(Role.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.servicesService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('client/my-services')
  findMyServices(@Req() { user }) {
    return this.servicesService.findByClient(user.id);
  }

  @UseInterceptors(CacheInterceptor)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Req() { user }) {
    return this.servicesService.findOne(+id, user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ whitelist: true, skipNullProperties: true }))
    updateServiceDto: UpdateServiceDto,
    @Req() { user },
  ) {
    return this.servicesService.update(+id, updateServiceDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() { user }) {
    return this.servicesService.remove(+id, user);
  }
}
