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

const loginUser = async (req: Request, res: Response) => {
  try {
    const user = req.body;

    if (!user.email || !user.password) {
      return res
        .status(400)
        .json({ error: "User email and password are required" });
    }

    const userDb = await User.findOld(user.email);

    if (userDb.rowCount == 0) {
      return res.status(401)
        .json({ error: "Email not registered" });
    }

    const isValid = await User.validatePass(user.password, userDb.rows[0].password);

    if (!isValid) {
      return res.status(401)
        .json({ error: "Unauthorized" });
    } else {
      const userInfo = {
        userId: userDb.rows[0].id,
        schoolId: userDb.rows[0].school_id,
        email: userDb.rows[0].email,
      };
      const token = await User.generateAuthToken(userInfo);
      return res.json({
        ...userInfo,
        token,
      });
    }
  }
  catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}

const listUsers = async (_: Request, res: Response) => {
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
    const userProfile = await User.findOld(req.query.email);
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
    if(deleteUser.rowCount != 0){
      res.status(200).send({
        success: true,
        message: `User ${deleteUser.rows[0].name} deleted successfully.`
      });
    } else {
      res.status(404).send({
        success: false,
        message: `User not found`
      });
    }
  } catch (err) {
    res.status(400).send({
      success: false,
      message: ({ err: err })
    });
  }
}

const UserController = { registerNewUser, listUsers, userProfile, userDelete, loginUser }

export = UserController;
