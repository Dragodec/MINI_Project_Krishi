import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, MessageSquare, History, Mic, Image as ImageIcon,
  Bell, CloudSun, LogOut, PlusCircle, Leaf, ChevronRight,
  TrendingUp, AlertCircle, Loader2
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import axiosInstance from '../API/axiosInstance';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState("Good morning");
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 12 && hour < 17) setGreeting("Good afternoon");
    else if (hour >= 17) setGreeting("Good evening");

    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/dashboard/stats');
      setDashboardData(res.data);
    } catch (err) {
      toast.error("Session expired or server error");
      if (err.response?.status === 401) navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    toast.success("Logged out successfully");
    navigate('/login');
  };

  if (loading || !dashboardData) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-emerald-600" size={40} />
      </div>
    );
  }

  const { user, stats, recentAnalyses, advisories } = dashboardData;

  const statsConfig = [
    { label: 'Total Queries', value: stats.totalQueries, icon: <MessageSquare size={16} />, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Diseases Detected', value: stats.diseasesDetected, icon: <TrendingUp size={16} />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Pending Alerts', value: stats.pendingAlerts, icon: <AlertCircle size={16} />, color: 'text-amber-600', bg: 'bg-amber-50' }
  ];

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* SIDEBAR */}
      <aside className="w-72 bg-white border-r border-slate-200 hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-8 flex items-center gap-3">
          <div className="bg-emerald-600 p-2 rounded-xl shadow-lg text-white"><Leaf size={24} /></div>
          <span className="font-bold text-2xl tracking-tight text-slate-900">AgriAI</span>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          <button className="w-full flex items-center gap-3 px-4 py-3.5 bg-emerald-600 text-white rounded-2xl font-semibold shadow-md"><LayoutDashboard size={20} /> Dashboard</button>
          <button onClick={() => navigate('/queries')} className="w-full flex items-center gap-3 px-4 py-3.5 text-slate-500 hover:bg-slate-50 rounded-2xl font-medium"><MessageSquare size={20} /> AI Queries</button>
          <button onClick={() => navigate('/history')} className="w-full flex items-center gap-3 px-4 py-3.5 text-slate-500 hover:bg-slate-50 rounded-2xl font-medium"><History size={20} /> History</button>
        </nav>
        <div className="p-4 mt-auto border-t border-slate-100 bg-slate-50/50">
          <div
  onClick={() => navigate('/profile')}
  className="flex items-center gap-3 px-2 py-3 mb-2 cursor-pointer hover:bg-slate-100 rounded-xl transition"
>
  <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold border-2 border-white shadow-sm">
    {user.name.charAt(0)}
  </div>

  <div className="flex-1 overflow-hidden">
    <p className="text-sm font-bold text-slate-900 truncate">
      {user.name}
    </p>
    <p className="text-xs text-slate-500 truncate capitalize">
      {user.role}
    </p>
  </div>
</div>
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-red-500 hover:bg-red-50 rounded-xl font-bold transition-colors"><LogOut size={18} /> Logout</button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-4 md:p-8 lg:p-12 max-w-7xl mx-auto w-full">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">{greeting}, <span className="text-emerald-600">{user.name.split(' ')[0]}</span></h1>
            <p className="text-slate-500 mt-2 font-medium">Today is {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
          </div>
          <button onClick={() => navigate('/analyze')} className="bg-slate-900 hover:bg-emerald-700 text-white px-6 py-3.5 rounded-2xl flex items-center gap-3 font-bold transition-all active:scale-95"><PlusCircle size={20} /> New Analysis</button>
        </header>

        {/* QUICK ACTIONS */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div onClick={() => navigate('/analyze')} className="group bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all cursor-pointer">
            <div className="bg-emerald-100 text-emerald-700 p-3 rounded-2xl w-fit mb-6"><ImageIcon size={28} /></div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Crop Diagnosis</h3>
            <p className="text-slate-500 text-sm mb-6">Take a photo to detect pests or diseases.</p>
            <div className="flex items-center text-emerald-600 font-bold text-sm">Start Scanning <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" /></div>
          </div>
          <div onClick={() => navigate('/voice')} className="group bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all cursor-pointer">
            <div className="bg-blue-100 text-blue-700 p-3 rounded-2xl w-fit mb-6"><Mic size={28} /></div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Voice Assistant</h3>
            <p className="text-slate-500 text-sm mb-6">Ask questions about farming techniques.</p>
            <div className="flex items-center text-blue-600 font-bold text-sm">Talk to AI <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" /></div>
          </div>
          <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 p-8 rounded-[2rem] text-white">
            <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl w-fit mb-6"><CloudSun size={28} /></div>
            <h3 className="text-xl font-bold mb-1">Local Weather</h3>
            <p className="text-emerald-50 text-sm font-medium mb-6">Optimal for Fertilization</p>
            <button onClick={() => navigate('/weather')} className="bg-white text-emerald-800 px-4 py-2 rounded-xl text-xs font-bold">View Forecast</button>
          </div>
        </section>

        {/* STATS STRIP */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {statsConfig.map((stat, i) => (
            <div key={i} className="flex items-center gap-5 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl`}>{stat.icon}</div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">{stat.label}</p>
                <p className="text-2xl font-black text-slate-900">{String(stat.value).padStart(2, '0')}</p>
              </div>
            </div>
          ))}
        </section>

        {/* BOTTOM SECTION */}
        <section className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
              <h3 className="font-bold text-xl text-slate-900">Recent Analyses</h3>
              <button onClick={() => navigate('/history')} className="text-emerald-600 text-sm font-bold hover:underline">See All</button>
            </div>
            <div className="p-4">
              {recentAnalyses.length > 0 ? recentAnalyses.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50">
                  <div className="flex items-center gap-4">
                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center font-bold ${item.issue === 'Healthy' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                      {item.crop.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{item.crop}</p>
                      <p className="text-xs text-slate-500 font-medium">{item.issue} • {item.score}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">{new Date(item.date).toLocaleDateString()}</span>
                </div>
              )) : <div className="p-8 text-center text-slate-400">No records found.</div>}
            </div>
          </div>

          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex items-center gap-3">
              <div className="bg-amber-100 text-amber-600 p-2 rounded-lg"><Bell size={18} /></div>
              <h3 className="font-bold text-xl text-slate-900">Advisories</h3>
            </div>
            <div className="p-8 space-y-6">
              {advisories.map((adv, i) => (
                <div key={i} className={`pl-6 border-l-2 ${adv.type === 'amber' ? 'border-amber-400' : 'border-blue-400'}`}>
                  <p className="text-sm font-bold text-slate-900 mb-1">{adv.title}</p>
                  <p className="text-xs text-slate-500 leading-relaxed">{adv.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;