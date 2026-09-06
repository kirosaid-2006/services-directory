import express from 'express';
import {
  getProviders,
  getTopProviders,
  getProviderById,
  createProvider,
  updateProvider,
  deleteProvider
} from '../controllers/providerController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getProviders)
  .post(protect, createProvider);

router.get('/top', getTopProviders);

router.route('/:id')
  .get(getProviderById)
  .put(protect, updateProvider)
  .delete(protect, deleteProvider);

export default router;
