import mongoose from 'mongoose';

const professionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'اسم المهنة أو الخدمة مطلوب'],
      trim: true,
      unique: true
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true
    },
    icon: {
      type: String,
      default: 'Wrench', // Lucide icon identifier
      trim: true
    },
    description: {
      type: String,
      default: '',
      trim: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for count of providers
professionSchema.virtual('providersCount', {
  ref: 'Provider',
  localField: '_id',
  foreignField: 'profession',
  count: true
});

const Profession = mongoose.model('Profession', professionSchema);
export default Profession;
