import express from 'express';
import { verifyToken } from '../middlewares/auth';
import SubjectController from '../controllers/subject.controller';

const router = express.Router();

router.post('/api/subject/register', [verifyToken], SubjectController.register);

router.get('/api/subject/:id', [verifyToken], SubjectController.get);
router.delete('/api/subject/:id', [verifyToken], SubjectController.remove);
router.patch('/api/subject/:id', [verifyToken], SubjectController.update);

router.get('/api/subject', [verifyToken], SubjectController.find);
router.patch('/api/subject', [verifyToken], SubjectController.update);


export = router;
