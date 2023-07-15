import db from '../config/databaseConnection.config';
import { AttendanceType, AttendanceTypeEmpty, StudentsAttendanceType } from '../interface/attendance.interface';
import { SubjectTypeEmpty } from '../interface/subject.interface';


export class Attendance implements AttendanceType {
  schoolId: number;
  subjectId: number;
  date: Date;
  totalLesson: number;
  students: StudentsAttendanceType[];
  id?: number | undefined;
  createdAt?: Date | undefined;
  updatedAt?: Date | undefined;

  constructor({ schoolId, subjectId, date, totalLesson, students, id, createdAt, updatedAt }: AttendanceType) {

    if (students && students.length > 0) {
      const listUsersId = students.map((student: StudentsAttendanceType) => {
        return student.userId;
      });

      if (listUsersId.length != new Set(listUsersId).size)
        throw 'There are duplicate students in the attendance list';
    }

    this.schoolId = schoolId;
    this.subjectId = subjectId;
    this.date = date;
    this.totalLesson = totalLesson;
    this.students = students || [];
    this.id = id;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static createByDb(rowDb: any): Attendance {

    let listUsers;

    if (!rowDb.students || rowDb.students == '{}') {
      listUsers = [];
    } else {
      listUsers = rowDb.students.substring(3, rowDb.students.length - 3).split(')","(').map((time: string) => {
        const studentsAttendance = time.split(',');
        return {
          userId: Number(studentsAttendance[0]),
          isPresent: studentsAttendance[1] == 't' ? true : studentsAttendance[1] == 'f' ? false : null,
        };
      });
    }

    return new Attendance({
      schoolId: rowDb.school_id,
      subjectId: rowDb.subject_id,
      date: rowDb.date,
      totalLesson: rowDb.total_lesson,
      students: listUsers,
      id: rowDb.id,
      createdAt: rowDb.created_at,
      updatedAt: rowDb.updated_at,
    });
  }

  async save(): Promise<string> {
    this.date.setHours(0, 0, 0, 0);

    const values = [
      this.schoolId,
      this.subjectId,
      this.date,
      this.totalLesson
    ];
    const query = {
      text: `
              INSERT INTO attendances (
                  school_id, subject_id, date, total_lesson, students
              )
              VALUES ($1, $2, $3, $4, ${this.saveListUserAttendance(this.students)})
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

  static async get({ id, schoolId }: SubjectTypeEmpty): Promise<Attendance | null> {
    const values = [id, schoolId];
    const query = {
      text: `
              SELECT * FROM attendances
              WHERE
                id = $1 AND
                school_id = $2
          `,
      values,
    }

    try {
      const row = await db.dbConn(query);

      if (row.rows.length == 1) {
        return Attendance.createByDb(row.rows[0]);
      }
      return null;
    } catch (err: any) {
      console.error(err);
      throw err.detail;
    }
  }

  static async getPaginated(school_id: number, subject_id: number, rowsPerPage: number, page: number): Promise<{
    data: Attendance[],
    total_count: number,
  }> {

    const values = [school_id, rowsPerPage, rowsPerPage * (page - 1), subject_id];
    const query = {
      text: `SELECT *,
                (SELECT COUNT(*) FROM attendances
                  WHERE
                    school_id = $1 AND subject_id = $4
                ) AS total_count
                FROM attendances
                WHERE
                  school_id = $1 AND subject_id = $4
              LIMIT $2
              OFFSET $3
          `,
      values,
    }

    try {
      const rows = await db.dbConn(query);

      if (!rows || rows.rows.length == 0) return { data: [], total_count: 0 };

      const attendances: Attendance[] = [];
      for (const iterator of rows.rows) {
        attendances.push(Attendance.createByDb(iterator));
      }
      const totalCount = Number(rows.rows[0].total_count);

      return { data: attendances, total_count: totalCount };
    } catch (err: any) {
      console.error(err);
      throw err.detail;
    }
  }

  static async find({ subjectId, schoolId, date }: AttendanceTypeEmpty): Promise<Attendance[]> {
    date?.setHours(0, 0, 0, 0);

    const query = {
      text: `
              SELECT * FROM attendances
              WHERE
                ${subjectId ? `subject_id = ${subjectId} AND` : ''}
                ${date ? `date = '${date.toISOString()}' AND` : ''}
                school_id = ${schoolId}
          `,
    }

    try {
      const rows = await db.dbConn(query);
      if (!rows || rows.rows.length == 0) return [];

      const attendances: Attendance[] = [];
      for (const iterator of rows.rows) {
        attendances.push(Attendance.createByDb(iterator));
      }

      return attendances;
    } catch (err: any) {
      console.error(err);
      throw err.detail;
    }
  }

  static async remove(id: number, school_id: number): Promise<number> {
    const values = [id, school_id];
    const query = {
      text: ` 
              DELETE FROM attendances
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
    this.date.setHours(0, 0, 0, 0);

    const values = [
      this.schoolId,
      this.date,
      this.totalLesson,
      this.id,
    ];
    const query = {
      text: `
              UPDATE attendances
                SET
                    date = $2,
                    total_lesson = $3,
                    students = ${this.saveListUserAttendance(this.students)},
                    updated_at = NOW()
              WHERE id = $4 AND school_id = $1
          `,
      values,
    };

    try {
      const resp = await db.dbConn(query);
      console.log('oi', resp);
    } catch (err: any) {
      console.error(err);
      throw err.detail;
    }
  }

  private saveListUserAttendance(list: StudentsAttendanceType[] | undefined | null) {
    if (!list || list.length == 0) return 'ARRAY[]::students_attendance[]';

    return 'ARRAY[' +
      list.map((user: StudentsAttendanceType) => {
        return `ROW('${user.userId}', '${user.isPresent}')`;
      }).join(',') + ']::students_attendance[]';
  }

}