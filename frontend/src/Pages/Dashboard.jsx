import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MessageSquare,
  History,
  CloudSun,
  PlusCircle,
  TrendingUp,
  AlertCircle,
  Loader2,
  Bell,
  Zap,
  ChevronRight // Added the missing import here
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
      toast.error("Unable to load field data");
      if (err.response?.status === 401) navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  if (loading || !dashboardData) {
    return (
      <div className="flex h-[calc(100vh-64px)] w-full items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-emerald-600" size={40} />
      </div>
    );
  }

  const { user, stats, recentAnalyses, advisories } = dashboardData;

  return (
    <main className="p-4 md:p-8 lg:p-12 max-w-7xl mx-auto w-full">
      {/* HEADER */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            {greeting}, <span className="text-emerald-600">{user.name.split(' ')[0]}</span>
          </h1>
          <p className="text-slate-500 mt-2 font-medium italic">
            Your field intelligence is up to date.
          </p>
        </div>
        <button 
          onClick={() => navigate('/queries')} 
          className="bg-slate-900 hover:bg-emerald-700 text-white px-8 py-4 rounded-2xl flex items-center gap-3 font-black text-sm uppercase tracking-widest transition-all active:scale-95 shadow-xl shadow-slate-200"
        >
          <PlusCircle size={20} /> New Analysis
        </button>
      </header>

      {/* PRIMARY ACTION SECTION - Focused on Multi-modal Entry */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {/* Weather Card */}
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 p-8 rounded-[2.5rem] text-white shadow-lg shadow-emerald-100 flex flex-col justify-between group">
          <div>
            <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform">
              <CloudSun size={32} />
            </div>
            <h3 className="text-2xl font-black mb-2">Local Weather Station</h3>
            <p className="text-emerald-50 text-sm font-medium mb-6 leading-relaxed opacity-80">
              Conditions are currently optimal for foliar spray and fertilization in your area.
            </p>
          </div>
          <button onClick={() => navigate('/weather')} className="bg-white text-emerald-800 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest self-start transition-all hover:bg-emerald-50">
            Open Forecast
          </button>
        </div>

        {/* Unified Agri-GPT Card (Text/Image/Audio combined) */}
        <div onClick={() => navigate('/queries')} className="bg-white p-8 rounded-[2.5rem] border-2 border-emerald-50 shadow-sm hover:shadow-xl hover:border-emerald-100 transition-all cursor-pointer flex flex-col justify-between group">
          <div>
            <div className="bg-emerald-50 text-emerald-600 p-3 rounded-2xl w-fit mb-6 group-hover:rotate-12 transition-transform">
              <Zap size={32} fill="currentColor" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">Agri-GPT AI</h3>
            <p className="text-slate-500 text-sm font-medium mb-6 leading-relaxed">
              Upload pest images, record voice notes, or chat about soil health in one place.
            </p>
          </div>
          <div className="flex items-center text-emerald-600 font-black text-xs uppercase tracking-widest">
            Launch Station <ChevronRight size={16} className="ml-1 group-hover:translate-x-2 transition-transform" />
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          { label: 'Field Queries', value: stats.totalQueries, icon: <MessageSquare size={16} />, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Diseases Detected', value: stats.diseasesDetected, icon: <TrendingUp size={16} />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Active Alerts', value: stats.pendingAlerts, icon: <AlertCircle size={16} />, color: 'text-amber-600', bg: 'bg-amber-50' }
        ].map((stat, i) => (
          <div key={i} className="flex items-center gap-5 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl`}>{stat.icon}</div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-2xl font-black text-slate-900">{String(stat.value).padStart(2, '0')}</p>
            </div>
          </div>
        ))}
      </section>

      {/* LOWER CONTENT AREA */}
      <section className="grid lg:grid-cols-2 gap-8">
        {/* RECENT ANALYSES */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-8 border-b border-slate-50 flex items-center justify-between">
            <h3 className="font-black text-xl text-slate-900 tracking-tight">Recent Logs</h3>
            <button onClick={() => navigate('/history')} className="text-emerald-600 text-xs font-black uppercase tracking-widest hover:underline">Full History</button>
          </div>
          <div className="p-4 flex-1">
            {recentAnalyses.length > 0 ? recentAnalyses.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
                <div className="flex items-center gap-4">
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center font-black ${item.issue === 'Healthy' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                    {item.crop.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{item.crop}</p>
                    <p className="text-xs text-slate-500 font-medium">{item.issue} • {item.score}</p>
                  </div>
                </div>
                <span className="text-[10px] font-black text-slate-300 uppercase">{new Date(item.date).toLocaleDateString()}</span>
              </div>
            )) : <div className="p-12 text-center text-slate-400 font-medium">No activity recorded yet.</div>}
          </div>
        </div>

        {/* ADVISORIES */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex items-center gap-3">
            <div className="bg-amber-100 text-amber-600 p-2 rounded-lg"><Bell size={18} /></div>
            <h3 className="font-black text-xl text-slate-900 tracking-tight">Advisories</h3>
          </div>
          <div className="p-8 space-y-8">
            {advisories.map((adv, i) => (
              <div key={i} className={`pl-6 border-l-2 ${adv.type === 'amber' ? 'border-amber-400' : 'border-blue-400'} group cursor-default`}>
                <p className="text-sm font-black text-slate-900 mb-1 group-hover:text-emerald-600 transition-colors">{adv.title}</p>
                <p className="text-xs text-slate-500 leading-relaxed font-bold">{adv.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Dashboard;