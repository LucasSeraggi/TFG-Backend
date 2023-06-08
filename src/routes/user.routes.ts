import express from 'express';
import userController from '../controllers/user.controller';
import { verifyToken } from '../middlewares/auth';

const router = express.Router();

//Registrar novo usuário
router.post('/api/user/register', [verifyToken], userController.register);

//Login de usuário
router.post('/api/user/login', userController.login);

//Dados de todos os usuários
router.get('/api/user', [verifyToken], userController.find); //add auth

//Dados de todos os usuários
router.get('/api/user/paginated', [verifyToken], userController.getPaginated); //add auth

// Retorna dados do usuário logado
router.get('/api/user/me', [verifyToken], userController.me);

//Dados de um usuário especifico
router.get('/api/user/:id', [verifyToken], userController.get);

//Excluir usuário
router.delete('/api/user/:id', [verifyToken], userController.remove);

//Verifica se usuario existe na base de dados
router.get('/api/is-new-user/', [verifyToken], userController.isNewUser);

export = router;
