import Report from '../models/Report.js';
import Provider from '../models/Provider.js';
import { getIsDbConnected } from '../config/db.js';
import { memoryStore } from '../config/mockData.js';

// @desc    Submit a report about a provider
// @route   POST /api/reports
// @access  Public
export const submitReport = async (req, res, next) => {
  try {
    const { providerId, userName, message } = req.body;

    if (!providerId || !userName || !message) {
      return res.status(400).json({ success: false, message: 'يرجى إدخال اسمك وتفاصيل البلاغ' });
    }

    if (!getIsDbConnected()) {
      const provider = memoryStore.providers.find((p) => p._id === providerId);
      if (!provider) return res.status(404).json({ success: false, message: 'مقدم الخدمة غير موجود' });

      const newRep = {
        _id: 'rep-' + Date.now(),
        provider,
        userName,
        message,
        isResolved: false,
        createdAt: new Date().toISOString()
      };
      memoryStore.reports.unshift(newRep);
      return res.status(201).json({ success: true, message: 'تم إرسال بلاغك للإدارة بنجاح', data: newRep });
    }

    const provider = await Provider.findById(providerId);
    if (!provider) return res.status(404).json({ success: false, message: 'مقدم الخدمة غير موجود' });

    const report = await Report.create({ provider: providerId, userName, message, isResolved: false });
    res.status(201).json({ success: true, message: 'تم إرسال بلاغك للإدارة وسيتم مراجعته', data: report });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reports
// @route   GET /api/reports
// @access  Private (Admin)
export const getReports = async (req, res, next) => {
  try {
    if (!getIsDbConnected()) {
      return res.status(200).json({ success: true, count: memoryStore.reports.length, data: memoryStore.reports });
    }

    const reports = await Report.find()
      .populate('provider', 'name phone area')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: reports.length, data: reports });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle resolved status for a report
// @route   PATCH /api/reports/:id/resolve
// @access  Private (Admin)
export const toggleResolveReport = async (req, res, next) => {
  try {
    if (!getIsDbConnected()) {
      const report = memoryStore.reports.find((r) => r._id === req.params.id);
      if (!report) return res.status(404).json({ success: false, message: 'البلاغ غير موجود' });
      report.isResolved = !report.isResolved;
      return res.status(200).json({
        success: true,
        message: report.isResolved ? 'تم تعيين البلاغ كمحلول' : 'تمت إعادة فتح البلاغ',
        data: report
      });
    }

    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ success: false, message: 'البلاغ غير موجود' });

    report.isResolved = !report.isResolved;
    await report.save();

    res.status(200).json({
      success: true,
      message: report.isResolved ? 'تم تعيين البلاغ كمحلول' : 'تمت إعادة فتح البلاغ',
      data: report
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a report
// @route   DELETE /api/reports/:id
// @access  Private (Admin)
export const deleteReport = async (req, res, next) => {
  try {
    if (!getIsDbConnected()) {
      const idx = memoryStore.reports.findIndex((r) => r._id === req.params.id);
      if (idx === -1) return res.status(404).json({ success: false, message: 'البلاغ غير موجود' });
      memoryStore.reports.splice(idx, 1);
      return res.status(200).json({ success: true, message: 'تم حذف البلاغ بنجاح' });
    }

    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ success: false, message: 'البلاغ غير موجود' });

    await report.deleteOne();
    res.status(200).json({ success: true, message: 'تم حذف البلاغ بنجاح' });
  } catch (error) {
    next(error);
  }
};
