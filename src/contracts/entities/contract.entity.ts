import { ContractStatus } from 'src/common/enums/contract-status.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Proposal } from '../../proposals/entities/proposal.entity';
import { User } from 'src/users/entities/user.entity';

@Entity()
export class Contract {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  proposalId: number;

  @Column()
  freelancerId: number;

  @Column()
  clientId: number;

  @Column({
    type: 'enum',
    enum: ContractStatus,
    default: ContractStatus.PENDING,
  })
  status: ContractStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => Proposal, (proposal) => proposal.contract)
  @JoinColumn({ name: 'proposalId' })
  proposal: Proposal;

  @ManyToOne(() => User, (user) => user.contractsAsFreelancer)
  @JoinColumn({ name: 'freelancerId' })
  freelancer: User;

  @ManyToOne(() => User, (user) => user.contractsAsClient)
  @JoinColumn({ name: 'clientId' })
  client: User;
}
