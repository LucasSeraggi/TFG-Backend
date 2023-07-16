import express from 'express';
import { verifyToken } from '../middlewares/auth';

import GradeController from '../controllers/grade.controller';

const router = express.Router();

router.post('/api/grade', [verifyToken], GradeController.register);

router.get('/api/grade/:id', [verifyToken], GradeController.get);

router.get('/api/grade', [verifyToken], GradeController.find);

router.get('/api/grade/paginated', [verifyToken], GradeController.getPaginated);

router.delete('/api/grade/:id', [verifyToken], GradeController.remove);

router.patch('/api/grade', [verifyToken], GradeController.update);

router.post('/api/grade/quiz', [verifyToken], GradeController.registerQuiz);


export = router;
