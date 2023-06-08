import { GlobalType } from "./global.interface";
import { UserRoleEnum } from "./user_role.enum";

interface UserTypeEmpty extends GlobalType {
  name?: string;
  schoolId?: number;
  classId?: number;
  registration?: string;
  birthDate?: Date;
  role?: UserRoleEnum;
  phone?: string;
  email?: string;
  cpf?: string;
  rg?: string;
  profile_picture?: string;
  address?: string;
}

interface UserType extends UserTypeEmpty {
  name: string;
  schoolId: number;
  classId: number;
  birthDate: Date;
  role: UserRoleEnum;
  phone: string;
  email: string;
  cpf: string;
  rg: string;
}

export { UserType, UserTypeEmpty };
