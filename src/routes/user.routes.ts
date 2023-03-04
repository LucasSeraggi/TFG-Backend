import express from 'express';
import auth from '../middlewares/auth';
const router = express.Router();

import userController from '../controllers/user.controller';

//Registrar novo usuário
router.post('/user/register', userController.registerNewUser);

/*
//Login de usuário
router.post('/login', userController.loginUser);
*/

//Dados de todos os usuários
router.get('/users', userController.listUsers); //add auth

//Dados do usuário
router.get('/userData', userController.userProfile);

//Excluir usuário
router.delete('/user/delete', userController.userDelete);

export = router;
