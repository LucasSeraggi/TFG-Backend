import { GlobalType } from "./global.interface";

interface GradeTypeEmpty extends GlobalType {
  name?: string;
  description?: string;
  subjectId?: number;
  studentId?: number;
  activityId?: number;
  period?: string;
  note?: number;
  file?: string;
}

interface GradeType extends GradeTypeEmpty {
  name: string;
  subjectId: number;
  studentId: number;
  activityId: number;
}

export { GradeType, GradeTypeEmpty };
