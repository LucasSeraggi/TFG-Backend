// const User = require('../models/user.model');
// const User = require('../models/user.model')
import User from '../models/user.model';
import { Request, Response } from "express";


const registerNewUser = async (req: Request, res: Response) => {
  try {
    const finded = await User.findEmail(req.body.email);
    console.log(finded);

    if (finded) {
      return res
        .status(409)
        .json({ message: "E-mail já cadastrado!" });
    }

    const user = await User.save(); // salvar no banco (antes criptografar senha)
    const token = await User.generateAuthToken(); // gerar token de acesso (para login)
    res.status(201).json({ message: 'Usuário criado com sucesso!', user, token });
  } catch (err) {
    res.status(400).json({ err: err });
  }
};

const UserController = { registerNewUser }

export = UserController;


