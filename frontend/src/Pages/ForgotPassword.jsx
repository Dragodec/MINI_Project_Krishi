import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ShieldCheck, Key, ArrowLeft, RefreshCw } from 'lucide-react';
import { toast } from 'react-hot-toast';
import axiosInstance from '../API/axiosInstance';

import { useLanguage } from '../Context/LanguageContext';
import { TRANSLATIONS } from '../Constants/Translations';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = TRANSLATIONS[language].forgotPassword;

  const [step, setStep] = useState(1); // 1: Request OTP, 2: Reset Password
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    if (!formData.email) return toast.error(t.toasts.enterEmail);

    setLoading(true);
    try {
      const res = await axiosInstance.post('/auth/forgot-password', { email: formData.email });
      toast.success(res.data.message || t.toasts.otpSent);
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.error || t.toasts.userNotFound);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    const { email, otp, newPassword, confirmPassword } = formData;

    if (!otp || !newPassword) return toast.error(t.toasts.fieldsRequired);
    if (newPassword !== confirmPassword) return toast.error(t.toasts.mismatch);
    if (newPassword.length < 8) return toast.error(t.toasts.length);

    setLoading(true);
    try {
      await axiosInstance.post('/auth/reset-password', { email, otp, newPassword });
      toast.success(t.toasts.success);
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.error || t.toasts.invalidOtp);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-xl overflow-hidden border border-stone-100">
        <div className="bg-slate-800 p-8 text-white text-center">
          <div className="bg-white/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Key size={32} />
          </div>
          <h2 className="text-2xl font-bold">{t.title}</h2>
          <p className="text-slate-300 mt-2 text-sm">
            {step === 1 ? t.step1Sub : t.step2Sub}
          </p>
        </div>

        <div className="p-8">
          {step === 1 ? (
            <form onSubmit={handleRequestOTP} className="space-y-6">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-500 ml-1">{t.labels.email}</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 text-slate-400" size={18} />
                  <input
                    type="email"
                    placeholder={t.placeholders.email}
                    className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-slate-500 outline-none transition"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <button
                disabled={loading}
                className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-4 rounded-xl shadow-lg transition active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {loading ? t.buttons.sending : t.buttons.sendCode}
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-500 ml-1">{t.labels.otp}</label>
                <div className="relative">
                  <ShieldCheck className="absolute left-3 top-3.5 text-slate-400" size={18} />
                  <input
                    type="text"
                    placeholder={t.placeholders.otp}
                    className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition"
                    value={formData.otp}
                    onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-500 ml-1">{t.labels.newPassword}</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 text-slate-400" size={18} />
                  <input
                    type="password"
                    placeholder={t.placeholders.newPassword}
                    className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition"
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-500 ml-1">{t.labels.confirmPassword}</label>
                <div className="relative">
                  <RefreshCw className="absolute left-3 top-3.5 text-slate-400" size={18} />
                  <input
                    type="password"
                    placeholder={t.placeholders.confirmPassword}
                    className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  />
                </div>
              </div>

              <button
                disabled={loading}
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-4 rounded-xl shadow-lg transition active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {loading ? t.buttons.updating : t.buttons.update}
              </button>
            </form>
          )}

          <Link to="/login" className="mt-6 flex items-center justify-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800 transition">
            <ArrowLeft size={16} />
            {t.buttons.back}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;