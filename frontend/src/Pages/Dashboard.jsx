import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MessageSquare, History, CloudSun, PlusCircle, TrendingUp,
  AlertCircle, Loader2, Bell, ChevronRight, ShieldCheck,
  Leaf, ListTodo, CheckCircle, CalendarDays, Download, Bot, RefreshCw
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import axiosInstance from '../API/axiosInstance';
import { jsPDF } from 'jspdf';
import * as htmlToImage from 'html-to-image';

import { useLanguage } from '../Context/LanguageContext';
import { TRANSLATIONS } from '../Constants/Translations';

const Dashboard = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = TRANSLATIONS[language].dashboard;

  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState(t.greetings.morning);
  const [dashboardData, setDashboardData] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [generatingTasks, setGeneratingTasks] = useState(false);
  const [downloadingReport, setDownloadingReport] = useState(false);
  const reportRef = useRef();

  const fetchTasks = useCallback(async () => {
    try {
      const res = await axiosInstance.get('/tasks');
      setTasks(res.data);
    } catch (err) { console.error(err); }
  }, []);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/dashboard/stats');
      setDashboardData(res.data);
    } catch (err) {
      toast.error(t.toasts.loadError);
      if (err.response?.status === 401) navigate('/login');
    } finally { setLoading(false); }
  }, [navigate, t.toasts.loadError]);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 12 && hour < 17) setGreeting(t.greetings.afternoon);
    else if (hour >= 17) setGreeting(t.greetings.evening);
    else setGreeting(t.greetings.morning);

    fetchDashboardData();
    fetchTasks();
  }, [fetchDashboardData, fetchTasks, t.greetings]);

  const handleGenerateTasks = async () => {
    setGeneratingTasks(true);
    setTasks([]); // 🔄 RESET UI IMMEDIATELY

    try {
      // 1. Fetch current environment from Field Hub
      const plotRes = await axiosInstance.get('/soil/status');
      const plot = plotRes.data;

      const environment = {
        crop: plot?.cropHistory?.currentCrop || "Rice",
        soilType: plot?.plotInfo?.soilType || "laterite",
        moisture: plot?.simulationState?.moistureContent || 50,
        weather: dashboardData?.weather?.condition || "Clear"
      };

      // 2. Generate Plan
      await axiosInstance.post('/tasks/generate', { 
        crop: environment.crop, 
        plantingDate: new Date().toISOString(),
        environment
      });

      toast.success(language === 'ml' ? `${environment.crop}-നായുള്ള പ്ലാൻ തയ്യാറായി!` : `Plan optimized for ${environment.crop}!`, { icon: '🌱' });
      fetchTasks();
    } catch (err) {
      toast.error(t.toasts.planError);
    } finally {
      setGeneratingTasks(false);
    }
  };

  const toggleTaskCompleted = async (taskId) => {
    try {
      await axiosInstance.patch(`/tasks/${taskId}/toggle`);
      setTasks(tasks.map(t => t._id === taskId ? { ...t, completed: !t.completed } : t));
    } catch(err) { toast.error(t.toasts.updateError); }
  };

  const downloadReport = async () => {
    setDownloadingReport(true);
    const element = reportRef.current;
    element.style.display = 'block';
    await new Promise(r => setTimeout(r, 150));
    try {
      const imgData = await htmlToImage.toPng(element, { pixelRatio: 2, backgroundColor: '#ffffff' });
      const pdf = new jsPDF({ orientation: 'p', unit: 'px', format: [800, 1200] });
      pdf.addImage(imgData, 'PNG', 0, 0, 800, 1200);
      pdf.save(`AgriAI_Field_Report.pdf`);
      toast.success(t.toasts.downloadSuccess);
    } catch (err) { toast.error(t.toasts.downloadError); }
    finally {
      element.style.display = 'none';
      setDownloadingReport(false);
    }
  };

  if (loading || !dashboardData) {
    return (
      <div className="flex h-[calc(100vh-64px)] w-full items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-emerald-600" size={40} />
      </div>
    );
  }

  const { user, stats, advisories, weather } = dashboardData;
  const allTasksDone = tasks.length > 0 && tasks.every(t => t.completed);

  return (
    <main className="p-4 md:p-8 lg:p-12 max-w-7xl mx-auto w-full">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">{greeting}, <span className="text-emerald-600">{user.name.split(' ')[0]}</span></h1>
          <p className="text-slate-500 mt-2 font-medium italic">{t.status.active} • {t.status.monitoring} {user._id.slice(-4).toUpperCase()}</p>
        </div>
        <div className="flex gap-3">
          
          <button onClick={() => navigate('/queries')} className="bg-slate-900 hover:bg-emerald-700 text-white px-6 py-4 rounded-2xl flex items-center gap-3 font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-slate-200">
            <PlusCircle size={20} /> {t.buttons.newAnalysis}
          </button>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 p-8 rounded-[2.5rem] text-white shadow-lg shadow-emerald-100 flex flex-col justify-between group">
          <div><div className="bg-white/20 p-3 rounded-2xl w-fit mb-6"><CloudSun size={32} /></div>
          <h3 className="text-2xl font-black mb-2">{weather ? `${weather.temp}°C` : t.weather.title}</h3>
          <p className="text-emerald-50 text-sm font-medium opacity-90">{weather?.condition || t.weather.syncing}</p></div>
          <button onClick={() => navigate('/weather')} className="bg-white text-emerald-800 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest mt-6 self-start">{t.buttons.openForecast}</button>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-50 shadow-sm flex flex-col justify-between group">
          <div><div className="bg-slate-100 text-slate-600 p-3 rounded-2xl w-fit mb-6"><ShieldCheck size={32} /></div>
          <h3 className="text-2xl font-black text-slate-900 mb-2">Station Status</h3>
          <p className="text-slate-500 text-sm font-medium leading-relaxed">{t.status.engine}</p>
          <div className="flex items-center gap-2 mt-4"><span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span><span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">{t.status.online}</span></div></div>
          <button onClick={() => navigate('/profile')} className="text-slate-400 hover:text-slate-900 text-[10px] font-black uppercase tracking-widest text-left mt-4">{t.buttons.settings}</button>
        </div>
      </section>

      {/* CROP CALENDAR SECTION */}
      <section className="mb-12">
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden p-8 flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3 border-b md:border-b-0 md:border-r border-slate-100 md:pr-8 pb-8 md:pb-0 flex flex-col justify-between">
            <div>
              <div className={`p-3 rounded-2xl w-fit mb-6 ${allTasksDone ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
                {allTasksDone ? <CheckCircle size={32} /> : <CalendarDays size={32} />}
              </div>
              <h3 className="font-black text-3xl text-slate-900 tracking-tight mb-3">{allTasksDone ? t.planner.harvestReady : t.planner.title}</h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">
                {allTasksDone ? t.planner.complete : t.planner.description}
              </p>
            </div>
            <button onClick={handleGenerateTasks} disabled={generatingTasks} className={`w-full font-black py-5 rounded-2xl transition-all shadow-xl active:scale-95 disabled:opacity-50 text-xs tracking-widest uppercase flex items-center justify-center gap-2 mt-6 ${allTasksDone ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-white'}`}>
              {generatingTasks ? <Loader2 className="animate-spin" size={18} /> : <RefreshCw size={18} />} {generatingTasks ? t.buttons.analyzing : t.buttons.generatePlan}
            </button>
          </div>

          <div className="md:w-2/3">
            {tasks.length > 0 ? (
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {tasks.map(task => (
                  <div key={task._id} className={`flex gap-4 p-5 rounded-3xl border transition-all ${task.completed ? 'bg-slate-50 opacity-60' : 'bg-white border-slate-200 hover:border-emerald-200'}`}>
                    <button onClick={() => toggleTaskCompleted(task._id)} className={`h-7 w-7 rounded-full flex items-center justify-center border-2 shrink-0 ${task.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 text-transparent'}`}><CheckCircle size={16} /></button>
                    <div className="flex-1"><div className="flex justify-between items-start mb-1"><h4 className={`font-black text-lg ${task.completed ? 'line-through text-slate-500' : 'text-slate-900'}`}>{task.title}</h4><span className="text-[10px] font-black uppercase text-amber-700 bg-amber-100 px-2 py-1 rounded-lg">{t.planner.due}: {new Date(task.dueDate).toLocaleDateString()}</span></div>
                    <p className="text-sm text-slate-600">{task.description}</p></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                <Leaf size={32} className="text-slate-300 mb-4" />
                <h4 className="font-bold text-slate-800 text-lg">{t.planner.noTimeline}</h4>
                <p className="text-sm text-slate-500">{t.planner.initialize}</p>
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* Hidden Report Ref */}
      <div ref={reportRef} style={{ display: 'none' }} className="p-10 text-slate-800">
          <h1 className="text-4xl font-black border-b-4 border-emerald-600 pb-4 mb-8">{t.pdf.title}</h1>
          <p className="font-bold mb-4">Date: {new Date().toLocaleString()}</p>
          <div className="grid grid-cols-2 gap-10 mb-10">
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  <p className="text-[10px] font-black uppercase text-slate-400 mb-2">{t.pdf.farmer}</p>
                  <p className="text-2xl font-black">{user.name}</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  <p className="text-[10px] font-black uppercase text-slate-400 mb-2">{t.pdf.queries}</p>
                  <p className="text-2xl font-black">{stats.totalQueries}</p>
              </div>
          </div>
      </div>
    </main>
  );
};

export default Dashboard;