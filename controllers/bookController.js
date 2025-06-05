import BookModel from '../models/Book.model.js';
import ReviewModel from '../models/Review.model.js';

// Create Book
export const createBook = async (req, res) => {
  try {
    const book = await BookModel.create({
      ...req.body,
      createdBy: req.user.id
    });
    res.status(201).json(book);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get All Books
export const getBooks = async (req, res) => {
  try {
    const { page = 1, limit = 10, author, genre } = req.query;
    const filter = {};
    
    // for filtering based on substring 
    if (author) filter.author = new RegExp(author, 'i');
    if (genre) filter.genre = new RegExp(genre, 'i');

    const books = await BookModel.find(filter)
      .limit(limit)
      .skip((page - 1) * limit)
      .populate('createdBy', 'username');

    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Single Book
export const getBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 5 } = req.query; // Default 5 reviews per page

    // Get book with user info
    const book = await BookModel.findById(id).populate('createdBy', 'username');
    if (!book) return res.status(404).json({ error: 'Book not found' });

    // Getting review from reviewmodel based on bookid
    const reviews = await ReviewModel.find({ book: id })
      .populate('user', 'username')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    //  average rating calculation
    const ratingStats = await ReviewModel.aggregate([
      { $match: { book: book._id } },
      { 
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          reviewCount: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        ...book.toObject(),
        averageRating: ratingStats[0]?.averageRating || 0,
        reviewCount: ratingStats[0]?.reviewCount || 0,
        reviews,
        currentPage: page,
        reviewsPerPage: limit
      }
    });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update Book
export const updateBook = async (req, res) => {
  try {
    const book = await BookModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    res.json(book);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete Book
export const deleteBook = async (req, res) => {
  try {
    await BookModel.findByIdAndDelete(req.params.id);
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


export const searchBooks = async (req, res) => {
  try {
    const { q, page = 1, limit = 10 } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        error: 'Search query (q) is required'
      });
    }


    // This filter object help us to filter based on title or author and its not case sensetive

    const filter = {
      $or: [
        { title: { $regex: q, $options: 'i' } }, 
        { author: { $regex: q, $options: 'i' } }  
      ]
    };

    

    const [books, count] = await Promise.all([
      BookModel.find(filter)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .populate('createdBy', 'username'),  
      
      BookModel.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: {
        results: books,
        totalResults: count,
        currentPage: page,
        totalPages: Math.ceil(count / limit)
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};