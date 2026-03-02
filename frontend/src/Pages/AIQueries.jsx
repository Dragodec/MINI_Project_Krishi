import React, { useEffect, useRef, useState, useCallback } from 'react';
import axiosInstance from '../API/axiosInstance';
import { 
  Send, Mic, Image as ImageIcon, Loader2, Paperclip, X,
  MessageSquare, Sprout, Volume2, Trash2, Clock, Calendar,
  Zap, Info, Leaf, Waves, ThermometerSun
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const AIQueries = () => {
  const [messages, setMessages] = useState([]);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [audio, setAudio] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const audioInputRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    fetchChat();
    fetchHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading, scrollToBottom]);

  const normalizeMessages = (msgs) =>
    msgs.map((msg, index) => ({
      ...msg,
      id: msg._id || msg.id || `${Date.now()}-${index}`
    }));

  const fetchChat = async () => {
    try {
      const res = await axiosInstance.get('/chat');
      setMessages(normalizeMessages(res.data.messages || []));
    } catch (err) {
      toast.error("Unable to sync chat history");
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await axiosInstance.get('/chat/history');
      setHistory(res.data.history || []);
    } catch (err) {
      console.log("History fetch failed");
    }
  };

  const handleSend = async () => {
    if (!text.trim() && !image && !audio) return toast.error("Provide a query or file");

    const formData = new FormData();
    if (text) formData.append('text', text);
    if (image) formData.append('image', image);
    if (audio) formData.append('audio', audio);

    const userMsgId = `user-${Date.now()}`;
    const userMessage = {
      role: 'user',
      text,
      image: image ? URL.createObjectURL(image) : null,
      audio: !!audio,
      id: userMsgId
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    setText('');
    setImage(null);
    setAudio(null);

    try {
      const res = await axiosInstance.post('/chat/send', formData);
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: res.data.reply,
        id: `ai-${Date.now()}`
      }]);
    } catch (err) {
      toast.error("AI Station Unreachable");
    } finally {
      setLoading(false);
    }
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return toast.error("Browser not supported");
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.onstart = () => setIsRecording(true);
    recognition.onend = () => setIsRecording(false);
    recognition.onresult = (e) => setText(e.results[0][0].transcript);
    recognition.start();
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-[#F8FAFC] relative overflow-hidden">
      
      {/* HEADER */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-600 p-2.5 rounded-2xl text-white shadow-lg shadow-emerald-200">
            <Sprout size={22} />
          </div>
          <div>
            <h1 className="font-black text-slate-900 tracking-tight leading-none text-lg">Agri-GPT</h1>
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Intelligent Station</span>
          </div>
        </div>

        <button 
          onClick={() => setShowHistory(true)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:border-emerald-200 text-slate-600 rounded-xl transition-all font-bold text-xs uppercase tracking-widest shadow-sm"
        >
          <Clock size={16} className="text-emerald-500" />
          <span className="hidden md:inline">Past Logs</span>
        </button>
      </header>

      {/* CHAT VIEWPORT WITH BOTANICAL PATTERN */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 no-scrollbar relative chat-bg-pattern">
        {messages.length === 0 && !loading && (
          <div className="h-full flex flex-col items-center justify-center max-w-2xl mx-auto text-center">
            <div className="relative mb-8">
                <div className="absolute inset-0 bg-emerald-200 blur-3xl opacity-20 animate-pulse rounded-full"></div>
                <div className="relative w-24 h-24 bg-white border-4 border-emerald-50 rounded-[3rem] flex items-center justify-center shadow-xl">
                    <Leaf size={40} className="text-emerald-600" />
                </div>
            </div>

            <h2 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">Your Field, Digitized.</h2>
            <p className="text-slate-500 font-medium mb-8 leading-relaxed max-w-md">
                Ask about soil health, pest identification, or irrigation planning. 
                Our agronomist core is ready for your first transmission.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full px-4">
                {[
                    { icon: <ImageIcon size={18}/>, label: "Identify Disease", color: "text-blue-600" },
                    { icon: <ThermometerSun size={18}/>, label: "Weather Impact", color: "text-orange-500" },
                    { icon: <Waves size={18}/>, label: "Irrigation Plan", color: "text-emerald-600" }
                ].map((item, idx) => (
                    <button 
                        key={idx} 
                        onClick={() => setText(item.label)}
                        className="flex flex-col items-center gap-3 p-5 bg-white border border-slate-100 rounded-[1.5rem] shadow-sm hover:shadow-md hover:border-emerald-300 transition-all group"
                    >
                        <div className={`${item.color} group-hover:scale-110 transition-transform`}>{item.icon}</div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-emerald-700">{item.label}</span>
                    </button>
                ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`relative max-w-[85%] md:max-w-[70%] p-5 shadow-sm transition-all ${
              msg.role === 'user' 
                ? 'bg-slate-900 text-white rounded-[2rem] rounded-tr-none' 
                : 'bg-white border border-slate-100 text-slate-800 rounded-[2rem] rounded-tl-none'
            }`}>
              {msg.text && <p className="text-sm md:text-base font-bold leading-relaxed">{msg.text}</p>}
              {msg.image && (
                <div className="mt-3 group relative rounded-2xl overflow-hidden border border-black/10">
                  <img src={msg.image} className="w-full object-cover max-h-72" alt="Farm context" />
                </div>
              )}
              <span className={`text-[9px] font-black uppercase tracking-tighter mt-3 block opacity-30 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                {msg.role === 'user' ? 'Local Node' : 'Central Intelligence'}
              </span>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-100 p-5 rounded-[2rem] rounded-tl-none flex items-center gap-3 shadow-md">
              <Loader2 size={18} className="animate-spin text-emerald-500" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Processing Data...</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* INPUT AREA */}
      <div className="px-4 pb-6 md:px-8 md:pb-8 bg-gradient-to-t from-white via-white to-transparent">
        <div className="max-w-4xl mx-auto">
          
          {/* MEDIA PREVIEW */}
          {(image || audio) && (
            <div className="mb-4 flex items-center gap-3 animate-in slide-in-from-bottom-2 bg-emerald-50/80 p-2 rounded-2xl border border-emerald-100 backdrop-blur-sm">
              {image && (
                <div className="relative group w-14 h-14 rounded-xl overflow-hidden shadow-md">
                  <img src={URL.createObjectURL(image)} className="w-full h-full object-cover" alt="preview" />
                  <button onClick={() => setImage(null)} className="absolute inset-0 bg-red-500/80 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
              <div className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Multimedia payload attached</div>
            </div>
          )}

          <div className="bg-white rounded-[2rem] border-2 border-slate-100 shadow-2xl overflow-hidden flex flex-col focus-within:border-emerald-500/30 transition-all">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="w-full bg-transparent border-none outline-none text-slate-900 font-bold placeholder:text-slate-300 px-6 py-5 text-lg"
              placeholder="What would you like to analyze?"
            />
            
            <div className="bg-slate-50/80 px-4 py-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <button onClick={() => fileInputRef.current.click()} className="p-3 text-slate-400 hover:text-emerald-600 hover:bg-white rounded-2xl transition-all flex items-center gap-2">
                        <ImageIcon size={20} />
                        <span className="text-[10px] font-black uppercase hidden sm:inline">Add Image</span>
                    </button>
                    <button onClick={startListening} className={`p-3 rounded-2xl transition-all flex items-center gap-2 ${isRecording ? 'bg-red-500 text-white animate-pulse shadow-lg' : 'text-slate-400 hover:bg-white'}`}>
                        <Mic size={20} />
                        <span className="text-[10px] font-black uppercase hidden sm:inline">{isRecording ? 'Recording...' : 'Voice Query'}</span>
                    </button>
                </div>

                <button 
                    onClick={handleSend} 
                    disabled={loading || (!text && !image)} 
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-7 py-3 rounded-2xl shadow-xl shadow-emerald-200 active:scale-95 transition-all disabled:opacity-30 flex items-center gap-2"
                >
                    <span className="text-xs font-black uppercase tracking-widest">Transmit</span>
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                </button>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-6 mt-4 opacity-40">
             <div className="h-[1px] bg-slate-300 flex-1"></div>
             <p className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.3em] flex items-center gap-2">
                <Info size={10} /> Central Intelligence Authorized
             </p>
             <div className="h-[1px] bg-slate-300 flex-1"></div>
          </div>
        </div>
      </div>

      {/* HISTORY DRAWER */}
      {showHistory && (
        <div className="absolute inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowHistory(false)} />
          <div className="relative w-full max-w-sm bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
             <div className="p-6 border-b flex items-center justify-between">
                <h2 className="font-black text-slate-900 uppercase text-xs tracking-[0.2em]">Transmission Logs</h2>
                <button onClick={() => setShowHistory(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20}/></button>
             </div>
             <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
                {history.length > 0 ? history.map((h, i) => (
                    <div key={i} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-emerald-50 hover:border-emerald-200 transition-all cursor-pointer group">
                        <p className="text-[10px] font-black text-slate-400 mb-1 flex items-center gap-2">
                            <Calendar size={12}/> {new Date(h.date).toLocaleDateString()}
                        </p>
                        <p className="text-sm font-bold text-slate-700 group-hover:text-emerald-700">{h.title || "Untitled Session"}</p>
                    </div>
                )) : (
                    <div className="h-full flex flex-col items-center justify-center opacity-20">
                        <Clock size={48} className="mb-2" />
                        <p className="font-black text-xs uppercase tracking-widest">No Logs Found</p>
                    </div>
                )}
             </div>
          </div>
        </div>
      )}

      {/* HIDDEN INPUTS */}
      <input type="file" hidden ref={fileInputRef} accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
      <input type="file" hidden ref={audioInputRef} accept="audio/*" onChange={(e) => setAudio(e.target.files[0])} />

      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        .chat-bg-pattern {
            background-color: #f8fafc;
            background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 10c-5 0-10 5-10 10s5 10 10 10 10-5 10-10-5-10-10-10zm0 2c4.4 0 8 3.6 8 8s-3.6 8-8 8-8-3.6-8-8 3.6-8 8-8z' fill='%2310b981' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E");
            opacity: 1;
        }
      `}} />
    </div>
  );
};

export default AIQueries;