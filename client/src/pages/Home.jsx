import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  Star, 
  Users, 
  CheckCircle2, 
  ShieldCheck, 
  PhoneCall, 
  ArrowLeft,
  Sparkles,
  Layers
} from 'lucide-react';
import api from '../services/api';
import DynamicIcon from '../components/DynamicIcon';
import ProviderCard from '../components/ProviderCard';

const Home = () => {
  const navigate = useNavigate();
  const [professions, setProfessions] = useState([]);
  const [topProviders, setTopProviders] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Search form states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProfession, setSelectedProfession] = useState('');
  const [selectedArea, setSelectedArea] = useState('');

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [profRes, topRes, statsRes] = await Promise.all([
          api.get('/professions'),
          api.get('/providers/top?limit=8'),
          api.get('/stats')
        ]);

        setProfessions(profRes.data.data || []);
        setTopProviders(topRes.data.data || []);
        setStats(statsRes.data.data || null);
      } catch (err) {
        console.error('Failed to load homepage data', err);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (selectedProfession) {
      navigate(`/professions/${selectedProfession}?search=${encodeURIComponent(searchQuery)}&area=${encodeURIComponent(selectedArea)}`);
    } else {
      // Find matching profession or general search
      navigate(`/professions/all?search=${encodeURIComponent(searchQuery)}&area=${encodeURIComponent(selectedArea)}`);
    }
  };

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-24 lg:pt-20 lg:pb-32 bg-gradient-to-b from-primary-50/70 via-white to-slate-50">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-100/70 text-primary-800 text-xs sm:text-sm font-bold shadow-2xs border border-primary-200">
              <Sparkles className="w-4 h-4 text-primary-600" />
              <span>دليلك الموثوق لجميع خدمات وحرف أبناء الكنيسة</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight sm:leading-none">
              ابحث عن أمهر <span className="text-primary-600">الفنيين والمهنيين</span> بالقرب منك
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              تصفح مئات الخدمات المعتمدة (سباكة، كهرباء، نجارة، صيانة، أطباء...) مع إمكانية التواصل الفوري عبر الهاتف أو واتساب ومراجعة آراء وتقييمات العملاء.
            </p>

            {/* Hero Search Box */}
            <form
              onSubmit={handleSearchSubmit}
              className="mt-8 p-3 sm:p-4 bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-3 text-right"
            >
              {/* Keyword / Name Search */}
              <div className="relative flex items-center">
                <Search className="w-5 h-5 text-slate-400 absolute right-3 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث بالاسم أو التخصص..."
                  className="w-full pr-10 pl-3 py-3 rounded-2xl bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-transparent focus:border-primary-500 focus:outline-none text-sm transition-all"
                />
              </div>

              {/* Profession Dropdown */}
              <div className="relative flex items-center">
                <Briefcase className="w-5 h-5 text-slate-400 absolute right-3 pointer-events-none" />
                <select
                  value={selectedProfession}
                  onChange={(e) => setSelectedProfession(e.target.value)}
                  className="w-full pr-10 pl-3 py-3 rounded-2xl bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-transparent focus:border-primary-500 focus:outline-none text-sm transition-all appearance-none cursor-pointer"
                >
                  <option value="">كل المهن والتخصصات</option>
                  {professions.map((prof) => (
                    <option key={prof._id} value={prof._id}>
                      {prof.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Area Input */}
              <div className="relative flex items-center">
                <MapPin className="w-5 h-5 text-slate-400 absolute right-3 pointer-events-none" />
                <input
                  type="text"
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  placeholder="المنطقة (شبرا، المعادي...)"
                  className="w-full pr-10 pl-3 py-3 rounded-2xl bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-transparent focus:border-primary-500 focus:outline-none text-sm transition-all"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full sm:col-span-3 md:col-span-1 py-3 px-6 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm shadow-md shadow-primary-500/20 hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" />
                بحث الآن
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Stats Counter Section */}
      {stats && (
        <section id="stats" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 sm:-mt-20">
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-lg shadow-slate-200/60 border border-slate-200/80 grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y sm:divide-y-0 sm:divide-x sm:divide-x-reverse divide-slate-100">
            <div className="space-y-1">
              <span className="text-3xl sm:text-4xl font-black text-primary-600 tracking-tight">
                {stats.totalProviders || 0}+
              </span>
              <p className="text-xs sm:text-sm font-bold text-slate-600">مقدم خدمة نشط</p>
            </div>
            <div className="space-y-1 pt-4 sm:pt-0">
              <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                {stats.totalProfessions || 0}
              </span>
              <p className="text-xs sm:text-sm font-bold text-slate-600">تخصص ومهنة مختلفة</p>
            </div>
            <div className="space-y-1 pt-4 sm:pt-0">
              <span className="text-3xl sm:text-4xl font-black text-emerald-600 tracking-tight">
                {stats.totalReviews || 0}
              </span>
              <p className="text-xs sm:text-sm font-bold text-slate-600">مراجعة معتمدة</p>
            </div>
            <div className="space-y-1 pt-4 sm:pt-0">
              <div className="flex items-center justify-center gap-1.5 text-3xl sm:text-4xl font-black text-amber-500">
                <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
                <span>{stats.averageRating || '5.0'}</span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-slate-600">متوسط رضا العملاء</p>
            </div>
          </div>
        </section>
      )}

      {/* Professions Grid Section */}
      <section id="professions" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary-600">
              التصنيفات والخدمات
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              تصفح حسب المهنة أو التخصص
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm">
            اختر التخصص المطلوب للاطلاع على قائمة كاملة بأصحاب المهن المتخصصين في منطقتك
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {professions.map((prof) => (
            <Link
              key={prof._id}
              to={`/professions/${prof._id}`}
              className="group p-5 bg-white rounded-2xl border border-slate-200/80 hover:border-primary-400 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col items-center text-center space-y-3"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary-50 group-hover:bg-primary-600 text-primary-600 group-hover:text-white flex items-center justify-center transition-colors shadow-xs">
                <DynamicIcon name={prof.icon} className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800 group-hover:text-primary-600 transition-colors">
                  {prof.name}
                </h3>
                <span className="text-xs text-slate-400 mt-1 inline-block">
                  {prof.providersCount || 0} مقدم خدمة
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Top Rated Providers Section */}
      <section id="top-providers" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
              المرشحون من المستخدمين
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              الأعلى تقييماً في المنصة
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            مقدمو خدمات حصلوا على أعلى تقييمات إيجابية من أفراد المجتمع
          </p>
        </div>

        {topProviders.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {topProviders.map((provider) => (
              <ProviderCard key={provider._id} provider={provider} />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-400">
            جاري تحميل مقدمي الخدمات...
          </div>
        )}
      </section>

      {/* Features & Values Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-primary-900 via-primary-800 to-slate-900 rounded-3xl p-8 sm:p-14 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-3xl space-y-6">
            <h3 className="text-2xl sm:text-3xl font-black">
              لماذا دليل خدمات أبناء الكنيسة؟
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 text-slate-200">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-primary-300">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-white text-base">أمانة وثقة</h4>
                <p className="text-xs leading-relaxed text-slate-300">
                  نهدف إلى تعزيز التعامل بروح الأمانة والشفافية وتوفير خيارات موثوقة لأبناء المجتمع.
                </p>
              </div>

              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-primary-300">
                  <Star className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-white text-base">تقييمات حقيقية</h4>
                <p className="text-xs leading-relaxed text-slate-300">
                  نظام تقييمات محمي ضد التكرار ومراجع إدارياً لضمان مصداقية الآراء وجودة التوصيات.
                </p>
              </div>

              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-primary-300">
                  <PhoneCall className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-white text-base">تواصل فوري</h4>
                <p className="text-xs leading-relaxed text-slate-300">
                  اتصال هاتفي ومحادثة واتساب مباشرة دون أي وسيط أو عمولات خفية.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
