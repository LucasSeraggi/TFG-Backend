import School from '../models/school.model';
import { Request, Response } from "express";
import { Storage, StorageType } from '../services/firebase/storage';
import { UserRoleEnum } from '../interface/user_role.enum';

const registerNewSchool = async (req: Request, res: Response) => {
  try {
    let url;

    if (req.body.newLogo && req.body.newLogo.data && req.body.newLogo.name) {
      const storage = new Storage();
      url = await storage.upload({
        base64: req.body.newLogo.data,
        name: req.body.newLogo.name,
        type: StorageType.logo,
      });

      req.body.logo = {
        url,
        'name': req.body.newLogo.name,
        'mimeType': req.body.newLogo.mimeType
      };
      req.body.newLogo = undefined;
      console.error(req.body);
    }


    const schoolCreate = await School.save(req);
    const tokenJwt = School.generatorJwtToken(schoolCreate.rows[0].id, req.body.email);

    res.status(201).send({
      id: schoolCreate.rows[0].id,
      message: `Escola ${schoolCreate.rows[0].name} criada com sucesso.`,
      schoolId: schoolCreate.rows[0].id,
      name: schoolCreate.rows[0].name,
      email: req.body.email,
      photoUrl: url,
      authRole: UserRoleEnum.ADMIN,
      token: tokenJwt,
    });

  } catch (err) {
    res.status(500).send({
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
        .json({ error: "Email not registered", message: 'E-mail incorreto' });
    }

    const isValid = await School.validatePass(school.password, schoolDb.rows[0].password);

    if (!isValid) {
      return res.status(401)
        .json({ error: "Unauthorized" });
    } else {
      const token = School.generatorJwtToken(schoolDb.rows[0].id, req.body.email);
      return res.status(200).json({
        schoolId: schoolDb.rows[0].id,
        name: schoolDb.rows[0].name,
        email: req.body.email,
        photoUrl: schoolDb.rows[0].logo?.url,
        authRole: UserRoleEnum.ADMIN,
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

const me = async (req: Request, res: Response) => {
  try {
    const school = await School.me(req.headers.schoolId as string);
    school.rows[0].password = undefined;
    school.rows[0].logo = school.rows[0].logo?.url;
    res.status(200).send(school.rows[0]);
  } catch (err) {
    res.status(500).send({
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
  me,
}

export = SchoolController;
