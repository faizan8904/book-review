import { body, param, query } from 'express-validator';
import UserModel from "../models/User.model.js";
import BookModel from '../models/Book.model.js';
import ReviewModel from '../models/Review.model.js';

export const validateSignup=[
    body('username')
    .notEmpty().withMessage('Username is required')
    .trim()
    .isLength({min:3}).withMessage('Username must be at least 3 characters')
    .custom(async username => {
        const user = await UserModel.findOne({username});
        if(user) throw new Error('Username already in use');
    }),

    body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail()
    .custom(async email => {
        const user = await UserModel.findOne({email});
        if(user) throw new Error('Email already in use');
    }),

    body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
    .matches(/[0-9]/).withMessage('Password must contain at least one number')
];

export const validateLogin = [
    body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),

    body('password')
    .notEmpty().withMessage('Password is required')
]



// Book creation validation
export const validateBookCreate = [
  body('title')
    .notEmpty().withMessage('Title is required')
    .trim()
    .isLength({ min: 2 }).withMessage('Title must be at least 2 characters')
    .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),

  body('author')
    .notEmpty().withMessage('Author is required')
    .trim()
    .isLength({ min: 2 }).withMessage('Author must be at least 2 characters')
    .isLength({ max: 50 }).withMessage('Author cannot exceed 50 characters'),

  body('genre')
    .notEmpty().withMessage('Genre is required')
    .trim()
    .isLength({ min: 2 }).withMessage('Genre must be at least 2 characters')
    .isLength({ max: 30 }).withMessage('Genre cannot exceed 30 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters')
];

// Book update validation
export const validateBookUpdate = [
  param('id')
    .isMongoId().withMessage('Invalid book ID format')
    .custom(async (id, { req }) => {
      const book = await BookModel.findById(id);
      if (!book) throw new Error('Book not found');
      if (book.createdBy.toString() !== req.user.id) throw new Error('Not authorized');
      return true;
    }),

  body('title')
    .optional()
    .trim()
    .isLength({ min: 2 }).withMessage('Title must be at least 2 characters')
    .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),

  body('author')
    .optional()
    .trim()
    .isLength({ min: 2 }).withMessage('Author must be at least 2 characters')
    .isLength({ max: 50 }).withMessage('Author cannot exceed 50 characters'),

  body('genre')
    .optional()
    .trim()
    .isLength({ min: 2 }).withMessage('Genre must be at least 2 characters')
    .isLength({ max: 30 }).withMessage('Genre cannot exceed 30 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters')
];

// Book query validation (for getBooks)
export const validateBookQuery = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer')
    .toInt(),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1-100')
    .toInt(),

  query('author')
    .optional()
    .trim()
    .isLength({ min: 2 }).withMessage('Author search must be at least 2 characters'),

  query('genre')
    .optional()
    .trim()
    .isLength({ min: 2 }).withMessage('Genre search must be at least 2 characters')
];



// Create Review Validation
export const validateReviewCreate = [
  param('bookId')
    .isMongoId().withMessage('Invalid book ID')
    .custom(async (bookId) => {
      const book = await BookModel.findById(bookId);
      if (!book) throw new Error('Book not found');
      return true;
    }),

  body('rating')
    .isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1-5'),

  body('comment')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Comment cannot exceed 500 characters')
];

// Update Review Validation
export const validateReviewUpdate = [
  param('id')
    .isMongoId().withMessage('Invalid review ID')
    .custom(async (id, { req }) => {
      const review = await ReviewModel.findById(id);
      if (!review) throw new Error('Review not found');
      if (review.user.toString() !== req.user.id) throw new Error('Not authorized');
      return true;
    }),

  body('rating')
    .optional()
    .isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1-5'),

  body('comment')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Comment cannot exceed 500 characters')
];

export const validateSearchQuery = [
  query('q')
    .notEmpty().withMessage('Search query is required')
    .trim()
    .isLength({ min: 2 }).withMessage('Query must be at least 2 characters'),
  
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be 1-100')
];