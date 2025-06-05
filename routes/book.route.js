import express from 'express';
import {
  createBook,
  getBooks,
  getBook,
  updateBook,
  deleteBook,
  searchBooks
} from '../controllers/bookController.js';
import { authenticate, authorizeBookOwner } from '../middlewares/auth.js';
import {
  validateBookCreate,
  validateBookUpdate,
  validateBookQuery,
  validateSearchQuery
} from '../middlewares/validators.js';

const router = express.Router();

// Public routes
router.get('/', validateBookQuery, getBooks);
router.get('/search', validateSearchQuery, searchBooks);
router.get('/:id', getBook);

// Protected routes
router.post('/', authenticate, validateBookCreate, createBook);
router.patch('/:id', authenticate, authorizeBookOwner, validateBookUpdate, updateBook);
router.delete('/:id', authenticate, authorizeBookOwner, deleteBook);



export default router;