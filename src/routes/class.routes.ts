import express from 'express';
const router = express.Router();

import classController from '../controllers/class.controller';

//Registrar nova classe
router.post('/class/register', classController.registerNewClass);

//Dados de todas as classes
router.get('/classes', classController.listClasses); //add auth

//Dados da classe
router.get('/classData', classController.classProfile);

//Excluir class
router.delete('/class/delete', classController.classDelete);

export = router;