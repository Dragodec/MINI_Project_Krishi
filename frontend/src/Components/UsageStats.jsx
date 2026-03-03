import React, { useState } from 'react';
import { Zap, RefreshCw, Info, X, ChevronUp } from 'lucide-react';
import axiosInstance from '../API/axiosInstance';
import { toast } from 'react-hot-toast';

const UsageStats = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const fetchUsage = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/usage');
      setData(res.data);
      setIsVisible(true);
    } catch (err) {
      toast.error("Failed to sync usage data");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => setIsVisible(false);

  const MAX_REQUESTS = 1500;
  const percent = data ? Math.min((data.requestsUsed / MAX_REQUESTS) * 100, 100) : 0;

  const getUIConfig = () => {
    if (percent < 60) return { color: "bg-emerald-500", border: "border-emerald-100", text: "You have plenty of AI usage left today.", status: "Safe" };
    if (percent < 85) return { color: "bg-amber-500", border: "border-amber-100", text: "You've used a good portion of your daily limit.", status: "Moderate" };
    return { color: "bg-red-500", border: "border-red-100", text: "AI usage is nearly exhausted for today.", status: "Critical" };
  };

  const ui = getUIConfig();

  return (
    <div className="w-full max-w-md">
      {!isVisible ? (
        /* VISIBLE ACTION BUTTON / MINIMIZED STATE */
        <button
          onClick={fetchUsage}
          disabled={loading}
          className="group flex items-center justify-between px-5 py-4 bg-white border border-slate-200 rounded-2xl font-bold text-slate-700 hover:border-emerald-500 hover:text-emerald-600 transition-all shadow-sm active:scale-95 w-full"
        >
          <div className="flex items-center gap-3">
            {loading ? (
              <RefreshCw size={18} className="animate-spin text-emerald-600" />
            ) : (
              <Zap size={18} className={`${data ? 'text-emerald-500 fill-emerald-500' : 'text-amber-500'} group-hover:scale-110 transition-transform`} />
            )}
            <span className="text-sm tracking-tight">
                {data ? `${Math.round(percent)}% Usage` : 'Check System Capacity'}
            </span>
          </div>
          <ChevronUp size={16} className="text-slate-400 group-hover:text-emerald-500" />
        </button>
      ) : (
        /* EXPANDED DATA CARD */
        <div className={`bg-white rounded-[2rem] p-6 shadow-xl shadow-slate-200/60 border-2 ${ui.border} animate-in fade-in zoom-in-95 duration-300 relative overflow-hidden`}>
          
          {/* HEADER AREA */}
          <div className="flex justify-between items-center mb-5">
            <div className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full ${ui.color} shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse`} />
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Node Capacity</p>
            </div>
            
            <div className="flex items-center gap-1.5">
              {/* REFRESH BUTTON - Higher Contrast */}
              <button 
                onClick={fetchUsage} 
                disabled={loading}
                className="p-2 bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-700 rounded-xl transition-all border border-slate-200 hover:border-emerald-200"
                title="Refresh"
              >
                <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              </button>

              {/* CLOSE BUTTON - Higher Contrast */}
              <button 
                onClick={handleClose}
                className="p-2 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 rounded-xl transition-all border border-slate-200 hover:border-red-200"
                aria-label="Close"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          <h3 className="text-[15px] font-black text-slate-900 leading-tight mb-5 pr-2">
            {ui.text}
          </h3>

          {/* PROGRESS BAR */}
          <div className="relative w-full h-5 bg-slate-100 rounded-full overflow-hidden border border-slate-200 shadow-inner">
            <div
              className={`h-full ${ui.color} transition-all duration-1000 ease-out relative`}
              style={{ width: `${percent}%` }}
            >
              {/* Shimmer Effect */}
              <div className="absolute inset-0 bg-white/25 w-1/3 -skew-x-12 animate-[shimmer_2.5s_infinite]" />
            </div>
          </div>

          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-lg border border-slate-100">
              <Info size={12} className="text-slate-600" />
              <p className="text-[11px] font-black text-slate-600 uppercase tracking-tighter">
                ~{data.approxCallsLeft?.toLocaleString()} remaining
              </p>
            </div>
            <span className={`text-[11px] font-black px-2 py-1 rounded-md bg-slate-900 text-white uppercase`}>
              {Math.round(percent)}%
            </span>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shimmer {
          0% { transform: translateX(-150%) skewX(-12deg); }
          100% { transform: translateX(350%) skewX(-12deg); }
        }
      `}} />
    </div>
  );
};

export default UsageStats;