import express from 'express';
import databaseConnection from '../config/databaseConnection.config';
import User from '../models/user.model';

const router = express.Router();

router.get('/api', (_: any, res: any) => {
  res.status(200).send({
    success: true,
    message: 'Bem Vindo!',
    version: '1.0.0',
  });
});

router.get('/test', async (_: any, res: any) => {
  const a = await User.findEmail('Jackson')
  console.log(a);
  res.status(201).send({});
});

export = router;
