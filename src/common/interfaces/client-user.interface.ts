import { Role } from '../enums/roles.enum';

export interface ClientUser {
  id: number;
  email: string;
  role: Role;
}
