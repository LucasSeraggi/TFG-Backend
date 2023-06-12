import db from '../config/databaseConnection.config';
import { SubjectType, SubjectTypeEmpty } from '../interface/subject.interface';


export class Subject implements SubjectType {
  id?: number;
  schoolId: number;
  teacherId: number;
  classId: number;
  name: string;
  className?: string;
  teacherName?: string;
  createdAt?: Date;
  updatedAt?: Date;
  picture?: string;

  constructor({ schoolId, teacherId, name, createdAt, updatedAt, id, classId: classeId, className, teacherName, picture }: SubjectType) {
    this.teacherName = teacherName;
    this.className = className;
    this.schoolId = schoolId;
    this.teacherId = teacherId;
    this.classId = classeId;
    this.name = name;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.id = id;
    this.picture = picture;
  }

  static createByDb(rowDb: any): Subject {
    return new Subject({
      schoolId: rowDb.school_id,
      teacherId: rowDb.teacher_id,
      classId: rowDb.class_id,
      name: rowDb.name,
      createdAt: rowDb.created_at,
      updatedAt: rowDb.updated_at,
      id: rowDb.id,
      className: rowDb.class_name,
      teacherName: rowDb.teacher_name,
      picture: rowDb.picture?.url,
    });
  }

  async save(): Promise<string> {
    const values = [
      this.schoolId,
      this.teacherId,
      this.classId,
      this.name,
    ];
    const query = {
      text: `
                INSERT INTO subjects (
                    school_id, teacher_id, class_id, name
                )
                VALUES ($1, $2, $3, $4)
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

  static async get({ id, schoolId }: SubjectTypeEmpty): Promise<Subject | null> {
    const values = [id, schoolId];
    const query = {
      text: `
              SELECT * FROM subjects
              WHERE 
                id = $1 AND
                school_id = $2
          `,
      values,
    }

    try {
      const row = await db.dbConn(query);

      if (row.rows.length == 1) {
        return Subject.createByDb(row.rows[0]);
      }
      return null;
    } catch (err: any) {
      console.error(err);
      throw err.detail;
    }
  }

  static async getPaginated(school_id: number, search: string, rowsPerPage: number, page: number): Promise<{
    data: Subject[],
    total_count: number,
  }> {
    const values = [school_id, rowsPerPage, rowsPerPage * (page - 1)];
    const query = {
      text: `SELECT *,
                (SELECT COUNT(*) FROM subjects WHERE
                  school_id = $1 AND
                  ${Number(search) ? `class_id = ${Number(search)} OR` : ''}
                  ${Number(search) ? `teacher_id = ${Number(search)} OR` : ''}
                  ${search ? `name ILIKE '%${search}%' OR` : ''}
                  true) AS total_count
                FROM subjects
                WHERE
                  school_id = $1 AND
                  (${Number(search) ? `class_id = ${Number(search)} OR` : ''}
                  ${Number(search) ? `teacher_id = ${Number(search)} OR` : ''}
                  ${search ? `name ILIKE '%${search}%' OR` : ''}
                  true)
              LIMIT $2
              OFFSET $3
          `,
      values,
    }

    try {
      const rows = await db.dbConn(query);
      if (!rows || rows.rows.length == 0) return { data: [], total_count: 0 };

      const subjects: Subject[] = [];
      for (const iterator of rows.rows) {
        subjects.push(Subject.createByDb(iterator));
      }
      const totalCount = rows[0].total_count;

      return { data: subjects, total_count: totalCount };
    } catch (err: any) {
      console.error(err);
      throw err.detail;
    }
  }

  static async find({ classId, schoolId, name, teacherId }: SubjectTypeEmpty): Promise<Subject[]> {
    const query = {
      text: `
              SELECT s.*, c.name AS class_name, u.name as teacher_name FROM subjects s
              LEFT JOIN classes c
              ON s.class_id = c.id
              LEFT JOIN users u
              ON s.teacher_id = u.id
              WHERE 
                ${classId ? `s.class_id = ${classId} AND` : ''}
                ${teacherId ? `s.teacher_id = ${teacherId} AND` : ''}
                ${name ? `s.name ILIKE '%${name}%' AND` : ''}
                s.school_id = ${schoolId}
          `,
    }

    try {
      const rows = await db.dbConn(query);
      if (!rows || rows.rows.length == 0) return [];

      const subjects: Subject[] = [];
      for (const iterator of rows.rows) {
        subjects.push(Subject.createByDb(iterator));
      }

      return subjects;
    } catch (err: any) {
      console.error(err);
      throw err.detail;
    }
  }

  static async remove(id: number, school_id: number): Promise<number> {
    const values = [id, school_id];
    const query = {
      text: `
              DELETE FROM subjects
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

  async update(): Promise<any> {
    const values = [
      this.schoolId,
      this.teacherId,
      this.classId,
      this.name,
      this.id,
    ];
    const query = {
      text: `
                UPDATE subjects
                  SET
                      teacher_id = $2,
                      class_id = $3,
                      name = $4,
                      updated_at = NOW() 
                WHERE id = $5 AND school_id = $1
            `,
      values,
    };

    try {
      const resp = await db.dbConn(query);
      console.log(resp);
    } catch (err: any) {
      console.error(err);
      throw err.detail;
    }
  }
}