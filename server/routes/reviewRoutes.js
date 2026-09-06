import express from 'express';
import {
  submitReview,
  getReviews,
  approveReview,
  deleteReview
} from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(submitReview)
  .get(getReviews);

router.patch('/:id/approve', protect, approveReview);
router.delete('/:id', protect, deleteReview);

export default router;
