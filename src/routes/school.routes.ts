import express from 'express';
import schoolController from '../controllers/school.controller';
import { verifyToken } from '../middlewares/auth';

const router = express.Router();

//Registrar nova escola
router.post('/api/school/register', schoolController.registerNewSchool);

//Dados de todas as escolas
router.get('/api/schools', [verifyToken], schoolController.listSchools); //add auth

//Dados da escola
router.get('/api/schoolData', [verifyToken], schoolController.schoolProfile);

//Excluir escola
router.delete('/api/school/delete', [verifyToken], schoolController.schoolDelete);

export = router;
