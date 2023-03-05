import express from 'express';
import userController from '../controllers/user.controller';
import { verifyToken } from '../middlewares/auth';

const router = express.Router();

//Registrar novo usuário
router.post('/user/register', userController.registerNewUser);

//Login de usuário
router.post('/login', userController.loginUser);

//Dados de todos os usuários
router.get('/users', [verifyToken], userController.listUsers); //add auth

//Dados do usuário
router.get('/userData', [verifyToken], userController.userProfile);

//Excluir usuário
router.delete('/user/delete', [verifyToken], userController.userDelete);

export = router;
