import School from '../models/school.model';
import { Request, Response } from "express";

const registerNewSchool = async (req: Request, res: Response) => {
  try {
    const schoolCreate = await School.save(req);
    const tokenJwt = School.generatorJwtToken(schoolCreate.rows[0].id, req.body.email);

    res.status(201).send({
      success: true,
      id: schoolCreate.rows[0].id,
      message: `School ${schoolCreate.rows[0].name} created successfully.`,
      email: req.body.email,
      token: tokenJwt,
    });
  } catch (err) {
    res.status(400).send({
      success: false,
      message: ({ err: err })
    })
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const school = req.body;

    if (!school.email || !school.password) {
      return res
        .status(400)
        .json({ error: "School email and password are required" });
    }

    const schoolDb = await School.find(school.email);
    if (schoolDb.rowCount == 0) {
      return res.status(401)
        .json({ error: "Email not registered" });
    }

    const isValid = await School.validatePass(school.password, schoolDb.rows[0].password);

    if (!isValid) {
      return res.status(401)
        .json({ error: "Unauthorized" });
    } else {
      const token = School.generatorJwtToken(schoolDb.rows[0].id, req.body.email);
      return res.status(200).json({
        schoolId: schoolDb.rows[0].id,
        email: req.body.email,
        token
      });

    }

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

// const schoolProfile = async (req: Request, res: Response) => {
//   try {
//     const schoolProfile = await School.find(req);
//     res.status(200).send({
//       success: true,
//       message: schoolProfile.rows
//     });
//   } catch (err) {
//     res.status(400).send({
//       success: false,
//       message: ({ err: err })
//     });
//   }
// }

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

const SchoolController = {
  registerNewSchool,
  login,
  listSchools,
  // schoolProfile,
  schoolDelete,
}

export = SchoolController;
