import { GlobalType } from "./global.interface";

enum WeekdayEnum {
  SUNDAY = 'sunday',
  MONDAY = 'monday',
  TUESDAY = 'tuesday',
  WEDNESDAY = 'wednesday',
  THURSDAY = 'thursday',
  FRIDAY = 'friday',
  SATURDAY = 'saturday'
}

interface DateCustomType {
  weekDay: WeekdayEnum;
  start: string;
  end: string;
}

interface SubjectTypeEmpty extends GlobalType {
  schoolId?: number;
  teacherId?: number;
  classId?: number;
  name?: string;
  className?: string;
  teacherName?: string;
  picture?: string;
  color?: string;
  times?: DateCustomType[];
}

interface SubjectType extends SubjectTypeEmpty {
  schoolId: number;
  teacherId: number;
  classId: number;
  name: string;
}


export { SubjectType, SubjectTypeEmpty, DateCustomType, WeekdayEnum };