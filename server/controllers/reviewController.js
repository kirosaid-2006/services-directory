import Review from '../models/Review.js';
import Provider from '../models/Provider.js';
import { getIsDbConnected } from '../config/db.js';
import { memoryStore } from '../config/mockData.js';

// @desc    Submit a review for a provider (with 30-day IP rate limit)
// @route   POST /api/reviews
// @access  Public
export const submitReview = async (req, res, next) => {
  try {
    const { providerId, userName, rating, comment } = req.body;
    const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';

    if (!providerId || !userName || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'يرجى ملء جميع حقول التقييم والتعليق' });
    }

    if (!getIsDbConnected()) {
      const provider = memoryStore.providers.find((p) => p._id === providerId);
      if (!provider) return res.status(404).json({ success: false, message: 'مقدم الخدمة غير موجود' });

      const newRev = {
        _id: 'rev-' + Date.now(),
        provider,
        userName,
        rating: Number(rating),
        comment,
        ipAddress,
        isApproved: false,
        createdAt: new Date().toISOString()
      };
      memoryStore.reviews.unshift(newRev);

      return res.status(201).json({
        success: true,
        message: 'شكراً لك! تم إرسال تقييمك وسيظهر بعد مراجعة الإدارة.',
        data: newRev
      });
    }

    const provider = await Provider.findById(providerId);
    if (!provider) {
      return res.status(404).json({ success: false, message: 'مقدم الخدمة المطلوب غير موجود' });
    }

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentReview = await Review.findOne({
      provider: providerId,
      ipAddress,
      createdAt: { $gte: thirtyDaysAgo }
    });

    if (recentReview) {
      return res.status(429).json({
        success: false,
        message: 'لقد قمت بتقييم هذا المقدم بالفعل خلال الـ 30 يوماً الماضية'
      });
    }

    const review = await Review.create({
      provider: providerId,
      userName,
      rating: Number(rating),
      comment,
      ipAddress,
      isApproved: false
    });

    res.status(201).json({
      success: true,
      message: 'شكراً لك! تم إرسال تقييمك وسيظهر بعد مراجعة الإدارة.',
      data: review
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reviews (filtered by provider or approval status)
// @route   GET /api/reviews
// @access  Private (Admin)
export const getReviews = async (req, res, next) => {
  try {
    const { status, providerId } = req.query;

    if (!getIsDbConnected()) {
      let list = memoryStore.reviews;
      if (status === 'pending') list = list.filter((r) => !r.isApproved);
      if (status === 'approved') list = list.filter((r) => r.isApproved);
      if (providerId) list = list.filter((r) => r.provider?._id === providerId || r.provider === providerId);
      return res.status(200).json({ success: true, count: list.length, data: list });
    }

    let query = {};
    if (status === 'pending') query.isApproved = false;
    else if (status === 'approved') query.isApproved = true;
    if (providerId) query.provider = providerId;

    const reviews = await Review.find(query)
      .populate('provider', 'name area')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve a review
// @route   PATCH /api/reviews/:id/approve
// @access  Private (Admin)
export const approveReview = async (req, res, next) => {
  try {
    if (!getIsDbConnected()) {
      const review = memoryStore.reviews.find((r) => r._id === req.params.id);
      if (!review) return res.status(404).json({ success: false, message: 'التقييم المطلوب غير موجود' });
      review.isApproved = true;

      // Recalculate rating
      const provId = review.provider?._id || review.provider;
      const provReviews = memoryStore.reviews.filter(
        (r) => (r.provider?._id === provId || r.provider === provId) && r.isApproved
      );
      const targetProv = memoryStore.providers.find((p) => p._id === provId);
      if (targetProv) {
        const sum = provReviews.reduce((acc, r) => acc + r.rating, 0);
        targetProv.avgRating = parseFloat((sum / provReviews.length).toFixed(1));
        targetProv.reviewsCount = provReviews.length;
      }

      return res.status(200).json({ success: true, message: 'تم اعتماد التقييم بنجاح' });
    }

    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'التقييم المطلوب غير موجود' });

    review.isApproved = true;
    await review.save();
    await Review.calculateAverageRating(review.provider);

    res.status(200).json({ success: true, message: 'تم اعتماد التقييم ونشره بنجاح' });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private (Admin)
export const deleteReview = async (req, res, next) => {
  try {
    if (!getIsDbConnected()) {
      const idx = memoryStore.reviews.findIndex((r) => r._id === req.params.id);
      if (idx === -1) return res.status(404).json({ success: false, message: 'التقييم المطلوب غير موجود' });
      memoryStore.reviews.splice(idx, 1);
      return res.status(200).json({ success: true, message: 'تم حذف التقييم بنجاح' });
    }

    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'التقييم المطلوب غير موجود' });

    const providerId = review.provider;
    await review.deleteOne();
    await Review.calculateAverageRating(providerId);

    res.status(200).json({ success: true, message: 'تم حذف التقييم بنجاح' });
  } catch (error) {
    next(error);
  }
};
