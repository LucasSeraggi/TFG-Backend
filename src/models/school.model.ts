import db from '../config/databaseConnection.config';
import { Request } from "express";

class School {
    static async save(req: Request) {
        const values = [
            req.body.name,
            req.body.cnpj,
            req.body.logo,
            req.body.cep,
        ];

        const queryInsertSchool = {
            text: `
                    INSERT INTO schools (
                        name, cnpj, logo, cep 
                    )
                    VALUES ($1, $2, $3, $4)
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

    static async find(req: Request) {
        const values = [
            req.query.name
        ];
        const querySelectSchool = {
            text: `
                    SELECT * FROM schools s
                    where s.name = $1 
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
}

export = School;