import { Request, Response } from "express";
import { Subject } from "../models/subject.model";



const register = async (req: Request, res: Response) => {
  try {

    if (req.body.schoolId && req.body.schoolId?.toString() != req.headers.schoolId?.toString())
      return res.status(401).json({ message: 'School id not match with user.' });


    const subject = new Subject({
      schoolId: Number(req.headers.schoolId),
      teacherId: req.body.teacherId,
      classId: req.body.classeId,
      name: req.body.name,
    });

    await subject.save();

    res.status(201).json({
      success: true,
      message: `Subject '${subject.name}' created with successfully.`,
      id: subject.id,
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
      return res.status(400).json({ message: 'Subject id is required.' });

    if (req.body.schoolId && req.body.schoolId?.toString() != req.headers.schoolId?.toString())
      return res.status(401).json({ message: 'School id not match with user.' });


    const subject = new Subject({
      id: req.body.id,
      schoolId: Number(req.headers.schoolId),
      teacherId: req.body.teacherId,
      classId: req.body.classeId,
      name: req.body.name,
      color: req.body.color,
    });

    const rowUpdated = await subject.update();

    if (rowUpdated == 0) {
      return res.status(404).json({
        message: 'Subject not found.'
      });
    }
    return res.status(200).json({
      message: 'Subject updated with successfully.'
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
    const subject = await Subject.get({
      id: Number(req.params.id),
      schoolId: Number(req.headers.schoolId)
    });

    if (subject) return res.status(200).json(subject);
    res.status(404).json({
      message: 'Subject not found.'
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
    const { data, total_count } = await Subject.getPaginated(
      Number(req.headers.schoolId),
      String(req.params.search || ''),
      Number(req.params.rowsPerPage),
      Number(req.params.page)
    );
    return res.status(200).json({ data: data, total: total_count });

  } catch (err) {
    res.status(500).json({
      data: [],
      message: err
    })
  }
};

const find = async (req: Request, res: Response) => {
  try {
    const subject = await Subject.find({
      schoolId: Number(req.headers.schoolId),
      classId: req.query.class_id ? Number(req.query.class_id) : undefined,
      teacherId: req.query.teacher_id ? Number(req.query.teacher_id) : undefined,
      name: req.query.name ? String(req.query.name) : undefined,
    });
    if (subject) return res.status(200).json(subject);
    res.status(404).json({
      message: 'Subject not found.'
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
    const rowRemoved = await Subject.remove(
      Number(req.params.id),
      Number(req.headers.schoolId)
    );

    if (rowRemoved == 0) {
      return res.status(404).json({
        message: 'Subject not found.'
      });
    }
    return res.status(200).json({
      message: 'Subject removed with successfully.'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err
    })
  }
};

const SubjectController = {
  register,
  getPaginated,
  get,
  find,
  remove,
  update,
}

export = SubjectController;
