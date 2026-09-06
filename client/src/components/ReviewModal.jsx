import React, { useState } from 'react';
import { X, Send, AlertCircle, CheckCircle2 } from 'lucide-react';
import StarRating from './StarRating';
import api from '../services/api';

const ReviewModal = ({ isOpen, onClose, provider, onReviewSubmitted }) => {
  const [userName, setUserName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!userName.trim() || !comment.trim()) {
      setError('يرجى ملء كافة الحقول (الاسم والتعليق)');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/reviews', {
        providerId: provider._id,
        userName,
        rating,
        comment
      });

      setSuccess(res.data.message || 'تم إرسال تقييمك بنجاح');
      setTimeout(() => {
        setUserName('');
        setComment('');
        setRating(5);
        setSuccess('');
        onClose();
        if (onReviewSubmitted) onReviewSubmitted();
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message || 'حدث خطأ أثناء إرسال التقييم، يرجى المحاولة لاحقاً'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              إضافة تقييم لـ: {provider?.name}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              شارك تجربتك لمساعدة الآخرين في اختيار الخدمة الأفضل
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="flex items-center gap-2 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-700">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-700">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {/* Star Selection */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              التقييم بالنجوم:
            </label>
            <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 w-fit">
              <StarRating
                rating={rating}
                interactive={true}
                onRatingChange={(r) => setRating(r)}
                size="w-7 h-7"
              />
              <span className="text-sm font-bold text-slate-700 px-2 py-0.5 bg-white border border-slate-200 rounded-lg">
                {rating} من 5
              </span>
            </div>
          </div>

          {/* User Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              اسمك الكريم:
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="مثال: يوسف ميخائيل"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm"
              required
            />
          </div>

          {/* Comment */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              رأيك أو تجربتك مع الخدمة:
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="اكتب ملاحظاتك عن جودة العمل، المواعيد، والأسعار..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm resize-none"
              required
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 transition-all shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              {loading ? 'جاري الإرسال...' : 'إرسال التقييم'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
