import School from '../models/school.model';
import { Request, Response } from "express";

const registerNewSchool = async (req: Request, res: Response) => {
  try {
    const schoolCreate = await School.save(req);
    res.status(201).send({
      success: true,
      message: `School ${schoolCreate.rows[0].name} created successfully.}`,
      id: schoolCreate.rows[0].id,
    });
  } catch (err) {
    res.status(400).send({
      success: false,
      message: ({ err: err })
    })
  }
};

const listSchools = async (_: Request, res: Response) => {
  try {
    const schools = await School.list();
    res.status(200).send({
      success: true,
      message: schools.rows
    });
  } catch (err) {
    res.status(400).send({
      success: false,
      message: ({ err: err })
    });
  }
}

const schoolProfile = async (req: Request, res: Response) => {
  try {
    const schoolProfile = await School.find(req);
    res.status(200).send({
      success: true,
      message: schoolProfile.rows
    });
  } catch (err) {
    res.status(400).send({
      success: false,
      message: ({ err: err })
    });
  }
}

const schoolDelete = async (req: Request, res: Response) => {
  try {
    const deleteSchool = await School.delete(req);
    res.status(200).send({
      success: true,
      message: `School ${deleteSchool.rows[0].name} deleted successfully.`
    });
  } catch (err) {
    res.status(400).send({
      success: false,
      message: ({ err: err })
    });
  }
}

const SchoolController = { registerNewSchool, listSchools, schoolProfile, schoolDelete }

export = SchoolController;
