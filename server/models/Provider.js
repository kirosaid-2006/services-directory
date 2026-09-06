import mongoose from 'mongoose';

const providerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'اسم مقدم الخدمة مطلوب'],
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'رقم الهاتف مطلوب'],
      trim: true
    },
    whatsapp: {
      type: String,
      default: '',
      trim: true
    },
    area: {
      type: String,
      required: [true, 'المنطقة أو المحافظة مطلوبة'],
      trim: true
    },
    profession: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Profession',
      required: [true, 'يرجى تحديد المهنة أو التخصص']
    },
    avgRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    reviewsCount: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Indexes for fast searching
providerSchema.index({ name: 'text', area: 'text' });
providerSchema.index({ profession: 1, isActive: 1 });
providerSchema.index({ avgRating: -1, reviewsCount: -1 });

const Provider = mongoose.model('Provider', providerSchema);
export default Provider;
