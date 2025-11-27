import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ServicesModule } from './services/services.module';
import { ProposalsModule } from './proposals/proposals.module';
import { ContractsModule } from './contracts/contracts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { Service } from './services/entities/service.entity';
import { Proposal } from './proposals/entities/proposal.entity';
import { Contract } from './contracts/entities/contract.entity';
import { CacheModule } from '@nestjs/cache-manager';
import KeyvRedis from '@keyv/redis';
import { JwtModule } from '@nestjs/jwt';
import 'dotenv/config';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ServicesModule,
    ProposalsModule,
    ContractsModule,
    TypeOrmModule.forRoot({
      type: 'mysql',

      database: 'marketplacedb',
      username: 'root',
      password: process.env.DB_PASSWORD,
      host: 'localhost',
      port: 3306,
      entities: [User, Service, Proposal, Contract],
      autoLoadEntities: true,
      synchronize: true,
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        store: new KeyvRedis('redis://localhost:6379'),
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
