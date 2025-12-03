import { Role } from '../../common/enums/roles.enum';
import { Contract } from '../../contracts/entities/contract.entity';
import { Proposal } from '../../proposals/entities/proposal.entity';
import { Service } from '../../services/entities/service.entity';
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

  @Column({ type: 'simple-enum', enum: Role, default: Role.CLIENT })
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
