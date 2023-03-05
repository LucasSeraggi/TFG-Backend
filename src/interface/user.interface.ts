interface UserJwt {
  userId: number;
  schoolId?: number;
  email: string;
  dateExp: number;
  iat?: number;
}

export {
  UserJwt,
}