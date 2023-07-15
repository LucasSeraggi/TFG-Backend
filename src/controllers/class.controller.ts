import { Class } from '../models/class.model';
import { Request, Response } from "express";
import User from '../models/user.model';
import { UserRoleEnum } from '../interface/user_role.enum';
import { Subject } from "../models/subject.model";

const register = async (req: Request, res: Response) => {
  try {

    if (req.body.schoolId && req.body.schoolId?.toString() != req.headers.schoolId?.toString())
      return res.status(401).json({ message: 'School id not match with user.' });


    const newClass = new Class({
      schoolId: Number(req.headers.schoolId),
      name: req.body.name,
    });

    await newClass.save();

    if (req.body.subjects && req.body.subjects.length > 0) {
      for (let index = 0; index < req.body.subjects.length; index++) {
        try {
          const element = req.body.subjects[index];
          const obj = new Subject({
            schoolId: Number(req.headers.schoolId),
            classId: newClass.id!,
            name: element.name,
            teacherId: element.teacherId,
            color: element.color,
          });

          await obj.save();
        } catch (error) {
          console.error('Matéria não cadastrada!', error);
        }
      }
    }

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
    const [value, students, subjects] = await Promise.all([
      Class.get({
        id: Number(req.params.id),
        schoolId: Number(req.headers.schoolId)
      }),
      User.find({
        schoolId: Number(req.headers.schoolId),
        classId: Number(req.params.id),
        role: UserRoleEnum.STUDENT,
      }),
      Subject.find({
        schoolId: Number(req.headers.schoolId),
        classId: Number(req.params.id),
      })
    ]);

    if (value) {
      return res.status(200).json({
        ...value,
        subjects,
        students: students.map(student => student.toResume),
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
    const { data, total_count } = await Class.getPaginated(
      Number(req.headers.schoolId),
      String(req.query.search || ''),
      Number(req.query.rowsPerPage || 10),
      Number(req.query.page || 1)
    );

    if (data) {
      return res.status(200).json({
        data, total: +total_count
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


    const classe = new Class({
      id: req.body.id,
      schoolId: Number(req.headers.schoolId),
      name: req.body.name,
    });

    const rowUpdated = await classe.update();
    if (rowUpdated == 0) {
      return res.status(404).json({
        message: 'Class not found.'
      });
    }



    const oldListSubjects = await Subject.find({
      classId: Number(req.body.id),
      schoolId: Number(req.headers.schoolId)
    });

    //* Remover e atualiza matérias
    if (oldListSubjects && oldListSubjects.length > 0) {
      for (let i = 0; i < oldListSubjects.length; i++) {
        const old = oldListSubjects[i];
        let found = false;

        if (req.body.subjects && req.body.subjects.length > 0) {
          for (let j = 0; j < req.body.subjects.length; j++) {
            const current = req.body.subjects[j];

            if (old.id == current.id) {
              //* Atualizar matéria
              found = true;
              const obj = new Subject({
                id: current.id,
                schoolId: Number(req.headers.schoolId),
                classId: classe.id!,
                name: current.name,
                teacherId: current.teacherId,
                color: current.color,
                times: current.times,
              });

              await obj.update();
              break;
            }

          }
        }

        if (!found) {
          //* Remover matéria
          await Subject.remove(old.id!, Number(req.headers.schoolId));
        }

      }
    }

    //* Adicionar novas matérias
    if (req.body.subjects && req.body.subjects.length > 0) {
      for (let j = 0; j < req.body.subjects.length; j++) {
        const current = req.body.subjects[j];
        let found = false;

        if (oldListSubjects && oldListSubjects.length > 0) {
          for (let i = 0; i < oldListSubjects.length; i++) {
            const old = oldListSubjects[i];
            if (old.id == current.id) {
              found = true;
              break;
            }

          }
        }

        if (!found) {
          //* Adicionar nova matéria
          const obj = new Subject({
            schoolId: Number(req.headers.schoolId),
            classId: classe.id!,
            name: current.name,
            teacherId: current.teacherId,
            color: current.color,
            times: current.times,
          });

          await obj.save();
        }
      }
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
