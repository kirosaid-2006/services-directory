import express from 'express';
import {
  submitReport,
  getReports,
  toggleResolveReport,
  deleteReport
} from '../controllers/reportController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(submitReport)
  .get(protect, getReports);

router.patch('/:id/resolve', protect, toggleResolveReport);
router.delete('/:id', protect, deleteReport);

export default router;
