import { Router } from 'express';
import { getSubjects, getSubject, getTree, getFirstVideo } from './subject.controller';
import { authMiddleware } from '../../middleware/authMiddleware';

export const subjectRoutes = Router();

subjectRoutes.get('/', getSubjects);
subjectRoutes.get('/:subjectId', getSubject);
subjectRoutes.get('/:subjectId/tree', authMiddleware, getTree);
subjectRoutes.get('/:subjectId/first-video', authMiddleware, getFirstVideo);
