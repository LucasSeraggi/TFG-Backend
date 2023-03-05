import User from '../models/user.model';
import { Request, Response } from "express";


const registerNewUser = async (req: Request, res: Response) => {
  try {
    const finded = await User.findEmail(req.body.email);
    if (finded) {
      return res
        .status(409)
        .json({ message: "E-mail já cadastrado!" });
    }

    const userCreate = await User.save(req);
    const userToken = await User.generateAuthToken({
      userId: userCreate.rows[0].id,
      schoolId: userCreate.rows[0].school_id,
      email: userCreate.rows[0].email,
      dateExp: Date.now() + (3600000 * 3), // 3 horas
    });

    res.status(201).send({
      success: true,
      message: `User ${userCreate.rows[0].name} created successfully.`,
      id: userCreate.rows[0].id,
      registration: userCreate.rows[0].registration,
      class_id: userCreate.rows[0].class_id,
      email: userCreate.rows[0].email,
      token: userToken
    });
  } catch (err) {
    res.status(401).send({
      success: false,
      message: ({ err: err })
    })
  }
};

const listUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.list();
    res.status(200).send({
      success: true,
      message: users.rows
    });
  } catch (err) {
    res.status(400).send({
      success: false,
      message: ({ err: err })
    });
  }
}

const userProfile = async (req: Request, res: Response) => {
  try {
    const userProfile = await User.find(req);
    res.status(200).send({
      success: true,
      message: userProfile.rows
    });
  } catch (err) {
    res.status(400).send({
      success: false,
      message: ({ err: err })
    });
  }
}

const userDelete = async (req: Request, res: Response) => {
  try {
    const deleteUser = await User.delete(req);
    res.status(200).send({
      success: true,
      message: `User ${deleteUser.rows[0].name} deleted successfully.`
    });
  } catch (err) {
    res.status(400).send({
      success: false,
      message: ({ err: err })
    });
  }
}

const UserController = { registerNewUser, listUsers, userProfile, userDelete }

export = UserController;
