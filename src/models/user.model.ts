import jwt from "jsonwebtoken";
import db from '../config/databaseConnection.config';
import { Request } from "express";
import { UserJwt } from "../interface/user.interface";
import bcrypt from 'bcryptjs';

const SECRET = process.env.JWT_SECRET || "secret";
class User {
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
        req.body.position,
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
            school_id, class_id, name, registration, birth_date, position,
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

  static async generateAuthToken(user: UserJwt) {
    const token = jwt.sign(user, SECRET);

    return token;
  }

  static verifyToken(token: string): UserJwt | null {
    try {
      const info = jwt.verify(token, SECRET) as UserJwt;
      const now = Date.now();

      if (info.dateExp > now) {
        return info;
      }
      return null;

    } catch (_) {
      return null;
    }
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

  static async find(email: any) {
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
