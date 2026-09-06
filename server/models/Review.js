import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Provider',
      required: [true, 'معرف مقدم الخدمة مطلوب']
    },
    userName: {
      type: String,
      required: [true, 'اسم صاحب التقييم مطلوب'],
      trim: true
    },
    rating: {
      type: Number,
      required: [true, 'التقييم من 1 إلى 5 مطلوب'],
      min: [1, 'التقييم يجب أن يكون 1 على الأقل'],
      max: [5, 'التقييم لا يمكن أن يتجاوز 5']
    },
    comment: {
      type: String,
      required: [true, 'نص التعليق مطلوب'],
      trim: true
    },
    ipAddress: {
      type: String,
      default: ''
    },
    isApproved: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Helper static method to recalculate provider's average rating
reviewSchema.statics.calculateAverageRating = async function (providerId) {
  const stats = await this.aggregate([
    {
      $match: {
        provider: new mongoose.Types.ObjectId(providerId),
        isApproved: true
      }
    },
    {
      $group: {
        _id: '$provider',
        avgRating: { $avg: '$rating' },
        reviewsCount: { $sum: 1 }
      }
    }
  ]);

  const Provider = mongoose.model('Provider');
  if (stats.length > 0) {
    await Provider.findByIdAndUpdate(providerId, {
      avgRating: parseFloat(stats[0].avgRating.toFixed(1)),
      reviewsCount: stats[0].reviewsCount
    });
  } else {
    await Provider.findByIdAndUpdate(providerId, {
      avgRating: 0,
      reviewsCount: 0
    });
  }
};

const Review = mongoose.model('Review', reviewSchema);
export default Review;
