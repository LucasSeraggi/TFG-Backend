import db from '../config/databaseConnection.config';
import { NewsType } from '../interface/news.interface';

export class News implements NewsType {
  id?: number;
  title: string;
  description: string;
  schoolId: number;
  subjectId: number;
  subjectName?: string;
  createdAt?: Date;
  updatedAt?: Date;
  classId: number;

  constructor({ id, title, description, schoolId, subjectId, subjectName, createdAt, updatedAt, classId }: NewsType) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.schoolId = schoolId;
    this.subjectId = subjectId;
    this.subjectName = subjectName;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.classId = classId;
  }

  static async find(subjectId: number): Promise<News[]> {
    try {
      const values = [subjectId];
      const query = {
        text:`
          SELECT *
          FROM news 
          WHERE subject_id = $1
          ORDER BY created_at DESC
        `,
        values,
      };
      const row = await db.dbConn(query);
      return row.rows;
    } catch (err: any) {
      console.error(err);
      throw err.detail;
    }
  }

  async save(): Promise<void> {
    const values = [this.title, this.description, this.schoolId, this.classId, this.subjectId];
    const query = {
      text: `
        INSERT INTO news (
          title, description, school_id, class_id, subject_id
        )
        VALUES ($1, $2, $3, $4, $5)
    `,
      values,
    };
    try {
      await db.dbConn(query);
    } catch (err: any) {
      console.error(err);
      throw err.detail;
    }
  }

  async update(): Promise<number> {
    const values = [this.title, this.description, this.schoolId, this.classId, this.subjectId, this.id];
    const query = {
      text: `
              UPDATE users
                SET
                  title = $1,
                  description = $3,
                  classId = $4,
                  subjectId = $5
                  updated_at = NOW()
                WHERE 
                  id = $6 AND school_id = $3
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

  static async remove(id: number, school_id: number): Promise<number> {
    const values = [id, school_id];
    const query = {
      text: `
            DELETE FROM news
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
      throw err;
    }
  }
}