import School from '../models/school.model';
import { Request, Response } from "express";
import { Storage, StorageType } from '../services/firebase/storage';
import { UserRoleEnum } from '../interface/user_role.enum';

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

    if (req.headers.role != UserRoleEnum.ADMIN)
      return res.status(403).json({ message: 'User not allowed.' });

    const rowRemoved = await School.delete(
      Number(req.params.id)
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

// const getPaginated = async (req: Request, res: Response) => {
//   try {
//     const { data, total_count } = await School.getPaginated(
//       Number(req.headers.schoolId),
//       String(req.params.search || ''),
//       Number(req.params.rowsPerPage),
//       Number(req.params.page)
//     );
//     return res.status(200).json({ data, total: total_count });

//   } catch (err) {
//     res.status(500).json({
//       data: [],
//       message: err
//     })
//   }
// };

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


const update = async (req: Request, res: Response) => {
  try {

    if (!req.body.id)
      return res.status(400).json({ message: 'School id is required.' });

    if (req.body.schoolId && req.body.schoolId?.toString() != req.headers.schoolId?.toString())
      return res.status(401).json({ message: 'School id not match with this school.' });

    if (req.headers.role != UserRoleEnum.ADMIN)
      return res.status(403).json({ message: 'User not allowed.' });

    if (req.body.newLogo && req.body.newLogo.data && req.body.newLogo.name) {
      const storage = new Storage();
      if (req.body.logo && req.body.logo.length > 0) {
        try {
          await storage.delete(req.body.logo);
        } catch (err) {
          console.error(err);
        }
      }

      req.body.logo = await storage.upload({
        base64: req.body.newPicture.data,
        name: req.body.newPicture.name,
        type: StorageType.logo,
      });

    }

    const schoolUpdate = new School({
      id: req.body.id,
      name: req.body.name,
      cnpj: req.body.cnpj,
      cep: req.body.cep,
      logo: req.body.logo,
      phone: req.body.phone,
      email: req.body.email,
    });


    const rowsUpdate = await schoolUpdate.update();
    if (rowsUpdate == 0) {
      return res.status(404).json({
        message: 'School não encontrado.'
      });
    }

    res.status(200).json({
      message: 'School atualizado com sucesso.'
    });
  } catch (err) {
    res.status(500).json({
      message: err
    });
  }
};


const SchoolController = {
  registerNewSchool,
  login,
  listSchools,
  // getPaginated,
  // schoolProfile,
  schoolDelete,
  me,
  update,
}

export = SchoolController;
