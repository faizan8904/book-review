import express from 'express';
import {
  createReview,
  updateReview,
  deleteReview
} from '../controllers/reviewController.js';
import { authenticate } from '../middlewares/auth.js';
import { validateReviewCreate, validateReviewUpdate } from '../middlewares/validators.js';

const router = express.Router();



router.post(
  '/books/:bookId',
  authenticate,
  validateReviewCreate,
  createReview
);

router.patch(
  '/:id',
  authenticate,
  validateReviewUpdate,
  updateReview
);

router.delete(
  '/:id',
  authenticate,
  validateReviewUpdate, 
  deleteReview
);

export default router;