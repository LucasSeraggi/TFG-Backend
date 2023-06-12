import { Class } from '../models/class.model';
import { Request, Response } from "express";
import User from '../models/user.model';
import { UserRoleEnum } from '../interface/user_role.enum';

const register = async (req: Request, res: Response) => {
  try {

    if (req.body.schoolId && req.body.schoolId?.toString() != req.headers.schoolId?.toString())
      return res.status(401).json({ message: 'School id not match with user.' });


    const newClass = new Class({
      schoolId: Number(req.headers.schoolId),
      name: req.body.name,
    });

    await newClass.save();

    res.status(201).json({
      success: true,
      message: `Class '${newClass.name}' created with successfully.`,
      id: newClass.id,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err
    })
  }
};

const get = async (req: Request, res: Response) => {
  try {
    const value = await Class.get({
      id: Number(req.params.id),
      schoolId: Number(req.headers.schoolId)
    });

    const students = await User.find({
      schoolId: Number(req.headers.schoolId),
      classId: Number(req.params.id),
      role: UserRoleEnum.STUDENT,
    });

    if (value) {
      return res.status(200).json({
        ...value, students: students.map(student => student.toResume)
      });
    }
    res.status(404).json({
      message: 'Class not found.'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err
    })
  }
};

const getPaginated = async (req: Request, res: Response) => {
  try {
    const  { data, total_count } = await Class.getPaginated(
      Number(req.headers.schoolId),
      String(req.params.search || ''),
      Number(req.params.rowsPerPage),
      Number(req.params.page)
    );

    const students = await User.find({
      schoolId: Number(req.headers.schoolId),
      classId: Number(req.params.id),
      role: UserRoleEnum.STUDENT,
    });

    if (data) {
      return res.status(200).json({
        ...data, total: total_count, students: students.map(student => student.toResume)
      });
    }

    res.status(404).json({
      message: 'Class not found.'
    });
  } catch (err) {
    res.status(500).json({
      data: [],
      message: err
    })
  }
};

const find = async (req: Request, res: Response) => {
  try {
    const classes = await Class.find({
      schoolId: Number(req.headers.schoolId),
      name: req.query.name ? String(req.query.name) : undefined,
    });

    if (classes) return res.status(200).json(classes);
    res.status(404).json({
      message: 'Class not found.'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err
    })
  }
};

const remove = async (req: Request, res: Response) => {
  try {
    const rowRemoved = await Class.remove({
      id: Number(req.params.id),
      schoolId: Number(req.headers.schoolId)
    });

    if (rowRemoved == 0) {
      return res.status(404).json({
        message: 'Class not found.'
      });
    }
    res.status(200).json({
      message: 'Class removed with successfully.'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err
    })
  }
};

const update = async (req: Request, res: Response) => {
  try {

    if (!req.body.id)
      return res.status(500).json({ message: 'Class id is required.' });

    if (req.body.schoolId && req.body.schoolId?.toString() != req.headers.schoolId?.toString())
      return res.status(401).json({ message: 'School id not match with user.' });


    const subject = new Class({
      id: req.body.id,
      schoolId: Number(req.headers.schoolId),
      name: req.body.name,
    });

    const rowUpdated = await subject.update();

    if (rowUpdated == 0) {
      return res.status(404).json({
        message: 'Class not found.'
      });
    }
    res.status(200).json({
      message: 'Class updated with successfully.'
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err
    })
  }
};


const ClassController = { register, get, find, remove, update, getPaginated }

export = ClassController;
