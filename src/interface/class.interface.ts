import { GlobalType } from "./global.interface";

interface ClassTypeEmpty extends GlobalType {
  schoolId?: number;
  name?: string;
}

interface ClassType extends ClassTypeEmpty {
  schoolId: number;
  name: string;
}

export { ClassType, ClassTypeEmpty };
