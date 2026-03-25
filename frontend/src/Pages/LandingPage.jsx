import React from 'react';
import { Link } from 'react-router-dom';
import { 
  CloudRain, 
  Bug, 
  UserX, 
  Bot, 
  Camera, 
  Award,
  MessageSquare, 
  ShieldCheck, 
  MapPin, 
  Zap, 
  ArrowRight, 
  PhoneCall, 
  Globe,
  CheckCircle2,
  TrendingUp
} from 'lucide-react';

import { useLanguage } from '../Context/LanguageContext';
import { TRANSLATIONS } from '../Constants/Translations';

const LandingPage = () => {
  const { language, toggleLanguage } = useLanguage();
  const t = TRANSLATIONS[language];

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-slate-900 selection:bg-emerald-100 selection:text-emerald-900 overflow-x-hidden">
      
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
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 mr-4">
            {t.nav.map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(/\s/g, '-')}`} className="hover:text-emerald-700 transition-colors">
                {item}
              </a>
            ))}
          </div>
          
          <button 
            onClick={toggleLanguage}
            className="flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-stone-50 transition-all active:scale-95 shadow-sm"
          >
            <Globe size={16} className="text-emerald-600" />
            {language === 'ml' ? 'English' : 'മലയാളം'}
          </button>
          
          <Link 
            to="/login" 
            className="rounded-full bg-emerald-700 px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-emerald-800 shadow-md hover:shadow-emerald-200 active:scale-95 hidden sm:flex items-center gap-2"
          >
            {t.ctaPrimary}
          </Link>
        </div>
      </nav>

      {/* Hero Section (Conversion Focused) */}
      <header className="relative bg-gradient-to-br from-emerald-50 via-white to-stone-50 px-6 pt-20 pb-28 lg:px-16 lg:pt-32 lg:pb-36 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-30 pointer-events-none">
          <div className="absolute -top-10 -left-10 w-96 h-96 bg-emerald-400 rounded-full blur-[100px]"></div>
          <div className="absolute top-1/2 right-0 w-80 h-80 bg-lime-300 rounded-full blur-[100px]"></div>
        </div>

        <div className="relative mx-auto max-w-5xl text-center">
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-bold text-emerald-700 mb-8 border border-emerald-100 shadow-sm">
              <ShieldCheck size={16} className="text-emerald-600" />
              {t.heroBadge}
            </div>
            
            <h1 className="mb-8 text-5xl font-black tracking-tight text-slate-900 md:text-7xl lg:text-8xl md:leading-[1.05]">
              {t.heroTitle[0]} <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-lime-500 drop-shadow-sm">
                {t.heroTitle[1]}
              </span>
            </h1>
            
            <p className="mb-12 text-lg text-slate-600 md:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
              {t.heroSub}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                to="/signup" 
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-8 py-4 text-lg font-bold text-white shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 hover:-translate-y-1 transition-all active:scale-95 border border-emerald-500 hover:shadow-emerald-600/30"
              >
                {t.ctaPrimary}
                <TrendingUp size={20} />
              </Link>
              <a 
                href="#how-it-works"
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 text-lg font-bold text-slate-700 shadow-md hover:bg-stone-50 hover:-translate-y-1 transition-all active:scale-95 border border-stone-200"
              >
                {t.ctaSecondary}
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Trust Indicators Section */}
      <section className="bg-white py-10 border-y border-stone-100 relative z-10 -mt-8 mx-6 lg:mx-16 rounded-3xl shadow-sm">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-6">
            {t.trustLabel}
          </p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="font-extrabold text-lg md:text-xl flex items-center gap-2 text-slate-800"><CheckCircle2 className="text-emerald-500"/> Krishibhavan</div>
            <div className="font-extrabold text-lg md:text-xl flex items-center gap-2 text-slate-800"><CheckCircle2 className="text-emerald-500"/> Agri Dept. Kerala</div>
            <div className="font-extrabold text-lg md:text-xl flex items-center gap-2 text-slate-800"><CheckCircle2 className="text-emerald-500"/> KAU Guidelines</div>
          </div>
        </div>
      </section>

      {/* The Problem Section */}
      <section id="പ്രശ്നങ്ങൾ" className="py-24 px-6 lg:px-16 bg-stone-50">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-6 text-slate-900">{t.problemTitle}</h2>
            <div className="h-1.5 w-24 bg-red-400 mx-auto rounded-full opacity-50"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {t.problems.map((prob, idx) => (
              <div key={idx} className="bg-white p-8 rounded-[2rem] shadow-sm border border-stone-100 hover:shadow-xl hover:border-red-100 transition-all duration-300 group">
                <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform group-hover:bg-red-500 group-hover:text-white">
                  {idx === 0 ? <CloudRain size={32} /> : idx === 1 ? <Bug size={32} /> : <UserX size={32} />}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-slate-900">{prob.t}</h3>
                <p className="text-slate-600 font-medium leading-relaxed">{prob.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Solution Section */}
      <section id="പരിഹാരങ്ങൾ" className="py-24 px-6 lg:px-16 bg-white relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-full h-full opacity-[0.02] pointer-events-none transform -translate-y-1/2">
          <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500 via-transparent to-transparent"></div>
        </div>

        <div className="mx-auto max-w-7xl relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-6xl font-black mb-6 text-slate-900">
              {t.solutionTitle[0]} <span className="text-emerald-600">{t.solutionTitle[1]}</span>
            </h2>
            <div className="h-1.5 w-24 bg-emerald-500 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {t.solutions.map((sol, idx) => (
              <div key={idx} className="relative bg-stone-50 p-10 rounded-[2.5rem] border border-stone-100 hover:bg-emerald-600 hover:text-white transition-colors duration-500 group overflow-hidden">
                <div className="absolute -right-6 -top-6 w-32 h-32 bg-emerald-100/50 rounded-full group-hover:bg-white/10 transition-colors"></div>
                
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-white text-emerald-600 shadow-sm flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                    {idx === 0 ? <Bot size={32} /> : idx === 1 ? <Camera size={32} /> : <Award size={32} />}
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{sol.t}</h3>
                  <p className="font-medium text-slate-500 group-hover:text-emerald-50 leading-relaxed text-lg">{sol.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Step-by-Step Guide */}
      <section id="how-it-works" className="py-24 px-6 lg:px-16 bg-stone-50">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-3xl md:text-5xl font-black mb-4">{t.stepsTitle}</h2>
            <div className="h-1.5 w-20 bg-emerald-500 mx-auto rounded-full"></div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8 relative items-start">
            <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-1 bg-gradient-to-r from-emerald-100 via-emerald-300 to-emerald-100 rounded-full -z-0"></div>
            
            {t.steps.map((step, idx) => (
              <div key={idx} className="flex-1 relative z-10 flex flex-col items-center text-center p-8 bg-white md:bg-transparent rounded-3xl md:rounded-none shadow-sm md:shadow-none border border-stone-100 md:border-none">
                <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-[2rem] bg-emerald-600 text-white shadow-xl shadow-emerald-600/20 transform md:-translate-y-4 font-black text-3xl">
                  {idx + 1}
                </div>
                <h4 className="text-2xl font-bold mb-4 text-slate-900">{step.t.replace(/^\d+\.\s*/, '')}</h4>
                <p className="text-slate-500 leading-relaxed font-medium text-lg">{step.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Conversion Banner */}
      <section className="py-20 px-6 lg:px-16 bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="bg-emerald-900 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/20 rounded-full blur-[80px]"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-lime-400/10 rounded-full blur-[80px]"></div>
            
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-6xl font-black text-white mb-8 leading-tight">
                {language === 'ml' 
                  ? "മികച്ച കാർഷിക ഭാവി ഇന്നുതന്നെ ആരംഭിക്കൂ" 
                  : "Start Your Journey to Better Yields Today"}
              </h2>
              <p className="text-emerald-100 text-xl font-medium mb-12 max-w-2xl mx-auto">
                {language === 'ml' 
                  ? "AgriAI ഉപയോഗിച്ച് 10,000-ത്തിലധികം കർഷകർ തങ്ങളുടെ വിളവ് വർദ്ധിപ്പിച്ചു കഴിഞ്ഞു." 
                  : "Join over 10,000 farmers who have already transformed their yield with AgriAI."}
              </p>
              
              <Link 
                to="/signup" 
                className="inline-flex items-center gap-3 rounded-full bg-white px-10 py-5 text-xl font-bold text-emerald-900 shadow-xl hover:bg-stone-50 hover:scale-[1.02] transition-all active:scale-95"
              >
                {t.ctaPrimary}
                <ArrowRight size={24} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 lg:px-16 border-t border-stone-200 text-center bg-stone-50">
        <div className="flex justify-center items-center gap-3 mb-8">
          <div className="bg-emerald-600 p-2 rounded-lg"><Zap className="text-white w-6 h-6" /></div>
          <span className="text-2xl font-bold text-emerald-900">Agri<span className="text-emerald-600">AI</span></span>
        </div>
        <div className="flex justify-center gap-4 mb-8">
          <div className="bg-white p-3 rounded-xl shadow-sm border border-stone-100 text-slate-400 hover:text-emerald-600 cursor-pointer transition-colors"><MessageSquare size={20}/></div>
          <div className="bg-white p-3 rounded-xl shadow-sm border border-stone-100 text-slate-400 hover:text-emerald-600 cursor-pointer transition-colors"><ShieldCheck size={20}/></div>
          <div className="bg-white p-3 rounded-xl shadow-sm border border-stone-100 text-slate-400 hover:text-emerald-600 cursor-pointer transition-colors"><Globe size={20}/></div>
        </div>
        <p className="text-slate-500 text-sm font-semibold tracking-wide">
          {t.footer}
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;