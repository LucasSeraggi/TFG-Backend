import express, { Request, Response } from 'express';
import { verifyToken } from '../middlewares/auth';

const router = express.Router();
const date = new Date();

router.all('*', (req: Request, __: Response, next: any) => {
  console.info('\n\n');
  console.info(new Date().toISOString());
  console.info(req.method + ':' + req.originalUrl);
  next();
});

router.get('/api', (_: any, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Bem Vindo!',
    version: '1.0.0',
    date: date.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })
  });
});

router.get('/api/this', [verifyToken], async (req: any, res: any) => {

  try {
    return res.status(201).send({
      userId: req.headers.userId,
      schoolId: req.headers.schoolId,
      email: req.headers.email,
      iat: req.headers.iat,
      role: req.headers.role,
      now: (Date.now() / 1000).toFixed(0),
      req: req.headers,
    });
  } catch (error) {
    return res.status(500).send({ error: error });
  }
});



export = router;
