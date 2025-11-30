import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateProposalDto {
  @IsNumber()
  @IsNotEmpty()
  serviceId: number;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsNumber()
  @IsPositive()
  amount: number;
}
