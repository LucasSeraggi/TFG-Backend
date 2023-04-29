enum UserRoleEnum {
  ADMIN = 'Administrador',
  TEACHER = 'Professor',
  STUDENT = 'Estudante',
  TUTOR = 'Tutor',
}

type UserRole =
  'Administrador' |
  'Professor' |
  'Estudante' |
  'Tutor';

export { UserRole, UserRoleEnum };