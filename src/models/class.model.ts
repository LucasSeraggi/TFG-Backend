import db from '../config/databaseConnection.config';
import { Request, Response } from "express";

class Class {
    static async save(req: Request) {
        const values = [
            req.body.name,
            req.body.school_id,
            req.body.users
        ];

        const queryInsertClass = {
            text: `
                    INSERT INTO classes (
                        name, school_id, users 
                    )
                    VALUES ($1, $2, $3)
                    RETURNING
                        id,
                        name
                `,
            values,
        };

        try {
            const classCreate = await db.dbConn(queryInsertClass);
            return classCreate;

        } catch (err: any) {
            console.log(err);
            throw err;
        }
    }

    static async list() {
        const querySelectClasses = {
            text: `
                    SELECT * FROM classes
                `
        }
        try {
            const classes = await db.dbConn(querySelectClasses);
            return classes;
        } catch (err: any) {
            console.log(err);
            throw err;
        }
    }

    static async find(req: Request) {
        const values = [
            req.query.school_id,
            req.query.name
        ];
        const querySelectClass = {
            text: `
                    SELECT * FROM classes c
                    where c.school_id = $1 and
                    c.name = $2 
                `,
            values,
        }
        try {
            const classFind = await db.dbConn(querySelectClass);
            return classFind;
        } catch (err: any) {
            console.log(err);
            throw err;
        }
    }

    static async delete(req: Request) {
        const values = [
            req.query.school_id,
            req.query.name
        ];
        const queryDeleteClass = {
            text: `
                    DELETE FROM classes c
                    where c.school_id = $1 and
                    c.name = $2
                    RETURNING
                        name
                `,
            values,
        }
        try {
            const classDelete = await db.dbConn(queryDeleteClass);
            return classDelete;
        } catch (err: any) {
            console.log(err);
            throw err;
        }
    }
}

export = Class;