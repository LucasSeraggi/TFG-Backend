import School from '../models/school.model';
import { Request, Response } from "express";
import { Storage, StorageType } from '../services/firebase/storage';

const registerNewSchool = async (req: Request, res: Response) => {
  try {
    if (req.body.newLogo && req.body.newLogo.data && req.body.newLogo.name) {
      const storage = new Storage();
      req.body.logo = await storage.upload({
        base64: req.body.newLogo.data,
        name: req.body.newLogo.name,
        type: StorageType.logo,
      });
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

    res.status(201).json({
      id: newSchool.id,
      token: newSchool.toTokenJwt,
      message: `Instituição ${newSchool.name} criado!`,
      ...newSchool.toTokenInfo,
      schoolName: newSchool.name,
      schoolLogo: newSchool.logo,
    });

  } catch (err) {
    res.status(500).json({
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
        .status(500)
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
        schoolName: scl.name,
        schoolLogo: scl.logo,
      })
    }
  } catch (err) {
    return res.status(500).json({
      message: err
    });
  }
};

const listSchools = async (_: Request, res: Response) => {
  try {
    const schools = await School.list();
    res.status(200).json({
      success: true,
      message: schools.rows
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: ({ err: err })
    });
  }
}

const schoolDelete = async (req: Request, res: Response) => {
  try {
    const rowRemoved = await School.delete(
      Number(req.query.id)
    );
    if (rowRemoved == 0) {
      return res.status(404).json({
        message: 'School not found.'
      });
    }
    return res.status(200).json({
      message: 'School removed successfully.'
    });
  } catch (err) {
    res.status(500).json({
      message: err
    })
  }
}

const getPaginated = async (req: Request, res: Response) => {
  try {
    const { data, total_count } = await School.getPaginated(
      Number(req.headers.schoolId),
      String(req.params.search || ''),
      Number(req.params.rowsPerPage),
      Number(req.params.page)
    );
    return res.status(200).json({ data, total: total_count });

  } catch (err) {
    res.status(500).json({
      data: [],
      message: err
    })
  }
};

const me = async (req: Request, res: Response) => {
  try {
    const school = await School.me(req.headers.schoolId as string);
    school.rows[0].password = undefined;
    school.rows[0].logo = school.rows[0].logo;
    res.status(200).json(school.rows[0]);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: ({ err: err })
    });
  }
}


const SchoolController = {
  registerNewSchool,
  login,
  listSchools,
  getPaginated,
  // schoolProfile,
  schoolDelete,
  me,
}

export = SchoolController;
