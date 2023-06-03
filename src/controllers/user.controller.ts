import { UserRoleEnum } from '../interface/user_role.enum';
import User from '../models/user.model';
import { Request, Response } from "express";

const register = async (req: Request, res: Response) => {
  try {

    if (req.body.schoolId && req.body.schoolId?.toString() != req.headers.schoolId?.toString())
      return res.status(401).send({ message: 'School id not match with user.' });


    const newUser = new User({
      schoolId: Number(req.headers.schoolId),

      classId: req.body.class_id,
      name: req.body.name,
      registration: req.body.registration,
      birthDate: req.body.birth_date,
      role: req.body.role,
      phone: req.body.phone,
      email: req.body.email,
      cpf: req.body.cpf,
      rg: req.body.rg,
      profile_picture: req.body.profile_picture,
      address: req.body.address,
    }, req.body.password,
    );

    await newUser.save();

    res.status(201).send({
      id: newUser.id,
      token: newUser.toTokenJwt,
      message: `Usuário ${newUser.name} criado com matricula ${newUser.registration}`,
    });
  } catch (err) {
    res.status(400).send({
      message: err
    })
  }
};

const login = async (req: Request, res: Response) => {
  try {
    if (!req.body.email || !req.body.password) {
      return res
        .status(400)
        .json({ message: "User email and password are required" });
    }

    const users = await User.find({ email: req.body.email }, true);

    if (users.length == 0) {
      return res.status(401).json({ message: "Email not registered" });
    } else if (users.length > 1) {
      return res.status(401).json({ message: "Email duplicated" });
    }

    const user = users[0];
    const isValid = user.validatePass(req.body.password);

    if (!isValid) {
      return res.status(401)
        .json({ message: "Unauthorized" });
    } else {
      return res.json({
        ...user.toTokenInfo,
        token: user.toTokenJwt,
      });
    }
  }
  catch (error: any) {
    console.error(error);
    return res.status(400).json({
      message: error.message
    });
  }
}

const find = async (req: Request, res: Response) => {
  try {
    const user = await User.find({
      schoolId: Number(req.headers.schoolId),
      classId: req.query.class_id ? Number(req.query.class_id) : undefined,
      name: req.query.name ? String(req.query.name) : undefined,
      registration: req.query.registration ? String(req.query.registration) : undefined,
      role: req.query.role ? String(req.query.role) as UserRoleEnum : undefined,
      phone: req.query.phone ? String(req.query.phone) : undefined,
      email: req.query.email ? String(req.query.email) : undefined,
      cpf: req.query.cpf ? String(req.query.cpf) : undefined,
      rg: req.query.rg ? String(req.query.rg) : undefined,
    });

    return res.status(200).send(user.map(u => u.toResume(req.headers.role as UserRoleEnum)));
  } catch (err) {
    res.status(400).send({
      message: err
    })
  }
};

const get = async (req: Request, res: Response) => {
  try {
    const user = await User.get(
      Number(req.params.id),
      Number(req.headers.schoolId)
    );

    const role = (Number(req.params.id) == user?.id) ? UserRoleEnum.ADMIN : req.headers.role;
    if (user) return res.status(200).send(user.toResume(role as UserRoleEnum));

    res.status(404).send({
      message: 'User not found.'
    });
  } catch (err) {
    res.status(400).send({
      message: err
    })
  }
};

const getPaginated = async (req: Request, res: Response) => {
  try {
    const  { data, total_count } = await User.getPaginated(
      Number(req.headers.schoolId),
      String(req.params.search || ''),
      Number(req.params.rowsPerPage),
      Number(req.params.page)
    );
    return res.status(200).json({ data: data.map(u => u.toResume(req.headers.role as UserRoleEnum)), total: total_count });

  } catch (err) {
    res.status(400).send({
      data: [],
      message: err
    })
  }
};

const remove = async (req: Request, res: Response) => {
  try {
    const rowRemoved = await User.remove(
      Number(req.params.id),
      Number(req.headers.schoolId)
    );

    if (rowRemoved == 0) {
      return res.status(404).send({
        message: 'User not found.'
      });
    }
    return res.status(200).send({
      message: 'User removed with successfully.'
    });
  } catch (err) {
    res.status(400).send({
      message: err
    })
  }
};


const update = async (req: Request, res: Response) => {
  try {

    if (!req.body.id)
      return res.status(400).send({ message: 'User id is required.' });

    if (req.body.schoolId && req.body.schoolId?.toString() != req.headers.schoolId?.toString())
      return res.status(401).send({ message: 'School id not match with user.' });

    if (req.headers.role != UserRoleEnum.ADMIN && req.headers.userId != req.body.id)
      return res.status(403).send({ message: 'User not allowed.' });


    const userUpdated = new User({
      id: Number(req.body.id),
      schoolId: Number(req.headers.schoolId),

      classId: req.body.class_id,
      name: req.body.name,
      registration: req.body.registration,
      birthDate: req.body.birth_date,
      role: req.body.role,
      phone: req.body.phone,
      email: req.body.email,
      cpf: req.body.cpf,
      rg: req.body.rg,
      profile_picture: req.body.profile_picture,
      address: req.body.address,
    });

    const rowsUpdate = await userUpdated.update();
    if (rowsUpdate == 0) {
      return res.status(404).send({
        message: 'User not found.'
      });
    }

    res.status(200).send({
      message: 'User updated with successfully.'
    });
  } catch (err) {
    res.status(400).send({
      message: err
    });
  }
};

const isNewUser = async (req: Request, res: Response) => {
  try {
    const userProfile = await User.find({ email: req.query.email as string });
    res.status(200).send({
      message: (userProfile.length === 0) ? (!true) : (!false),
    });
  } catch (err) {
    res.status(400).send({
      message: err,
    });
  }
}

const me = async (req: Request, res: Response) => {
  try {

    const userProfile = await User.get(
      Number(req.headers.userId),
      Number(req.headers.schoolId)
    );
    res.status(200).send(userProfile?.toResume(UserRoleEnum.ADMIN));
  } catch (err) {
    res.status(400).send({
      message: err,
    });
  }
}

const UserController = {
  register,
  login,
  find,
  get,
  getPaginated,
  update,
  remove,
  isNewUser,
  me,
};

export = UserController;
