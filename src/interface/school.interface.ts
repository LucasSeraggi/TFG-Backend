import { GlobalType } from "./global.interface";

interface SchoolTypeEmpty extends GlobalType {
  name?: string;
  cnpj?: string;
  logo?: string;
  // social?:
  cep?: string;
  phone?: string;
  email?: string;
}

interface SchoolType extends SchoolTypeEmpty {
  name?: string;
  cnpj?: string;
  logo?: string;
  // social?:
  cep?: string;
  phone?: string;
  email?: string;
}

export { SchoolType, SchoolTypeEmpty };
