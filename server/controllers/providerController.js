import Provider from '../models/Provider.js';
import Review from '../models/Review.js';
import Report from '../models/Report.js';
import { getIsDbConnected } from '../config/db.js';
import { memoryStore } from '../config/mockData.js';

// @desc    Get all providers (with filters: profession, area, search, isActive)
// @route   GET /api/providers
// @access  Public
export const getProviders = async (req, res, next) => {
  try {
    const { profession, area, search, all } = req.query;

    if (!getIsDbConnected()) {
      let list = memoryStore.providers;
      if (!all) list = list.filter((p) => p.isActive);
      if (profession) list = list.filter((p) => p.profession?._id === profession || p.profession === profession);
      if (area) list = list.filter((p) => p.area.toLowerCase().includes(area.toLowerCase()));
      if (search) {
        list = list.filter(
          (p) =>
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.area.toLowerCase().includes(search.toLowerCase())
        );
      }
      return res.status(200).json({ success: true, count: list.length, data: list });
    }

    let query = {};
    if (!all) query.isActive = true;
    if (profession) query.profession = profession;
    if (area) query.area = { $regex: area, $options: 'i' };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { area: { $regex: search, $options: 'i' } }
      ];
    }

    const providers = await Provider.find(query)
      .populate('profession', 'name icon')
      .sort({ avgRating: -1, reviewsCount: -1 });

    res.status(200).json({
      success: true,
      count: providers.length,
      data: providers
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get top rated providers for homepage
// @route   GET /api/providers/top
// @access  Public
export const getTopProviders = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 8;

    if (!getIsDbConnected()) {
      const top = [...memoryStore.providers]
        .filter((p) => p.isActive)
        .sort((a, b) => (b.avgRating || 0) - (a.avgRating || 0))
        .slice(0, limit);
      return res.status(200).json({ success: true, count: top.length, data: top });
    }

    const providers = await Provider.find({ isActive: true })
      .populate('profession', 'name icon')
      .sort({ avgRating: -1, reviewsCount: -1 })
      .limit(limit);

    res.status(200).json({
      success: true,
      count: providers.length,
      data: providers
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single provider by ID with approved reviews
// @route   GET /api/providers/:id
// @access  Public
export const getProviderById = async (req, res, next) => {
  try {
    if (!getIsDbConnected()) {
      const provider = memoryStore.providers.find((p) => p._id === req.params.id);
      if (!provider) {
        return res.status(404).json({ success: false, message: 'مقدم الخدمة غير موجود' });
      }
      const reviews = memoryStore.reviews.filter(
        (r) => (r.provider?._id === req.params.id || r.provider === req.params.id) && r.isApproved
      );
      return res.status(200).json({ success: true, data: { provider, reviews } });
    }

    const provider = await Provider.findById(req.params.id).populate(
      'profession',
      'name icon'
    );

    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'مقدم الخدمة غير موجود'
      });
    }

    const reviews = await Review.find({
      provider: provider._id,
      isApproved: true
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: { provider, reviews }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new provider
// @route   POST /api/providers
// @access  Private (Admin)
export const createProvider = async (req, res, next) => {
  try {
    const { name, phone, whatsapp, area, profession, isActive } = req.body;

    if (!name || !phone || !area || !profession) {
      return res.status(400).json({
        success: false,
        message: 'يرجى استكمال جميع الحقول المطلوبة'
      });
    }

    if (!getIsDbConnected()) {
      const profObj = memoryStore.professions.find((p) => p._id === profession) || { name: 'خدمة عامة', icon: 'Wrench' };
      const newProv = {
        _id: 'prov-' + Date.now(),
        name,
        phone,
        whatsapp: whatsapp || '',
        area,
        profession: profObj,
        avgRating: 5.0,
        reviewsCount: 0,
        isActive: isActive !== undefined ? isActive : true,
        createdAt: new Date().toISOString()
      };
      memoryStore.providers.unshift(newProv);
      return res.status(201).json({ success: true, message: 'تم إضافة مقدم الخدمة بنجاح', data: newProv });
    }

    const provider = await Provider.create({
      name,
      phone,
      whatsapp: whatsapp || '',
      area,
      profession,
      isActive: isActive !== undefined ? isActive : true
    });

    const populatedProvider = await Provider.findById(provider._id).populate(
      'profession',
      'name icon'
    );

    res.status(201).json({
      success: true,
      message: 'تم إضافة مقدم الخدمة بنجاح',
      data: populatedProvider
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update provider
// @route   PUT /api/providers/:id
// @access  Private (Admin)
export const updateProvider = async (req, res, next) => {
  try {
    const { name, phone, whatsapp, area, profession, isActive } = req.body;

    if (!getIsDbConnected()) {
      const prov = memoryStore.providers.find((p) => p._id === req.params.id);
      if (!prov) return res.status(404).json({ success: false, message: 'مقدم الخدمة غير موجود' });
      if (name) prov.name = name;
      if (phone) prov.phone = phone;
      if (whatsapp !== undefined) prov.whatsapp = whatsapp;
      if (area) prov.area = area;
      if (profession) {
        prov.profession = memoryStore.professions.find((p) => p._id === profession) || prov.profession;
      }
      if (isActive !== undefined) prov.isActive = isActive;
      return res.status(200).json({ success: true, message: 'تم تحديث بيانات مقدم الخدمة بنجاح', data: prov });
    }

    let provider = await Provider.findById(req.params.id);
    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'مقدم الخدمة غير موجود'
      });
    }

    if (name) provider.name = name;
    if (phone) provider.phone = phone;
    if (whatsapp !== undefined) provider.whatsapp = whatsapp;
    if (area) provider.area = area;
    if (profession) provider.profession = profession;
    if (isActive !== undefined) provider.isActive = isActive;

    await provider.save();

    const updatedProvider = await Provider.findById(provider._id).populate(
      'profession',
      'name icon'
    );

    res.status(200).json({
      success: true,
      message: 'تم تحديث بيانات مقدم الخدمة بنجاح',
      data: updatedProvider
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete provider and related data
// @route   DELETE /api/providers/:id
// @access  Private (Admin)
export const deleteProvider = async (req, res, next) => {
  try {
    if (!getIsDbConnected()) {
      const idx = memoryStore.providers.findIndex((p) => p._id === req.params.id);
      if (idx === -1) return res.status(404).json({ success: false, message: 'مقدم الخدمة غير موجود' });
      memoryStore.providers.splice(idx, 1);
      return res.status(200).json({ success: true, message: 'تم حذف مقدم الخدمة بنجاح' });
    }

    const provider = await Provider.findById(req.params.id);
    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'مقدم الخدمة غير موجود'
      });
    }

    await Review.deleteMany({ provider: req.params.id });
    await Report.deleteMany({ provider: req.params.id });
    await provider.deleteOne();

    res.status(200).json({
      success: true,
      message: 'تم حذف مقدم الخدمة بنجاح'
    });
  } catch (error) {
    next(error);
  }
};
