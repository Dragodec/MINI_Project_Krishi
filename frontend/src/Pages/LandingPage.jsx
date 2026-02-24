import React, { useState } from 'react';
import { Mic, Image as ImageIcon, MessageSquare, ShieldCheck, MapPin, Zap, ArrowRight, PhoneCall, Globe } from 'lucide-react';
import { useLanguage } from '../Context/LanguageContext';
import { TRANSLATIONS } from '../Constants/Translations';

const LandingPage = () => {
  const [query, setQuery] = useState('');
  const { language, toggleLanguage } = useLanguage();
  const t = TRANSLATIONS[language];

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-slate-900">
      <nav className="sticky top-0 z-50 flex items-center justify-between bg-white/80 px-6 py-4 backdrop-blur-md border-b border-stone-200 lg:px-16">
        <div className="flex items-center gap-2">
          <div className="bg-emerald-600 p-1.5 rounded-lg">
            <Zap className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-emerald-900">
            AgriAI <span className="text-emerald-600">{language === 'ml' ? 'Malayalam' : 'Global'}</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 mr-4">
            {t.nav.map((item) => (
              <a key={item} href="#" className="hover:text-emerald-700 transition">{item}</a>
            ))}
          </div>
          
          <button 
            onClick={toggleLanguage}
            className="flex items-center gap-2 rounded-full border border-stone-200 px-4 py-2 text-sm font-medium hover:bg-stone-50 transition active:scale-95"
          >
            <Globe size={16} />
            {language === 'ml' ? 'English' : 'മലയാളം'}
          </button>
          
          <button className="rounded-full bg-emerald-700 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 shadow-md">
            Open App
          </button>
        </div>
      </nav>

      <header className="relative overflow-hidden bg-white px-6 pt-16 pb-24 lg:px-16 lg:pt-24">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-sm font-semibold text-emerald-700 mb-6 border border-emerald-100">
            <ShieldCheck size={16} />
            {t.heroBadge}
          </div>
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-slate-900 md:text-6xl leading-tight">
            {t.heroTitle[0]} <br /> 
            <span className="text-emerald-600 font-black">{t.heroTitle[1]}</span>
          </h1>
          <p className="mb-10 text-lg text-slate-600 md:text-xl max-w-2xl mx-auto leading-relaxed">
            {t.heroSub}
          </p>

          <div className="relative mx-auto max-w-2xl group">
            <div className="flex flex-col md:flex-row items-center gap-3 rounded-2xl bg-white p-2 shadow-2xl border border-stone-100 group-focus-within:ring-2 ring-emerald-500/20 transition-all">
              <input
                type="text"
                placeholder={t.inputPlaceholder}
                className="w-full rounded-xl border-none bg-transparent px-4 py-4 text-lg outline-none focus:ring-0"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <div className="flex w-full md:w-auto gap-2 p-1">
                <button className="flex h-12 w-12 items-center justify-center rounded-xl bg-stone-100 text-slate-600 hover:bg-stone-200 transition">
                  <Mic size={20} />
                </button>
                <button className="flex h-12 w-12 items-center justify-center rounded-xl bg-stone-100 text-slate-600 hover:bg-stone-200 transition">
                  <ImageIcon size={20} />
                </button>
                <button className="flex flex-1 md:flex-none items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-bold text-white shadow-lg transition hover:bg-emerald-700">
                  <span>{t.askBtn}</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-400">{t.suggestionText}</p>
          </div>
        </div>
      </header>

      <section className="bg-stone-50 py-10 border-y border-stone-200">
        <div className="mx-auto max-w-7xl px-6 lg:px-16 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-8">{t.trustLabel}</p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 grayscale">
            <div className="font-bold text-xl text-slate-700 underline decoration-emerald-500 underline-offset-4">Krishibhavan</div>
            <div className="font-bold text-xl text-slate-700 underline decoration-emerald-500 underline-offset-4">Agri Dept. Kerala</div>
            <div className="font-bold text-xl text-slate-700 underline decoration-emerald-500 underline-offset-4">KAU Guidelines</div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-24 px-6 lg:px-16 bg-white">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center text-3xl font-bold mb-16">{t.stepsTitle}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {t.steps.map((step, idx) => (
              <div key={idx} className="relative flex flex-col items-center text-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 shadow-inner">
                  {idx === 0 ? <MessageSquare size={32} /> : idx === 1 ? <Zap size={32} /> : <PhoneCall size={32} />}
                </div>
                <h4 className="text-xl font-bold mb-3">{step.t}</h4>
                <p className="text-slate-600">{step.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="py-24 px-6 lg:px-16 bg-emerald-900 text-white rounded-[3rem] mx-4 my-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-8 leading-tight">
                {t.featuresTitle[0]} <br/> {t.featuresTitle[1]}
              </h2>
              <div className="space-y-8">
                {t.featureList.map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="mt-1 h-6 w-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                      {idx === 0 ? <ShieldCheck size={18}/> : <MapPin size={18}/>}
                    </div>
                    <div>
                      <h5 className="font-bold text-lg mb-1">{item.t}</h5>
                      <p className="text-emerald-100/70">{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-emerald-800/50 p-8 rounded-3xl border border-white/10">
               <div className="space-y-4">
                <div className="bg-white/10 p-4 rounded-xl">
                  <p className="text-sm italic opacity-80 text-white">
                    {language === 'ml' ? '"ഈ മഴക്കാലത്ത് റബ്ബറിന് ഏത് റെയിൻ ഗാർഡ് ആണ് നല്ലത്?"' : '"Which rain guard is best for rubber this monsoon?"'}
                  </p>
                  <p className="mt-2 text-sm font-bold text-emerald-300">
                    — {language === 'ml' ? 'കർഷകൻ, കോട്ടയം' : 'Farmer from Kottayam'}
                  </p>
                </div>
                <div className="bg-emerald-600 p-4 rounded-xl ml-8">
                  <p className="text-sm">
                    {language === 'ml' ? 'നിലവിലെ കാലാവസ്ഥയിൽ സിന്തറ്റിക് റെയിൻ ഗാർഡുകൾ ഉപയോഗിക്കുന്നതാണ് ഉചിതം...' : 'In current weather conditions, using synthetic rain guards is advisable...'}
                  </p>
                  <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-emerald-200">— AI Response</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 px-6 lg:px-16 border-t border-stone-200 text-center">
        <p className="text-slate-500 text-sm">{t.footer}</p>
      </footer>
    </div>
  );
};

export default LandingPage;