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
}