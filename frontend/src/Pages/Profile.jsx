import React, { useEffect, useState } from 'react';
import { 
  User, 
  Mail, 
  ShieldCheck, 
  Calendar, 
  Key, 
  Edit3, 
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import axiosInstance from '../API/axiosInstance';
import { toast } from 'react-hot-toast';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [editName, setEditName] = useState('');
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: ''
  });

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await axiosInstance.get('/auth/me');
      setUser(res.data);
      setEditName(res.data.name);
    } catch (err) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      const res = await axiosInstance.patch('/auth/update-profile', {
        name: editName
      });
      setUser(res.data.user);
      toast.success("Profile updated");
    } catch (err) {
      toast.error("Update failed");
    } finally {
      setUpdating(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!passwords.currentPassword || !passwords.newPassword) {
      return toast.error("Please fill in both password fields");
    }
    setUpdating(true);
    try {
      await axiosInstance.patch('/auth/change-password', passwords);
      toast.success("Password updated successfully");
      setPasswords({ currentPassword: '', newPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.error || "Error updating password");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans selection:bg-emerald-100">
      
      {/* HEADER HERO */}
      <div className="bg-[#0F172A] pt-16 pb-32 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full -ml-32 -mt-32 blur-[120px]" />
        
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-4xl font-black shadow-2xl">
                {user.name.charAt(0).toUpperCase()}
              </div>
              {user.isVerified && (
                <div className="absolute -bottom-2 -right-2 bg-white p-1.5 rounded-2xl shadow-lg">
                  <CheckCircle2 className="text-emerald-500 w-6 h-6" />
                </div>
              )}
            </div>
            
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-2">
                {user.name}
              </h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                <span className="bg-white/10 backdrop-blur-md text-emerald-300 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-white/10">
                  {user.role}
                </span>
                <span className="bg-white/5 backdrop-blur-md text-slate-400 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-white/5">
                  ID: {user._id.slice(-6)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <main className="max-w-5xl mx-auto px-4 -mt-16 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: INFORMATION */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-[3rem] p-8 shadow-2xl shadow-slate-200 border border-slate-100">
              <h2 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
                <ShieldCheck className="text-emerald-600" size={22} /> Account Details
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</p>
                    <p className="text-slate-900 font-bold">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Member Since</p>
                    <p className="text-slate-900 font-bold">{new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric', day: 'numeric' })}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-50">
                  <div className={`flex items-center gap-2 p-4 rounded-3xl ${user.isVerified ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                    {user.isVerified ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                    <span className="text-xs font-black uppercase tracking-tight">
                      {user.isVerified ? 'Verified Account' : 'Verification Pending'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: ACTIONS */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* EDIT NAME CARD */}
            <div className="bg-white rounded-[3rem] p-10 shadow-2xl shadow-slate-200 border border-slate-100">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                  <Edit3 className="text-emerald-600" size={24} /> General
                </h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block">Display Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-slate-50 border-none rounded-3xl p-5 text-slate-900 font-bold focus:ring-2 focus:ring-emerald-500 transition-all shadow-inner"
                  />
                </div>

                <button
                  onClick={handleUpdate}
                  disabled={updating}
                  className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 px-10 rounded-3xl transition-all shadow-lg shadow-emerald-200 active:scale-95 flex items-center justify-center gap-2"
                >
                  {updating && <Loader2 size={18} className="animate-spin" />}
                  Save Profile Changes
                </button>
              </div>
            </div>

            {/* PASSWORD CARD */}
            <div className="bg-white rounded-[3.5rem] p-10 shadow-2xl shadow-slate-200 border border-slate-100">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3 mb-8">
                <Key className="text-slate-900" size={24} /> Security
              </h2>

              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <input
                    type="password"
                    placeholder="Current Password"
                    value={passwords.currentPassword}
                    onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                    className="w-full bg-slate-50 border-none rounded-3xl p-5 text-slate-900 font-bold focus:ring-2 focus:ring-slate-900 transition-all shadow-inner"
                  />
                  <input
                    type="password"
                    placeholder="New Password"
                    value={passwords.newPassword}
                    onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                    className="w-full bg-slate-50 border-none rounded-3xl p-5 text-slate-900 font-bold focus:ring-2 focus:ring-slate-900 transition-all shadow-inner"
                  />
                </div>

                <button
                  onClick={handlePasswordChange}
                  disabled={updating}
                  className="w-full bg-slate-900 hover:bg-black text-white font-black py-4 rounded-3xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                >
                  {updating && <Loader2 size={18} className="animate-spin" />}
                  Update Security Credentials
                </button>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;