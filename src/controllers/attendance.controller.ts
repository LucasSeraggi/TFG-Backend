import { Request, Response } from "express";
import { Attendance } from '../models/attendance.model';
import User from "../models/user.model";
import { UserRoleEnum } from "../interface/user_role.enum";
import { Subject } from "../models/subject.model";


const register = async (req: Request, res: Response) => {
  try {

    const last = await Attendance.find({
      schoolId: Number(req.headers.schoolId),
      subjectId: req.body.subjectId,
      date: new Date(req.body.date),
    });

    if (last.length > 0) {
      return res.status(400).json({ message: 'Já existe uma chamada para esta data.' });
    }

    const attendance = new Attendance({
      schoolId: Number(req.headers.schoolId),
      subjectId: req.body.subjectId,
      totalLesson: req.body.totalLesson,
      date: new Date(req.body.date),
      students: req.body.students,
    });

    await attendance.save();

    res.status(201).json({
      id: attendance.id,
      message: `Chamada criada!`,
    });
  }
  catch (err) {
    res.status(500).json({
      success: false,
      error: err
    });
  }
};

const update = async (req: Request, res: Response) => {
  try {
    if (!req.body.id)
      return res.status(400).json({ message: 'Attendance id is required.' });

    if (req.body.schoolId && req.body.schoolId?.toString() != req.headers.schoolId?.toString())
      return res.status(401).json({ message: 'School id not match with user.' });


    const last = await Attendance.find({
      schoolId: Number(req.headers.schoolId),
      subjectId: req.body.subjectId,
      date: new Date(req.body.date),
    });

    if (last.length > 1) {
      return res.status(400).json({ message: 'Já existe outra chamada para esta data.' });
    } else if (last.length == 1 && last[0].id != req.body.id) {
      return res.status(400).json({ message: 'Já existe outra chamada para esta data.' });
    }

    const attendance = new Attendance({
      id: req.body.id,
      schoolId: Number(req.headers.schoolId),
      subjectId: req.body.subjectId,
      totalLesson: req.body.totalLesson,
      date: new Date(req.body.date),
      students: req.body.students,
    });

    await attendance.update();

    res.status(200).json({
      message: 'Chamada atualizada!',
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: err
    });
  }
}

const get = async (req: Request, res: Response) => {
  try {
    const attendance = await Attendance.get({
      id: Number(req.params.id),
      schoolId: Number(req.headers.schoolId),
    });

    if (!attendance)
      return res.status(404).json({ message: 'Chamada não encontrada.' });

    const subject = await Subject.get({
      id: Number(attendance.subjectId),
      schoolId: Number(req.headers.schoolId),
    });

    const users = await User.find({
      schoolId: Number(req.headers.schoolId),
      role: UserRoleEnum.STUDENT,
      classId: subject!.classId,
    });

    const newListStudentsAttendance = [];
    for (const student of users) {
      const userInAttendance = attendance.students.find((user) => user.userId == student.id);

      newListStudentsAttendance.push({
        userId: student.id!,
        userName: student.name,
        userRegistration: student.registration,
        isPresent: userInAttendance ? userInAttendance!.isPresent : false,
      });

    }
    attendance.students = newListStudentsAttendance;

    res.status(200).json(attendance);
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err
    });
  }
}

const getPaginated = async (req: Request, res: Response) => {
  try {
    const { data, total_count } = await Attendance.getPaginated(
      Number(req.headers.schoolId),
      Number(req.query.subjectId),
      Number(req.query.rowsPerPage),
      Number(req.query.page)
    );

    if (!data || data.length == 0) {
      return res.status(200).json({ data: data, total: total_count });
    }

    const subject = await Subject.get({
      id: Number(req.query.subjectId),
      schoolId: Number(req.headers.schoolId),
    });

    const users = await User.find({
      schoolId: Number(req.headers.schoolId),
      role: UserRoleEnum.STUDENT,
      classId: subject!.classId,
    });

    for (const attendance of data) {
      const newListStudentsAttendance = [];
      for (const student of users) {
        const userInAttendance = attendance.students.find((user) => user.userId == student.id);

        newListStudentsAttendance.push({
          userId: student.id!,
          userName: student.name,
          userRegistration: student.registration,
          isPresent: userInAttendance ? userInAttendance!.isPresent : false,
        });

      }
      attendance.students = newListStudentsAttendance;
    }

    return res.status(200).json({ data: data, total: total_count });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err
    })
  }
};

const find = async (req: Request, res: Response) => {
  try {
    const attendance = await Attendance.find({
      schoolId: Number(req.headers.schoolId),
      subjectId: req.query.subjectId ? Number(req.query.subjectId) : undefined,
      date: req.query.date ? new Date(req.query.date!.toString()) : undefined,
    });
    if (attendance) return res.status(200).json(attendance);

    res.status(404).json({ message: 'Chamada não encontrada.' });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err
    })
  }
}

const remove = async (req: Request, res: Response) => {
  try {
    const rowsRemoved = await Attendance.remove(Number(req.params.id), Number(req.headers.schoolId));
    if (rowsRemoved == 0)
      return res.status(404).json({ message: 'Chamada não encontrada.' });

    res.status(200).json({ message: 'Chamada removida!' });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err
    });
  }
}


const AttendanceController = {
  register,
  update,
  get,
  getPaginated,
  find,
  remove,
}

export = AttendanceController;


