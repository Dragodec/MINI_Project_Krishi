import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, 
  MessageSquare, 
  Leaf, 
  LogOut, 
  CloudSun, 
  Loader2, 
  ChevronRight,
  ThermometerSun // Replaced History with Environment/Soil icon
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import axiosInstance from '../API/axiosInstance';
import UsageStats from './UsageStats';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get('/auth/me');
        setUser(res.data);
      } catch (err) {
        console.log("Session verification failed");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/auth/logout');
      toast.success("Logged out successfully");
      navigate('/login');
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  const menuItems = [
    { label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { label: 'Agri-GPT', icon: <MessageSquare size={20} />, path: '/queries' },
    { label: 'Weather', icon: <CloudSun size={20} />, path: '/weather' },
    // Replaced History with Field Hub
    { label: 'Field Hub', icon: <ThermometerSun size={20} />, path: '/field-analysis' },
  ];

  if (loading) return (
    <div className="h-screen w-full flex items-center justify-center bg-slate-50">
      <Loader2 className="animate-spin text-emerald-600" size={32} />
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* SIDEBAR */}
      <aside className="w-72 bg-white border-r border-slate-200 hidden lg:flex flex-col sticky top-0 h-screen z-50">
        <div className="p-8 flex items-center gap-3">
          <div className="bg-emerald-600 p-2 rounded-xl shadow-lg text-white shadow-emerald-100">
            <Leaf size={24} />
          </div>
          <span className="font-black text-2xl tracking-tight text-slate-900">AgriAI</span>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all duration-200 ${
                  isActive 
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-100' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-emerald-600'
                }`}
              >
                {item.icon} {item.label}
              </button>
            );
          })}
        </nav>

        <div className="px-4 mb-4">
            <UsageStats />
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          {user && (
            <div
              onClick={() => navigate('/profile')}
              className="flex items-center gap-3 px-2 py-3 mb-2 cursor-pointer hover:bg-white hover:shadow-sm rounded-xl transition-all border border-transparent hover:border-slate-200"
            >
              <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold border-2 border-white shadow-sm">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{user.role}</p>
              </div>
              <ChevronRight size={14} className="text-slate-300" />
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-red-500 hover:bg-red-50 rounded-xl font-bold transition-colors"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* MOBILE HEADER & CONTENT */}
      <main className="flex-1 overflow-y-auto relative">
        <div className="lg:hidden bg-white border-b border-slate-100 p-4 sticky top-0 z-40 flex justify-between items-center backdrop-blur-md bg-white/80">
             <div className="flex items-center gap-2">
                <Leaf className="text-emerald-600" size={20} />
                <span className="font-black text-slate-900 tracking-tight">AgriAI</span>
             </div>
             <button onClick={() => navigate('/profile')} className="w-8 h-8 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center font-bold shadow-md shadow-emerald-100">
                {user?.name.charAt(0).toUpperCase()}
             </button>
        </div>
        <div className="w-full">{children}</div>
      </main>
    </div>
  );
};

export default Layout;