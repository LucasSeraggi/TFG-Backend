import express from 'express';
import classController from '../controllers/class.controller';
import { verifyToken } from '../middlewares/auth';

const router = express.Router();

//Registrar nova classe
router.post('/api/class/register', [verifyToken], classController.registerNewClass);

//Dados de todas as classes
router.get('/api/classes', [verifyToken], classController.listClasses); //add auth

//Dados da classe
router.get('/api/classData', [verifyToken], classController.classProfile);

//Excluir class
router.delete('/api/class/delete', [verifyToken], classController.classDelete);

export = router;