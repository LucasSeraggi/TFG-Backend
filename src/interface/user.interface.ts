import { GlobalType } from "./global.interface";
import { UserRole } from "./user_role.enum";

interface UserTypeEmpty extends GlobalType {
  name?: string;
  schoolId?: number;
  classId?: number;
  registration?: string;
  birth_date?: Date;
  role?: UserRole;
  phone?: string;
  email?: string;
  cpf?: string;
  rg?: string;
  profile_picture?: {}
  address?: string;
}

interface UserType extends UserTypeEmpty {
  name: string;
  schoolId: number;
  classId: number;
  registration: string;
  birth_date: Date;
  role: UserRole;
  phone: string;
  email: string;
  cpf: string;
  rg: string;
}

export { UserType, UserTypeEmpty };
