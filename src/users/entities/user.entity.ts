import { Role } from 'src/common/enums/roles.enum';
import { Contract } from 'src/contracts/entities/contract.entity';
import { Proposal } from 'src/proposals/entities/proposal.entity';
import { Service } from 'src/services/entities/service.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ type: 'enum', enum: Role, default: Role.CLIENT })
  role: Role;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Service, (service) => service.client)
  services: Service[];

  @OneToMany(() => Proposal, (proposal) => proposal.freelancer)
  proposals: Proposal[];

  @OneToMany(() => Contract, (contract) => contract.freelancer)
  contractsAsFreelancer: Contract[];

  @OneToMany(() => Contract, (contract) => contract.client)
  contractsAsClient: Contract[];
}
