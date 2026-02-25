import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Mic, 
  Image as ImageIcon, 
  MessageSquare, 
  ShieldCheck, 
  MapPin, 
  Zap, 
  ArrowRight, 
  PhoneCall, 
  Globe 
} from 'lucide-react';

// Using your Capitalized directory structure
import { useLanguage } from '../Context/LanguageContext';
import { TRANSLATIONS } from '../Constants/Translations';

const LandingPage = () => {
  const [query, setQuery] = useState('');
  const { language, toggleLanguage } = useLanguage();
  
  // Accessing translations based on global state
  const t = TRANSLATIONS[language];

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* Navigation */}
      <nav className="sticky top-0 z-50 flex items-center justify-between bg-white/80 px-6 py-4 backdrop-blur-md border-b border-stone-200 lg:px-16">
        <div className="flex items-center gap-2">
          <div className="bg-emerald-600 p-1.5 rounded-lg shadow-sm">
            <Zap className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-emerald-900">
            AgriAI <span className="text-emerald-600">{language === 'ml' ? 'Malayalam' : 'Global'}</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 mr-4">
            {t.nav.map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(/\s/g, '-')}`} className="hover:text-emerald-700 transition-colors">
                {item}
              </a>
            ))}
          </div>
          
          {/* Language Toggle */}
          <button 
            onClick={toggleLanguage}
            className="flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-stone-50 transition-all active:scale-95 shadow-sm"
          >
            <Globe size={16} className="text-emerald-600" />
            {language === 'ml' ? 'English' : 'മലയാളം'}
          </button>
          
          {/* Signup Redirect Button */}
          <Link 
            to="/login" 
            className="rounded-full bg-emerald-700 px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-emerald-800 shadow-md hover:shadow-emerald-200 active:scale-95"
          >
            {language === 'ml' ? 'തുടങ്ങാം' : 'Open App'}
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative overflow-hidden bg-white px-6 pt-16 pb-24 lg:px-16 lg:pt-24">
        {/* Decorative Background Element */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-[0.03] pointer-events-none">
          <div className="absolute top-10 left-10 w-64 h-64 bg-emerald-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-700 rounded-full blur-3xl"></div>
        </div>

        <div className="relative mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-sm font-bold text-emerald-700 mb-6 border border-emerald-100 shadow-sm">
            <ShieldCheck size={16} />
            {t.heroBadge}
          </div>
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-slate-900 md:text-7xl leading-[1.1]">
            {t.heroTitle[0]} <br /> 
            <span className="text-emerald-600 font-black drop-shadow-sm">{t.heroTitle[1]}</span>
          </h1>
          <p className="mb-10 text-lg text-slate-600 md:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
            {t.heroSub}
          </p>

          {/* Main Search/Query Box */}
          <div className="relative mx-auto max-w-2xl group">
            <div className="flex flex-col md:flex-row items-center gap-3 rounded-2xl bg-white p-2 shadow-2xl border border-stone-100 group-focus-within:ring-4 ring-emerald-500/10 transition-all">
              <input
                type="text"
                placeholder={t.inputPlaceholder}
                className="w-full rounded-xl border-none bg-transparent px-4 py-4 text-lg outline-none focus:ring-0 placeholder:text-slate-300"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <div className="flex w-full md:w-auto gap-2 p-1">
                <button className="flex h-12 w-12 items-center justify-center rounded-xl bg-stone-100 text-slate-500 hover:bg-emerald-50 hover:text-emerald-600 transition-colors" title="Voice Search">
                  <Mic size={20} />
                </button>
                <button className="flex h-12 w-12 items-center justify-center rounded-xl bg-stone-100 text-slate-500 hover:bg-emerald-50 hover:text-emerald-600 transition-colors" title="Upload Photo">
                  <ImageIcon size={20} />
                </button>
                <button className="flex flex-1 md:flex-none items-center justify-center gap-2 rounded-xl bg-emerald-600 px-8 py-3 font-bold text-white shadow-lg hover:bg-emerald-700 transition-all active:scale-[0.98]">
                  <span>{t.askBtn}</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
            <p className="mt-4 text-sm font-medium text-slate-400">
              {t.suggestionText}
            </p>
          </div>
        </div>
      </header>

      {/* Trust Indicators Section */}
      <section className="bg-stone-50 py-12 border-y border-stone-200">
        <div className="mx-auto max-w-7xl px-6 lg:px-16 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-8">
            {t.trustLabel}
          </p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500 cursor-default">
            <div className="font-black text-xl text-slate-800 border-b-2 border-emerald-500 pb-1">Krishibhavan</div>
            <div className="font-black text-xl text-slate-800 border-b-2 border-emerald-500 pb-1">Agri Dept. Kerala</div>
            <div className="font-black text-xl text-slate-800 border-b-2 border-emerald-500 pb-1">KAU Guidelines</div>
          </div>
        </div>
      </section>

      {/* Step-by-Step Guide */}
      <section id="how-it-works" className="py-24 px-6 lg:px-16 bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-3xl md:text-4xl font-black mb-4">{t.stepsTitle}</h2>
            <div className="h-1.5 w-20 bg-emerald-500 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {t.steps.map((step, idx) => (
              <div key={idx} className="group relative flex flex-col items-center text-center p-6 rounded-3xl hover:bg-stone-50 transition-colors">
                <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-[2rem] bg-emerald-50 text-emerald-700 shadow-inner group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 transform group-hover:rotate-6">
                  {idx === 0 ? <MessageSquare size={36} /> : idx === 1 ? <Zap size={36} /> : <PhoneCall size={36} />}
                </div>
                <h4 className="text-xl font-bold mb-4 text-slate-900">{step.t}</h4>
                <p className="text-slate-500 leading-relaxed font-medium">{step.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact/Features Feature Card */}
      <section id="features" className="py-16 px-4 lg:px-16 bg-white">
        <div className="mx-auto max-w-7xl bg-emerald-900 text-white rounded-[3rem] p-8 md:p-16 shadow-2xl shadow-emerald-900/20 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          
          <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
            <div>
              <h2 className="text-4xl md:text-5xl font-black mb-10 leading-tight">
                {t.featuresTitle[0]} <br/> 
                <span className="text-emerald-400">{t.featuresTitle[1]}</span>
              </h2>
              <div className="space-y-10">
                {t.featureList.map((item, idx) => (
                  <div key={idx} className="flex gap-6 group">
                    <div className="mt-1 h-12 w-12 shrink-0 rounded-2xl bg-white/10 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                      {idx === 0 ? <ShieldCheck size={24}/> : <MapPin size={24}/>}
                    </div>
                    <div>
                      <h5 className="font-bold text-xl mb-2">{item.t}</h5>
                      <p className="text-emerald-100/70 leading-relaxed font-medium">{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Mockup / Visual Indicator */}
            <div className="bg-emerald-800/40 backdrop-blur-sm p-6 md:p-10 rounded-[2.5rem] border border-white/10 shadow-inner">
               <div className="space-y-6">
                <div className="bg-white/10 p-5 rounded-2xl border border-white/5 animate-pulse">
                  <p className="text-sm italic opacity-90 text-white font-medium">
                    {language === 'ml' 
                      ? '"ഈ മഴക്കാലത്ത് റബ്ബറിന് ഏത് റെയിൻ ഗാർഡ് ആണ് നല്ലത്?"' 
                      : '"Which rain guard is best for rubber this monsoon?"'}
                  </p>
                  <p className="mt-3 text-xs font-bold text-emerald-300 uppercase tracking-wider">
                    — {language === 'ml' ? 'കോട്ടയത്തുനിന്നുള്ള കർഷകൻ' : 'Farmer from Kottayam'}
                  </p>
                </div>
                <div className="bg-emerald-500 p-5 rounded-2xl ml-8 shadow-xl relative">
                  <div className="absolute -left-2 top-4 w-4 h-4 bg-emerald-500 rotate-45"></div>
                  <p className="text-sm font-semibold leading-relaxed">
                    {language === 'ml' 
                      ? 'നിലവിലെ അതിശക്തമായ മഴ കണക്കിലെടുത്ത് പ്ലാസ്റ്റിക് റെയിൻ ഗാർഡുകൾക്ക് പകരം സിന്തറ്റിക് റെയിൻ ഗാർഡുകൾ ഉപയോഗിക്കുന്നത് കൂടുതൽ ഫലപ്രദമാണ്...' 
                      : 'Given the heavy rainfall, synthetic rain guards are recommended over traditional plastic ones for better durability...'}
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <div className="h-1.5 w-1.5 bg-white rounded-full animate-ping"></div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-100">AI Verified Response</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 lg:px-16 border-t border-stone-100 text-center bg-white">
        <div className="flex justify-center gap-2 mb-6">
          <div className="bg-stone-100 p-2 rounded-lg text-slate-400 hover:text-emerald-600 transition-colors"><MessageSquare size={20}/></div>
          <div className="bg-stone-100 p-2 rounded-lg text-slate-400 hover:text-emerald-600 transition-colors"><ShieldCheck size={20}/></div>
          <div className="bg-stone-100 p-2 rounded-lg text-slate-400 hover:text-emerald-600 transition-colors"><Globe size={20}/></div>
        </div>
        <p className="text-slate-400 text-sm font-bold tracking-tight">
          {t.footer}
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;