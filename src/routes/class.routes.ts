import express from 'express';
import classController from '../controllers/class.controller';
import { verifyToken } from '../middlewares/auth';

const router = express.Router();

//Registrar nova classe
router.post('/class/register', [verifyToken], classController.registerNewClass);

//Dados de todas as classes
router.get('/classes', classController.listClasses); //add auth

//Dados da classe
router.get('/classData', [verifyToken], classController.classProfile);

//Excluir class
router.delete('/class/delete', [verifyToken], classController.classDelete);

export = router;