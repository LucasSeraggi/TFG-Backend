import express from 'express';
import schoolController from '../controllers/school.controller';
import { verifyToken } from '../middlewares/auth';

const router = express.Router();

//Registrar nova escola
router.post('/api/school/register', schoolController.registerNewSchool);

// Login 
router.post('/api/school/login', schoolController.login);

//Dados de todas as escolas
router.get('/api/schools', [verifyToken], schoolController.listSchools); //add auth

router.get('/api/school/me', [verifyToken], schoolController.me); //add auth

// //Dados da escola
// router.get('/api/schoolData', [verifyToken], schoolController.schoolProfile);

//Excluir escola
router.delete('/api/school/:id', [verifyToken], schoolController.schoolDelete);

//Atualizar escola
router.patch('/api/school', [verifyToken], schoolController.update);

export = router;
