import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  Users,
  Briefcase,
  Star,
  AlertTriangle,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Search,
  CheckCircle2,
  AlertCircle,
  Phone,
  MessageSquare,
  MapPin,
  RefreshCw
} from 'lucide-react';
import DynamicIcon from '../components/DynamicIcon';
import StarRating from '../components/StarRating';

const AdminDashboard = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ type: '', message: '' });

  // Data states
  const [providers, setProviders] = useState([]);
  const [professions, setProfessions] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reports, setReports] = useState([]);

  // Modal states
  const [providerModal, setProviderModal] = useState({ open: false, isEdit: false, data: null });
  const [professionModal, setProfessionModal] = useState({ open: false, isEdit: false, data: null });

  // Search filter
  const [searchTerm, setSearchTerm] = useState('');

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert({ type: '', message: '' }), 4000);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [sRes, pRes, profRes, revRes, repRes] = await Promise.all([
        api.get('/stats'),
        api.get('/providers?all=true'),
        api.get('/professions'),
        api.get('/reviews'),
        api.get('/reports')
      ]);

      setStats(sRes.data.data);
      setProviders(pRes.data.data);
      setProfessions(profRes.data.data);
      setReviews(revRes.data.data);
      setReports(repRes.data.data);
    } catch (err) {
      console.error('Failed to load dashboard data', err);
      showAlert('error', 'حدث خطأ أثناء تحميل بيانات لوحة التحكم');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/admin/login');
      return;
    }
    if (isAuthenticated) {
      loadData();
    }
  }, [authLoading, isAuthenticated, navigate]);

  // Provider CRUD Handlers
  const handleSaveProvider = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = {
      name: formData.get('name'),
      phone: formData.get('phone'),
      whatsapp: formData.get('whatsapp'),
      area: formData.get('area'),
      profession: formData.get('profession'),
      isActive: formData.get('isActive') === 'on'
    };

    try {
      if (providerModal.isEdit) {
        await api.put(`/providers/${providerModal.data._id}`, payload);
        showAlert('success', 'تم تعديل بيانات مقدم الخدمة بنجاح');
      } else {
        await api.post('/providers', payload);
        showAlert('success', 'تم إضافة مقدم الخدمة بنجاح');
      }
      setProviderModal({ open: false, isEdit: false, data: null });
      loadData();
    } catch (err) {
      showAlert('error', err.response?.data?.message || 'فشل حفظ بيانات مقدم الخدمة');
    }
  };

  const handleDeleteProvider = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف مقدم الخدمة هذا وجميع مراجعاته؟')) return;
    try {
      await api.delete(`/providers/${id}`);
      showAlert('success', 'تم حذف مقدم الخدمة بنجاح');
      loadData();
    } catch (err) {
      showAlert('error', 'فشل حذف مقدم الخدمة');
    }
  };

  // Profession CRUD Handlers
  const handleSaveProfession = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = {
      name: formData.get('name'),
      icon: formData.get('icon'),
      description: formData.get('description')
    };

    try {
      if (professionModal.isEdit) {
        await api.put(`/professions/${professionModal.data._id}`, payload);
        showAlert('success', 'تم تعديل المهنة بنجاح');
      } else {
        await api.post('/professions', payload);
        showAlert('success', 'تم إضافة المهنة بنجاح');
      }
      setProfessionModal({ open: false, isEdit: false, data: null });
      loadData();
    } catch (err) {
      showAlert('error', err.response?.data?.message || 'فشل حفظ المهنة');
    }
  };

  const handleDeleteProfession = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه المهنة؟')) return;
    try {
      await api.delete(`/professions/${id}`);
      showAlert('success', 'تم حذف المهنة بنجاح');
      loadData();
    } catch (err) {
      showAlert('error', err.response?.data?.message || 'فشل حذف المهنة');
    }
  };

  // Review Moderation
  const handleApproveReview = async (id) => {
    try {
      await api.patch(`/reviews/${id}/approve`);
      showAlert('success', 'تم اعتماد ونشر التقييم بنجاح');
      loadData();
    } catch (err) {
      showAlert('error', 'فشل اعتماد التقييم');
    }
  };

  const handleDeleteReview = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا التقييم؟')) return;
    try {
      await api.delete(`/reviews/${id}`);
      showAlert('success', 'تم حذف التقييم');
      loadData();
    } catch (err) {
      showAlert('error', 'فشل حذف التقييم');
    }
  };

  // Report Resolution
  const handleToggleReport = async (id) => {
    try {
      const res = await api.patch(`/reports/${id}/resolve`);
      showAlert('success', res.data.message);
      loadData();
    } catch (err) {
      showAlert('error', 'فشل تغيير حالة البلاغ');
    }
  };

  const handleDeleteReport = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا البلاغ؟')) return;
    try {
      await api.delete(`/reports/${id}`);
      showAlert('success', 'تم حذف البلاغ');
      loadData();
    } catch (err) {
      showAlert('error', 'فشل حذف البلاغ');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-400">
        جاري تحميل بيانات لوحة التحكم...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900">
            لوحة الإدارة والتحكم (Admin Dashboard)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            مرحباً بك يا <span className="font-bold text-slate-800">{user?.username}</span> • إدارة المهن، الفنيين، التقييمات والبلاغات
          </p>
        </div>
        <button
          onClick={loadData}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          تحديث البيانات
        </button>
      </div>

      {/* Global Alert */}
      {alert.message && (
        <div
          className={`flex items-center gap-2 p-4 rounded-2xl text-xs font-bold ${
            alert.type === 'error'
              ? 'bg-rose-50 text-rose-700 border border-rose-200'
              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
          }`}
        >
          {alert.type === 'error' ? (
            <AlertCircle className="w-4 h-4 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          )}
          <span>{alert.message}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto gap-2 p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200 text-xs sm:text-sm font-bold">
        {[
          { id: 'overview', label: 'نظرة عامة', icon: Briefcase },
          { id: 'providers', label: `مقدمو الخدمات (${providers.length})`, icon: Users },
          { id: 'professions', label: `المهن (${professions.length})`, icon: Briefcase },
          { id: 'reviews', label: `التقييمات (${reviews.filter(r => !r.isApproved).length} معلق)`, icon: Star },
          { id: 'reports', label: `البلاغات (${reports.filter(r => !r.isResolved).length} مفتوح)`, icon: AlertTriangle }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-2">
              <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-3xl font-black text-slate-900">{stats?.totalProviders || 0}</span>
              <p className="text-xs font-semibold text-slate-500">إجمالي مقدمي الخدمات النشطين</p>
            </div>

            <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-2">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Briefcase className="w-5 h-5" />
              </div>
              <span className="text-3xl font-black text-slate-900">{stats?.totalProfessions || 0}</span>
              <p className="text-xs font-semibold text-slate-500">المهن والتخصصات المسجلة</p>
            </div>

            <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Star className="w-5 h-5" />
              </div>
              <span className="text-3xl font-black text-amber-600">{stats?.pendingReviews || 0}</span>
              <p className="text-xs font-semibold text-slate-500">تقييمات معلقة بانتظار الموافقة</p>
            </div>

            <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-2">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <span className="text-3xl font-black text-rose-600">{stats?.unresolvedReports || 0}</span>
              <p className="text-xs font-semibold text-slate-500">بلاغات وشكاوى غير محلولة</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PROVIDERS MANAGEMENT */}
      {activeTab === 'providers' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="بحث في مقدمي الخدمات..."
                className="w-full pr-9 pl-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-primary-500"
              />
            </div>

            <button
              onClick={() => setProviderModal({ open: true, isEdit: false, data: null })}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              إضافة مقدم خدمة جديد
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 text-slate-600 border-y border-slate-200">
                <tr>
                  <th className="py-3 px-4">الاسم</th>
                  <th className="py-3 px-4">المهنة</th>
                  <th className="py-3 px-4">المنطقة</th>
                  <th className="py-3 px-4">الهاتف / واتساب</th>
                  <th className="py-3 px-4">التقييم</th>
                  <th className="py-3 px-4">الحالة</th>
                  <th className="py-3 px-4 text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {providers
                  .filter((p) => !searchTerm || p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.area.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((provider) => (
                    <tr key={provider._id} className="hover:bg-slate-50/80">
                      <td className="py-3 px-4 font-bold text-slate-900">{provider.name}</td>
                      <td className="py-3 px-4 text-slate-600">{provider.profession?.name || '—'}</td>
                      <td className="py-3 px-4 text-slate-600">{provider.area}</td>
                      <td className="py-3 px-4 text-slate-600">
                        {provider.phone} {provider.whatsapp ? `(${provider.whatsapp})` : ''}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-800">{provider.avgRating?.toFixed(1) || '0.0'}</span>
                        <span className="text-slate-400 text-[11px]"> ({provider.reviewsCount})</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                          provider.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {provider.isActive ? 'نشط' : 'معطل'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center space-x-2 space-x-reverse">
                        <button
                          onClick={() => setProviderModal({ open: true, isEdit: true, data: provider })}
                          className="p-1.5 text-slate-600 hover:text-primary-600 hover:bg-slate-100 rounded-lg transition-colors"
                          title="تعديل"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProvider(provider._id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="حذف"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: PROFESSIONS MANAGEMENT */}
      {activeTab === 'professions' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-sm">قائمة المهن والتخصصات المتاحة</h3>
            <button
              onClick={() => setProfessionModal({ open: true, isEdit: false, data: null })}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold"
            >
              <Plus className="w-4 h-4" />
              إضافة مهنة جديدة
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 text-slate-600 border-y border-slate-200">
                <tr>
                  <th className="py-3 px-4">الأيقونة</th>
                  <th className="py-3 px-4">اسم المهنة</th>
                  <th className="py-3 px-4">الوصف</th>
                  <th className="py-3 px-4">عدد مقدمي الخدمة</th>
                  <th className="py-3 px-4 text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {professions.map((prof) => (
                  <tr key={prof._id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-4">
                      <div className="w-8 h-8 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center">
                        <DynamicIcon name={prof.icon} className="w-4 h-4" />
                      </div>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">{prof.name}</td>
                    <td className="py-3 px-4 text-slate-500 max-w-xs truncate">{prof.description || '—'}</td>
                    <td className="py-3 px-4 font-bold text-slate-700">{prof.providersCount || 0}</td>
                    <td className="py-3 px-4 text-center space-x-2 space-x-reverse">
                      <button
                        onClick={() => setProfessionModal({ open: true, isEdit: true, data: prof })}
                        className="p-1.5 text-slate-600 hover:text-primary-600 hover:bg-slate-100 rounded-lg transition-colors"
                        title="تعديل"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProfession(prof._id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="حذف"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: REVIEWS MODERATION */}
      {activeTab === 'reviews' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h3 className="font-bold text-slate-800 text-sm">مراجعة واعتماد التقييمات</h3>
          <div className="space-y-3">
            {reviews.map((rev) => (
              <div
                key={rev._id}
                className={`p-4 rounded-2xl border transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  rev.isApproved ? 'bg-white border-slate-200' : 'bg-amber-50/50 border-amber-200'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-xs text-slate-900">{rev.userName}</span>
                    <span className="text-slate-400 text-xs">عن الفني:</span>
                    <span className="font-bold text-xs text-primary-700">{rev.provider?.name || 'مقدم خدمة'}</span>
                    <StarRating rating={rev.rating} size="w-3.5 h-3.5" />
                  </div>
                  <p className="text-xs text-slate-600">"{rev.comment}"</p>
                  <span className="text-[10px] text-slate-400">
                    تاريخ: {new Date(rev.createdAt).toLocaleDateString('ar-EG')} • IP: {rev.ipAddress || '—'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {!rev.isApproved && (
                    <button
                      onClick={() => handleApproveReview(rev._id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                      اعتماد
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteReview(rev._id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    حذف
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: REPORTS */}
      {activeTab === 'reports' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h3 className="font-bold text-slate-800 text-sm">البلاغات والشكاوى المقدمة</h3>
          <div className="space-y-3">
            {reports.map((rep) => (
              <div
                key={rep._id}
                className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  rep.isResolved ? 'bg-slate-50 border-slate-200 opacity-75' : 'bg-rose-50/50 border-rose-200'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-xs text-slate-900">المُبلّغ: {rep.userName}</span>
                    <span className="text-slate-400 text-xs">ضد:</span>
                    <span className="font-bold text-xs text-rose-700">{rep.provider?.name || 'مقدم خدمة'}</span>
                  </div>
                  <p className="text-xs text-slate-700 font-medium">"{rep.message}"</p>
                  <span className="text-[10px] text-slate-400">
                    تاريخ: {new Date(rep.createdAt).toLocaleDateString('ar-EG')}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleReport(rep._id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      rep.isResolved
                        ? 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    {rep.isResolved ? 'إعادة فتح' : 'تعيين كمحلول'}
                  </button>
                  <button
                    onClick={() => handleDeleteReport(rep._id)}
                    className="p-1.5 text-rose-600 hover:bg-rose-100 rounded-xl transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Provider Add/Edit Modal */}
      {providerModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 space-y-5 border border-slate-200 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">
                {providerModal.isEdit ? 'تعديل بيانات مقدم الخدمة' : 'إضافة مقدم خدمة جديد'}
              </h3>
              <button
                onClick={() => setProviderModal({ open: false, isEdit: false, data: null })}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProvider} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">الاسم الكامل:</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={providerModal.data?.name || ''}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:border-primary-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">رقم الهاتف:</label>
                  <input
                    type="text"
                    name="phone"
                    defaultValue={providerModal.data?.phone || ''}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:border-primary-500 focus:outline-none"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">رقم واتساب:</label>
                  <input
                    type="text"
                    name="whatsapp"
                    defaultValue={providerModal.data?.whatsapp || ''}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:border-primary-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">المنطقة / المحافظة:</label>
                  <input
                    type="text"
                    name="area"
                    defaultValue={providerModal.data?.area || ''}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:border-primary-500 focus:outline-none"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">المهنة أو التخصص:</label>
                  <select
                    name="profession"
                    defaultValue={providerModal.data?.profession?._id || providerModal.data?.profession || ''}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:border-primary-500 focus:outline-none"
                    required
                  >
                    <option value="">اختر المهنة...</option>
                    {professions.map((prof) => (
                      <option key={prof._id} value={prof._id}>
                        {prof.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  name="isActive"
                  id="isActive"
                  defaultChecked={providerModal.data ? providerModal.data.isActive : true}
                  className="rounded text-primary-600"
                />
                <label htmlFor="isActive" className="font-bold text-slate-700">حساب نشط ومتاح في الدليل</label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setProviderModal({ open: false, isEdit: false, data: null })}
                  className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-xl"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 shadow-sm"
                >
                  حفظ البيانات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Profession Add/Edit Modal */}
      {professionModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 space-y-5 border border-slate-200 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">
                {professionModal.isEdit ? 'تعديل المهنة' : 'إضافة مهنة جديدة'}
              </h3>
              <button
                onClick={() => setProfessionModal({ open: false, isEdit: false, data: null })}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfession} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">اسم المهنة:</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={professionModal.data?.name || ''}
                  placeholder="مثال: سباكة وصحي"
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:border-primary-500 focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">اسم أيقونة Lucide:</label>
                <select
                  name="icon"
                  defaultValue={professionModal.data?.icon || 'Wrench'}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:border-primary-500 focus:outline-none"
                >
                  <option value="Wrench">Wrench (سباكة / ميكانيكا)</option>
                  <option value="Zap">Zap (كهرباء)</option>
                  <option value="Hammer">Hammer (نجارة / بناء)</option>
                  <option value="Paintbrush">Paintbrush (نقاشة ودهانات)</option>
                  <option value="Wind">Wind (تكييف وتبريد)</option>
                  <option value="Stethoscope">Stethoscope (طب ورعاية صحية)</option>
                  <option value="Cpu">Cpu (صيانة أجهزة إلكترونية)</option>
                  <option value="GraduationCap">GraduationCap (تعليم ومدرسين)</option>
                  <option value="Truck">Truck (نقل وشحن)</option>
                  <option value="Scale">Scale (محاماة واستشارات)</option>
                  <option value="Scissors">Scissors (خياطة وتطريز)</option>
                  <option value="Camera">Camera (تصوير وميديا)</option>
                  <option value="Car">Car (خدمات سيارات)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">وصف مختصر:</label>
                <textarea
                  name="description"
                  rows={3}
                  defaultValue={professionModal.data?.description || ''}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:border-primary-500 focus:outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setProfessionModal({ open: false, isEdit: false, data: null })}
                  className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-xl"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 shadow-sm"
                >
                  حفظ المهنة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
