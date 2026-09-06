import React from 'react';
import { Heart, Building2, ShieldCheck, Mail, PhoneCall } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Brand */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center text-white">
                <Building2 className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                دليل خدمات أبناء الكنيسة
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-md">
              منصة رقمية لتوثيق وتسهيل الوصول إلى أصحاب الحرف والمهن والخدمات المتنوعة،
              بهدف تشجيع ودعم الأعمال والخدمات بروح المحبة والأمانة والجودة.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 w-fit px-3 py-1.5 rounded-lg">
              <ShieldCheck className="w-4 h-4" />
              <span>بيانات موثوقة ومراجعة بإشراف إداري دوري</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              روابط سريعة
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <a href="#professions" className="hover:text-primary-400 transition-colors">
                  قائمة المهن والتخصصات
                </a>
              </li>
              <li>
                <a href="#top-providers" className="hover:text-primary-400 transition-colors">
                  أعلى مقدمي الخدمات تقييماً
                </a>
              </li>
              <li>
                <a href="#stats" className="hover:text-primary-400 transition-colors">
                  إحصائيات المنصة
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Support */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              الدعم والاستفسارات
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              إذا كنت صاحب مهنة وترغب في إدراج خدماتك أو تعديل بياناتك، يرجى التواصل مع إدارة المنصة.
            </p>
            <div className="pt-2 text-xs text-slate-400 space-y-1.5">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary-400" />
                <span>support@community-services.org</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} دليل خدمات أبناء الكنيسة - جميع الحقوق محفوظة.</p>
          <p className="flex items-center gap-1">
            تم التطوير بحب وإتقان <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> كمنصة MERN متكاملة
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
