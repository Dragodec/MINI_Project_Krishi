import React, { useEffect, useState, useCallback } from 'react';
import { 
  CloudRain, 
  Wind, 
  Droplets, 
  AlertTriangle, 
  RefreshCw, 
  Sun, 
  CloudSun, 
  CheckCircle2,
  Clock,
  Navigation
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import axiosInstance from '../API/axiosInstance';

const Weather = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchWeather = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await axiosInstance.get('/weather');
      setData(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update weather data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  const getWeatherIcon = (temp, rain, size = 48) => {
    if (rain > 40) return <CloudRain size={size} className="text-blue-400" />;
    if (temp > 30) return <Sun size={size} className="text-amber-400" />;
    return <CloudSun size={size} className="text-slate-200" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-center">
        <div>
          <RefreshCw size={48} className="animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Syncing Global Data</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  // Calculation for SVG Gauge
  const radius = 100;
  const circumference = 2 * Math.PI * radius;
  const sprayScore = 98; // This would ideally come from data.current.sprayScore
  const offset = circumference - (sprayScore / 100) * circumference;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans selection:bg-emerald-100">
      
      {/* HEADER SECTION */}
      <div className="bg-[#0F172A] pt-12 pb-28 px-8 md:px-12 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full -mr-32 -mt-32 blur-[120px]" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
            
            <div className="flex items-center gap-8">
              <div className="bg-white/5 backdrop-blur-2xl p-6 rounded-[3rem] border border-white/10 shadow-2xl">
                {getWeatherIcon(data.current.temp, data.current.rain, 72)}
              </div>
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="bg-emerald-500 text-white px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                    Station Active
                  </span>
                  <button onClick={() => fetchWeather(true)} className="text-slate-500 hover:text-white transition-colors">
                    <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
                  </button>
                </div>
                <h1 className="text-8xl font-black tracking-tighter leading-none mb-2">
                  {data.current.temp}°
                </h1>
                <p className="text-slate-400 font-bold text-lg">Clear skies in your farm area</p>
              </div>
            </div>

            {/* HIGH-IMPACT METRICS */}
            <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
              <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] min-w-[160px]">
                <div className="flex justify-between items-center mb-4">
                   <Wind size={20} className="text-emerald-400" />
                   <Navigation size={14} className="text-slate-500 rotate-[45deg]" />
                </div>
                <p className="text-4xl font-black mb-1">{data.current.wind}<span className="text-sm text-slate-500 ml-1">m/s</span></p>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '45%' }} />
                </div>
                <p className="text-[10px] font-bold text-slate-500 mt-2 uppercase">Wind Velocity</p>
              </div>

              <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] min-w-[160px]">
                <div className="flex justify-between items-center mb-4">
                   <Droplets size={20} className="text-blue-400" />
                </div>
                <p className="text-4xl font-black mb-1">{data.current.rain}<span className="text-sm text-slate-500 ml-1">%</span></p>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: `${data.current.rain}%` }} />
                </div>
                <p className="text-[10px] font-bold text-slate-500 mt-2 uppercase">Rain Chance</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <main className="max-w-6xl mx-auto px-4 -mt-20 relative z-20 space-y-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* AGRONOMIC INSIGHTS */}
          <div className="lg:col-span-7 bg-white rounded-[3.5rem] p-10 shadow-2xl shadow-slate-200 border border-slate-100">
            <div className="flex items-center gap-4 mb-10">
              <div className="bg-amber-50 text-amber-600 p-4 rounded-3xl">
                <AlertTriangle size={28} />
              </div>
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Farm Advisory</h2>
                <p className="text-slate-400 text-sm font-bold">Smart recommendations for today</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {data.recommendations.map((rec, i) => (
                <div key={i} className="flex items-start gap-5 p-6 rounded-3xl bg-slate-50 hover:bg-white hover:shadow-xl hover:scale-[1.02] transition-all border border-transparent hover:border-slate-100 group">
                  <span className="text-2xl font-black text-slate-200 group-hover:text-emerald-500 transition-colors">0{i+1}</span>
                  <p className="text-md font-bold text-slate-700 leading-relaxed tracking-tight">{rec}</p>
                </div>
              ))}
            </div>
          </div>

          {/* SPRAY CONDITION GAUGE */}
          <div className="lg:col-span-5 bg-white rounded-[3.5rem] p-10 shadow-2xl shadow-slate-200 border border-slate-100 flex flex-col items-center justify-center text-center">
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-10">Condition Index</p>
            
            <div className="relative w-56 h-56 flex items-center justify-center mb-10">
              <svg className="absolute w-full h-full -rotate-90">
                <circle cx="112" cy="112" r="100" stroke="currentColor" strokeWidth="16" fill="transparent" className="text-slate-50" />
                <circle 
                  cx="112" cy="112" r="100" 
                  stroke="currentColor" 
                  strokeWidth="16" 
                  fill="transparent" 
                  strokeDasharray={circumference}
                  strokeDashoffset={offset} 
                  strokeLinecap="round"
                  className="text-emerald-500 transition-all duration-1000 ease-out"
                />
              </svg>
              
              <div className="relative z-10 flex flex-col items-center">
                <div className="bg-emerald-500 text-white p-5 rounded-full shadow-lg shadow-emerald-200 mb-2">
                  <CheckCircle2 size={40} />
                </div>
                <span className="text-4xl font-black text-slate-900">{sprayScore}%</span>
              </div>
            </div>

            <h3 className="text-2xl font-black text-slate-900 mb-2">Safe to Spray</h3>
            <p className="text-sm font-bold text-slate-400 leading-relaxed px-6">
              Low wind speeds and zero rain detected. Ideal for pest control.
            </p>
          </div>
        </div>

        {/* 24 HOUR FORECAST */}
        <section className="bg-white rounded-[3.5rem] p-10 shadow-2xl shadow-slate-200 border border-slate-100">
          <div className="flex items-center mb-10">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-4">
              <Clock className="text-emerald-600" size={24} /> 24-Hour Forecast
            </h2>
            <div className="h-px flex-1 bg-slate-100 ml-8" />
          </div>
          
          <div 
            className="flex gap-6 overflow-x-auto pb-6 no-scrollbar"
            style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
          >
            {data.hourly.map((h, i) => (
              <div 
                key={i} 
                className="min-w-[130px] flex flex-col items-center p-8 rounded-[3rem] bg-slate-50 border border-slate-50 hover:border-emerald-200 hover:bg-white hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer group"
              >
                <p className="text-[10px] font-black text-slate-400 uppercase mb-6 group-hover:text-emerald-500">{h.time}</p>
                <div className="mb-6 scale-125">
                  {getWeatherIcon(h.temp, h.rain, 32)}
                </div>
                <p className="text-3xl font-black text-slate-900 mb-2">{h.temp}°</p>
                <p className="text-[10px] font-black text-blue-500 bg-blue-50 px-3 py-1 rounded-full">
                  {h.rain}% Rain
                </p>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* Custom Scrollbar Handling */}
      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}} />
    </div>
  );
};

export default Weather;