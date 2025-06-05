import jwt from 'jsonwebtoken';
import BookModel from '../models/Book.model.js';



export const authenticate = async (req, res, next) => {
  try {
    // Get token from cookie or Authorization header
    const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      throw new Error('Authentication required. Please login first.');
    }

    //  Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false,
      error: error.message || 'Invalid or expired token' 
    });
  }
};



export const authorizeBookOwner = async (req, res, next) => {
  try {
    
    const book = await BookModel.findById(req.params.id);
    if (!book) {
      throw new Error('Book not found');
    }

   
    if (book.createdBy.toString() !== req.user.id) {
      throw new Error('Unauthorized. You can only modify your own books.');
    }

    
    req.book = book;
    next();
  } catch (error) {
    res.status(403).json({ 
      success: false,
      error: error.message || 'Authorization failed' 
    });
  }
};