import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ArrowRight, LogIn } from 'lucide-react';
import { toast } from 'react-hot-toast';
import axiosInstance from '../API/axiosInstance';

import { useLanguage } from '../Context/LanguageContext';
import { TRANSLATIONS } from '../Constants/Translations';

const Login = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = TRANSLATIONS[language].login;

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return toast.error(t.toasts.required);
    }

    setLoading(true);
    try {
      // The backend will attach the 'token' cookie automatically upon success
      const res = await axiosInstance.post('/auth/login', formData);
      
      // We only store the 'role' for UI rendering logic.
      // The actual authentication is now handled by the browser-managed HttpOnly cookie.
      localStorage.setItem('role', res.data.role);
      
      toast.success(t.toasts.success);
      navigate('/dashboard');
    } catch (err) {
      const errorMsg = err.response?.data?.error || t.toasts.fail;
      toast.error(errorMsg);
      
      // Logic for unverified users
      if (errorMsg.toLowerCase().includes("verify email")) {
        // You could navigate to a verification page if you have one
        // navigate('/verify-otp', { state: { email: formData.email } });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-xl overflow-hidden border border-stone-100">
        <div className="bg-emerald-800 p-8 text-white text-center">
          <div className="bg-white/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <LogIn size={32} />
          </div>
          <h2 className="text-2xl font-bold">{t.title}</h2>
          <p className="text-emerald-100 mt-2 text-sm opacity-90">{t.subtitle}</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-slate-500 ml-1">{t.labels.email}</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 text-slate-400" size={18} />
                <input
                  type="email"
                  placeholder={t.placeholders.email}
                  className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-bold uppercase text-slate-500">{t.labels.password}</label>
                <Link to="/forgot-password" size="sm" className="text-xs font-bold text-emerald-700 hover:text-emerald-600">
                  {t.labels.forgot}
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 text-slate-400" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder={t.placeholders.password}
                  className="w-full pl-10 pr-12 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-slate-400 hover:text-emerald-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-4 rounded-xl shadow-lg transition active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {loading ? t.buttons.authenticating : t.buttons.signIn}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-stone-100 text-center">
            <p className="text-slate-500 text-sm">
              {t.footer.new}{' '}
              <Link to="/signup" className="text-emerald-700 font-bold hover:underline">
                {t.footer.link}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;