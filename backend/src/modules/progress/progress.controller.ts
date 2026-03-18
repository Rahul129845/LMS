import { Request, Response, NextFunction } from 'express';
import { getVideoProgress, upsertVideoProgress, getSubjectProgress } from './progress.repository';
import { createError } from '../../middleware/errorHandler';

export async function getVideoProgressHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const videoId = parseInt(String(req.params['videoId']));
    const userId = req.user!.id;
    const progress = await getVideoProgress(userId, videoId);
    res.json(progress);
  } catch (err) {
    next(err);
  }
}

export async function postVideoProgress(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const videoId = parseInt(String(req.params['videoId']));
    const userId = req.user!.id;
    const { last_position_seconds, is_completed } = req.body;

    if (typeof last_position_seconds !== 'number' || last_position_seconds < 0) {
      return next(createError('last_position_seconds must be a non-negative number', 400));
    }

    const result = await upsertVideoProgress(userId, videoId, {
      last_position_seconds,
      is_completed: !!is_completed,
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getSubjectProgressHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const subjectId = parseInt(String(req.params['subjectId']));
    const userId = req.user!.id;
    const progress = await getSubjectProgress(userId, subjectId);
    res.json(progress);
  } catch (err) {
    next(err);
  }
}
