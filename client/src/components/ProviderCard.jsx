import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, MessageSquare, MapPin, UserCheck, ArrowLeft } from 'lucide-react';
import StarRating from './StarRating';
import DynamicIcon from './DynamicIcon';

const ProviderCard = ({ provider }) => {
  if (!provider) return null;

  // Clean whatsapp phone (remove non-digits, prepend country code if needed)
  const formatWhatsappLink = (phone) => {
    let clean = (phone || '').replace(/\D/g, '');
    if (clean.startsWith('0')) {
      clean = '2' + clean; // Egypt prefix default
    }
    return `https://wa.me/${clean}`;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:border-primary-300">
      <div className="p-6 space-y-4">
        {/* Header: Profession Tag & Active Status */}
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary-50 text-primary-700 border border-primary-200/60">
            <DynamicIcon
              name={provider.profession?.icon || 'Wrench'}
              className="w-3.5 h-3.5 text-primary-600"
            />
            {provider.profession?.name || 'خدمة عامة'}
          </span>

          <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
            <UserCheck className="w-3 h-3" /> متاح
          </span>
        </div>

        {/* Provider Name */}
        <div>
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary-600 transition-colors">
            <Link to={`/providers/${provider._id}`}>
              {provider.name}
            </Link>
          </h3>
          <p className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>{provider.area}</span>
          </p>
        </div>

        {/* Ratings */}
        <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
          <StarRating rating={provider.avgRating || 0} size="w-4 h-4" />
          <span className="text-xs font-bold text-slate-700">
            {(provider.avgRating || 0).toFixed(1)}
          </span>
          <span className="text-xs text-slate-400">
            ({provider.reviewsCount || 0} تقييم)
          </span>
        </div>
      </div>

      {/* Action Buttons Footer */}
      <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center gap-2">
        {/* Call Button */}
        <a
          href={`tel:${provider.phone}`}
          className="flex-1 inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 hover:text-primary-600 transition-all shadow-2xs"
        >
          <Phone className="w-3.5 h-3.5 text-primary-600" />
          اتصال
        </a>

        {/* WhatsApp Button */}
        {provider.whatsapp && (
          <a
            href={formatWhatsappLink(provider.whatsapp)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-all shadow-2xs"
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
            واتساب
          </a>
        )}

        {/* Details link */}
        <Link
          to={`/providers/${provider._id}`}
          title="عرض الملف الكامل والتقييمات"
          className="p-2 rounded-xl text-slate-400 hover:text-primary-600 hover:bg-white border border-transparent hover:border-slate-200 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default ProviderCard;
