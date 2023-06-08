import jwt from "jsonwebtoken";
import db from '../config/databaseConnection.config';
import { Request } from "express";
import { TokenJwtUser } from "../interface/global.interface";
import bcrypt from 'bcryptjs';
import { UserType, UserTypeEmpty } from "../interface/user.interface";
import { UserRoleEnum } from "../interface/user_role.enum";

const SECRET = process.env.JWT_SECRET || "secret";
const SALT_BCRYPT = Number(process.env.SALT_BCRYPT) || 10;

class User implements UserType {
  private password?: string;
  id?: number;
  name: string;
  schoolId: number;
  classId: number;
  registration?: string;
  birthDate: Date;
  role: UserRoleEnum;
  phone: string;
  email: string;
  cpf: string;
  rg: string;
  profile_picture?: string
  address?: string;
  createdAt?: Date;
  updatedAt?: Date;

  constructor({ id, name, schoolId, classId, registration, birthDate: birth_date, role, phone, email, cpf, rg, profile_picture, address, createdAt, updatedAt }: UserType, password?: string) {
    this.id = id;
    this.name = name;
    this.schoolId = schoolId;
    this.classId = classId;
    this.registration = registration;
    this.birthDate = birth_date;
    this.role = role;
    this.phone = phone;
    this.email = email;
    this.cpf = cpf;
    this.rg = rg;
    this.profile_picture = profile_picture;
    this.address = address;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.password = password;
  }

  static createByDb(rowDb: any, password?: string): User {
    return new User({
      id: rowDb.id,
      name: rowDb.name,
      schoolId: rowDb.school_id,
      classId: rowDb.class_id,
      registration: rowDb.registration,
      birthDate: rowDb.birth_date,
      role: rowDb.role,
      phone: rowDb.phone,
      email: rowDb.email,
      cpf: rowDb.cpf,
      rg: rowDb.rg,
      profile_picture: rowDb.profile_picture?.url,
      address: rowDb.address,
      createdAt: rowDb.created_at,
      updatedAt: rowDb.updated_at,
    }, password,
    );
  }

  toResume(role: UserRoleEnum): object {
    let data: {};

    switch (role) {
      case UserRoleEnum.ADMIN:
        data = {
          id: this.id,
          name: this.name,
          schoolId: this.schoolId,
          classId: this.classId,
          registration: this.registration,
          birth_date: this.birthDate,
          role: this.role,
          phone: this.phone,
          email: this.email,
          cpf: this.cpf,
          rg: this.rg,
          profile_picture: this.profile_picture,
          address: this.address,
          createdAt: this.createdAt,
          updatedAt: this.updatedAt,
        };
        break;
      case UserRoleEnum.TEACHER:
      case UserRoleEnum.TUTOR:
        data = {
          id: this.id,
          name: this.name,
          schoolId: this.schoolId,
          classId: this.classId,
          registration: this.registration,
          birth_date: this.birthDate,
          role: this.role,
          phone: this.phone,
          email: this.email,
          profile_picture: this.profile_picture,
          address: this.address,
          createdAt: this.createdAt,
          updatedAt: this.updatedAt,
        };
        break;
      case UserRoleEnum.STUDENT:
        data = {
          id: this.id,
          name: this.name,
          schoolId: this.schoolId,
          classId: this.classId,
          registration: this.registration,
          role: this.role,
          phone: this.phone,
          email: this.email,
          profile_picture: this.profile_picture,
          createdAt: this.createdAt,
          updatedAt: this.updatedAt,
        };
        break;
      default:
        data = {};
        break;
    }

    return data;
  }

  async save(): Promise<void> {
    try {
      this.password = await bcrypt.hash(this.password!, SALT_BCRYPT);
    } catch (error) {
      throw "password invalid";
    }

    const values = [
      this.name,
      this.schoolId,
      this.classId,
      this.birthDate,
      this.role,
      this.phone,
      this.email,
      this.cpf,
      this.rg,
      this.profile_picture,
      this.address,
      this.password,
    ];
    const query = {
      text: `
              INSERT INTO users (
                name,
                school_id,
                class_id,
                birth_date,
                role,
                phone,
                email,
                cpf,
                rg,
                profile_picture,
                address,
                password,
                registration
              )
                SELECT $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 
                    concat( 
                      EXTRACT(YEAR FROM  CURRENT_DATE), 
                      LPAD(COUNT(*)::varchar,4,'0')
                    ) FROM users
                    WHERE EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM CURRENT_DATE)
              RETURNING id, registration
          `,
      values,
    }

    try {
      const resp = await db.dbConn(query);
      this.id = resp.rows[0].id;
      this.registration = resp.rows[0].registration;
    } catch (err: any) {
      console.error(err);
      throw err.toString().replaceAll('"', "'") + ' - ' + err.detail;
    }
  }

