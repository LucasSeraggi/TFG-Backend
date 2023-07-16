import { Request, Response } from "express";
import { Grade } from "../models/grade.model";

const register = async (req: Request, res: Response) => {
  try {
    const newGrade = new Grade({
      name: req.body.name,
      description: req.body.description,
      subjectId: req.body.subjectId,
      activityId: req.body.activityId,
      studentId: req.body.studentId,
      period: req.body.period,
      note: req.body.note,
      file: req.body.file,
    });

    await newGrade.save();

    res.status(201).json({
      success: true,
      message: `Grade '${newGrade.name}' created with successfully.`,
      id: newGrade.id,
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
    const grade = await Grade.get({
      id: Number(req.params.id),
    });

    if (grade) {
      return res.status(200).json(grade);
    }

    res.status(404).json({
      message: 'Grade not found.'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err
    });
  }
};

const getPaginated = async (req: Request, res: Response) => {
  try {
    const { data, total_count } = await Grade.getPaginated({
      search: String(req.query.search || ''),
      rowsPerPage: Number(req.query.rowsPerPage || 10),
      page: Number(req.query.page || 1),
      subjectId: Number(req.query.subjectId),
      studentId: Number(req.query.studentId),
    });

    if (data) {
      return res.status(200).json({
        data, total: +total_count
      });
    }

    res.status(404).json({
      message: 'Grade not found.'
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
    const grades = await Grade.find({
      subjectId: Number(req.query.subjectId),
      studentId: Number(req.query.studentId),
      name: req.query.name ? String(req.query.name) : undefined,
    });

    if (grades) return res.status(200).json(grades);
    res.status(404).json({
      message: 'Grades not found.'
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
    const rowRemoved = await Grade.remove({
      id: Number(req.params.id),
    });

    if (rowRemoved == 0) {
      return res.status(404).json({
        message: 'Grade not found.'
      });
    }
    res.status(200).json({
      message: 'Grade removed with successfully.'
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
      return res.status(500).json({ message: 'Grade id is required.' });

    const gradeUpdated = new Grade({
      id: Number(req.body.id),
      name: req.body.name,
      description: req.body.description,
      subjectId: req.body.subjectId,
      activityId: req.body.activityId,
      studentId: req.body.studentId,
      period: req.body.period,
      note: req.body.note,
      file: req.body.file,
    });

    const rowsUpdate = await gradeUpdated.update();
    if (rowsUpdate === 0) {
      return res.status(404).json({
        message: 'Grade not found.'
      });
    }

    res.status(200).json({
      message: 'Grade updated successfully.'
    });
  } catch (err) {
    res.status(500).json({
      message: err
    });
  }
};

const registerQuiz = async (req: Request, res: Response) => {
  try {
    const quiz = req.body.item;
    const response = req.body.response;
    let acertos = 0;

    if (quiz.quizzes.length !== response.quizzes.length) {
      return res.status(500).json({
        success: false,
        message: 'Quiz and response are not compatible.'
      });
    }

    for (let index = 0; index < quiz.quizzes.length; index++) {
      if (quiz.quizzes[index].indexSolution == response.quizzes[index].indexSolution) {
        acertos++;
      }
    }

    const newGrade = new Grade({
      name: quiz.title,
      description: `Você acertou ${acertos} questões de ${quiz.quizzes.length}.`,
      subjectId: req.body.subjectId,
      activityId: quiz.uuid,
      studentId: req.body.studentId,
      note: (quiz.quizzes.length / acertos * 10) > 10 ? 0 : (quiz.quizzes.length / acertos * 10),
    });

    await newGrade.save();

    res.status(201).json({
      success: true,
      id: newGrade.id,
      message: `Você acertou ${acertos} questões de ${quiz.quizzes.length}.`,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err
    })
  }
};


const GradeController = { register, get, getPaginated, find, remove, update, registerQuiz }

export = GradeController;
