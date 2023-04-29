import { GlobalType } from "./global.interface";

interface SubjectTypeEmpty extends GlobalType {
  schoolId?: number;
  teacherId?: number;
  classId?: number;
  name?: string;
}

interface SubjectType extends SubjectTypeEmpty {
  schoolId: number;
  teacherId: number;
  classId: number;
  name: string;
}


export { SubjectType, SubjectTypeEmpty };