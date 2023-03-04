import express from 'express';
const router = express.Router();

import schoolController from '../controllers/school.controller';

//Registrar nova escola
router.post('/school/register', schoolController.registerNewSchool);

//Dados de todas as escolas
router.get('/schools', schoolController.listSchools); //add auth

//Dados da escola
router.get('/schoolData', schoolController.schoolProfile);

//Excluir escola
router.delete('/school/delete', schoolController.schoolDelete);

export = router;
