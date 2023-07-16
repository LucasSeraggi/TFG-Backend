import { UserRoleEnum } from "./user_role.enum";

interface GlobalType {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface TokenJwtUser {
  userId?: number;
  schoolId: number;
  email: string;
  role: UserRoleEnum;
  iat?: number;
  classId: number;
}

interface TokenJwtSchool {
  userId?: number;
  schoolId: number;
  email: string;
  role: UserRoleEnum;
  iat?: number;
}

export { TokenJwtUser, TokenJwtSchool, GlobalType }