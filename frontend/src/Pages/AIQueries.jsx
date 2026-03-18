import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../API/axiosInstance';
import { 
  Send, Mic, Image as ImageIcon, Loader2, X,
  Sprout, Trash2, Clock, Calendar, Leaf, Volume2, Plus, Edit3, Share2
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const AIQueries = () => {
  const { chatId } = useParams(); // URL parameter for multi-chat
  const navigate = useNavigate();

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

  // Helper to serve files
  const getFileSrc = (filePath) => {
    if (!filePath) return null;
    if (filePath.startsWith('blob:')) return filePath;
    const normalizedPath = filePath.replace(/\\/g, '/');
    return `http://localhost:5000/${normalizedPath}`;
  };

  const scrollToBottom = useCallback(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Fetch specific chat messages
  const fetchChat = useCallback(async (id) => {
    try {
      const res = await axiosInstance.get(`/chat/${id}`);
      setMessages(res.data.messages || []);
    } catch (err) {
      toast.error("Unable to load this conversation");
      navigate('/queries');
    }
  }, [navigate]);

  // Fetch sidebar history list
  const fetchHistory = async () => {
    try {
      const res = await axiosInstance.get('/chat/history');
      setHistory(res.data.history || []);
    } catch (err) {
      console.log("History fetch failed");
    }
  };

  // Logic to handle route changes
  useEffect(() => {
    fetchHistory();
    if (chatId) {
      fetchChat(chatId);
    } else {
      setMessages([]); // Clear viewport for new chat
    }
  }, [chatId, fetchChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading, scrollToBottom]);

  const handleSend = async () => {
    if (!text.trim() && !image && !audio) {
      return toast.error("Provide a query, image, or voice note");
    }

    const formData = new FormData();
    if (text) formData.append('text', text);
    if (image) formData.append('image', image);
    if (audio) formData.append('audio', audio);
    if (chatId) formData.append('chatId', chatId); // Inform backend which chat to update

    // Optimistic UI
    const userMessage = {
      role: 'user',
      text: text || (image ? "Sent an image for analysis" : "Sent a voice query"),
      image: image ? URL.createObjectURL(image) : null,
      audio: audio ? URL.createObjectURL(audio) : null,
      id: `user-${Date.now()}`
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    const lastText = text;
    setText(''); setImage(null); setAudio(null);

    try {
      const res = await axiosInstance.post('/chat/send', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // If this was a new chat, the backend returns a new chatId
      if (!chatId && res.data.chatId) {
        navigate(`/queries/${res.data.chatId}`);
      } else {
        setMessages(prev => [...prev, {
          role: 'assistant',
          text: res.data.reply,
          id: `ai-${Date.now()}`
        }]);
      }
      fetchHistory();
    } catch (err) {
      toast.error(err.response?.data?.error || "AI Station Unreachable");
      setText(lastText); 
    } finally {
      setLoading(false);
    }
  };

  const deleteChat = async (id, e) => {
    e.stopPropagation();
    if(!window.confirm("Delete this field log?")) return;
    try {
      await axiosInstance.delete(`/chat/${id}`);
      fetchHistory();
      if(chatId === id) navigate('/queries');
      toast.success("Log deleted");
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  const renameChat = async (id, e) => {
    e.stopPropagation();
    const newTitle = prompt("Enter new name for this log:");
    if(!newTitle) return;
    try {
      await axiosInstance.put(`/chat/${id}/rename`, { title: newTitle });
      fetchHistory();
    } catch (err) {
      toast.error("Failed to rename");
    }
  };

  const shareToWhatsApp = (text) => {
    const message = `🌱 *Krishi Officer AI Advisory*\n\n${text}\n\n_Shared from Agri-GPT Network_`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
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

        <div className="flex items-center gap-2">
            <button 
              onClick={() => navigate('/queries')}
              className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-all border border-emerald-100 shadow-sm"
              title="New Chat"
            >
              <Plus size={20} />
            </button>
            <button 
              onClick={() => setShowHistory(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:border-emerald-200 text-slate-600 rounded-xl transition-all font-bold text-xs uppercase tracking-widest shadow-sm"
            >
              <Clock size={16} className="text-emerald-500" />
              <span className="hidden md:inline">Past Logs</span>
            </button>
        </div>
      </header>

      {/* CHAT VIEWPORT */}
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
                Analyze crop health or pest issues using text, images, or voice.
            </p>
          </div>
        )}

        {messages.map((msg, index) => (
          <div key={msg.id || index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`relative max-w-[85%] md:max-w-[70%] p-5 shadow-sm transition-all ${
              msg.role === 'user' 
                ? 'bg-slate-900 text-white rounded-[2rem] rounded-tr-none' 
                : 'bg-white border border-slate-100 text-slate-800 rounded-[2rem] rounded-tl-none'
            }`}>
              {msg.text && <p className="text-sm md:text-base font-bold leading-relaxed whitespace-pre-wrap">{msg.text}</p>}
              
              {msg.image && (
                <div className="mt-3 rounded-2xl overflow-hidden border border-black/10">
                  <img 
                    src={getFileSrc(msg.image)} 
                    className="w-full object-cover max-h-72" 
                    alt="Query context" 
                    onError={(e) => { e.target.src = "https://via.placeholder.com/400?text=Image+Unavailable"; }}
                  />
                </div>
              )}

              {msg.audio && (
                <div className="mt-3">
                  <audio controls className="w-full max-w-[240px] h-10">
                    <source src={getFileSrc(msg.audio)} type="audio/wav" />
                  </audio>
                </div>
              )}

              <div className={`mt-3 flex items-center justify-between ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <span className="text-[9px] font-black uppercase tracking-tighter opacity-30">
                  {msg.role === 'user' ? 'Farmer Node' : 'Krishi Officer AI'}
                </span>
                
                {msg.role === 'assistant' && msg.text && (
                  <button 
                    onClick={() => shareToWhatsApp(msg.text)}
                    title="Forward to WhatsApp Community"
                    className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[#25D366] hover:bg-[#25D366]/10 px-2.5 py-1.5 rounded-lg active:scale-95 transition-all border border-[#25D366]/20"
                  >
                    <Share2 size={12} /> Share
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-100 p-5 rounded-[2rem] rounded-tl-none flex items-center gap-3 shadow-md">
              <Loader2 size={18} className="animate-spin text-emerald-500" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Analyzing Field Data...</span>
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
              {audio && (
                <div className="flex items-center gap-2 p-2 bg-emerald-100 rounded-lg">
                  <Volume2 size={16} className="text-emerald-700" />
                  <span className="text-[10px] font-bold text-emerald-700">Voice Note Ready</span>
                  <button onClick={() => setAudio(null)} className="text-red-500 ml-1"><X size={14}/></button>
                </div>
              )}
            </div>
          )}

          <div className="bg-white rounded-[2rem] border-2 border-slate-100 shadow-2xl overflow-hidden flex flex-col focus-within:border-emerald-500/30 transition-all">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="w-full bg-transparent border-none outline-none text-slate-900 font-bold placeholder:text-slate-300 px-6 py-5 text-lg"
              placeholder="Describe your crop issue..."
            />
            
            <div className="bg-slate-50/80 px-4 py-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <button onClick={() => fileInputRef.current.click()} className="p-3 text-slate-400 hover:text-emerald-600 hover:bg-white rounded-2xl transition-all flex items-center gap-2">
                        <ImageIcon size={20} />
                        <span className="text-[10px] font-black uppercase hidden sm:inline">Add Image</span>
                    </button>
                    <button onClick={startListening} className={`p-3 rounded-2xl transition-all flex items-center gap-2 ${isRecording ? 'bg-red-500 text-white animate-pulse shadow-lg' : 'text-slate-400 hover:bg-white'}`}>
                        <Mic size={20} />
                        <span className="text-[10px] font-black uppercase hidden sm:inline">{isRecording ? 'Listening...' : 'Voice'}</span>
                    </button>
                </div>

                <button 
                    onClick={handleSend} 
                    disabled={loading || (!text && !image && !audio)} 
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-7 py-3 rounded-2xl shadow-xl shadow-emerald-200 active:scale-95 transition-all disabled:opacity-30 flex items-center gap-2"
                >
                    <span className="text-xs font-black uppercase tracking-widest">Analyze</span>
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                </button>
            </div>
          </div>
        </div>
      </div>

      {/* DRAWER & HIDDEN INPUTS */}
      {showHistory && (
        <div className="absolute inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowHistory(false)} />
          <div className="relative w-full max-w-sm bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
             <div className="p-6 border-b flex items-center justify-between">
                <h2 className="font-black text-slate-900 uppercase text-xs tracking-[0.2em]">Field Logs</h2>
                <button onClick={() => setShowHistory(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20}/></button>
             </div>
             <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
                {history.map((h) => (
                    <div 
                      key={h._id} 
                      onClick={() => { navigate(`/queries/${h._id}`); setShowHistory(false); }}
                      className={`p-4 rounded-2xl transition-all cursor-pointer border flex justify-between items-center ${chatId === h._id ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-100 hover:bg-emerald-50'}`}
                    >
                        <div className="overflow-hidden">
                            <p className="text-[10px] font-black text-slate-400 mb-1 flex items-center gap-2">
                                <Calendar size={12}/> {new Date(h.createdAt).toLocaleDateString()}
                            </p>
                            <p className="text-sm font-bold text-slate-700 truncate pr-2">
                              {h.title || "Multimedia Query"}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={(e) => renameChat(h._id, e)} className="p-2 text-slate-400 hover:text-blue-500 hover:bg-white rounded-lg transition-all">
                            <Plus size={14} className="rotate-45" /> {/* Using Edit/Plus as placeholders */}
                            <Edit3 size={14} />
                          </button>
                          <button onClick={(e) => deleteChat(h._id, e)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-white rounded-lg transition-all">
                            <Trash2 size={14} />
                          </button>
                        </div>
                    </div>
                ))}
             </div>
          </div>
        </div>
      )}

      <input type="file" hidden ref={fileInputRef} accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
      <input type="file" hidden ref={audioInputRef} accept="audio/*" onChange={(e) => setAudio(e.target.files[0])} />

      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .chat-bg-pattern {
            background-color: #f8fafc;
            background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 10c-5 0-10 5-10 10s5 10 10 10 10-5 10-10-5-10-10-10zm0 2c4.4 0 8 3.6 8 8s-3.6 8-8 8-8-3.6-8-8 3.6-8 8-8z' fill='%2310b981' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E");
        }
      `}} />
    </div>
  );
};

export default AIQueries;