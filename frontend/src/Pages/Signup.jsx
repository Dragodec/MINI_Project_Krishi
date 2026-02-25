import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, ShieldCheck } from 'lucide-react';
import { toast } from 'react-hot-toast';
import axiosInstance from '../API/axiosInstance';
import { useLanguage } from '../Context/LanguageContext';

const Signup = () => {
  const navigate = useNavigate();
  const { language } = useLanguage(); // Ready for future i18n implementation
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1); 
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    otp: ''
  });

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // STEP 1: Register and request OTP
  const handleRegister = async (e) => {
    e.preventDefault();
    const { name, email, password } = formData;

    if (!name || !email || !password) return toast.error("Please fill all fields");
    if (!validateEmail(email)) return toast.error("Invalid email format");
    if (password.length < 8) return toast.error("Password must be at least 8 characters");

    setLoading(true);
    try {
      const res = await axiosInstance.post('/auth/register', { name, email, password });
      toast.success(res.data.message || "OTP sent to your email!");
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Verify OTP and Perform Auto-Login (sets HttpOnly Cookie)
  const handleVerifyAndAutoLogin = async (e) => {
    e.preventDefault();
    if (!formData.otp) return toast.error("Please enter the OTP");

    setLoading(true);
    try {
      // 1. Verify the OTP
      await axiosInstance.post('/auth/verify-otp', { 
        email: formData.email, 
        code: formData.otp 
      });

      // 2. Auto-Signin using login route. 
      // Note: Backend will set the HttpOnly cookie here automatically.
      const loginRes = await axiosInstance.post('/auth/login', {
        email: formData.email,
        password: formData.password
      });

      // 3. Store only non-sensitive data (Role)
      // We DO NOT store the token; the browser manages it via Cookies now.
      localStorage.setItem('role', loginRes.data.role);

      toast.success("Account verified! Welcome to AgriAI.");
      
      // 4. Navigate to Dashboard
      navigate('/dashboard');

    } catch (err) {
      const errorMsg = err.response?.data?.error || "Verification failed";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-6">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-xl overflow-hidden border border-stone-100">
        <div className="bg-emerald-700 p-8 text-white text-center">
          <h2 className="text-2xl font-bold">{step === 1 ? 'Create Account' : 'Verify Email'}</h2>
          <p className="text-emerald-100 mt-2 text-sm opacity-90">
            {step === 1 ? 'Join our community of smart farmers' : `Enter the 6-digit code sent to ${formData.email}`}
          </p>
        </div>

        <div className="p-8">
          {step === 1 ? (
            <form onSubmit={handleRegister} className="space-y-5">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-500 ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 text-slate-400" size={18} />
                  <input
                    type="text"
                    placeholder="Enter your name"
                    className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-500 ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 text-slate-400" size={18} />
                  <input
                    type="email"
                    placeholder="farmer@example.com"
                    className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-500 ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 text-slate-400" size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 8 characters"
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
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {loading ? 'Processing...' : 'Send OTP'}
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyAndAutoLogin} className="space-y-6">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-500 text-center block mb-4">Verification Code</label>
                <input
                  type="text"
                  maxLength="6"
                  placeholder="000000"
                  className="w-full text-center text-3xl tracking-[1rem] font-bold py-4 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition"
                  value={formData.otp}
                  onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                />
              </div>

              <button
                disabled={loading}
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-4 rounded-xl shadow-lg transition active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <ShieldCheck size={20} />
                {loading ? 'Verifying...' : 'Verify & Sign In'}
              </button>
              
              <button 
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-slate-400 text-sm font-medium hover:text-emerald-600 transition"
              >
                Change Email Address
              </button>
            </form>
          )}

          <div className="mt-8 pt-6 border-t border-stone-100 text-center">
            <p className="text-slate-500 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-emerald-700 font-bold hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;