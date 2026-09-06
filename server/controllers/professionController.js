import Profession from '../models/Profession.js';
import Provider from '../models/Provider.js';
import { getIsDbConnected } from '../config/db.js';
import { memoryStore } from '../config/mockData.js';

// @desc    Get all professions with active provider counts
// @route   GET /api/professions
// @access  Public
export const getProfessions = async (req, res, next) => {
  try {
    if (!getIsDbConnected()) {
      const data = memoryStore.professions.map((prof) => {
        const count = memoryStore.providers.filter(
          (p) => (p.profession?._id === prof._id || p.profession === prof._id) && p.isActive
        ).length;
        return { ...prof, providersCount: count };
      });
      return res.status(200).json({ success: true, count: data.length, data });
    }

    const professions = await Profession.find().sort({ name: 1 });
    const professionsWithCounts = await Promise.all(
      professions.map(async (prof) => {
        const count = await Provider.countDocuments({
          profession: prof._id,
          isActive: true
        });
        return {
          ...prof.toObject(),
          providersCount: count
        };
      })
    );

    res.status(200).json({
      success: true,
      count: professionsWithCounts.length,
      data: professionsWithCounts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single profession with its providers
// @route   GET /api/professions/:id
// @access  Public
export const getProfessionById = async (req, res, next) => {
  try {
    if (!getIsDbConnected()) {
      const profession = memoryStore.professions.find((p) => p._id === req.params.id);
      if (!profession) {
        return res.status(404).json({ success: false, message: 'المهنة المطلوبة غير موجودة' });
      }
      const providers = memoryStore.providers.filter(
        (p) => (p.profession?._id === req.params.id || p.profession === req.params.id) && p.isActive
      );
      return res.status(200).json({ success: true, data: { profession, providers } });
    }

    const profession = await Profession.findById(req.params.id);
    if (!profession) {
      return res.status(404).json({
        success: false,
        message: 'المهنة المطلوبة غير موجودة'
      });
    }

    const providers = await Provider.find({
      profession: profession._id,
      isActive: true
    }).sort({ avgRating: -1, reviewsCount: -1 });

    res.status(200).json({
      success: true,
      data: { profession, providers }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new profession
// @route   POST /api/professions
// @access  Private (Admin)
export const createProfession = async (req, res, next) => {
  try {
    const { name, icon, description } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'اسم المهنة أو الخدمة مطلوب' });
    }

    if (!getIsDbConnected()) {
      const newProf = {
        _id: 'prof-' + Date.now(),
        name,
        icon: icon || 'Wrench',
        description: description || '',
        providersCount: 0
      };
      memoryStore.professions.push(newProf);
      return res.status(201).json({ success: true, message: 'تم إضافة المهنة بنجاح', data: newProf });
    }

    const exists = await Profession.findOne({ name });
    if (exists) {
      return res.status(400).json({ success: false, message: 'هذه المهنة مسجلة بالفعل' });
    }

    const profession = await Profession.create({
      name,
      icon: icon || 'Wrench',
      description: description || ''
    });

    res.status(201).json({ success: true, message: 'تم إضافة المهنة بنجاح', data: profession });
  } catch (error) {
    next(error);
  }
};

// @desc    Update profession
// @route   PUT /api/professions/:id
// @access  Private (Admin)
export const updateProfession = async (req, res, next) => {
  try {
    const { name, icon, description } = req.body;

    if (!getIsDbConnected()) {
      const prof = memoryStore.professions.find((p) => p._id === req.params.id);
      if (!prof) return res.status(404).json({ success: false, message: 'المهنة غير موجودة' });
      if (name) prof.name = name;
      if (icon) prof.icon = icon;
      if (description !== undefined) prof.description = description;
      return res.status(200).json({ success: true, message: 'تم تحديث بيانات المهنة بنجاح', data: prof });
    }

    const profession = await Profession.findById(req.params.id);
    if (!profession) {
      return res.status(404).json({ success: false, message: 'المهنة المطلوبة غير موجودة' });
    }

    if (name) profession.name = name;
    if (icon) profession.icon = icon;
    if (description !== undefined) profession.description = description;

    await profession.save();
    res.status(200).json({ success: true, message: 'تم تحديث بيانات المهنة بنجاح', data: profession });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete profession
// @route   DELETE /api/professions/:id
// @access  Private (Admin)
export const deleteProfession = async (req, res, next) => {
  try {
    if (!getIsDbConnected()) {
      const index = memoryStore.professions.findIndex((p) => p._id === req.params.id);
      if (index === -1) return res.status(404).json({ success: false, message: 'المهنة غير موجودة' });
      memoryStore.professions.splice(index, 1);
      return res.status(200).json({ success: true, message: 'تم حذف المهنة بنجاح' });
    }

    const profession = await Profession.findById(req.params.id);
    if (!profession) {
      return res.status(404).json({ success: false, message: 'المهنة غير موجودة' });
    }

    const linkedProviders = await Provider.countDocuments({ profession: req.params.id });
    if (linkedProviders > 0) {
      return res.status(400).json({
        success: false,
        message: `لا يمكن حذف هذه المهنة لوجود (${linkedProviders}) مقدم خدمة مسجلين تحتها.`
      });
    }

    await profession.deleteOne();
    res.status(200).json({ success: true, message: 'تم حذف المهنة بنجاح' });
  } catch (error) {
    next(error);
  }
};
