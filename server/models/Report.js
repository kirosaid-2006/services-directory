import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Provider',
      required: [true, 'معرف مقدم الخدمة مطلوب']
    },
    userName: {
      type: String,
      required: [true, 'اسم المبلغ مطلوب'],
      trim: true
    },
    message: {
      type: String,
      required: [true, 'تفاصيل البلاغ أو الشكوى مطلوبة'],
      trim: true
    },
    isResolved: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

const Report = mongoose.model('Report', reportSchema);
export default Report;
