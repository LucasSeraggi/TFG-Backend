import db from '../config/databaseConnection.config';
import { Request, Response } from "express";

class Role {
    static async list() {
        const querySelectRoles = {
            text: `
                SELECT
                    type.typname,
                    enum.enumlabel AS value
                FROM pg_enum AS enum
                JOIN pg_type AS type
                ON (type.oid = enum.enumtypid and type.typname = 'enum_users_role')
                `
        }
        try {
            const roles = await db.dbConn(querySelectRoles);
            return roles;
        } catch (err: any) {
            console.log(err);
            throw err;
        }
    }
}

export = Role;