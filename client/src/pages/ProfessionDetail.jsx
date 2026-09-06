import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { 
  Briefcase, 
  Search, 
  MapPin, 
  ArrowRight, 
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import api from '../services/api';
import DynamicIcon from '../components/DynamicIcon';
import ProviderCard from '../components/ProviderCard';

const ProfessionDetail = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  const [profession, setProfession] = useState(null);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Sorting
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [areaQuery, setAreaQuery] = useState(searchParams.get('area') || '');
  const [sortBy, setSortBy] = useState('rating'); // 'rating' or 'reviews'

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (id === 'all') {
          // Fetch all providers
          const res = await api.get('/providers');
          setProfession({ name: 'جميع المهن والخدمات', icon: 'Briefcase' });
          setProviders(res.data.data || []);
        } else {
          // Fetch specific profession
          const res = await api.get(`/professions/${id}`);
          setProfession(res.data.data.profession);
          setProviders(res.data.data.providers || []);
        }
      } catch (err) {
        console.error('Failed to load profession details', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Client-side filtering
  const filteredProviders = providers
    .filter((p) => {
      const matchSearch =
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.area.toLowerCase().includes(searchQuery.toLowerCase());

      const matchArea =
        !areaQuery ||
        p.area.toLowerCase().includes(areaQuery.toLowerCase());

      return matchSearch && matchArea;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') {
        return (b.avgRating || 0) - (a.avgRating || 0);
      }
      return (b.reviewsCount || 0) - (a.reviewsCount || 0);
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link to="/" className="hover:text-primary-600 transition-colors flex items-center gap-1">
          <ArrowRight className="w-3.5 h-3.5" />
          الرئيسية
        </Link>
        <span>/</span>
        <span className="text-slate-800 font-bold">{profession?.name || 'الخدمات'}</span>
      </div>

      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center shadow-xs">
            <DynamicIcon
              name={profession?.icon || 'Briefcase'}
              className="w-8 h-8"
            />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              {profession?.name || 'جاري التحميل...'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              مقدمو الخدمات المتاحين: ({filteredProviders.length}) فني ومهني معتمد
            </p>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Name Search */}
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث بالاسم..."
            className="w-full pr-9 pl-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-primary-500 focus:outline-none text-xs sm:text-sm"
          />
        </div>

        {/* Area Filter */}
        <div className="relative flex items-center">
          <MapPin className="w-4 h-4 text-slate-400 absolute right-3 pointer-events-none" />
          <input
            type="text"
            value={areaQuery}
            onChange={(e) => setAreaQuery(e.target.value)}
            placeholder="تصفية حسب المنطقة..."
            className="w-full pr-9 pl-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-primary-500 focus:outline-none text-xs sm:text-sm"
          />
        </div>

        {/* Sort Dropdown */}
        <div className="relative flex items-center">
          <SlidersHorizontal className="w-4 h-4 text-slate-400 absolute right-3 pointer-events-none" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full pr-9 pl-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-primary-500 focus:outline-none text-xs sm:text-sm appearance-none cursor-pointer"
          >
            <option value="rating">ترتيب حسب: الأعلى تقييماً</option>
            <option value="reviews">ترتيب حسب: الأكثر عدداً في التقييمات</option>
          </select>
        </div>
      </div>

      {/* Providers Grid */}
      {loading ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-slate-200 text-slate-400">
          جاري تحميل القائمة...
        </div>
      ) : filteredProviders.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProviders.map((provider) => (
            <ProviderCard key={provider._id} provider={provider} />
          ))}
        </div>
      ) : (
        <div className="p-16 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">لا يوجد مقدمو خدمات يطابقون بحثك</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            جرب تغيير كلمات البحث أو اسم المنطقة للعثور على مقدمي خدمات آخرين
          </p>
        </div>
      )}
    </div>
  );
};

export default ProfessionDetail;
