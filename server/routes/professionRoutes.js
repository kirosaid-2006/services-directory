import express from 'express';
import {
  getProfessions,
  getProfessionById,
  createProfession,
  updateProfession,
  deleteProfession
} from '../controllers/professionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getProfessions)
  .post(protect, createProfession);

router.route('/:id')
  .get(getProfessionById)
  .put(protect, updateProfession)
  .delete(protect, deleteProfession);

export default router;
