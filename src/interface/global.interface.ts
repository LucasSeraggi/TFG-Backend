import { UserRoleEnum } from "./user_role.enum";

interface GlobalType {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface TokenJwt {
  userId?: number;
  schoolId: number;
  email: string;
  role: UserRoleEnum;
  iat?: number;
}

export { TokenJwt, GlobalType }