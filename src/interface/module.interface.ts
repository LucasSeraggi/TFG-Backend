import { GlobalType } from "./global.interface";

interface ModuleTypeEmpty extends GlobalType {
  title?: string;
  description?: string;
  subjectId?: number;
  content?: string;
  ordenation?: number;
}

interface ModuleType extends ModuleTypeEmpty {
  title: string;
  description: string;
  subjectId: number;
  content: string;
  ordenation: number;
}

export { ModuleType, ModuleTypeEmpty };
