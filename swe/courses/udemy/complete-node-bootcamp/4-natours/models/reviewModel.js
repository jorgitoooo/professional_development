const mongoose = require('mongoose');
const Tour = require('./tourModel');

// review / rating / createdAt / tour ref / user ref
const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Cannot submit an empty review'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      required: [true, 'A review must have a tour'],
      ref: 'Tour',
    },
    user: {
      type: mongoose.Schema.ObjectId,
      required: [true, 'A review must have an author'],
      ref: 'User',
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Allows user to make only one review per tour
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  //   this.populate({ path: 'tour', select: 'name' });
  this.populate({ path: 'user', select: 'name photo' });
  next();
});

reviewSchema.statics.calcAvgerageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

reviewSchema.post('save', function () {
  // this points to current review
  this.constructor.calcAvgerageRatings(this.tour);
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
  // query is executed to retrieve the review and passed to the post query handler
  this.r = await this.findOne();
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  // await this.findOne() doesn't work here since query has already executed
  await this.r.constructor.calcAvgerageRatings(this.r.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
