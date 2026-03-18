import { Router } from 'express';
import { getVideoProgressHandler, postVideoProgress, getSubjectProgressHandler } from './progress.controller';
import { authMiddleware } from '../../middleware/authMiddleware';

export const progressRoutes = Router();

progressRoutes.get('/subjects/:subjectId', authMiddleware, getSubjectProgressHandler);
progressRoutes.get('/videos/:videoId', authMiddleware, getVideoProgressHandler);
progressRoutes.post('/videos/:videoId', authMiddleware, postVideoProgress);
