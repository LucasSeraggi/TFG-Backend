import express from 'express';
import roleController from '../controllers/role.controller';

const router = express.Router();

//Dados de todas as roles
router.get('/api/roles', roleController.listRoles); //add auth

export = router;