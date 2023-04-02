import express from 'express';
import roleController from '../controllers/role.controller';

const router = express.Router();

//Dados de todas as roles
router.get('/roles', roleController.listRoles); //add auth

export = router;