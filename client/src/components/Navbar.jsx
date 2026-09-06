import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Building2, 
  Search, 
  ShieldCheck, 
  Menu, 
  X, 
  LogOut, 
  LayoutDashboard,
  Sparkles
} from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary-700 to-primary-500 flex items-center justify-center text-white shadow-md shadow-primary-500/20 group-hover:scale-105 transition-transform duration-200">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-slate-900 group-hover:text-primary-600 transition-colors">
                  دليل خدمات الكنيسة
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                  <Sparkles className="w-3 h-3" /> موثق
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">المنصة الشاملة لخدمات وأصحاب المهن</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="text-sm font-semibold text-slate-700 hover:text-primary-600 transition-colors"
            >
              الرئيسية
            </Link>
            <a
              href="#professions"
              className="text-sm font-semibold text-slate-700 hover:text-primary-600 transition-colors"
            >
              تصفح المهن
            </a>
            <a
              href="#top-providers"
              className="text-sm font-semibold text-slate-700 hover:text-primary-600 transition-colors"
            >
              الأعلى تقييماً
            </a>
          </nav>

          {/* Admin & Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/admin/dashboard"
                  className="flex items-center gap-2 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-xl shadow-sm transition-all hover:shadow-md"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  لوحة التحكم ({user?.username})
                </Link>
                <button
                  onClick={handleLogout}
                  title="تسجيل الخروج"
                  className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors border border-slate-200"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/admin/login"
                className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-xl transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-slate-500" />
                دخول الإدارة
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-3">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-semibold text-slate-700 hover:bg-slate-50"
          >
            الرئيسية
          </Link>
          <a
            href="#professions"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-semibold text-slate-700 hover:bg-slate-50"
          >
            تصفح المهن
          </a>
          <a
            href="#top-providers"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-semibold text-slate-700 hover:bg-slate-50"
          >
            الأعلى تقييماً
          </a>

          <div className="pt-3 border-t border-slate-100">
            {isAuthenticated ? (
              <div className="space-y-2">
                <Link
                  to="/admin/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-primary-600"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  لوحة التحكم
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-rose-600 bg-rose-50"
                >
                  <LogOut className="w-4 h-4" />
                  تسجيل الخروج
                </button>
              </div>
            ) : (
              <Link
                to="/admin/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100"
              >
                <ShieldCheck className="w-4 h-4" />
                دخول الإدارة
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
