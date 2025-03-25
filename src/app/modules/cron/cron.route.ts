import { Router } from 'express';
import { cronControllers } from './cron.controller';

const router = Router();

router.get('/clearExpiredOffers', cronControllers.resetOffer);

export const CronRouters = router;
