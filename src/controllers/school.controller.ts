import School from '../models/school.model';
import auth from '../middlewares/auth';
import { Request, Response } from "express";

const registerNewSchool = async (req: Request, res: Response) => {
  try {
    const isValid = await auth.verifyToken(req, res, null);
    if (isValid) {
      const schoolCreate = await School.save(req);
      res.status(201).send({
        success: true,
        message: `School ${schoolCreate.rows[0].name} created successfully.}`,
        id: schoolCreate.rows[0].id,
      });
    }
  } catch (err) {
    res.status(400).send({
      success: false,
      message: ({ err: err })
    })
  }
};

const listSchools = async (req: Request, res: Response) => {
  try {
    const isValid = await auth.verifyToken(req, res, null);
    if (isValid) {
      const schools = await School.list();
      res.status(200).send({
        success: true,
        message: schools.rows
      });
    }
  } catch (err) {
    res.status(400).send({
      success: false,
      message: ({ err: err })
    });
  }
}

const schoolProfile = async (req: Request, res: Response) => {
  try {
    const isValid = await auth.verifyToken(req, res, null);
    if (isValid) {
      const schoolProfile = await School.find(req);
      res.status(200).send({
        success: true,
        message: schoolProfile.rows
      });
    }
  } catch (err) {
    res.status(400).send({
      success: false,
      message: ({ err: err })
    });
  }
}

const schoolDelete = async (req: Request, res: Response) => {
  try {
    const isValid = await auth.verifyToken(req, res, null);
    if (isValid) {
      const deleteSchool = await School.delete(req);
      res.status(200).send({
        success: true,
        message: `School ${deleteSchool.rows[0].name} deleted successfully.`
      });
    }
  } catch (err) {
    res.status(400).send({
      success: false,
      message: ({ err: err })
    });
  }
}

const SchoolController = { registerNewSchool, listSchools, schoolProfile, schoolDelete }

export = SchoolController;
