interface UserJwt {
  userId?: number;
  schoolId: number;
  email: string;
  iat?: number;
}

export {
  UserJwt,
}