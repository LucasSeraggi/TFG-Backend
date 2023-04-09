interface GlobalType {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface TokenJwt {
  userId?: number;
  schoolId: number;
  email: string;
  iat?: number;
}

export { TokenJwt, GlobalType }