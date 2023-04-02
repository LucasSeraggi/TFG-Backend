import express from 'express';
import userController from '../controllers/user.controller';
import { verifyToken } from '../middlewares/auth';

const router = express.Router();

//Registrar novo usuário
router.post('/api/user/register', userController.registerNewUser);

//Login de usuário
router.post('/api/user/login', userController.loginUser);

//Dados de todos os usuários
router.get('/api/users', [verifyToken], userController.listUsers); //add auth

//Dados do usuário
router.get('/api/userData', [verifyToken], userController.userProfile);

//Excluir usuário
router.delete('/api/user/delete', [verifyToken], userController.userDelete);

export = router;
