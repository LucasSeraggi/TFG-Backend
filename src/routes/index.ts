import express, { Response } from 'express';
import { verifyToken } from '../middlewares/auth';

const router = express.Router();

router.get('/api', (_: any, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Bem Vindo!',
    version: '1.0.0',
  });
});

router.get('/api/this', [verifyToken], async (req: any, res: any) => {

  try {
    return res.status(201).send({
      userId: req.headers.userId,
      schoolId: req.headers.schoolId,
      email: req.headers.email,
      iat: req.headers.iat,
      now: (Date.now() / 1000).toFixed(0),
      req: req.headers,
    });
  } catch (error) {
    return res.status(400).send({ error: error });
  }
});

export = router;
