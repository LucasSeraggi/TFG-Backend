import { GlobalType } from "./global.interface";

interface NewsTypeEmpty extends GlobalType {
  title?: string;
  description?: string;
  schoolId?: number;
  subjectId?: number;
  subjectName?: string;
  classId?: number;
}

interface NewsType extends NewsTypeEmpty {
    title: string;
    description: string;
    schoolId: number;
    subjectId: number;
    classId: number;
}

export { NewsType, NewsTypeEmpty };
