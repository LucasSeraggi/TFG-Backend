import jwt from "jsonwebtoken";
import db from '../config/databaseConnection.config';
import { Request } from "express";
import { TokenJwt } from "../interface/global.interface";
import bcrypt from 'bcryptjs';
import { UserType, UserTypeEmpty } from "../interface/user.interface";
import { UserRole } from "../interface/user_role.enum";

const SECRET = process.env.JWT_SECRET || "secret";

class User implements UserType {
  name: string;
  schoolId: number;
  classId: number;
  registration: string;
  birth_date: Date;
  role: UserRole;
  phone: string;
  email: string;
  cpf: string;
  rg: string;
  password?: string;
  profile_picture?: {}
  address?: string;

  constructor({ name, schoolId, classId, registration, birth_date, role, phone, email, cpf, rg, profile_picture, address }: UserType) {
    this.name = name;
    this.schoolId = schoolId;
    this.classId = classId;
    this.registration = registration;
    this.birth_date = birth_date;
    this.role = role;
    this.phone = phone;
    this.email = email;
    this.cpf = cpf;
    this.rg = rg;
    this.profile_picture = profile_picture;
    this.address = address;
  }

  static createByDb(rowDb: any): User {
    return new User({
      name: rowDb.name,
      schoolId: rowDb.school_id,
      classId: rowDb.class_id,
      registration: rowDb.registration,
      birth_date: rowDb.birth_date,
      role: rowDb.role,
      phone: rowDb.phone,
      email: rowDb.email,
      cpf: rowDb.cpf,
      rg: rowDb.rg,
      profile_picture: rowDb.profile_picture,
      address: rowDb.address,
    });
  }

  get toResume(): object {
    // Não possui dados sensíveis
    return {
      name: this.name,
      registration: this.registration,
      phone: this.phone,
      email: this.email,
      profile_picture: this.profile_picture,
    };
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

  static async find({ classId, name, email, registration, schoolId, role }: UserTypeEmpty): Promise<User[]> {
    const query = {
      text: `
              SELECT * FROM users
              WHERE 
                ${classId ? `class_id = ${classId} AND` : ''}
                ${email ? `teacher_id = '${email}' AND` : ''}
                ${registration ? `teacher_id = '${registration}' AND` : ''}
                ${role ? `role = '${role}' AND` : ''}
                ${name ? `name ILIKE '%${name}%' AND` : ''}
                school_id = ${schoolId}
          `,
    }

    try {
      const rows = await db.dbConn(query);
      if (!rows || rows.rows.length == 0) return [];

      const subjects: User[] = [];
      for (const iterator of rows.rows) {
        subjects.push(User.createByDb(iterator));
      }

      return subjects;
    } catch (err: any) {
      console.error(err);
      throw err.detail;
    }
  }


  // Older code ----------------------------------------------------------------------
  static async save(req: Request) {
    try {
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(req.body.password, saltRounds);

      const values = [
        req.body.school_id,
        req.body.class_id,
        req.body.name,
        req.body.registration,
        req.body.birth_date,
        req.body.role,
        req.body.phone,
        req.body.email,
        req.body.cpf,
        req.body.rg,
        passwordHash,
        req.body.profile_picture,
        req.body.address,
      ];

      const queryInsertUser = {
        text: `
          INSERT INTO users (
            school_id, class_id, name, registration, birth_date, role,
            phone, email, cpf, rg, password, profile_picture, address
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
          RETURNING
              id,
              registration,
              class_id,
              name,
              email
      `,
        values,
      };

      const userCreate = await db.dbConn(queryInsertUser);
      return userCreate;
    } catch (err: any) {
      console.log(err);
      throw err;
    }
  }

  static async list() {
    const querySelectUsers = {
      text: `
              SELECT * FROM users
          `
    }
    try {
      const users = await db.dbConn(querySelectUsers);
      return users;
    } catch (err: any) {
      console.log(err);
      throw err;
    }
  }

  static async validatePass(password: string, hash: string) {
    return bcrypt.compareSync(password, hash);
  }

  static async generateAuthToken(user: TokenJwt) {
    const token = jwt.sign(user, SECRET);

    return token;
  }

  static async findEmail(email: string) {
    const values = [email];
    const query = {
      text: `
          SELECT *
          FROM users
          WHERE email = $1
          Limit 1
      `, values,
    }
    const result = await db.dbConn(query);
    if (result.rowCount == 0) {
      return false;
    } else if (result.rowCount > 0) {
      return true;
    }

    throw 'Error query';
  }

  static async findOld(email: any) {
    const values = [
      email
    ];
    const querySelectUser = {
      text: `
                SELECT * FROM users u
                where u.email = $1 
            `,
      values,
    }
    try {
      const userFind = await db.dbConn(querySelectUser);
      return userFind;
    } catch (err: any) {
      console.log(err);
      throw err;
    }
  }

  static async delete(req: Request) {
    const values = [
      req.query.cpf
    ];
    const queryDeleteUser = {
      text: `
                DELETE FROM users u
                where u.cpf = $1
                RETURNING
                    name
            `,
      values,
    }
    try {
      const userDelete = await db.dbConn(queryDeleteUser);
      return userDelete;
    } catch (err: any) {
      console.log(err);
      throw err;
    }
  }
}

export = User;
