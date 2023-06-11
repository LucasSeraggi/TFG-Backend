import School from '../models/school.model';
import User from '../models/user.model';
import { Request, Response } from "express";
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import ResetPassword from '../services/reset_password/reset_password';
import sgMail from '@sendgrid/mail';

const SALT_BCRYPT = Number(process.env.SALT_BCRYPT) || 10;

const existsEmail = async (email: string, isSchool: boolean) => {
  let user;
  if (isSchool) {
    user = await School.find({
      email: email,
    });
  } else {
    user = await User.find({
      email: email,
    });
  }
  return (user.length !== 0) ? (true) : (false)
};

const preResetPassword = async (req: Request, res: Response) => {
  try {
    if (await existsEmail(req.body.email, req.body.isSchool)) {
      const resetPassword = new ResetPassword();
      const token = crypto.randomBytes(20).toString('hex');
      resetPassword.insertTokenReset(token, req.body.email, req.body.isSchool);

      sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');
      const resetLink = process.env.REDEF_LINK || 'http://localhost:8000/#/reset-password/' + token;
      const email = {
        to: req.body.email,
        from: 'blackboard.tfg@gmail.com',
        subject: 'Soliticitação de Redefinição de Senha',
        html: `<strong>
                Acesse o link para redefinir sua senha: ${resetLink}
              </strong>`,
      };
      sgMail.send(email);

      res.status(200).json({
        error: false,
        message: 'E-mail enviado com sucesso',
      });
    } else {
      res.status(200).json({
        error: true,
        message: 'E-mail não encontrado na base de dados'
      })
    }

  } catch (err) {
    res.status(500).json({
      message: err
    });
  }
};

const resetPassword = async (req: Request, res: Response) => {
  try {
    const resetPassword = new ResetPassword();
    const newPassword = await bcrypt.hash(req.body.newPassword, SALT_BCRYPT);
    const resultInfoByToken = await resetPassword.getInfoByToken(req.body.resetToken);
    if(resultInfoByToken === null) {
      res.status(200).json({
        error: true,
        message: 'Token expirado ou inexistente. Por favor, solicite uma nova troca de senha.',
      });
      return ;
    }
    const isTokenExpired = await resetPassword.isTokenExpired(new Date(resultInfoByToken.resetTokenCreatedAt), 5);

    if (isTokenExpired) {
      res.status(200).json({
        error: true,
        message: 'Token expirado. Por favor, solicite uma nova troca de senha.',
      });
    } else {
      const result = await resetPassword.changePassword(resultInfoByToken.email, resultInfoByToken.isSchool, newPassword,);

      if (result !== 0) {
        res.status(200).json({
          error: false,
          message: 'Senha alterada com sucesso',
        });
      } else {
        res.status(200).json({
          error: true,
          message: 'Ocorreu um erro! Tente mais tarde.',
        });
      }
    }

  } catch (err) {
    res.status(500).json({
      message: err
    });
  }
}

const ResetPassowordController = {
  existsEmail,
  preResetPassword,
  resetPassword,
};

export = ResetPassowordController;