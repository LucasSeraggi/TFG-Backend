import Class from '../models/class.model';
import { Request, Response } from "express";


const registerNewClass = async (req: Request, res: Response) => {
  try {
    const classCreate = await Class.save(req);
    res.status(201).send({
      success: true,
      message: `Class ${classCreate.rows[0].name} created successfully.}`,
      id: classCreate.rows[0].id,
    });
  } catch (err) {
    res.status(400).send({
      success: false,
      message: ({ err: err })
    })
  }
};

const listClasses = async (req: Request, res: Response) => {
  try {
    const classes = await Class.list();
    res.status(200).send({
      success: true,
      message: classes.rows
    });
  } catch (err) {
    res.status(400).send({
      success: false,
      message: ({ err: err })
    });
  }
}

const classProfile = async (req: Request, res: Response) => {
  try {
    const classProfile = await Class.find(req);
    res.status(200).send({
      success: true,
      message: classProfile.rows
    });
  } catch (err) {
    res.status(400).send({
      success: false,
      message: ({ err: err })
    });
  }
}

const classDelete = async (req: Request, res: Response) => {
  try {
    const deleteClass = await Class.delete(req);
    res.status(200).send({
      success: true,
      message: `Class ${deleteClass.rows[0].name} deleted successfully.`
    });
  } catch (err) {
    res.status(400).send({
      success: false,
      message: ({ err: err })
    });
  }
}

const ClassController = { registerNewClass, listClasses, classProfile, classDelete }

export = ClassController;
