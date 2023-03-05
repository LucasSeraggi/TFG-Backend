import express from 'express';
import schoolController from '../controllers/school.controller';
import { verifyToken } from '../middlewares/auth';

const router = express.Router();

//Registrar nova escola
router.post('/school/register', schoolController.registerNewSchool);

//Dados de todas as escolas
router.get('/schools', [verifyToken], schoolController.listSchools); //add auth

//Dados da escola
router.get('/schoolData', [verifyToken], schoolController.schoolProfile);

//Excluir escola
router.delete('/school/delete', [verifyToken], schoolController.schoolDelete);

export = router;
