import { Request, Response, NextFunction } from 'express';
import { findVideoWithContext } from './video.repository';
import { createError } from '../../middleware/errorHandler';

export async function getVideo(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const videoId = parseInt(String(req.params['videoId']));
    const userId = req.user!.id;
    const video = await findVideoWithContext(videoId, userId);
    if (!video) return next(createError('Video not found', 404));
    res.json(video);
  } catch (err) {
    next(err);
  }
}
