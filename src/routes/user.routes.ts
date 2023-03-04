import express from 'express';
const router = express.Router();
const auth = require('../middlewares/auth');

import UserController from '../controllers/user.controllers';

/*
//Registrar novo usuário
router.post('/register', userController.registerNewUser);

//Login de usuário
router.post('/login', userController.loginUser);

//Dados do usuário
router.get('/userData', auth, userController.userProfile);
*/

router.post('/register', UserController.registerNewUser);

export = router;