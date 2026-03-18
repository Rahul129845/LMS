import { Router } from 'express';
import { getVideo } from './video.controller';
import { authMiddleware } from '../../middleware/authMiddleware';

export const videoRoutes = Router();

videoRoutes.get('/:videoId', authMiddleware, getVideo);
