import db from '../config/databaseConnection.config';
import { Request } from "express";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";


const SECRET = process.env.JWT_SECRET || "secret";

class School {
    static async save(req: Request) {

        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(req.body.password, saltRounds);

        const values = [
            req.body.name,
            req.body.cnpj,
            req.body.logo,
            req.body.cep,
            req.body.email,
            req.body.phone,
            passwordHash,
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
            return schoolCreate

        } catch (err: any) {
            console.log(err)
            throw err;
        }
    }

    static async list() {
        const querySelectSchools = {
            text: `
                    SELECT * FROM schools
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

    static async find(email: string) {
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
            return schoolFind;
        } catch (err: any) {
            console.log(err);
            throw err;
        }
    }

    static async delete(req: Request) {
        const values = [
            req.query.name
        ];
        const queryDeleteSchool = {
            text: `
                    DELETE FROM schools s
                    where s.name = $1
                    RETURNING
                        name
                `,
            values,
        }
        try {
            const schoolDelete = await db.dbConn(queryDeleteSchool);
            return schoolDelete;
        } catch (err: any) {
            console.log(err);
            throw err;
        }
    }

    static generatorJwtToken(schoolId: string, email: string) {
        return jwt.sign({ email, schoolId }, SECRET);
    }

    static async validatePass(password: string, hash: string) {
        return bcrypt.compareSync(password, hash);
    }
}

export = School;