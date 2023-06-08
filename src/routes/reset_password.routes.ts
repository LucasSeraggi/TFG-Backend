import express from 'express';
import resetPasswordController from '../controllers/reset_password.controller';

const router = express.Router();

//Gera o token e envia email de redefinicao
router.post('/api/pre-reset-password', resetPasswordController.preResetPassword);

//Realiza a alteracao da senha
router.post('/api/reset-password', resetPasswordController.resetPassword);

export = router;