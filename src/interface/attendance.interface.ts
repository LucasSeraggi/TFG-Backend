import { GlobalType } from "./global.interface";

interface StudentsAttendanceType {
  userId: number;
  isPresent: boolean;
}

interface AttendanceTypeEmpty extends GlobalType {
  schoolId?: number;
  subjectId?: number;
  date?: Date;
  totalLesson?: number;
  students?: StudentsAttendanceType[];
}

interface AttendanceType extends AttendanceTypeEmpty {
  schoolId: number;
  subjectId: number;
  date: Date;
  totalLesson: number;
  students: StudentsAttendanceType[];
}

export { AttendanceType, AttendanceTypeEmpty, StudentsAttendanceType };
