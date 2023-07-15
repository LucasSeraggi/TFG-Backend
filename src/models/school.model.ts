import db from '../config/databaseConnection.config';
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import { SchoolType, SchoolTypeEmpty } from '../interface/school.interface';
import { TokenJwtSchool } from "../interface/global.interface";
import { UserRoleEnum } from '../interface/user_role.enum';

const SECRET = process.env.JWT_SECRET || "secret";
const SALT_BCRYPT = Number(process.env.SALT_BCRYPT) || 10;

// interface SchoolInterface {
//     id?: number;
//     name: string;
//     cnpj: string;
//     logo?: string;
//     cep: string;
//     phone: string;
//     email: string;
//     createdAt?: Date;
//     updatedAt?: Date;
//     disabledAt?: Date;

//     save(): Promise<void>;
//     list(): Promise<School[]>;
//     find({ email }: SchoolTypeEmpty): Promise<School[]>;
//     disable(id: number): Promise<void>;
//     validatePass(password: string): boolean;
//     update(): Promise<number>;
//     me(schoolId: string): Promise<School[]>;
//     get toTokenJwt(): string;
// }

class School implements SchoolType {
    private password?: string;
    id?: number;
    name: string;
    cnpj: string;
    logo?: string;
    // social/?: {};
    cep: string;
    phone: string;
    email: string;
    createdAt?: Date;
    updatedAt?: Date;
    disabledAt?: Date;


    constructor({ id, name, cnpj, logo, cep, phone, email, createdAt, updatedAt, disabledAt }: SchoolType, password?: string) {
        this.id = id;
        this.name = name;
        this.cnpj = cnpj;
        this.logo = logo;
        this.cep = cep;
        this.phone = phone;
        this.email = email;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.disabledAt = disabledAt;
        this.password = password;
    }

    private static createByDb(rowDb: any, password?: string): School {
        return new School({
            id: rowDb.id,
            name: rowDb.name,
            cnpj: rowDb.cnpj,
            logo: rowDb.logo,
            cep: rowDb.cep,
            phone: rowDb.phone,
            email: rowDb.email,
            createdAt: rowDb.created_at,
            updatedAt: rowDb.updated_at,
            disabledAt: rowDb.disabled_at,
        }, password);
    }

    async save(): Promise<void> {
        try {
            this.password = await bcrypt.hash(this.password!, SALT_BCRYPT);
        } catch (err) {
            throw "password invalid";
        }

        const values = [
            this.name,
            this.cnpj,
            this.logo,
            this.cep,
            this.email,
            this.phone,
            this.password,
        ];

        const queryInsertSchool = {
            text: `
                   INSERT INTO schools (
                       name, cnpj, logo, cep, email, phone, password
                   )
                   VALUES ($1, $2, $3, $4, $5, $6, $7)
                   RETURNING
                       id,
                       name
                 `,
            values,
        };

        try {
            const schoolCreate = await db.dbConn(queryInsertSchool);
            this.id = schoolCreate.rows[0].id;
            return schoolCreate
        } catch (err: any) {
            console.error(err);
            throw err;
        }
    }

    static async list() {
        const querySelectSchools = {
            text: `
                    SELECT * FROM schools
                    WHERE disabled_at IS NULL
                `
        }
        try {
            const schools = await db.dbConn(querySelectSchools);
            return schools;
        } catch (err: any) {
            console.log(err);
            throw err;
        }
    }

    // static async getPaginated(school_id: number, search: string, rowsPerPage: number, page: number): Promise<{
    //     data: School[],
    //     total_count: number,
    // }> {
    //     const values = [school_id, rowsPerPage, rowsPerPage * (page - 1)];
    //     const query = {
    //         text: `SELECT *,
    //                 (SELECT COUNT(*) FROM schools WHERE
    //                   school_id = $1 AND
    //                   ${search ? `name ILIKE '%${search}%' OR` : ''}
    //                   ${search ? `cnpj ILIKE '%${search}%' OR` : ''}
    //                   ${search ? `cep ILIKE '%${search}%' OR` : ''}
    //                   ${search ? `phone ILIKE '%${search}%' OR` : ''}
    //                   ${search ? `email ILIKE '%${search}%' OR` : ''}
    //                   true) AS total_count
    //                 FROM schools
    //                 WHERE
    //                   school_id = $1 AND
    //                   ${search ? `name ILIKE '%${search}%' OR` : ''}
    //                   ${search ? `cnpj ILIKE '%${search}%' OR` : ''}
    //                   ${search ? `cep ILIKE '%${search}%' OR` : ''}
    //                   ${search ? `phone ILIKE '%${search}%' OR` : ''}
    //                   ${search ? `email ILIKE '%${search}%' OR` : ''}
    //                   true)
    //               LIMIT $2
    //               OFFSET $3
    //           `,
    //         values,
    //     }

    //     try {
    //         const rows = await db.dbConn(query);
    //         if (!rows || rows.rows.length == 0) return { data: [], total_count: 0 };

    //         const subjects: School[] = [];
    //         for (const iterator of rows.rows) {
    //             subjects.push(School.createByDb(iterator));
    //         }
    //         const totalCount = rows[0].total_count;

    //         return { data: subjects, total_count: totalCount };
    //     } catch (err: any) {
    //         console.error(err);
    //         throw err.detail;
    //     }
    // }

    static async find({ email }: SchoolTypeEmpty, isPassword = false) {
        const values = [
            email
        ];
        const querySelectSchool = {
            text: `
                    SELECT * FROM schools s
                    where s.email = $1 
                `,
            values,
        }
        try {
            const schoolFind = await db.dbConn(querySelectSchool);
            if (!schoolFind || schoolFind.rows.length == 0) return [];
            const subjects: School[] = [];
            for (const iterator of schoolFind.rows) {
                subjects.push(School.createByDb(iterator, isPassword ? iterator.password : undefined));
            }
            return subjects;
        } catch (err: any) {
            console.log(err);
            throw err;
        }
    }

    static async delete(id: number) {
        const values = [id];
        const queryDeleteSchool = {
            text: `
                    UPDATE schools s
                    SET disabled_at = NOW()
                    where s.id = $1
                    RETURNING
                        id
                `,
            values,
        }
        try {
            const response = await db.dbConn(queryDeleteSchool);
            return response;
        } catch (err: any) {
            console.log(err);
            throw err;
        }
    }

    validatePass(password: string) {
        return bcrypt.compareSync(password, this.password!);
    }

    get toTokenInfo(): TokenJwtSchool {
        return {
            schoolId: this.id!,
            email: this.email!,
            role: UserRoleEnum.ADMIN,// this.role,
        }
    }

    get toTokenJwt(): string {
        return jwt.sign(this.toTokenInfo, SECRET);
    }

    async update(): Promise<number> {
        const values = [
            this.name,
            this.cnpj,
            this.cep,
            this.phone,
            this.logo,
            this.id,
        ];
        const query = {
            text: `
                  UPDATE schools
                    SET
                      name = $1,
                      cnpj = $2,
                      cep = $3,
                      phone = $4,
                      logo = $5,
                      updated_at = NOW()
                    WHERE 
                      id = $6
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

    static async me(schoolId: string) {
        const values = [
            schoolId
        ];
        const querySelectSchool = {
            text: `
                    SELECT * FROM schools
                        where id = $1
                `,
            values,
        }
        try {
            const schoolFind = await db.dbConn(querySelectSchool);
            return schoolFind;
        } catch (err: any) {
            console.log(err);
            throw err;
        }
    }
}

export = School;