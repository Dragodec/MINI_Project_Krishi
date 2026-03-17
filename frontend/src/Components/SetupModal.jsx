import React, { useState } from 'react';
import { 
  Sprout, 
  MapPin, 
  ChevronRight, 
  Loader2, 
  Trees, 
  Mountain, 
  Waves 
} from 'lucide-react';
import axiosInstance from '../API/axiosInstance';
import { toast } from 'react-hot-toast';

const SetupModal = ({ onCreated }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    plotInfo: { 
      name: '', 
      size: { value: 10, unit: 'cent' }, 
      soilType: 'laterite', 
      irrigationType: 'rainfed' 
    },
    location: { coordinates: [76.9, 11.0], district: 'Coimbatore' },
    cropHistory: { currentCrop: '' }
  });

  const handleSetup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axiosInstance.post('/soil/setup', formData);
      toast.success("Field Node Synchronized!", {
        style: { borderRadius: '20px', background: '#064e3b', color: '#fff' }
      });
      onCreated(res.data);
    } catch (err) {
      toast.error(err.response?.data?.error || "Initialization failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 backdrop-blur-xl bg-slate-900/60">
      <div className="bg-white rounded-[3.5rem] w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-white/20">
        
        {/* MODAL HEADER */}
        <div className="bg-[#0F172A] p-10 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full -mr-20 -mt-20 blur-3xl" />
          <div className="relative z-10 flex items-center gap-6">
            <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Sprout size={32} />
            </div>
            <div>
              <h2 className="text-3xl font-black tracking-tight">Initialize Field Node</h2>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mt-1">Digital Twin Configuration</p>
            </div>
          </div>
        </div>

        {/* FORM BODY */}
        <form onSubmit={handleSetup} className="p-10 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* PLOT IDENTITY */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-4 tracking-widest">Plot Identity</label>
              <div className="relative group">
                <input 
                  required 
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-emerald-500/20 focus:bg-white rounded-3xl p-5 font-bold transition-all outline-none" 
                  placeholder="e.g. North Plantation"
                  onChange={val => setFormData({...formData, plotInfo: {...formData.plotInfo, name: val.target.value}})} 
                />
              </div>
            </div>

            {/* CURRENT CROP */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-4 tracking-widest">Primary Crop</label>
              <input 
                required 
                className="w-full bg-slate-50 border-2 border-transparent focus:border-emerald-500/20 focus:bg-white rounded-3xl p-5 font-bold transition-all outline-none" 
                placeholder="e.g. Cavendish Banana"
                onChange={val => setFormData({...formData, cropHistory: {...formData.cropHistory, currentCrop: val.target.value}})} 
              />
            </div>

            {/* SOIL TYPE SELECT */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-4 tracking-widest">Soil Profile</label>
              <div className="relative">
                <select 
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-emerald-500/20 focus:bg-white rounded-3xl p-5 font-bold appearance-none cursor-pointer outline-none transition-all"
                  onChange={e => setFormData({...formData, plotInfo: {...formData.plotInfo, soilType: e.target.value}})}
                >
                  <option value="laterite">Laterite (Standard)</option>
                  <option value="black_soil">Black Soil (High Retention)</option>
                  <option value="alluvial">Alluvial (River Basin)</option>
                  <option value="coastal_sand">Coastal Sand (Fast Drain)</option>
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <Mountain size={18} />
                </div>
              </div>
            </div>

            {/* IRRIGATION SELECT */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-4 tracking-widest">Irrigation Node</label>
              <div className="relative">
                <select 
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-emerald-500/20 focus:bg-white rounded-3xl p-5 font-bold appearance-none cursor-pointer outline-none transition-all"
                  onChange={e => setFormData({...formData, plotInfo: {...formData.plotInfo, irrigationType: e.target.value}})}
                >
                  <option value="rainfed">Natural Rainfed</option>
                  <option value="drip">Drip System</option>
                  <option value="flood">Flood Irrigation</option>
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <Waves size={18} />
                </div>
              </div>
            </div>
          </div>

          {/* GEOLOCATION PREVIEW (Simulated) */}
          <div className="flex items-center gap-4 p-5 bg-emerald-50 rounded-[2rem] border border-emerald-100/50">
             <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-emerald-600 shadow-sm">
                <MapPin size={20} />
             </div>
             <div className="flex-1">
                <p className="text-[10px] font-black text-emerald-800 uppercase tracking-widest">Station Location</p>
                <p className="text-sm font-bold text-emerald-900 leading-tight">Auto-detecting GPS Coordinates...</p>
             </div>
             <span className="text-[10px] font-black text-emerald-600 bg-white px-2 py-1 rounded-md border border-emerald-100 uppercase">Live</span>
          </div>

          <button 
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-6 rounded-3xl shadow-xl shadow-emerald-200 transition-all active:scale-[0.98] flex items-center justify-center gap-3 text-lg uppercase tracking-widest"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Trees size={22} />}
            {loading ? "Synchronizing..." : "Initialize Digital Twin"}
            {!loading && <ChevronRight size={20} />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SetupModal;