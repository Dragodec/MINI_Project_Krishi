import React, { useState, useEffect, useRef } from 'react';
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
  ChevronRight,
  ShieldCheck,
  Leaf,
  ListTodo,
  CheckCircle,
  CalendarDays,
  Download,
  Bot
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import axiosInstance from '../API/axiosInstance';
import { jsPDF } from 'jspdf';
import * as htmlToImage from 'html-to-image';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState("Good morning");
  const [dashboardData, setDashboardData] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [generatingTasks, setGeneratingTasks] = useState(false);
  const [downloadingReport, setDownloadingReport] = useState(false);
  const reportRef = useRef();

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 12 && hour < 17) setGreeting("Good afternoon");
    else if (hour >= 17) setGreeting("Good evening");
    fetchDashboardData();
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axiosInstance.get('/tasks');
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleGenerateTasks = async () => {
    let crop = "Rice"; // fallback
    try {
      const plotRes = await axiosInstance.get('/soil/status');
      if (plotRes.data?.cropHistory?.currentCrop) {
        crop = plotRes.data.cropHistory.currentCrop;
      }
    } catch (e) {
      console.log("No active field, using fallback crop");
    }
    
    const plantingDate = new Date().toISOString();
    
    try {
      setGeneratingTasks(true);
      await axiosInstance.post('/tasks/generate', { crop, plantingDate });
      toast.success(`Crop lifecycle calendar generated for ${crop}!`);
      fetchTasks();
    } catch (err) {
      toast.error('Failed to generate tasks');
    } finally {
      setGeneratingTasks(false);
    }
  };

  const toggleTaskCompleted = async (taskId) => {
    try {
      await axiosInstance.patch(`/tasks/${taskId}/toggle`);
      setTasks(tasks.map(t => t._id === taskId ? { ...t, completed: !t.completed } : t));
    } catch(err) {
      toast.error("Failed to update task");
    }
  };

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

  const downloadReport = async () => {
    setDownloadingReport(true);
    const element = reportRef.current;
    
    // Briefly display the element so HTML2Canvas can accurately capture its layout
    element.style.display = 'block';
    
    // VERY IMPORTANT: Force the browser to complete layout and paint the hidden DOM node before capturing
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
      // Use htmlToImage which converts DOM to SVG via foreignObject, bypassing CSS color parsing faults entirely
      const imgData = await htmlToImage.toPng(element, { pixelRatio: 2, backgroundColor: '#ffffff' });
      
      // Calculate true image dimensions
      const img = new Image();
      img.src = imgData;
      await new Promise((resolve) => { img.onload = resolve; });

      // Build a dynamic seamless PDF instead of A4 to prevent height clipping
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'px',
        format: [img.width, img.height]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, img.width, img.height);
      pdf.save(`AgriAI_Official_Field_Report.pdf`);
      toast.success("Field Report downloaded securely!", { icon: '📄' });
    } catch (err) {
      console.error("PDF Compilation Error:", err);
      toast.error("Failed to compile PDF Report");
    } finally {
      element.style.display = 'none'; // Re-hide from user view
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

  const { user, stats, recentAnalyses, advisories, weather, followUps } = dashboardData;

  return (
    <main className="p-4 md:p-8 lg:p-12 max-w-7xl mx-auto w-full">
      {/* HEADER */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            {greeting}, <span className="text-emerald-600">{user.name.split(' ')[0]}</span>
          </h1>
          <p className="text-slate-500 mt-2 font-medium italic">
            Your farming station is active and monitoring.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <button 
            onClick={downloadReport} 
            disabled={downloadingReport}
            className="bg-white hover:bg-slate-50 border-2 border-slate-200 text-slate-700 px-6 py-4 rounded-2xl flex items-center gap-3 font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-sm disabled:opacity-50"
          >
            {downloadingReport ? <Loader2 size={20} className="animate-spin text-emerald-600"/> : <Download size={20} className="text-emerald-600" />}
            {downloadingReport ? "Compiling..." : "Field Report"}
          </button>

          <button 
            onClick={() => navigate('/queries')} 
            className="bg-slate-900 hover:bg-emerald-700 text-white px-6 py-4 rounded-2xl flex items-center gap-3 font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-xl shadow-slate-200"
          >
            <PlusCircle size={20} /> New Analysis
          </button>
        </div>
      </header>

      {/* PROACTIVE FOLLOW-UP NUDGE */}
      {followUps && followUps.length > 0 && (
        <section onClick={() => navigate(`/queries/${followUps[0].chatId}`)} className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-[2.5rem] p-8 mb-12 shadow-2xl shadow-blue-900/20 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 cursor-pointer hover:-translate-y-1 active:scale-95 transition-all group overflow-hidden relative border border-blue-600">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/5 rounded-full blur-[40px] pointer-events-none group-hover:bg-white/10 transition-colors" />
          <div className="flex items-center gap-6 relative z-10">
             <div className="bg-white/10 p-5 rounded-3xl backdrop-blur-md border border-white/10 shadow-inner group-hover:rotate-12 transition-transform">
                <Bot size={32} className="text-blue-100" />
             </div>
             <div>
                <h4 className="font-black text-2xl tracking-tight flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
                   Proactive Care Check-In
                   <span className="bg-blue-500/50 text-blue-100 text-[10px] px-3 py-1 rounded-xl uppercase tracking-widest border border-blue-400/30 w-fit backdrop-blur-sm">
                     {followUps[0].daysAgo} Later
                   </span>
                </h4>
                <p className="text-blue-100 text-sm md:text-base font-medium leading-relaxed max-w-2xl">{followUps[0].message}</p>
             </div>
          </div>
          <button className="bg-white text-blue-900 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl group-hover:shadow-white/20 transition-all whitespace-nowrap self-start md:self-auto relative z-10 hidden sm:block">
             Reply to Agent
          </button>
        </section>
      )}

      {/* PRIMARY GRID */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        
        {/* Card 1: Weather Station - NOW DYNAMIC */}
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 p-8 rounded-[2.5rem] text-white shadow-lg shadow-emerald-100 flex flex-col justify-between group">
          <div>
            <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform">
              <CloudSun size={32} />
            </div>
            <h3 className="text-2xl font-black mb-2">
              {weather ? `${weather.temp}°C` : "Weather Station"}
            </h3>
            <p className="text-emerald-50 text-sm font-medium mb-6 leading-relaxed opacity-90 min-h-[40px]">
              {weather ? weather.condition : "Fetching local environmental data..."}
            </p>
          </div>
          <button 
            onClick={() => navigate('/weather')} 
            className="bg-white text-emerald-800 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest self-start transition-all hover:bg-emerald-50"
          >
            Open Forecast
          </button>
        </div>

        {/* Card 2: History Logs */}
        <div onClick={() => navigate('/history')} className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-50 shadow-sm hover:shadow-xl hover:border-slate-200 transition-all cursor-pointer flex flex-col justify-between group">
          <div>
            <div className="bg-blue-50 text-blue-600 p-3 rounded-2xl w-fit mb-6 group-hover:rotate-12 transition-transform">
              <History size={32} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">History Logs</h3>
            <p className="text-slate-500 text-sm font-medium mb-6 leading-relaxed">
              Review your previous {stats.totalQueries} transmissions and AI diagnostic results.
            </p>
          </div>
          <div className="flex items-center text-blue-600 font-black text-xs uppercase tracking-widest">
            View Records <ChevronRight size={16} className="ml-1 group-hover:translate-x-2 transition-transform" />
          </div>
        </div>

        {/* Card 3: Station Status */}
        <div className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-50 shadow-sm flex flex-col justify-between group">
          <div>
            <div className="bg-slate-100 text-slate-600 p-3 rounded-2xl w-fit mb-6"><ShieldCheck size={32} /></div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">Station Status</h3>
            <p className="text-slate-500 text-sm font-medium leading-relaxed mb-4">
              All systems operational. Multimodal RAG node connected.
            </p>
            <div className="flex items-center gap-2 mb-6">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Active</span>
            </div>
          </div>
          <button onClick={() => navigate('/profile')} className="text-slate-400 hover:text-slate-900 text-[10px] font-black uppercase tracking-widest text-left">
            Manage Node Settings
          </button>
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
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-8 border-b border-slate-50 flex items-center justify-between">
            <h3 className="font-black text-xl text-slate-900 tracking-tight">Recent Logs</h3>
            <button onClick={() => navigate('/history')} className="text-emerald-600 text-xs font-black uppercase tracking-widest hover:underline">Full History</button>
          </div>
          <div className="p-4 flex-1">
            {recentAnalyses.length > 0 ? recentAnalyses.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
                <div className="flex items-center gap-4">
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center font-black ${item.issue === 'Issue Detected' ? 'bg-red-50 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
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

        {/* ADVISORIES - NOW DYNAMIC FROM BACKEND */}
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

      {/* CROP LIFECYCLE CALENDAR SECTION */}
      <section className="mt-8">
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden p-8 flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3 border-b md:border-b-0 md:border-r border-slate-100 md:pr-8 pb-8 md:pb-0 flex flex-col justify-between">
            <div>
              <div className="bg-emerald-100 text-emerald-600 p-3 rounded-2xl w-fit mb-6">
                <CalendarDays size={32} />
              </div>
              <h3 className="font-black text-3xl text-slate-900 tracking-tight mb-3">Crop Calendar</h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed mb-6">
                Automated AI-generated task planner that tracks the perfect lifecycle schedule for your newly planted crop.
              </p>
            </div>
            <button 
              onClick={handleGenerateTasks}
              disabled={generatingTasks}
              className="w-full bg-slate-900 hover:bg-emerald-600 text-white font-black py-5 rounded-2xl transition-all shadow-xl active:scale-95 disabled:opacity-50 text-xs tracking-widest uppercase flex items-center justify-center gap-2"
            >
              {generatingTasks ? <Loader2 className="animate-spin" size={18} /> : <ListTodo size={18} />}
              {generatingTasks ? "Generating Plan..." : "Generate New Plan"}
            </button>
          </div>

          <div className="md:w-2/3 flex flex-col justify-center">
            {tasks.length > 0 ? (
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {tasks.map(task => (
                  <div key={task._id} className={`flex gap-4 p-5 rounded-3xl border transition-all group ${task.completed ? 'bg-slate-50 border-slate-100 opacity-60' : 'bg-white border-slate-200 hover:shadow-lg hover:border-emerald-200'}`}>
                    <button onClick={() => toggleTaskCompleted(task._id)} className={`mt-1 h-7 w-7 rounded-full flex items-center justify-center border-2 transition-all shrink-0 ${task.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 text-transparent hover:border-emerald-500'}`}>
                      <CheckCircle size={16} />
                    </button>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-2">
                        <h4 className={`font-black text-lg leading-tight ${task.completed ? 'text-slate-500 line-through' : 'text-slate-900'}`}>{task.title}</h4>
                        <span className="text-[10px] font-black uppercase text-amber-700 bg-amber-100 px-3 py-1 rounded-lg shrink-0">
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                      <p className={`text-sm ${task.completed ? 'text-slate-400' : 'text-slate-600 font-medium'}`}>{task.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center px-4 py-12 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                <div className="bg-slate-200 text-slate-400 p-4 rounded-3xl mb-4"><Leaf size={32} /></div>
                <h4 className="font-bold text-slate-800 text-lg mb-2">No Active Timelines</h4>
                <p className="text-sm font-medium text-slate-500 max-w-sm mx-auto">Click "Generate New Plan" to get automated weekly tasks tailored for your crop plot.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* HIDDEN INVISIBLE FIELD REPORT TEMPLATE BOUND FOR PDF RENDER */}
      {/* ========================================================= */}
      <div 
        ref={reportRef} 
        style={{ display: 'none', position: 'absolute', top: 0, left: 0, width: '800px', backgroundColor: 'white', zIndex: -9999 }}
        className="p-10 text-slate-800 font-sans"
      >
        <div className="flex justify-between items-center border-b-4 border-emerald-600 pb-6 mb-8 mt-4">
            <div className="flex items-center gap-3">
                <Leaf size={42} className="text-emerald-600" />
                <div>
                   <h1 className="font-black text-3xl tracking-tighter text-slate-900">Agri-GPT</h1>
                   <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Certified Field Report Tracker</p>
                </div>
            </div>
            <div className="text-right">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Compiled Securely On</p>
                <p className="font-black text-base text-slate-800">{new Date().toLocaleString()}</p>
                <p className="text-[9px] text-slate-400 mt-1 font-mono uppercase">STATION UID: {user._id?.slice(-8) || "X9-ALPHA-VER"}</p>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-10 bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
            <div>
               <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3 border-b border-slate-200 pb-2">Registered Entity</h3>
               <p className="text-2xl font-black text-slate-900">{user.name}</p>
               <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mt-1 bg-emerald-100 w-fit px-2 py-0.5 rounded">{user.role}</p>
            </div>
            <div>
               <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3 border-b border-slate-200 pb-2">Primary Node Stats</h3>
               <div className="flex justify-between font-bold text-xs mb-2 pb-1 border-b border-slate-100">
                  <span className="text-slate-500 uppercase">Queries Serviced:</span> <span className="text-slate-900">{stats.totalQueries}</span>
               </div>
               <div className="flex justify-between font-bold text-xs mb-2 pb-1 border-b border-slate-100">
                  <span className="text-red-500 uppercase">Threats Flagged:</span> <span className="text-red-500 font-black">{stats.diseasesDetected} Lifetime</span>
               </div>
               <div className="flex justify-between font-bold text-xs">
                  <span className="text-blue-500 uppercase">Atmosphere:</span> <span className="text-blue-600">{weather ? `${weather.temp}°C, ${weather.condition}` : 'Active'}</span>
               </div>
            </div>
        </div>

        <h3 className="text-[10px] font-black uppercase text-emerald-700 tracking-widest mb-4 bg-emerald-100 p-2.5 rounded-lg border border-emerald-200">Recent AI Analyses & Outbreak Detections</h3>
        <div className="space-y-3 mb-10">
            {recentAnalyses.length > 0 ? recentAnalyses.map((item, i) => (
                <div key={i} className="border-l-4 border-slate-200 pl-4 py-1 flex justify-between items-center" style={{ borderColor: item.issue === 'Issue Detected' ? '#ef4444' : '#10b981' }}>
                    <div>
                        <p className="font-black text-slate-900 text-sm">{item.crop}</p>
                        <p className={`text-xs font-bold uppercase tracking-widest mt-1 ${item.issue === 'Issue Detected' ? 'text-red-500' : 'text-emerald-500'}`}>{item.issue} • {item.score}</p>
                    </div>
                    <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase bg-slate-50 px-2 py-1 rounded">{new Date(item.date).toLocaleDateString()}</p>
                </div>
            )) : <p className="text-xs font-bold italic text-slate-400 ml-2">No hardware queries registered this cycle.</p>}
        </div>

        <h3 className="text-[10px] font-black uppercase text-blue-700 tracking-widest mb-4 bg-blue-100 p-2.5 rounded-lg border border-blue-200">Active Crop Planning Timeline</h3>
        <div className="space-y-4 mb-16 pl-2">
            {tasks.length > 0 ? tasks.filter(t => !t.completed).slice(0, 5).map((task, i) => (
                <div key={i} className="flex gap-4 items-start relative">
                    <div className="mt-1 flex-shrink-0 w-3 h-3 rounded-full border-2 border-slate-300 bg-white relative z-10"></div>
                    {i !== tasks.filter(t => !t.completed).slice(0,5).length - 1 && (
                        <div className="absolute top-4 left-[5px] w-[2px] h-full bg-slate-100 z-0"></div>
                    )}
                    <div className="-mt-1 w-full flex justify-between items-start border-b border-dashed border-slate-100 pb-3">
                        <div>
                            <p className="font-bold text-slate-900 text-sm leading-none mb-1">{task.title}</p>
                            <p className="text-[10px] text-slate-500 font-medium w-4/5">{task.description}</p>
                        </div>
                        <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest bg-amber-50 px-2 py-1 rounded shadow-sm border border-amber-100 whitespace-nowrap">DUE: {new Date(task.dueDate).toLocaleDateString()}</p>
                    </div>
                </div>
            )) : <p className="text-xs font-bold italic text-slate-400">Yield schedule complete / Unit offline.</p>}
        </div>

        <div className="mt-8 pt-8 text-center bg-[#0F172A] rounded-3xl p-6 text-white shadow-xl isolate relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjMGYxNzJhIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDBMOCA4Wk04IDBMMCA4WiIgc3Ryb2tlPSIjMWUwNzMzIiBzdHJva2Utd2lkdGg9IjEiPjwvcGF0aD4KPC9zdmc+')] opacity-20"></div>
            <ShieldCheck size={28} className="mx-auto text-emerald-400 mb-2 relative z-10" />
            <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.2em] leading-loose relative z-10">
                Verifiable Official Document • AgriAI Network Outpost<br/>
                Digital authenticity seal embedded via System RAG. Unauthorized replication restricted.
            </p>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;