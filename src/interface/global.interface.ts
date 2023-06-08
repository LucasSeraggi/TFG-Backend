import { UserRoleEnum } from "./user_role.enum";

interface GlobalType {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
  search?: string;
  rowsPerPage?: number;
  page?: number;
}

interface TokenJwtUser {
  userId?: number;
  schoolId: number;
  userName: string;
  email: string;
  role: UserRoleEnum;
  iat?: number;
  userPhoto?: string;
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