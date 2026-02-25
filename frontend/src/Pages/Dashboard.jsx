import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, History, LogOut, PlusCircle, Leaf } from 'lucide-react';
import { toast } from 'react-hot-toast';
import axiosInstance from '../API/axiosInstance';

const Dashboard = () => {
  const navigate = useNavigate();
  const userName = "Farmer Friend"; // You can fetch this from your '/auth/me' route later

  const handleLogout = async () => {
    try {
      // 1. Tell backend to clear the HttpOnly cookie
      await axiosInstance.post('/auth/logout');
      
      // 2. Clear non-sensitive UI state
      localStorage.removeItem('role');
      
      toast.success("Logged out successfully");
      
      // 3. Redirect to login
      navigate('/login');
    } catch (err) {
      toast.error("Logout failed. Please try again.");
      console.error("Logout Error:", err);
    }
  };

  return (
    <div className="flex min-h-screen bg-stone-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-stone-200 hidden md:flex flex-col">
        <div className="p-6 flex items-center gap-2 border-b border-stone-100">
          <div className="bg-emerald-600 p-1.5 rounded-lg text-white">
            <Leaf size={20} />
          </div>
          <span className="font-bold text-emerald-900 text-xl">AgriAI</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-emerald-50 text-emerald-700 rounded-xl font-bold transition">
            <LayoutDashboard size={20} /> Dashboard
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-stone-100 rounded-xl font-medium transition">
            <MessageSquare size={20} /> AI Queries
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-stone-100 rounded-xl font-medium transition">
            <History size={20} /> History
          </button>
        </nav>

        <div className="p-4 border-t border-stone-100">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl font-medium transition"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Welcome, {userName}!</h1>
            <p className="text-slate-500">How is your crop doing today?</p>
          </div>
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-full font-bold flex items-center gap-2 shadow-lg shadow-emerald-100 transition">
            <PlusCircle size={18} /> New Query
          </button>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { label: 'Total Queries', value: '12' },
            { label: 'Identified Diseases', value: '4' },
            { label: 'Krishibhavan Alerts', value: '2' },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
              <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">{stat.label}</p>
              <p className="text-3xl font-black mt-1 text-slate-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Recent Activity Placeholder */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-stone-100">
            <h3 className="font-bold text-slate-900">Recent AI Analyses</h3>
          </div>
          <div className="p-12 text-center">
            <div className="bg-stone-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-stone-300">
              <History size={32} />
            </div>
            <p className="text-slate-400">No recent activity to show.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;