import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Phone, 
  MessageSquare, 
  MapPin, 
  Star, 
  ShieldAlert, 
  ArrowRight, 
  CheckCircle2, 
  User, 
  Calendar
} from 'lucide-react';
import api from '../services/api';
import DynamicIcon from '../components/DynamicIcon';
import StarRating from '../components/StarRating';
import ReviewModal from '../components/ReviewModal';
import ReportModal from '../components/ReportModal';

const ProviderDetail = () => {
  const { id } = useParams();
  const [provider, setProvider] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const fetchProvider = async () => {
    try {
      const res = await api.get(`/providers/${id}`);
      setProvider(res.data.data.provider);
      setReviews(res.data.data.reviews || []);
    } catch (err) {
      console.error('Failed to load provider profile', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProvider();
  }, [id]);

  const formatWhatsappLink = (phone) => {
    let clean = (phone || '').replace(/\D/g, '');
    if (clean.startsWith('0')) clean = '2' + clean;
    return `https://wa.me/${clean}`;
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-slate-400">
        جاري تحميل ملف مقدم الخدمة...
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">مقدم الخدمة غير موجود</h2>
        <Link to="/" className="inline-flex items-center gap-2 text-primary-600 font-bold text-sm">
          <ArrowRight className="w-4 h-4" />
          العودة للرئيسية
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link to="/" className="hover:text-primary-600 transition-colors">الرئيسية</Link>
        <span>/</span>
        <Link to={`/professions/${provider.profession?._id}`} className="hover:text-primary-600 transition-colors">
          {provider.profession?.name}
        </Link>
        <span>/</span>
        <span className="text-slate-800 font-bold">{provider.name}</span>
      </div>

      {/* Profile Overview Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-8 border-b border-slate-100">
          <div className="flex items-start gap-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-primary-600 to-primary-400 text-white flex items-center justify-center shadow-md shadow-primary-500/20 shrink-0">
              <DynamicIcon name={provider.profession?.icon || 'User'} className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                  {provider.name}
                </h1>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" /> نشط ومعتمد
                </span>
              </div>
              <p className="flex items-center gap-2 text-sm text-slate-600">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span>المنطقة: {provider.area}</span>
                <span className="text-slate-300">•</span>
                <span>التخصص: {provider.profession?.name}</span>
              </p>
              {/* Rating summary */}
              <div className="flex items-center gap-2 pt-1">
                <StarRating rating={provider.avgRating || 0} size="w-5 h-5" />
                <span className="text-base font-black text-slate-800">
                  {(provider.avgRating || 0).toFixed(1)}
                </span>
                <span className="text-xs text-slate-400">
                  ({provider.reviewsCount || 0} تقييم معتمد)
                </span>
              </div>
            </div>
          </div>

          {/* Report Button */}
          <button
            onClick={() => setIsReportModalOpen(true)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200 transition-colors"
          >
            <ShieldAlert className="w-4 h-4" />
            إبلاغ عن مشكلة
          </button>
        </div>

        {/* Quick Contact Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <a
            href={`tel:${provider.phone}`}
            className="flex items-center justify-center gap-3 py-3.5 px-6 rounded-2xl text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 shadow-md shadow-primary-500/20 hover:shadow-lg transition-all"
          >
            <Phone className="w-5 h-5" />
            اتصال هاتفي ({provider.phone})
          </a>

          {provider.whatsapp && (
            <a
              href={formatWhatsappLink(provider.whatsapp)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 py-3.5 px-6 rounded-2xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-500/20 hover:shadow-lg transition-all"
            >
              <MessageSquare className="w-5 h-5" />
              محادثة واتساب مباشرة
            </a>
          )}
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              تقييمات وتجارب العملاء
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              آراء حقيقية من أشخاص تعاملوا مع مقدم الخدمة
            </p>
          </div>

          <button
            onClick={() => setIsReviewModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 transition-all shadow-sm"
          >
            <Star className="w-4 h-4" />
            أضف تقييمك
          </button>
        </div>

        {/* Reviews List */}
        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((rev) => (
              <div
                key={rev._id}
                className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs">
                      {rev.userName?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">{rev.userName}</h4>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(rev.createdAt).toLocaleDateString('ar-EG')}</span>
                      </div>
                    </div>
                  </div>
                  <StarRating rating={rev.rating} size="w-4 h-4" />
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
                  "{rev.comment}"
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-10 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
            <Star className="w-8 h-8 text-slate-300 mx-auto" />
            <h4 className="text-sm font-bold text-slate-700">لا توجد تقييمات منشورة حتى الآن</h4>
            <p className="text-xs text-slate-400">كن أول من يشارك تجربته مع هذا الفني!</p>
          </div>
        )}
      </div>

      {/* Review Modal */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        provider={provider}
        onReviewSubmitted={fetchProvider}
      />

      {/* Report Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        provider={provider}
      />
    </div>
  );
};

export default ProviderDetail;
