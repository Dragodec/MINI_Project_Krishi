import React, { useState } from 'react';
import { Zap, RefreshCw, Info } from 'lucide-react';
import axiosInstance from '../API/axiosInstance';
import { toast } from 'react-hot-toast';

const UsageStats = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchUsage = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/usage');
      setData(res.data);
    } catch (err) {
      toast.error("Failed to sync usage data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Logic for UI Interpretation
  const MAX_REQUESTS = 1500;
  const percent = data ? Math.min((data.requestsUsed / MAX_REQUESTS) * 100, 100) : 0;

  const getUIConfig = () => {
    if (percent < 60) return { color: "bg-emerald-500", text: "You have plenty of AI usage left today.", status: "Safe" };
    if (percent < 85) return { color: "bg-amber-500", text: "You've used a good portion of your daily limit.", status: "Moderate" };
    return { color: "bg-red-500", text: "AI usage is nearly exhausted for today.", status: "Critical" };
  };

  const ui = getUIConfig();

  return (
    <div className="max-w-md w-full">
      {!data ? (
        /* INITIAL STATE: Action Button */
        <button
          onClick={fetchUsage}
          disabled={loading}
          className="group flex items-center gap-3 px-6 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-slate-700 hover:border-emerald-500 hover:text-emerald-600 transition-all shadow-sm active:scale-95"
        >
          {loading ? (
            <RefreshCw size={18} className="animate-spin text-emerald-500" />
          ) : (
            <Zap size={18} className="text-amber-500 group-hover:fill-amber-500 transition-all" />
          )}
          Check AI Usage Status
        </button>
      ) : (
        /* DATA STATE: Human-Friendly Card */
        <div className="bg-white rounded-[2rem] p-6 shadow-xl shadow-slate-200/50 border border-slate-100 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${ui.color} animate-pulse`} />
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">System Capacity</p>
            </div>
            <button onClick={fetchUsage} className="text-slate-300 hover:text-emerald-600 transition-colors">
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            </button>
          </div>

          <h3 className="text-sm font-bold text-slate-800 leading-tight mb-4">
            {ui.text}
          </h3>

          {/* PROGRESS BAR */}
          <div className="relative w-full h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-50">
            <div
              className={`h-full ${ui.color} transition-all duration-1000 ease-out relative`}
              style={{ width: `${percent}%` }}
            >
              {/* Shimmer Effect */}
              <div className="absolute inset-0 bg-white/20 w-1/2 -skew-x-12 animate-[shimmer_2s_infinite]" />
            </div>
          </div>

          <div className="flex justify-between items-center mt-3">
            <p className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
              <Info size={12} className="text-slate-300" />
              ~{data.approxCallsLeft?.toLocaleString()}+ queries remaining
            </p>
            <span className="text-[10px] font-black text-slate-300 uppercase italic">
              {Math.round(percent)}% Used
            </span>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shimmer {
          0% { transform: translateX(-150%) skewX(-12deg); }
          100% { transform: translateX(250%) skewX(-12deg); }
        }
      `}} />
    </div>
  );
};

export default UsageStats;