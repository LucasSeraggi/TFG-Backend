import { UserRoleEnum } from "./user_role.enum";

interface GlobalType {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
  search?: string;
  rowsPerPage?: number;
  page?: number;
}

interface TokenJwt {
  userId?: number;
  schoolId: number;
  email: string;
  role: UserRoleEnum;
  iat?: number;
}

export { TokenJwt, GlobalType }