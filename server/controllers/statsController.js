import Provider from '../models/Provider.js';
import Profession from '../models/Profession.js';
import Review from '../models/Review.js';
import Report from '../models/Report.js';
import { getIsDbConnected } from '../config/db.js';
import { memoryStore } from '../config/mockData.js';

// @desc    Get dashboard statistics (public and admin counters)
// @route   GET /api/stats
// @access  Public
export const getStats = async (req, res, next) => {
  try {
    if (!getIsDbConnected()) {
      const activeProvs = memoryStore.providers.filter((p) => p.isActive);
      const totalProviders = activeProvs.length;
      const totalProfessions = memoryStore.professions.length;
      const totalReviews = memoryStore.reviews.filter((r) => r.isApproved).length;
      const pendingReviews = memoryStore.reviews.filter((r) => !r.isApproved).length;
      const unresolvedReports = memoryStore.reports.filter((r) => !r.isResolved).length;
      const avgRating = activeProvs.length > 0
        ? parseFloat((activeProvs.reduce((acc, p) => acc + (p.avgRating || 0), 0) / activeProvs.length).toFixed(1))
        : 4.8;
      const recentProviders = activeProvs.slice(0, 5);

      return res.status(200).json({
        success: true,
        data: {
          totalProviders,
          totalProfessions,
          totalReviews,
          pendingReviews,
          unresolvedReports,
          averageRating: avgRating,
          recentProviders
        }
      });
    }

    const [
      totalProviders,
      totalProfessions,
      totalReviews,
      pendingReviews,
      unresolvedReports,
      avgRatingAgg,
      recentProviders
    ] = await Promise.all([
      Provider.countDocuments({ isActive: true }),
      Profession.countDocuments(),
      Review.countDocuments({ isApproved: true }),
      Review.countDocuments({ isApproved: false }),
      Report.countDocuments({ isResolved: false }),
      Provider.aggregate([
        { $match: { isActive: true, reviewsCount: { $gt: 0 } } },
        { $group: { _id: null, avg: { $avg: '$avgRating' } } }
      ]),
      Provider.find({ isActive: true })
        .populate('profession', 'name icon')
        .sort({ createdAt: -1 })
        .limit(5)
    ]);

    const averageRating =
      avgRatingAgg.length > 0 ? parseFloat(avgRatingAgg[0].avg.toFixed(1)) : 5.0;

    res.status(200).json({
      success: true,
      data: {
        totalProviders,
        totalProfessions,
        totalReviews,
        pendingReviews,
        unresolvedReports,
        averageRating,
        recentProviders
      }
    });
  } catch (error) {
    next(error);
  }
};
