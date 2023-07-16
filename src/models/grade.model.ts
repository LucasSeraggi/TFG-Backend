import db from '../config/databaseConnection.config';
import { GradeType, GradeTypeEmpty } from '../interface/grade.interface';

export class Grade implements GradeType {
    id?: number;
    name: string;
    description?: string;
    subjectId: number;
    studentId: number;
    activityId: number;
    period?: string;
    note?: number;
    file?: string;
    createdAt?: Date;
    updatedAt?: Date;

    constructor({ id, name, description, subjectId, studentId, activityId, period, note, file, createdAt, updatedAt }: GradeType) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.subjectId = subjectId;
        this.studentId = studentId;
        this.activityId = activityId;
        this.period = period;
        this.note = note;
        this.file = file;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    static createByDb(rowDb: any): Grade {
        return new Grade({
            id: rowDb.id,
            name: rowDb.name,
            description: rowDb.description,
            subjectId: rowDb.subject_id,
            studentId: rowDb.student_id,
            activityId: rowDb.activity_id,
            period: rowDb.period,
            note: rowDb.note,
            file: rowDb.file,
            createdAt: rowDb.created_at,
            updatedAt: rowDb.updated_at,
        });
    }

    async save(): Promise<string> {
        const values = [
            this.name,
            this.description,
            this.subjectId,
            this.studentId,
            this.activityId,
            this.period,
            this.note,
            this.file,
        ];
        const query = {
            text: `
                  INSERT INTO grades (
                      name, description, subject_id, student_id, activity_id, period, note, file
                  )
                  VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
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

    static async get({ id }: GradeTypeEmpty): Promise<Grade | null> {
        const values = [id];
        const query = {
            text: `
                SELECT * FROM grades
                WHERE 
                  id = $1
            `,
            values,
        }

        try {
            const row = await db.dbConn(query);

            if (row.rows.length == 1) {
                return Grade.createByDb(row.rows[0]);
            }
            return null;
        } catch (err: any) {
            console.error(err);
            throw err.detail;
        }
    }

    static async find({ name, activityId, studentId, subjectId }: GradeTypeEmpty): Promise<Grade[]> {
        const query = {
            text: `
                SELECT * FROM grades
                WHERE
                  TRUE
                  ${name ? `name ILIKE %${name}% AND` : ''}
                  ${activityId ? `AND activity_id = ${activityId}` : ''}
                  ${studentId ? `AND student_id = ${studentId}` : ''}
                  ${subjectId ? `AND subject_id = ${subjectId}` : ''}
            `,
        }

        try {
            const rows = await db.dbConn(query);
            if (!rows || rows.rows.length == 0) return [];

            const grades: Grade[] = [];
            for (const iterator of rows.rows) {
                grades.push(Grade.createByDb(iterator));
            }

            return grades;
        } catch (err: any) {
            console.error(err);
            throw err.detail;
        }
    }

    static async remove({ id }: GradeTypeEmpty): Promise<number> {
        const values = [id];
        const query = {
            text: `
                DELETE FROM grades
                WHERE 
                  id = $1
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
            this.name,
            this.description,
            this.subjectId,
            this.studentId,
            this.activityId,
            this.period,
            this.note,
            this.file,
            this.id,
        ];
        const query = {
            text: `
                  UPDATE grades
                    SET
                        name = $1,
                        description = $2,
                        subject_id = $3,
                        student_id = $4,
                        activity_id = $5,
                        period = $6,
                        note = $7,
                        file = $8,
                        updated_at = NOW() 
                  WHERE id = $9
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

    static async getPaginated({ studentId, subjectId, search, rowsPerPage, page }:
        { studentId: number, subjectId: number, search: string, rowsPerPage: number, page: number }): Promise<{
            data: Grade[],
            total_count: number,
        }> {
        const values = [
            rowsPerPage,
            rowsPerPage * (page - 1),
        ];
        const query = {
            text: `
                SELECT *,
                    (SELECT COUNT(*) FROM grades WHERE
                        ${subjectId ? `subject_id = ${subjectId} AND` : ''}
                        ${studentId ? `student_id = ${studentId} AND` : ''}
                        ${search ? `name ILIKE %${search}%` : 'true'}
                    ) AS total_count
                FROM grades
                WHERE 
                    ${subjectId ? `subject_id = ${subjectId} AND` : ''}
                    ${studentId ? `student_id = ${studentId} AND` : ''}
                    ${search ? `name ILIKE %${search}%` : 'true'}
                LIMIT $1
                OFFSET $2
            `,
            values,
        }

        try {
            const rows = await db.dbConn(query);
            if (!rows || rows.rows.length == 0) return { data: [], total_count: 0 };

            const grades: Grade[] = [];
            for (const iterator of rows.rows) {
                grades.push(Grade.createByDb(iterator));
            }
            const totalCount = rows.rows[0].total_count;

            return { data: grades, total_count: totalCount };
        } catch (err: any) {
            console.error(err);
            throw err.detail;
        }
    }
}