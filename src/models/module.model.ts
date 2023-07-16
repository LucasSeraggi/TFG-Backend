import db from "../config/databaseConnection.config";
import { ModuleType, ModuleTypeEmpty } from "../interface/module.interface";

export class Module implements ModuleType {
  id?: number;
  title: string;
  description: string;
  subjectId: number;
  content: string;
  ordenation: number;
  createdAt?: Date;
  updatedAt?: Date;

  constructor({
    id,
    title,
    description,
    subjectId,
    content,
    createdAt,
    updatedAt,
    ordenation,
  }: ModuleType) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.subjectId = subjectId;
    this.content = content;
    this.ordenation = ordenation;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static async find(subjectId: number): Promise<Module[]> {
    try {
      const values = [subjectId];
      const query = {
        text: `
          SELECT *
          FROM modules 
          WHERE subject_id = $1
          ORDER BY ordenation ASC
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

  async save(): Promise<number> {
    const values = [
      this.title,
      this.description,
      this.subjectId,
      this.content,
      this.ordenation,
    ];
    const query = {
      text: `
        INSERT INTO modules (
          title, description, subject_id, content, ordenation
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id
    `,
      values,
    };
    try {
      const id = (await db.dbConn(query)).rows[0]?.id;
      return id;

    } catch (err: any) {
      console.error(err);
      throw err.detail;
    }
  }

  static async remove(id: number): Promise<number> {
    const values = [id];
    const query = {
      text: `
              DELETE FROM modules
              WHERE 
                id = $1
          `,
      values,
    };

    try {
      const response = await db.dbConn(query);
      return response.rowCount;
    } catch (err: any) {
      console.error(err);
      throw err.detail;
    }
  }

  static async update({
    id,
    title,
    description,
    content,
    ordenation,
  }: ModuleTypeEmpty): Promise<number> {
    const values = [id];
    const query = {
      text: `
              UPDATE modules
                SET
                  ${title ? `title = '${title}',` : ""}
                  ${description ? `description = '${description}',` : ""}
                  ${content ? `content = '${content}',` : ""}
                  ${ordenation ? `ordenation = ${ordenation},` : ""}
                  updated_at = NOW()
                WHERE 
                  id = $1
          `,
      values,
    };

    try {
      const response = await db.dbConn(query);
      return response.rowCount;
    } catch (err: any) {
      console.error(err);
      throw err.detail ? err.detail : err.toString().replaceAll('"', "'");
    }
  }
}
