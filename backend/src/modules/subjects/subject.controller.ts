import { Request, Response, NextFunction } from 'express';
import { listPublishedSubjects, findSubjectById, getSubjectTree, getFirstUnlockedVideo } from './subject.repository';
import { createError } from '../../middleware/errorHandler';

export async function getSubjects(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const page = parseInt(String(req.query['page'] || '1'));
    const pageSize = parseInt(String(req.query['pageSize'] || '12'));
    const q = req.query['q'] ? String(req.query['q']) : undefined;
    const result = await listPublishedSubjects(page, pageSize, q);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getSubject(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const subjectId = parseInt(String(req.params['subjectId']));
    const subject = await findSubjectById(subjectId);
    if (!subject) return next(createError('Subject not found', 404));
    res.json(subject);
  } catch (err) {
    next(err);
  }
}

export async function getTree(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const subjectId = parseInt(String(req.params['subjectId']));
    const userId = req.user!.id;
    const tree = await getSubjectTree(subjectId, userId);
    res.json(tree);
  } catch (err) {
    next(err);
  }
}

export async function getFirstVideo(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const subjectId = parseInt(String(req.params['subjectId']));
    const userId = req.user!.id;
    const videoId = await getFirstUnlockedVideo(subjectId, userId);
    if (!videoId) return next(createError('No videos found for this subject', 404));
    res.json({ videoId });
  } catch (err) {
    next(err);
  }
}
