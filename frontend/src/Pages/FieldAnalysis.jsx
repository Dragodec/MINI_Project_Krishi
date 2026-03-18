import React, { useEffect, useState, useCallback } from 'react';
import { 
  Sprout, Droplets, Thermometer, Activity, AlertCircle, 
  RefreshCw, MapPin, Waves, CheckCircle2, CloudRain, 
  Droplet, Wind, X, Info, ChevronRight, Loader2,
  Mountain, Trees, Sun, RotateCcw, Zap, FlaskConical
} from 'lucide-react';
import axiosInstance from '../API/axiosInstance';
import { toast } from 'react-hot-toast';

const FieldAnalysis = () => {
  const [plot, setPlot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [showRainModal, setShowRainModal] = useState(false);

  // 🔄 Fetch Logic with Polling
  const fetchStatus = useCallback(async (quiet = false) => {
    if (!quiet) setLoading(true);
    try {
      const res = await axiosInstance.get('/soil/status');
      setPlot(res.data);
      setShowSetup(false);
    } catch (err) {
      if (err.response?.status === 404) setShowSetup(true);
    } finally {
      if (!quiet) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(() => { if (plot) fetchStatus(true); }, 45000);
    return () => clearInterval(interval);
  }, [fetchStatus, !!plot]);

  // --- ACTIONS ---

  const runRainSimulation = async (amount) => {
    setSimulating(true);
    setShowRainModal(false);
    try {
      const res = await axiosInstance.post('/soil/simulate-rain', { amountMm: amount });
      setPlot(res.data.data);
      toast.success(`Rain simulated: Moisture +${res.data.data.simulationState.moistureContent - plot.simulationState.moistureContent}%`, { icon: '🌧️' });
    } catch (err) {
      toast.error("Rain simulation failed");
    } finally { setSimulating(false); }
  };

  const runIrrigation = async () => {
    setSimulating(true);
    try {
      const res = await axiosInstance.post('/soil/irrigate', { method: 'drip', waterAmountLiters: 50 });
      setPlot(res.data.data);
      toast.success("Irrigation sequence successful", { icon: '💧' });
    } catch (err) {
      toast.error("Irrigation system failure");
    } finally { setSimulating(false); }
  };

  const runHeatSim = async () => {
    setSimulating(true);
    try {
      const res = await axiosInstance.post('/soil/dry');
      setPlot(res.data.data || res.data); // Adjust based on your specific backend return
      toast.success("Heatwave simulated: Moisture dropped", { icon: '☀️' });
      fetchStatus(true); // Force refresh to catch all side effects
    } catch (err) {
      toast.error("Heat simulation failed");
    } finally { setSimulating(false); }
  };

  const runReset = async () => {
    if (!window.confirm("Are you sure? This will reset all simulated soil data.")) return;
    setSimulating(true);
    try {
      await axiosInstance.post('/soil/reset');
      toast.success("Field Environment Reset");
      fetchStatus();
    } catch (err) {
      toast.error("Reset failed");
    } finally { setSimulating(false); }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <RefreshCw className="animate-spin text-emerald-600" size={32} />
    </div>
  );

  if (showSetup) return <SetupModal onCreated={(data) => { setPlot(data); setShowSetup(false); }} />;

  const { simulationState, plotInfo, weatherContext, recommendations } = plot;

  const getMoistureUI = (val) => {
    if (val < 25) return { bar: "bg-red-500", text: "text-red-600", label: "Critically Dry", icon: "text-red-400" };
    if (val < 50) return { bar: "bg-amber-500", text: "text-amber-600", label: "Needs Water", icon: "text-amber-400" };
    return { bar: "bg-emerald-500", text: "text-emerald-600", label: "Optimal", icon: "text-emerald-400" };
  };
  const mUI = getMoistureUI(simulationState.moistureContent);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans">
      
      {/* 🟢 HERO SECTION */}
      <div className="bg-[#0F172A] pt-12 pb-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px]" />
        
        <div className="max-w-6xl mx-auto relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-emerald-500 text-white px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest">Station Online</span>
              <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{plotInfo.soilType} Node</span>
            </div>
            <h1 className="text-5xl font-black text-white tracking-tight leading-none mb-2">{plotInfo.name}</h1>
            <p className="text-slate-400 font-bold flex items-center gap-2">
              <MapPin size={16} className="text-emerald-500" /> Sensor ID: {plot._id.slice(-6).toUpperCase()} • {plot.cropHistory.currentCrop}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
             <button onClick={() => setShowRainModal(true)} className="bg-white/10 hover:bg-white/20 text-white px-6 py-4 rounded-2xl flex items-center gap-3 font-bold border border-white/10 backdrop-blur-md transition-all active:scale-95">
                <CloudRain size={20} className="text-blue-400" /> Rain
             </button>
             <button onClick={runIrrigation} className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-4 rounded-2xl flex items-center gap-3 font-bold transition-all active:scale-95 shadow-xl shadow-emerald-500/20">
                <Droplet size={20} /> Irrigate
             </button>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 -mt-12 relative z-20 space-y-8">
        
        {/* 📊 STATUS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 bg-slate-50 ${mUI.icon}`}>
              <Droplets size={24} />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Soil Moisture</p>
            <h4 className={`text-4xl font-black ${mUI.text}`}>{Math.round(simulationState.moistureContent)}%</h4>
            <div className="mt-6 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
               <div className={`h-full ${mUI.bar} transition-all duration-1000`} style={{ width: `${simulationState.moistureContent}%` }} />
            </div>
          </div>

          <StatCard label="Nitrogen" value={simulationState.estimatedNutrients.nitrogen} icon={<Activity />} color="text-emerald-500" bg="bg-emerald-50" />
          <StatCard label="pH Level" value={simulationState.estimatedNutrients.pH} icon={<Thermometer />} color="text-amber-500" bg="bg-amber-50" />
          <StatCard label="Health" value={`${simulationState.healthScore}/100`} icon={<CheckCircle2 />} color="text-purple-500" bg="bg-purple-50" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* 🛠️ SIMULATION CONTROL PANEL (New Section) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-[3rem] p-8 shadow-xl shadow-slate-200 border border-slate-100">
                <h3 className="font-black text-slate-900 mb-6 flex items-center gap-2">
                    <Zap size={18} className="text-amber-500" /> Command Center
                </h3>
                <div className="space-y-3">
                    <button 
                        onClick={runHeatSim} 
                        disabled={simulating}
                        className="w-full p-4 bg-orange-50 border border-orange-100 rounded-2xl flex items-center justify-between group hover:bg-orange-100 transition-all"
                    >
                        <div className="flex items-center gap-3">
                            <Sun className="text-orange-500" size={20} />
                            <span className="font-bold text-orange-900">Simulate Heatwave</span>
                        </div>
                        <ChevronRight size={16} className="text-orange-300 group-hover:translate-x-1 transition-all" />
                    </button>

                    <button 
                        onClick={runReset} 
                        disabled={simulating}
                        className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between group hover:bg-red-50 hover:border-red-100 transition-all"
                    >
                        <div className="flex items-center gap-3 text-slate-600 group-hover:text-red-600">
                            <RotateCcw size={20} />
                            <span className="font-bold">Reset Environment</span>
                        </div>
                        <ChevronRight size={16} className="text-slate-300 group-hover:text-red-300 transition-all" />
                    </button>
                </div>

                <div className="mt-8 pt-8 border-t border-slate-50">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Environmental Impact</p>
                    <div className="flex justify-between items-center text-sm font-bold text-slate-700">
                        <span>Last Rainfall</span>
                        <span className="text-blue-500">{weatherContext.lastRainfallMM}mm</span>
                    </div>
                </div>
            </div>
            
            <DosageCalculator />

            {/* Advice Box */}
            <div className="bg-slate-900 rounded-[3rem] p-8 text-white shadow-2xl relative overflow-hidden group">
               <Sprout size={100} className="absolute -bottom-4 -right-4 opacity-10 group-hover:scale-110 transition-transform" />
               <h4 className="font-black text-emerald-400 uppercase text-xs tracking-widest mb-2">Simulated Node</h4>
               <p className="text-sm font-medium leading-relaxed text-slate-300">
                  This station uses a Rule-Based Engine to simulate soil physics based on {plotInfo.soilType} absorption rates.
               </p>
            </div>
          </div>

          {/* 📝 ADVISORIES */}
          <div className="lg:col-span-8 bg-white rounded-[3rem] p-10 shadow-2xl shadow-slate-200 border border-slate-100">
            <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
              <Waves className="text-emerald-600" /> Agronomic Guidance
            </h2>
            
            {recommendations.length > 0 ? (
              <div className="space-y-4">
                {recommendations.map((rec, i) => (
                  <div key={i} className="flex items-start gap-5 p-6 rounded-3xl bg-slate-50 border-l-4 border-emerald-500">
                    <div className="p-3 bg-white rounded-2xl shadow-sm text-emerald-600">
                      <AlertCircle size={24} />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{rec.category} • {rec.priority} Priority</p>
                      <p className="text-lg font-bold text-slate-800 leading-tight mb-2">{rec.messageEn}</p>
                      <p className="text-sm font-medium text-slate-500 italic mb-4">{rec.messageMl}</p>
                      <span className="text-[10px] font-black bg-emerald-100 text-emerald-700 px-3 py-1 rounded-lg uppercase">Action: {rec.dosage}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-16 text-center border-2 border-dashed border-slate-100 rounded-[3rem]">
                <CheckCircle2 size={56} className="mx-auto mb-4 text-emerald-100" />
                <p className="font-black uppercase tracking-widest text-slate-300 text-xs">Soil parameters are within optimal safety limits</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* RAIN MODAL */}
      {showRainModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 backdrop-blur-md bg-slate-900/40 animate-in fade-in duration-300">
            <div className="bg-white rounded-[3.5rem] p-10 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-300 relative border border-slate-100">
                <button onClick={() => setShowRainModal(false)} className="absolute top-8 right-8 p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20}/></button>
                <div className="mb-8 text-center">
                    <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-[1.5rem] flex items-center justify-center mx-auto mb-4 shadow-sm"><CloudRain size={32} /></div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Simulate Rain</h3>
                    <p className="text-[10px] font-black text-slate-400 mt-2 uppercase tracking-widest">Select Precipitation Level</p>
                </div>
                <div className="grid grid-cols-1 gap-3">
                    {[
                        { val: 5, label: 'Light Drizzle', color: 'hover:bg-blue-50 hover:border-blue-200' },
                        { val: 20, label: 'Moderate Rain', color: 'hover:bg-blue-100 hover:border-blue-300' },
                        { val: 50, label: 'Heavy Storm', color: 'hover:bg-blue-600 hover:text-white' }
                    ].map((btn) => (
                        <button key={btn.val} onClick={() => runRainSimulation(btn.val)} className={`w-full p-6 border-2 border-slate-100 rounded-[2rem] text-left transition-all group flex justify-between items-center ${btn.color}`}>
                            <div><p className="font-black">{btn.label}</p><p className="text-[10px] opacity-60 uppercase font-bold">{btn.val}mm volume</p></div>
                            <ChevronRight size={18} className="opacity-30 group-hover:translate-x-1 transition-all" />
                        </button>
                    ))}
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

// --- SUB COMPONENTS ---

const StatCard = ({ label, value, icon, color, bg }) => (
  <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 group hover:-translate-y-1 transition-all">
    <div className={`${bg} ${color} w-12 h-12 rounded-2xl flex items-center justify-center mb-6`}>
      {React.cloneElement(icon, { size: 24 })}
    </div>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
    <p className="text-3xl font-black text-slate-900">{value}</p>
  </div>
);

const SetupModal = ({ onCreated }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    plotInfo: { name: '', soilType: 'laterite', irrigationType: 'rainfed' },
    cropHistory: { currentCrop: '' },
    location: { coordinates: [76.9, 11.0], district: 'Kerala' }
  });

  const handleSetup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axiosInstance.post('/soil/setup', formData);
      onCreated(res.data);
    } catch (err) { toast.error("Setup failed"); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 backdrop-blur-xl bg-slate-900/60">
      <div className="bg-white rounded-[3.5rem] w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="bg-[#0F172A] p-10 text-white relative">
          <div className="relative z-10 flex items-center gap-6">
            <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center"><Sprout size={32} /></div>
            <div>
              <h2 className="text-3xl font-black tracking-tight leading-none">Register Field</h2>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-2">Initialize Digital Twin</p>
            </div>
          </div>
        </div>
        <form onSubmit={handleSetup} className="p-10 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputGroup label="Plot Identity" placeholder="e.g. South Field" onChange={v => setFormData({...formData, plotInfo: {...formData.plotInfo, name: v}})} />
            <InputGroup label="Crop Type" placeholder="e.g. Banana" onChange={v => setFormData({...formData, cropHistory: {...formData.cropHistory, currentCrop: v}})} />
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-4 tracking-widest">Soil Type</label>
              <select className="w-full bg-slate-50 border-none rounded-3xl p-5 font-bold appearance-none outline-none" onChange={e => setFormData({...formData, plotInfo: {...formData.plotInfo, soilType: e.target.value}})}>
                <option value="laterite">Laterite</option>
                <option value="black_soil">Black Soil</option>
                <option value="alluvial">Alluvial</option>
              </select>
            </div>
          </div>
          <button disabled={loading} className="w-full bg-emerald-600 text-white font-black py-6 rounded-3xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 uppercase tracking-widest">
            {loading ? <Loader2 className="animate-spin" /> : <Trees size={22} />}
            {loading ? "Syncing..." : "Activate Station"}
          </button>
        </form>
      </div>
    </div>
  );
};

const DosageCalculator = () => {
  const [size, setSize] = useState(1);
  const [unit, setUnit] = useState('acre');
  const [chemical, setChemical] = useState('neem_oil');

  const chemicals = {
    npk_19: { name: 'NPK 19:19:19 (Foliar)', calc: (acres) => `${(5 * acres).toFixed(1)} Kg` },
    urea: { name: 'Urea (Top Dress)', calc: (acres) => `${(45 * acres).toFixed(1)} Kg` },
    neem_oil: { name: 'Neem Oil 10000ppm', calc: (acres) => `${(1 * acres).toFixed(1)} Liters + ${(200 * acres).toFixed(0)}L Water` },
    copper_50wp: { name: 'Copper Fungicide 50%', calc: (acres) => `${(1 * acres).toFixed(1)} Kg` },
    bordeaux: { name: 'Bordeaux (1%)', calc: (acres) => `${(4 * acres).toFixed(1)}kg CuSO4 + ${(4 * acres).toFixed(1)}kg Lime` },
    tricho: { name: 'Trichoderma Viride', calc: (acres) => `${(2.5 * acres).toFixed(1)} Kg + ${(50 * acres).toFixed(0)}kg Compost` },
  };

  const getAcres = () => {
    const val = parseFloat(size) || 0;
    if (unit === 'hectare') return val * 2.47105;
    if (unit === 'cent') return val * 0.01;
    return val;
  };

  const acres = getAcres();
  const rawOutput = chemicals[chemical].calc(acres);

  return (
    <div className="bg-white rounded-[3rem] p-8 shadow-sm hover:shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden group hover:border-indigo-200 transition-all">
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/5 rounded-full blur-[40px] pointer-events-none group-hover:bg-indigo-500/10 transition-colors" />
      <h3 className="font-black text-slate-900 mb-6 flex items-center gap-2 relative z-10">
        <FlaskConical size={18} className="text-indigo-500" /> Rx Dosage Engine
      </h3>
      
      <div className="space-y-4 relative z-10">
        <div className="flex gap-3">
            <input 
              type="number" min="0.1" step="0.1"
              value={size} onChange={e => setSize(e.target.value)}
              className="w-1/2 bg-slate-50 border-none rounded-2xl p-4 font-black text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/20 text-center shadow-inner"
            />
            <select 
              value={unit} onChange={e => setUnit(e.target.value)}
              className="w-1/2 bg-slate-50 border-none rounded-2xl p-4 font-black text-slate-500 outline-none focus:ring-2 focus:ring-indigo-500/20 appearance-none text-center cursor-pointer shadow-inner hover:bg-slate-100 transition-colors"
            >
              <option value="acre">Acres</option>
              <option value="hectare">Hectares</option>
              <option value="cent">Cents</option>
            </select>
        </div>
        
        <select 
          value={chemical} onChange={e => setChemical(e.target.value)}
          className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20 appearance-none cursor-pointer shadow-inner hover:bg-slate-100 transition-colors"
        >
          {Object.entries(chemicals).map(([k, v]) => (
            <option key={k} value={k}>{v.name}</option>
          ))}
        </select>

        <div className="mt-6 pt-2">
            <div className="p-5 bg-indigo-50 rounded-2xl border border-indigo-100 flex flex-col items-center justify-center text-center group-hover:border-indigo-300 transition-colors">
                <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-1.5">Required Farm Volume</p>
                <p className="text-xl font-black text-indigo-700 whitespace-nowrap leading-tight">{rawOutput}</p>
            </div>
        </div>
      </div>
    </div>
  );
};

const InputGroup = ({ label, placeholder, onChange }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-400 uppercase ml-4 tracking-widest">{label}</label>
    <input required className="w-full bg-slate-50 border-none rounded-3xl p-5 font-bold placeholder:text-slate-300 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 transition-all outline-none shadow-inner" 
      placeholder={placeholder} onChange={e => onChange(e.target.value)} />
  </div>
);

export default FieldAnalysis;