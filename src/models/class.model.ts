import db from '../config/databaseConnection.config';
import { Request } from "express";
import { ClassType, ClassTypeEmpty } from '../interface/class.interface';


export class Class implements ClassType {
    id?: number;
    schoolId: number;
    name: string;
    createdAt?: Date;
    updatedAt?: Date;

    constructor({ schoolId, name, createdAt, updatedAt, id }: ClassType) {
        this.schoolId = schoolId;
        this.name = name;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.id = id;
    }

    static createByDb(rowDb: any): Class {
        return new Class({
            schoolId: rowDb.school_id,
            name: rowDb.name,
            createdAt: rowDb.created_at,
            updatedAt: rowDb.updated_at,
            id: rowDb.id,
        });
    }

    async save(): Promise<string> {
        const values = [
            this.schoolId,
            this.name,
        ];
        const query = {
            text: `
                  INSERT INTO classes (
                      school_id, name
                  )
                  VALUES ($1, $2)
                  RETURNING id
              `,
            values,
        };

        try {
            const id = (await db.dbConn(query)).rows[0]?.id;
            this.id = id;
            return id;

        } catch (err: any) {
            console.error(err);
            throw err.detail;
        }
    }

    static async get({ id, schoolId }: ClassTypeEmpty): Promise<Class | null> {
        const values = [id, schoolId];
        const query = {
            text: `
                SELECT * FROM classes
                WHERE 
                  id = $1 AND
                  school_id = $2
            `,
            values,
        }

        try {
            const row = await db.dbConn(query);

            if (row.rows.length == 1) {
                return Class.createByDb(row.rows[0]);
            }
            return null;
        } catch (err: any) {
            console.error(err);
            throw err.detail;
        }
    }

    static async find({ schoolId, name }: ClassTypeEmpty): Promise<Class[]> {
        const query = {
            text: `
                SELECT * FROM classes
                WHERE 
                  ${name ? `name ILIKE '%${name}%' AND` : ''}
                  school_id = ${schoolId}
            `,
        }

        try {
            const rows = await db.dbConn(query);
            if (!rows || rows.rows.length == 0) return [];

            const subjects: Class[] = [];
            for (const iterator of rows.rows) {
                subjects.push(Class.createByDb(iterator));
            }

            return subjects;
        } catch (err: any) {
            console.error(err);
            throw err.detail;
        }
    }

    static async remove({ id, schoolId }: ClassTypeEmpty): Promise<number> {
        const values = [id, schoolId];
        const query = {
            text: `
                DELETE FROM classes
                WHERE 
                  id = $1 AND
                  school_id = $2
            `,
            values,
        }

        try {
            let response = await db.dbConn(query);
            return response.rowCount;
        } catch (err: any) {
            console.error(err);
            throw err.detail;
        }
    }

    async update(): Promise<number> {
        const values = [
            this.id,
            this.schoolId,
            this.name,
        ];
        const query = {
            text: `
                  UPDATE classes
                    SET
                        name = $3,
                        updated_at = NOW() 
                  WHERE id = $1 AND school_id = $2
              `,
            values,
        };

        try {
            let response = await db.dbConn(query);
            return response.rowCount;
        } catch (err: any) {
            console.error(err);
            throw err.detail;
        }
    }

    static async getPaginated(school_id: number, search: string, rowsPerPage: number, page: number): Promise<{
        data: Class[],
        total_count: number,
      }> {
        const values = [school_id, rowsPerPage, rowsPerPage * (page - 1)];
        const query = {
          text: `SELECT *,
                    (SELECT COUNT(*) FROM classes WHERE
                      school_id = $1 AND
                      ${search ? `name ILIKE '%${search}%' OR` : ''}
                      true) AS total_count
                    FROM classes
                    WHERE
                      school_id = $1 AND
                      (${search ? `name ILIKE '%${search}%' OR` : ''}
                      true)
                  LIMIT $2
                  OFFSET $3
              `,
          values,
        }
    
        try {
          const rows = await db.dbConn(query);
          if (!rows || rows.rows.length == 0) return { data: [], total_count: 0 };
          console.log(rows.rows);
    
          const subjects: Class[] = [];
          for (const iterator of rows.rows) {
            subjects.push(Class.createByDb(iterator));
          }
          const totalCount = rows[0].total_count;
    
          return { data: subjects, total_count: totalCount };
        } catch (err: any) {
          console.error(err);
          throw err.detail;
        }
      } 
}

// class Class {
//     static async save(req: Request) {
//         const values = [
//             req.body.name,
//             req.body.school_id,
//             req.body.users
//         ];

//         const queryInsertClass = {
//             text: `
//                     INSERT INTO classes (
//                         name, school_id, users 
//                     )
//                     VALUES ($1, $2, $3)
//                     RETURNING
//                         id,
//                         name
//                 `,
//             values,
//         };

//         try {
//             const classCreate = await db.dbConn(queryInsertClass);
//             return classCreate;

//         } catch (err: any) {
//             console.log(err);
//             throw err;
//         }
//     }

//     static async list() {
//         const querySelectClasses = {
//             text: `
//                     SELECT * FROM classes
//                 `
//         }
//         try {
//             const classes = await db.dbConn(querySelectClasses);
//             return classes;
//         } catch (err: any) {
//             console.log(err);
//             throw err;
//         }
//     }

//     static async find(req: Request) {
//         const values = [
//             req.query.school_id,
//             req.query.name
//         ];
//         const querySelectClass = {
//             text: `
//                     SELECT * FROM classes c
//                     where c.school_id = $1 and
//                     c.name = $2 
//                 `,
//             values,
//         }
//         try {
//             const classFind = await db.dbConn(querySelectClass);
//             return classFind;
//         } catch (err: any) {
//             console.log(err);
//             throw err;
//         }
//     }

//     static async delete(req: Request) {
//         const values = [
//             req.query.school_id,
//             req.query.name
//         ];
//         const queryDeleteClass = {
//             text: `
//                     DELETE FROM classes c
//                     where c.school_id = $1 and
//                     c.name = $2
//                     RETURNING
//                         name
//                 `,
//             values,
//         }
//         try {
//             const classDelete = await db.dbConn(queryDeleteClass);
//             return classDelete;
//         } catch (err: any) {
//             console.log(err);
//             throw err;
//         }
//     }
// }