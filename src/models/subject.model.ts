import db from '../config/databaseConnection.config';
import { SubjectType, SubjectTypeEmpty } from '../interface/subject.interface';


class Subject implements SubjectType {
  id?: number;
  schoolId: number;
  teacherId: number;
  classeId: number;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;

  constructor({ schoolId, teacherId, name, createdAt, updatedAt, id, classeId }: SubjectType) {
    this.schoolId = schoolId;
    this.teacherId = teacherId;
    this.classeId = classeId;
    this.name = name;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.id = id;
  }

  static createByDb(rowDb: any): Subject {
    return new Subject({
      schoolId: rowDb.school_id,
      teacherId: rowDb.teacher_id,
      classeId: rowDb.classe_id,
      name: rowDb.name,
      createdAt: rowDb.created_at,
      updatedAt: rowDb.updated_at,
      id: rowDb.id,
    });
  }

  toMap(): {} {
    return {
      id: this.id,
      schoolId: this.schoolId,
      teacherId: this.teacherId,
      classeId: this.classeId,
      name: this.name,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      test: 'test',
    }
  }

  async save(): Promise<string> {
    const values = [
      this.schoolId,
      this.teacherId,
      this.classeId,
      this.name,
    ];
    const query = {
      text: `
                INSERT INTO subjects (
                    school_id, teacher_id, classe_id, name
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

  static async get(id: number, school_id: number): Promise<Subject | null> {
    const values = [id, school_id];
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

  static async find({ classeId, schoolId, name, teacherId }: SubjectTypeEmpty): Promise<Subject[]> {
    const query = {
      text: `
              SELECT * FROM subjects
              WHERE 
                ${classeId ? `classe_id = ${classeId} AND` : ''}
                ${teacherId ? `teacher_id = ${teacherId} AND` : ''}
                ${name ? `name = ${name} AND` : ''}
                school_id = ${schoolId}
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

  static async remove(id: number, school_id: number): Promise<any> {
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
      await db.dbConn(query);
    } catch (err: any) {
      console.error(err);
      throw err.detail;
    }
  }

  async update(): Promise<any> {
    const values = [
      this.schoolId,
      this.teacherId,
      this.classeId,
      this.name,
      this.id,
    ];
    const query = {
      text: `
                UPDATE subjects
                  SET
                      teacher_id = $2,
                      classe_id = $3,
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

export = Subject;