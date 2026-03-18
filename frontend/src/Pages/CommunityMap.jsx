import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Loader2, MapPin, AlertTriangle, Bug, Activity, ShieldAlert, PlusCircle, X } from 'lucide-react';
import axiosInstance from '../API/axiosInstance';
import { toast } from 'react-hot-toast';
import L from 'leaflet';
import { sampleData } from './sampleHeatmapData';

// Fix for default marker icons in Leaflet with Webpack/Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Kerala bounding box rough center
const KERALA_CENTER = [10.8505, 76.2711];

const getSeverityColor = (severity) => {
  switch(severity) {
    case 'High': return '#EF4444'; // red-500
    case 'Medium': return '#F59E0B'; // amber-500
    case 'Low': return '#3B82F6'; // blue-500
    default: return '#10B981'; // emerald-500
  }
};

const CommunityMap = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReportModal, setShowReportModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [simulateMode, setSimulateMode] = useState(true);
  
  // Default values based on Kerala
  const [reportForm, setReportForm] = useState({
    cropName: '',
    diseaseName: '',
    severity: 'Medium',
    lat: 10.8505,
    lng: 76.2711,
    district: 'Wayanad'
  });

  useEffect(() => {
    fetchHeatmapData();
    // Try to get actual location for the form
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (pos) => setReportForm(prev => ({ ...prev, lat: pos.coords.latitude, lng: pos.coords.longitude })),
            (err) => console.log("Geolocation denied or unavailable.")
        );
    }
  }, []);

  const fetchHeatmapData = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/heatmap/data');
      setReports(res.data);
    } catch (err) {
      toast.error('Failed to load community heatmap');
    } finally {
      setLoading(false);
    }
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axiosInstance.post('/heatmap/report', {
        cropName: reportForm.cropName,
        diseaseName: reportForm.diseaseName,
        severity: reportForm.severity,
        location: {
            type: "Point",
            coordinates: [parseFloat(reportForm.lng), parseFloat(reportForm.lat)], // MongoDB needs [lng, lat]
            district: reportForm.district
        }
      });
      toast.success("Disease reported to community map!");
      setShowReportModal(false);
      fetchHeatmapData(); // Refresh map
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to submit report");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 relative">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <div>
            <div className="flex items-center gap-3 mb-2">
                <div className="bg-red-100 text-red-600 p-2 rounded-xl">
                    <ShieldAlert size={24} />
                </div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Community Heatmap</h1>
            </div>
            <p className="text-slate-500 font-medium">Real-time local disease tracking to prevent epidemic spread.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
             {/* SIMULATION TOGGLE */}
             <div className="bg-slate-100 p-1.5 rounded-full flex items-center shadow-inner">
               <button 
                  onClick={() => setSimulateMode(false)}
                  className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${!simulateMode ? 'bg-white shadow text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}
               >Live Data</button>
               <button 
                  onClick={() => setSimulateMode(true)}
                  className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${simulateMode ? 'bg-indigo-600 shadow-md shadow-indigo-200 text-white' : 'text-slate-400 hover:text-slate-600'}`}
               >Demo Mode</button>
             </div>

             <button 
                onClick={() => setShowReportModal(true)}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3.5 rounded-full flex items-center gap-2 font-bold shadow-xl shadow-red-200 transition-all active:scale-95 uppercase tracking-widest text-xs"
             >
                <PlusCircle size={18} /> Report Outbreak
             </button>
          </div>
        </header>

        {/* MAP CONTAINER */}
        <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-slate-200 relative h-[65vh]">
          {loading && !simulateMode ? (
             <div className="absolute inset-0 flex items-center justify-center bg-slate-50 z-10">
                 <Loader2 className="animate-spin text-emerald-600 space-y-4" size={40} />
             </div>
          ) : (
            <MapContainer 
                center={KERALA_CENTER} 
                zoom={7} 
                style={{ height: '100%', width: '100%', zIndex: 0 }}
                scrollWheelZoom={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {(simulateMode ? sampleData : reports).map((report) => (
                <CircleMarker
                  key={report._id}
                  // MongoDB stores [lng, lat], Leaflet needs [lat, lng]
                  center={[report.location.coordinates[1], report.location.coordinates[0]]}
                  pathOptions={{ 
                    color: getSeverityColor(report.severity), 
                    fillColor: getSeverityColor(report.severity),
                    fillOpacity: 0.6
                  }}
                  radius={report.severity === 'High' ? 12 : report.severity === 'Medium' ? 8 : 5}
                >
                  <Popup className="rounded-2xl">
                    <div className="p-1">
                      <h3 className="font-black text-slate-900 text-sm mb-1">{report.diseaseName}</h3>
                      <p className="text-xs text-slate-500 mb-2 border-b pb-2"><span className="font-bold text-emerald-600">{report.cropName}</span> • {report.location.district}</p>
                      <div className="flex items-center gap-2">
                         <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md text-white`} style={{ backgroundColor: getSeverityColor(report.severity) }}>
                             {report.severity} Risk
                         </span>
                         <span className="text-[10px] text-slate-400 font-bold">{new Date(report.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}
            </MapContainer>
          )}
        </div>

        {/* STATS STRIP */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-red-100 shadow-sm flex items-center gap-4">
                <div className="bg-red-50 text-red-500 p-4 rounded-2xl"><Bug size={24} /></div>
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Threats</p>
                   <p className="text-2xl font-black text-slate-900">{(simulateMode ? sampleData : reports).filter(r => r.severity === 'High').length}</p>
                </div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-amber-100 shadow-sm flex items-center gap-4">
                <div className="bg-amber-50 text-amber-500 p-4 rounded-2xl"><Activity size={24} /></div>
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Monitoring</p>
                   <p className="text-2xl font-black text-slate-900">{(simulateMode ? sampleData : reports).filter(r => r.severity === 'Medium').length}</p>
                </div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                <div className="bg-blue-50 text-blue-500 p-4 rounded-2xl"><MapPin size={24} /></div>
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Reports (30d)</p>
                   <p className="text-2xl font-black text-slate-900">{(simulateMode ? sampleData : reports).length}</p>
                </div>
            </div>
        </div>
      </div>

      {/* REPORT MODAL */}
      {showReportModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md bg-slate-900/40 animate-in fade-in duration-300">
           <div className="bg-white rounded-[3rem] w-full max-w-lg shadow-2xl relative border border-slate-100 overflow-hidden">
             
             <div className="bg-red-600 p-8 text-white relative">
                <button onClick={() => setShowReportModal(false)} className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"><X size={20}/></button>
                <AlertTriangle size={40} className="mb-4 text-red-200" />
                <h2 className="text-3xl font-black tracking-tight leading-none">Report Outbreak</h2>
                <p className="text-red-200 text-xs font-bold uppercase tracking-widest mt-2">Alert nearby farmers</p>
             </div>

             <form onSubmit={handleReportSubmit} className="p-8 space-y-5">
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Crop Name</label>
                    <input required className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold placeholder:text-slate-300 mt-1 outline-none focus:ring-2 focus:ring-red-500/20" 
                        placeholder="e.g. Banana" value={reportForm.cropName} onChange={e => setReportForm({...reportForm, cropName: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">District</label>
                    <input required className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold placeholder:text-slate-300 mt-1 outline-none focus:ring-2 focus:ring-red-500/20" 
                        placeholder="e.g. Wayanad" value={reportForm.district} onChange={e => setReportForm({...reportForm, district: e.target.value})} />
                  </div>
               </div>

               <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Disease / Pest Name</label>
                  <input required className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold placeholder:text-slate-300 mt-1 outline-none focus:ring-2 focus:ring-red-500/20" 
                      placeholder="e.g. Bunchy Top Virus" value={reportForm.diseaseName} onChange={e => setReportForm({...reportForm, diseaseName: e.target.value})} />
               </div>

               <div>
                 <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Severity Level</label>
                 <select className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold outline-none focus:ring-2 focus:ring-red-500/20 appearance-none mt-1" 
                    value={reportForm.severity} onChange={e => setReportForm({...reportForm, severity: e.target.value})}>
                     <option value="Low">Low - Contained / Minor Signs</option>
                     <option value="Medium">Medium - Spreading Fast</option>
                     <option value="High">High - Severe Epidemic Risk</option>
                 </select>
               </div>

               <div className="pt-4">
                 <button disabled={submitting} type="submit" className="w-full bg-red-600 text-white font-black py-5 rounded-2xl shadow-xl transition-all active:scale-95 disabled:opacity-50 text-sm uppercase tracking-widest flex justify-center items-center gap-2">
                    {submitting ? <Loader2 size={18} className="animate-spin" /> : <AlertTriangle size={18} />}
                    {submitting ? "Broadcasting Warning..." : "Broadcast Warning"}
                 </button>
               </div>
             </form>

           </div>
        </div>
      )}

    </div>
  );
};

export default CommunityMap;
