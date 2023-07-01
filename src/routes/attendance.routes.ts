import express from 'express';
import { verifyToken } from '../middlewares/auth';

import AttendanceController from '../controllers/attendance.controller';

const router = express.Router();

router.post('/api/attendance/register', [verifyToken], AttendanceController.register);

router.get('/api/attendance/paginated', [verifyToken], AttendanceController.getPaginated);

router.get('/api/attendance/:id', [verifyToken], AttendanceController.get);

router.get('/api/attendance', [verifyToken], AttendanceController.find);

router.delete('/api/attendance/:id', [verifyToken], AttendanceController.remove);

router.patch('/api/attendance', [verifyToken], AttendanceController.update);

export = router;
