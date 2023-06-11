import express from 'express';
import classController from '../controllers/class.controller';
import { verifyToken } from '../middlewares/auth';

const router = express.Router();

//Registrar nova classe
router.post('/api/class/register', [verifyToken], classController.register);

//Dados de todas as classes
router.get('/api/class', [verifyToken], classController.find);
router.get('/api/class/paginated', [verifyToken], classController.getPaginated);
router.get('/api/class/:id', [verifyToken], classController.get);

//Excluir class
router.delete('/api/class/:id', [verifyToken], classController.remove);

router.patch('/api/class', [verifyToken], classController.update);

export = router;