  static async get(id: number, school_id: number): Promise<User | null> {
    const values = [id, school_id];
    const query = {
      text: `
              SELECT * FROM users
              WHERE 
                id = $1 AND
                school_id = $2
          `,
      values,
    }

    try {
      const row = await db.dbConn(query);

      if (row.rows.length == 1) {
        return User.createByDb(row.rows[0]);
      }
      return null;
    } catch (err: any) {
      console.error(err);
      throw err.detail;
    }
  }

  static async getPaginated(school_id: number, search: string, rowsPerPage: number, page: number): Promise<User[]> {
    const values = [school_id, rowsPerPage, rowsPerPage * (page - 1)];
    const query = {
      text: `
              SELECT * FROM users
              WHERE
                school_id = $1 AND
                (${Number(search) ? `class_id = ${Number(search)} OR` : ''}
                ${search ? `email ILIKE '%${search}%' OR` : ''}
                ${search ? `registration ILIKE '%${search}%' OR` : ''}
                ${search ? `name ILIKE '%${search}%' OR` : ''}
                true)
              LIMIT $2
              OFFSET $3
          `,
      values,
    }

    try {
      const rows = await db.dbConn(query);
      if (!rows || rows.rows.length == 0) return [];

      const subjects: User[] = [];
      for (const iterator of rows.rows) {
        subjects.push(User.createByDb(iterator, undefined));
      }

      return subjects;
    } catch (err: any) {
      console.error(err);
      throw err.detail;
    }
  }

  static async find({ classId, name, email, registration, schoolId, role }: UserTypeEmpty, isPassword = false): Promise<User[]> {
    const query = {
      text: `
              SELECT * FROM users
              WHERE 
                ${classId ? `class_id = ${classId} AND` : ''}
                ${email ? `email = '${email}' AND` : ''}
                ${registration ? `registration = '${registration}' AND` : ''}
                ${role ? `role = '${role}' AND` : ''}
                ${name ? `name ILIKE '%${name}%' AND` : ''}
                ${schoolId ? `school_id = '${schoolId}' AND` : ''}
                true
          `,
    }

    try {
      const rows = await db.dbConn(query);
      if (!rows || rows.rows.length == 0) return [];

      const users: User[] = [];
      for (const iterator of rows.rows) {
        users.push(User.createByDb(iterator, isPassword ? iterator.password : undefined));
      }

      return users;
    } catch (err: any) {
      console.error(err);
      throw err.detail ? err.detail : err.toString().replaceAll('"', "'");
    }
  }

  static async remove(id: number, school_id: number): Promise<number> {
    const values = [id, school_id];
    const query = {
      text: `
              DELETE FROM users
              WHERE 
                id = $1 AND
                school_id = $2
          `,
      values,
    }

    try {
      const response = await db.dbConn(query);
      return response.rowCount;
    } catch (err: any) {
      console.error(err);
      throw err.detail;
    }
  }

  async update(): Promise<number> {
    const values = [
      this.name,
      this.schoolId,
      this.classId,
      this.registration,
      this.birthDate,
      this.role,
      this.phone,
      this.email,
      this.cpf,
      this.rg,
      this.profile_picture,
      this.address,
      this.id,
    ];
    const query = {
      text: `
              UPDATE users
                SET
                  name = $1,
                  class_id = $3,
                  registration = $4,
                  birth_date = $5,
                  role = $6,
                  phone = $7,
                  email = $8,
                  cpf = $9,
                  rg = $10,
                  profile_picture = $11,
                  address = $12,
                  updated_at = NOW()
                WHERE 
                  id = $13 AND school_id = $2
          `,
      values,
    }

    try {
      const response = await db.dbConn(query);
      return response.rowCount;
    } catch (err: any) {
      console.error(err);
      throw err.detail ? err.detail : err.toString().replaceAll('"', "'");
    }
  }

  validatePass(password: string) {
    return bcrypt.compareSync(password, this.password!);
  }

  get toTokenInfo(): TokenJwtUser {
    return {
      userId: this.id,
      schoolId: this.schoolId,
      email: this.email,
      role: this.role,
      userName: this.name,
      userPhoto: this.profile_picture,
      classId: this.classId,
    }
  }

  get toTokenJwt(): string {
    return jwt.sign(this.toTokenInfo, SECRET);
    // return jwt.sign(this.toTokenInfo, SECRET, { expiresIn: '3h' });
  }

}

export = User;
