import School from '../models/school.model';
import { Request, Response } from "express";
import { Storage, StorageType } from '../services/firebase/storage';
// import { UserRoleEnum } from '../interface/user_role.enum';

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
    
    const newSchool = new School({
      name: req.body.name,
      cnpj: req.body.cnpj,
      cep: req.body.cep,
      logo: req.body.logo,
      phone: req.body.phone,
      email: req.body.email,
    }, req.body.password,);

    await newSchool.save();

    res.status(201).send({
      id: newSchool.id,
      token: newSchool.toTokenJwt,
      message: `instituição ${newSchool.name} criado!`,
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

    const schoolDb = await School.find({ email: school.email }, true);
    if (schoolDb.length == 0) {
      return res.status(401)
        .json({ error: "Email not registered", message: 'E-mail incorreto' });
    } else if (schoolDb.length > 1) {
      return res.status(401).json({ message: "Email duplicated" });
    }

    const scl = schoolDb[0];
    const isValid = scl.validatePass(req.body.password);

    if (!isValid) {
      return res.status(401)
        .json({ error: "Unauthorized" });
    } else {
      return res.json({
        ...scl.toTokenInfo,
        token: scl.toTokenJwt,
      })
    }
  } catch (err) {
    return res.status(400).json({
      message: err
    });
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
    res.status(500).send({
      success: false,
      message: ({ err: err })
    });
  }
}

const schoolDelete = async (req: Request, res: Response) => {
  try {
    const rowRemoved = await School.delete(
      Number(req.params.id)
    );
    if (rowRemoved == 0) {
      return res.status(404).send({
        message: 'School not found.'
      });
    }
    return res.status(200).send({
      message: 'School removed successfully.'
    });
  } catch (err) {
    res.status(400).send({
      message: err
    })
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
