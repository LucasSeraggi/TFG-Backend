// const User = require('../models/user.model');
const User = require('../models/user.model')

exports.registerNewUser = async (req, res) => {
  try {
    const isUser = await User.find({ email: req.body.email });
    console.log(isUser);

    if (isUser.length >= 1) {
      return res
        .status(409)
        .json({ message: "E-mail já cadastrado!" });
    }

    const newUser = new User(req.body);
    const user = await newUser.save(); // salvar no banco (antes criptografar senha)
    const token = await newUser.generateAuthToken(); // gerar token de acesso (para login)
    res.status(201).json({ message: 'Usuário criado com sucesso!', user, token });
  } catch (err) {
    res.status(400).json({ err: err });
  }
};


