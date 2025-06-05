
import BookModel from '../models/Book.model.js';
import ReviewModel from '../models/Review.model.js';


export const createReview = async (req, res) => {
  try {
    const { bookId } = req.params;
    const { rating, comment } = req.body;

    // Check if user already reviewed this book
    const existingReview = await ReviewModel.findOne({
      book: bookId,
      user: req.user.id
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        error: 'You have already reviewed this book'
      });
    }

    const review = await ReviewModel.create({
      book: bookId,
      user: req.user.id,
      rating,
      comment
    });

    // Update book's average rating
    await updateBookRating(bookId);

    res.status(201).json({
      success: true,
      data: review
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};


export const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    const review = await ReviewModel.findByIdAndUpdate(
      id,
      { rating, comment },
      { new: true, runValidators: true }
    );

    // Update book's average rating
    await updateBookRating(review.book);

    res.json({
      success: true,
      data: review
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};



export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await ReviewModel.findByIdAndDelete(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found'
      });
    }

    // Update book's average rating
    await updateBookRating(review.book);

    res.json({
      success: true,
      data: {}
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};


const updateBookRating = async (bookId) => {
  const stats = await ReviewModel.aggregate([
    {
      $match: { book: bookId }
    },
    {
      $group: {
        _id: '$book',
        averageRating: { $avg: '$rating' },
        reviewsCount: { $sum: 1 }
      }
    }
  ]);

  await BookModel.findByIdAndUpdate(bookId, {
    averageRating: stats.length > 0 ? stats[0].averageRating : 0,
    reviewsCount: stats.length > 0 ? stats[0].reviewsCount : 0
  });
};

