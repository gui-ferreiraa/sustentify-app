import { Department } from "../enums/department.enum";

export interface ICompany {
  id: number;
  name: string;
  email: string;
  password: string;
  cnpj: string;
  address: string;
  phone: string;
  companyDepartment: Department;
}

export interface ICompanySummary {
  id: number;
  name: string;
  email: string;
  cnpj: string;
  address: string;
  phone: string;
  companyDepartment: Department;
}
