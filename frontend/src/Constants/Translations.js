export const TRANSLATIONS = {
  ml: {
    // 1. Landing Page
    nav: ["പ്രശ്നങ്ങൾ", "പരിഹാരങ്ങൾ", "സവിശേഷതകൾ"],
    heroBadge: "നിങ്ങളുടെ സ്മാർട്ട് കാർഷിക സഹായി",
    heroTitle: ["കൃഷിയിലെ വെല്ലുവിളികൾക്ക്", "സ്മാർട്ട് പരിഹാരം"],
    heroSub: "കാലാവസ്ഥാ വ്യതിയാനങ്ങളും കീടബാധയും നിങ്ങളുടെ വിളവിനെ ബാധിക്കുന്നുണ്ടോ? കൃത്യസമയത്ത് ശരിയായ ഉപദേശങ്ങൾ നേടി മികച്ച വിളവെടുപ്പ് ഉറപ്പാക്കൂ.",
    ctaPrimary: "ഇപ്പോൾ തന്നെ തുടങ്ങാം",
    ctaSecondary: "കൂടുതൽ അറിയാൻ",
    problemTitle: "കർഷകർ നേരിടുന്ന പ്രധാന വെല്ലുവിളികൾ",
    problems: [
      { t: "അപ്രതീക്ഷിത കാലാവസ്ഥ", d: "മഴയും വെയിലും പ്രവചിക്കാനാകാത്ത അവസ്ഥ." },
      { t: "കീടബാധയും രോഗങ്ങളും", d: "വിളകളെ നശിപ്പിക്കുന്ന അജ്ഞാതമായ രോഗങ്ങൾ." },
      { t: "വിദഗ്ദ്ധോപദേശത്തിന്റെ കുറവ്", d: "ശരിയായ സമയത്ത് വിദഗ്ദ്ധരെ കിട്ടാത്ത അവസ്ഥ." }
    ],
    solutionTitle: ["എങ്ങനെയാണ് AgriAI", "സഹായിക്കുന്നത്?"],
    solutions: [
      { t: "24/7 AI അസിസ്റ്റൻ്റ്", d: "നിങ്ങളുടെ ഭാഷയിൽ, എപ്പോൾ വേണമെങ്കിലും സംശയങ്ങൾ ചോദിക്കാം." },
      { t: "ചിത്രത്തിലൂടെ രോഗമറിയാം", d: "ചെടിയുടെ ഫോട്ടോ എടുത്താൽ മാത്രം മതി, രോഗവും പരിഹാരവും AI പറയും." },
      { t: "കൃഷി ഓഫീസറുടെ സേവനം", d: "സങ്കീർണ്ണമായ പ്രശ്നങ്ങൾക്ക് നേരിട്ട് ഡോക്ടർമാരുടെ സഹായം." }
    ],
    trustLabel: "വിശ്വസ്ത സേവനം",
    stepsTitle: "ഇത് എങ്ങനെ പ്രവർത്തിക്കുന്നു?",
    steps: [
      { t: "1. അക്കൗണ്ട് സൃഷ്‌ടിക്കുക", d: "നിങ്ങളുടെ കൃഷിയിടത്തിന്റെ വിവരങ്ങൾ നൽകി രജിസ്റ്റർ ചെയ്യുക." },
      { t: "2. പ്രശ്നങ്ങൾ ചോദിക്കുക", d: "ശബ്ദമായോ ഫോട്ടോ ആയോ സംശയങ്ങൾ ചോദിക്കൂ." },
      { t: "3. പരിഹാരം നേടുക", d: "കൃത്യമായതും ശാസ്ത്രീയവുമായ മറുപടികൾ തൽക്ഷണം." }
    ],
    featuresTitle: ["ഉയർന്ന വിളവിനായി", "നൂതന സാങ്കേതികവിദ്യ"],
    featureList: [
      { t: "പ്രാദേശിക കാലാവസ്ഥാ മുന്നറിയിപ്പ്", d: "നിങ്ങളുടെ കൃഷിയിടത്തിന് അനുയോജ്യമായ വിവരങ്ങൾ." },
      { t: "സർക്കാർ പദ്ധതികൾ", d: "സബ്‌സിഡികളും ആനുകൂല്യങ്ങളും സമയബന്ധിതമായി അറിയുക." }
    ],
    footer: "© 2026 AgriAI ഡിജിറ്റൽ സിസ്റ്റം. കേരളത്തിലെ കർഷകർക്കായി സമർപ്പിക്കുന്നു.",

    // 2. Global Layout & Sidebar
    layout: {
      menu: {
        dashboard: "ഡാഷ്ബോർഡ്",
        agriGpt: "Agri-GPT",
        weather: "കാലാവസ്ഥ",
        fieldHub: "ഫീൽഡ് ഹബ്",
        outbreakMap: "ഔട്ട്ബ്രേക്ക് മാപ്പ്"
      },
      language: "ഭാഷ",
      logout: "ലോഗ് ഔട്ട്",
      toasts: {
        logoutSuccess: "വിജയകരമായി ലോഗ് ഔട്ട് ചെയ്തു",
        logoutFail: "ലോഗ് ഔട്ട് പരാജയപ്പെട്ടു"
      }
    },

    // 3. Dashboard
    dashboard: {
      greetings: {
        morning: "സുപ്രഭാതം",
        afternoon: "ശുഭ ഉച്ചയാഹ്നം",
        evening: "ശുഭസായാഹ്നം"
      },
      status: {
        active: "സ്റ്റേഷൻ ആക്ടീവ് ആണ്",
        monitoring: "മോണിറ്ററിംഗ് നോഡ്",
        engine: "RAG അനാലിസിസ് എഞ്ചിൻ ഓൺലൈൻ ആണ്. ടെലിമെട്രി സ്ട്രീം സ്റ്റേബിൾ ആണ്.",
        online: "ആക്ടീവ്"
      },
      buttons: {
        report: "റിപ്പോർട്ട്",
        newAnalysis: "പുതിയ പരിശോധന",
        openForecast: "ഫോർകാസ്റ്റ് കാണുക",
        settings: "ക്രമീകരണങ്ങൾ",
        generatePlan: "പുതിയ പ്ലാൻ തയ്യാറാക്കുക",
        analyzing: "പരിശോധിക്കുന്നു..."
      },
      weather: { title: "കാലാവസ്ഥ", syncing: "വിവരങ്ങൾ ശേഖരിക്കുന്നു..." },
      planner: {
        title: "ക്രോപ്പ് പ്ലാനർ",
        harvestReady: "വിളവെടുപ്പിന് തയ്യാർ",
        complete: "നിലവിലെ സൈക്കിൾ പൂർത്തിയായി.",
        description: "മണ്ണിലെ ഈർപ്പവും കാലാവസ്ഥയും അനുസരിച്ചുള്ള AI ഷെഡ്യൂൾ.",
        noTimeline: "സജീവമായ ടൈംലൈൻ ലഭ്യമല്ല",
        initialize: "വിളചക്രം സിങ്ക് ചെയ്യുന്നതിനായി സ്റ്റേഷൻ ആരംഭിക്കുക.",
        due: "തിയതി"
      },
      toasts: {
        loadError: "വിവരങ്ങൾ ലോഡ് ചെയ്യാൻ കഴിഞ്ഞില്ല",
        planSuccess: "പ്ലാൻ തയ്യാറായിരിക്കുന്നു!",
        planError: "AI പ്ലാനറുമായി ബന്ധപ്പെടാൻ കഴിഞ്ഞില്ല",
        updateError: "ടാസ്ക് അപ്ഡേറ്റ് ചെയ്യാൻ കഴിഞ്ഞില്ല",
        downloadSuccess: "റിപ്പോർട്ട് ഡൗൺലോഡ് ചെയ്തു",
        downloadError: "പിഡിഎഫ് എക്സ്പോർട്ട് പരാജയപ്പെട്ടു"
      },
      pdf: { title: "AgriAI ഫീൽഡ് റിപ്പോർട്ട്", farmer: "കർഷകൻ", queries: "അന്വേഷണങ്ങൾ" }
    },

    // 4. Agri-GPT / Queries
    queries: {
      station: "ഇന്റലിജന്റ് സ്റ്റേഷൻ",
      newChat: "പുതിയ ചാറ്റ്",
      pastLogs: "പഴയ വിവരങ്ങൾ",
      emptyTitle: "നിങ്ങളുടെ കൃഷിയിടം, ഡിജിറ്റലായി.",
      emptySub: "ടെക്സ്റ്റ്, ചിത്രങ്ങൾ അല്ലെങ്കിൽ ശബ്ദം ഉപയോഗിച്ച് വിളകളുടെ ആരോഗ്യത്തെക്കുറിച്ചോ കീടങ്ങളെക്കുറിച്ചോ ചോദിക്കാം.",
      userRole: "കർഷകൻ",
      aiRole: "കൃഷി ഓഫീസർ AI",
      share: "പങ്കിടുക",
      analyzing: "വിവരങ്ങൾ വിശകലനം ചെയ്യുന്നു...",
      voiceReady: "ശബ്ദ സന്ദേശം തയ്യാറാണ്",
      placeholder: "നിങ്ങളുടെ കൃഷി പ്രശ്നം വിവരിക്കുക...",
      addImage: "ചിത്രം ചേർക്കുക",
      voice: "ശബ്ദം",
      listening: "കേൾക്കുന്നു...",
      analyzeBtn: "വിശകലനം",
      fieldLogs: "ഫീൽഡ് ലോഗുകൾ",
      multimediaQuery: "മൾട്ടിമീഡിയ ക്വറി",
      errors: {
        loadChat: "ഈ സംഭാഷണം ലോഡ് ചെയ്യാൻ കഴിഞ്ഞില്ല",
        emptyQuery: "ഒരു ചോദ്യം, ചിത്രം അല്ലെങ്കിൽ വോയ്‌സ് നോട്ട് നൽകുക",
        unreachable: "AI സ്റ്റേഷൻ ലഭ്യമല്ല",
        deleteFail: "ഡീലീറ്റ് ചെയ്യാൻ പറ്റിയില്ല",
        renameFail: "പേര് മാറ്റാൻ പറ്റിയില്ല",
        browserSupport: "ബ്രൗസർ സപ്പോർട്ട് ചെയ്യുന്നില്ല",
      }
    },

    // 5. Field Hub / Analysis
    field: {
      hero: { online: "സ്റ്റേഷൻ ഓൺലൈൻ", sensor: "സെൻസർ", rain: "മഴ", irrigate: "നനയ്ക്കുക" },
      stats: {
        moisture: "മണ്ണിലെ ഈർപ്പം",
        nitrogen: "നൈട്രജൻ",
        ph: "pH നില",
        health: "ആരോഗ്യം",
        optimal: "അത്യുത്തമം",
        needsWater: "നനയ്ക്കേണ്ടതുണ്ട്",
        criticallyDry: "അതീവ ഗുരുതരം"
      },
      command: {
        title: "കമാൻഡ് സെന്റർ",
        heatwave: "താപതരംഗം സിമുലേറ്റ് ചെയ്യുക",
        reset: "റീസെറ്റ് എൻവയോൺമെന്റ്",
        impact: "പരിസ്ഥിതി ആഘാതം",
        lastRain: "അവസാന മഴ",
        nodeInfo: "ഈ സ്റ്റേഷൻ മണ്ണിലെ ഭൗതികമാറ്റങ്ങളെ സിമുലേറ്റ് ചെയ്യുന്ന ഒരു റൂൾ ബേസ്ഡ് എഞ്ചിൻ ഉപയോഗിക്കുന്നു."
      },
      guidance: {
        title: "കാർഷിക നിർദ്ദേശങ്ങൾ",
        priority: "മുൻഗണന",
        action: "നടപടി",
        optimalLimits: "മണ്ണിലെ ഘടകങ്ങൾ സുരക്ഷിതമായ പരിധിക്കുള്ളിലാണ്"
      },
      rainModal: {
        title: "മഴ സിമുലേറ്റ് ചെയ്യുക",
        subtitle: "മഴയുടെ അളവ് തിരഞ്ഞെടുക്കുക",
        light: "ചെറിയ ചാറ്റൽ മഴ",
        moderate: "മിതമായ മഴ",
        heavy: "ശക്തമായ മഴ",
        volume: "അളവ്"
      },
      dosage: {
        title: "ഡോസേജ് എഞ്ചിൻ",
        unitAcre: "ഏക്കർ",
        unitHectare: "ഹെക്ടർ",
        unitCent: "സെന്റ്",
        outputLabel: "ആവശ്യമായ അളവ്",
        chemicals: {
          npk_19: "NPK 19:19:19 (ഇലകളിൽ തളിക്കാൻ)",
          urea: "യൂറിയ (അടിവളം)",
          neem_oil: "വേപ്പെണ്ണ 10000ppm",
          copper_50wp: "കോപ്പർ ഫംഗിസൈഡ് 50%",
          bordeaux: "ബോർഡോ മിശ്രിതം (1%)",
          tricho: "ട്രൈക്കോഡെർമ വിറിഡെ"
        }
      },
      setup: {
        title: "കൃഷിയിടം രജിസ്റ്റർ ചെയ്യുക",
        subtitle: "ഡിജിറ്റൽ ട്വിൻ ആരംഭിക്കുക",
        plotName: "കൃഷിയിടത്തിന്റെ പേര്",
        cropType: "വിളയുടെ ഇനം",
        soilType: "മണ്ണിന്റെ ഇനം",
        soilOptions: { laterite: "ചെങ്കൽ മണ്ണ് (Laterite)", black: "കറുത്ത മണ്ണ്", alluvial: "എക്കൽ മണ്ണ്" },
        activate: "സ്റ്റേഷൻ ആരംഭിക്കുക",
        syncing: "സിങ്ക് ചെയ്യുന്നു..."
      },
      toasts: {
        rainSuccess: "മഴ രേഖപ്പെടുത്തി. ഈർപ്പം വർദ്ധിച്ചു",
        irrigationSuccess: "നനയ്ക്കൽ വിജയകരമായി പൂർത്തിയായി",
        heatSuccess: "താപതരംഗം: ഈർപ്പം കുറഞ്ഞു",
        resetSuccess: "എൻവയോൺമെന്റ് റീസെറ്റ് ചെയ്തു",
        setupFail: "സജ്ജീകരണം പരാജയപ്പെട്ടു"
      }
    },

    // 6. Community Map
    map: {
      title: "കമ്മ്യൂണിറ്റി ഹീറ്റ്മാപ്പ്",
      subtitle: "രോഗവ്യാപനം തടയുന്നതിനായി തത്സമയ വിവരങ്ങൾ.",
      liveData: "തത്സമയ ഡാറ്റ",
      demoMode: "ഡെമോ മോഡ്",
      reportBtn: "രോഗവിവരം അറിയിക്കാം",
      stats: { threats: "സജീവ ഭീഷണികൾ", monitoring: "നിരീക്ഷണം", total: "ആകെ റിപ്പോർട്ടുകൾ (30 ദിവസം)" },
      popup: { risk: "അപകടസാധ്യത", district: "ജില്ല" },
      modal: {
        title: "രോഗവിവരം അറിയിക്കാം",
        badge: "അടുത്തുള്ള കർഷകർക്ക് മുന്നറിയിപ്പ് നൽകുക",
        crop: "വിളയുടെ പേര്",
        district: "ജില്ല",
        disease: "രോഗം / കീടത്തിന്റെ പേര്",
        severity: "തീവ്രത",
        severityOptions: { low: "കുറഞ്ഞത് - നിയന്ത്രണവിധേയം", medium: "മിതമായത് - വേഗത്തിൽ പടരുന്നു", high: "ഉയർന്നത് - കഠിനമായ രോഗസാധ്യത" },
        submit: "മുന്നറിയിപ്പ് നൽകുക",
        submitting: "അറിയിപ്പ് നൽകുന്നു..."
      },
      toasts: { loadFail: "മാപ്പ് ലോഡ് ചെയ്യാൻ കഴിഞ്ഞില്ല", success: "വിവരം കമ്മ്യൂണിറ്റി മാപ്പിൽ ചേർത്തു!", submitFail: "വിവരം സമർപ്പിക്കാൻ കഴിഞ്ഞില്ല" }
    },

    // 7. Weather Page
    weather: {
      loading: "ഗ്ലോബൽ ഡാറ്റ സിങ്ക് ചെയ്യുന്നു",
      hero: { status: "സ്റ്റേഷൻ ആക്ടീവ് ആണ്", clear: "നിങ്ങളുടെ കൃഷിയിടത്തിൽ തെളിഞ്ഞ കാലാവസ്ഥയാണ്", wind: "കാറ്റിന്റെ വേഗത", rain: "മഴയ്ക്ക് സാധ്യത" },
      advisory: { title: "കൃഷി ഉപദേശങ്ങൾ", subtitle: "ഇന്നത്തെ പ്രധാന നിർദ്ദേശങ്ങൾ" },
      gauge: { label: "കണ്ടീഷൻ ഇൻഡക്സ്", safe: "മരുന്ന് തളിക്കാൻ അനുയോജ്യം", unsafe: "മരുന്ന് തളിക്കാൻ അനുയോജ്യമല്ല", desc: "കാറ്റിന്റെ വേഗത കുറവാണ്, മഴയ്ക്ക് സാധ്യതയില്ല. കീടനാശിനികൾ തളിക്കാൻ ഏറ്റവും അനുയോജ്യമായ സമയം." },
      forecast: { title: "24-മണിക്കൂർ പ്രവചനം", rain: "മഴ" },
      toasts: { fail: "കാലാവസ്ഥാ വിവരങ്ങൾ പുതുക്കാൻ കഴിഞ്ഞില്ല" }
    },

    // 8. Auth flow
    forgotPassword: {
      title: "പാസ്‌വേഡ് മാറ്റുക",
      step1Sub: "റീസെറ്റ് കോഡ് ലഭിക്കുന്നതിന് ഇമെയിൽ നൽകുക",
      step2Sub: "നിങ്ങളുടെ പുതിയ സുരക്ഷിതമായ പാസ്‌വേഡ് നൽകുക",
      labels: { email: "ഇമെയിൽ വിലാസം", otp: "OTP കോഡ്", newPassword: "പുതിയ പാസ്‌വേഡ്", confirmPassword: "പാസ്‌വേഡ് ഉറപ്പാക്കുക" },
      placeholders: { email: "your-email@example.com", otp: "6 അക്ക കോഡ്", newPassword: "കുറഞ്ഞത് 8 അക്ഷരങ്ങൾ", confirmPassword: "പുതിയ പാസ്‌വേഡ് വീണ്ടും നൽകുക" },
      buttons: { sendCode: "റീസെറ്റ് കോഡ് അയക്കുക", sending: "അയക്കുന്നു...", update: "പാസ്‌വേഡ് മാറ്റുക", updating: "മാറ്റിക്കൊണ്ടിരിക്കുന്നു...", back: "തിരികെ ലോഗിൻ പേജിലേക്ക്" },
      toasts: { enterEmail: "ദയവായി ഇമെയിൽ വിലാസം നൽകുക", otpSent: "റീസെറ്റ് OTP ഇമെയിലിലേക്ക് അയച്ചു", userNotFound: "യൂസറെ കണ്ടെത്താനായില്ല", fieldsRequired: "എല്ലാ വിവരങ്ങളും നൽകേണ്ടതുണ്ട്", mismatch: "പാസ്‌വേഡുകൾ തമ്മിൽ ചേരുന്നില്ല", length: "പാസ്‌വേഡിന് കുറഞ്ഞത് 8 അക്ഷരങ്ങൾ വേണം", success: "പാസ്‌വേഡ് വിജയകരമായി മാറ്റി! ദയവായി ലോഗിൻ ചെയ്യുക.", invalidOtp: "തെറ്റായ OTP അല്ലെങ്കിൽ സമയം കഴിഞ്ഞു" }
    },
    login: {
      title: "വീണ്ടും സ്വാഗതം",
      subtitle: "നിങ്ങളുടെ കൃഷിയിടവും വിവരങ്ങളും നിയന്ത്രിക്കാൻ ലോഗിൻ ചെയ്യുക",
      labels: { email: "ഇമെയിൽ വിലാസം", password: "പാസ്‌വേഡ്", forgot: "മറന്നുപോയോ?" },
      placeholders: { email: "farmer@example.com", password: "••••••••" },
      buttons: { signIn: "ലോഗിൻ ചെയ്യുക", authenticating: "പരിശോധിക്കുന്നു...", createAccount: "അക്കൗണ്ട് തുടങ്ങാം" },
      footer: { new: "AgriAI-ൽ പുതിയതാണോ?", link: "അക്കൗണ്ട് സൃഷ്ടിക്കുക" },
      toasts: { required: "ഇമെയിലും പാസ്‌വേഡും നൽകുക", success: "ലോഗിൻ വിജയിച്ചു! സ്വാഗതം.", fail: "ലോഗിൻ പരാജയപ്പെട്ടു" }
    },
    signup: {
      title: "അക്കൗണ്ട് സൃഷ്ടിക്കുക",
      verifyTitle: "ഇമെയിൽ വെരിഫൈ ചെയ്യുക",
      subtitle: "സ്മാർട്ട് കർഷകരുടെ കൂട്ടായ്മയിൽ പങ്കുചേരൂ",
      verifySubtitle: (email) => `${email}-ലേക്ക് അയച്ച 6 അക്ക കോഡ് നൽകുക`,
      labels: { name: "മുഴുവൻ പേര്", email: "ഇമെയിൽ വിലാസം", password: "പാസ്‌വേഡ്", otp: "വെരിഫിക്കേഷൻ കോഡ്" },
      placeholders: { name: "നിങ്ങളുടെ പേര് നൽകുക", email: "farmer@example.com", password: "കുറഞ്ഞത് 8 അക്ഷരങ്ങൾ", otp: "000000" },
      buttons: { sendOtp: "OTP അയക്കുക", processing: "പ്രോസസ്സ് ചെയ്യുന്നു...", verify: "വെരിഫൈ ചെയ്ത് ലോഗിൻ ചെയ്യുക", verifying: "പരിശോധിക്കുന്നു...", changeEmail: "ഇമെയിൽ വിലാസം മാറ്റുക" },
      footer: { already: "നിലവിൽ അക്കൗണ്ട് ഉണ്ടോ?", login: "ലോഗിൻ ചെയ്യുക" },
      toasts: { fillAll: "എല്ലാ വിവരങ്ങളും നൽകുക", invalidEmail: "ഇമെയിൽ ശരിയല്ല", passLength: "പാസ്‌വേഡിന് കുറഞ്ഞത് 8 അക്ഷരങ്ങൾ വേണം", otpSent: "OTP നിങ്ങളുടെ ഇമെയിലിലേക്ക് അയച്ചിട്ടുണ്ട്!", regFailed: "രജിസ്ട്രേഷൻ പരാജയപ്പെട്ടു", enterOtp: "OTP നൽകുക", success: "അക്കൗണ്ട് വെരിഫൈ ചെയ്തു! AgriAI-ലേക്ക് സ്വാഗതം.", verifyFailed: "വെരിഫിക്കേഷൻ പരാജയപ്പെട്ടു" }
    },
    profile: {
      labels: { accountDetails: "അക്കൗണ്ട് വിവരങ്ങൾ", email: "ഇമെയിൽ വിലാസം", memberSince: "അംഗമായത് മുതൽ", verified: "വെരിഫൈഡ് അക്കൗണ്ട്", pending: "വെരിഫിക്കേഷൻ പൂർത്തിയായിട്ടില്ല", general: "പൊതുവായവ", displayName: "പേര്", security: "സുരക്ഷ", currentPass: "നിലവിലെ പാസ്‌വേഡ്", newPass: "പുതിയ പാസ്‌വേഡ്" },
      placeholders: { name: "നിങ്ങളുടെ പേര് നൽകുക", currentPass: "നിലവിലെ പാസ്‌വേഡ്", newPass: "പുതിയ പാസ്‌വേഡ്" },
      buttons: { saveProfile: "പ്രൊഫൈൽ മാറ്റങ്ങൾ സേവ് ചെയ്യുക", updateSecurity: "പാസ്‌വേഡ് അപ്ഡേറ്റ് ചെയ്യുക", updating: "അപ്ഡേറ്റ് ചെയ്യുന്നു..." },
      toasts: { loadFail: "പ്രൊഫൈൽ ലോഡ് ചെയ്യാൻ കഴിഞ്ഞില്ല", updateSuccess: "പ്രൊഫൈൽ അപ്ഡേറ്റ് ചെയ്തു", updateFail: "അപ്ഡേറ്റ് പരാജയപ്പെട്ടു", passwordRequired: "രണ്ട് പാസ്‌വേഡ് ഫീൽഡുകളും പൂരിപ്പിക്കുക", passwordSuccess: "പാസ്‌വേഡ് വിജയകരമായി മാറ്റി", passwordFail: "പാസ്‌വേഡ് മാറ്റുന്നതിൽ തകരാർ" }
    }
  },

  en: {
    // 1. Landing Page
    nav: ["Problems", "Solutions", "Features"],
    heroBadge: "Your Smart Agricultural Assistant",
    heroTitle: ["Smart Solutions for", "Farming Challenges"],
    heroSub: "Unpredictable weather and sudden pest attacks ruining your yield? Get timely, accurate advice and secure your harvest with intelligent farming.",
    ctaPrimary: "Get Started Free",
    ctaSecondary: "See How It Works",
    problemTitle: "Major Challenges Farmers Face",
    problems: [
      { t: "Unpredictable Weather", d: "Sudden climate changes affecting crop planning." },
      { t: "Pests & Diseases", d: "Unknown diseases destroying crops silently." },
      { t: "Lack of Expert Advice", d: "Inability to reach an expert at the right time." }
    ],
    solutionTitle: ["How AgriAI", "Solves Them"],
    solutions: [
      { t: "24/7 AI Assistant", d: "Ask your questions anytime, in your own native language." },
      { t: "Image Based Diagnosis", d: "Just take a photo of the plant and get instant disease solutions." },
      { t: "Expert Escalation", d: "Direct connection to Agricultural Officers for complex issues." }
    ],
    trustLabel: "Trusted by Local Authorities",
    stepsTitle: "How It Works?",
    steps: [
      { t: "1. Create Account", d: "Register with your farm details and location." },
      { t: "2. Report Issues", d: "Ask questions via voice or image uploads." },
      { t: "3. Get Solutions", d: "Receive accurate, scientific solutions instantly." }
    ],
    featuresTitle: ["Advanced Tech for", "Better Yield"],
    featureList: [
      { t: "Hyper-local Weather Alerts", d: "Customized notifications for your specific farm location." },
      { t: "Government Schemes", d: "Stay updated on subsidies and agricultural benefits." }
    ],
    footer: "© 2026 AgriAI Digital Extension System. Dedicated to the farmers of Kerala.",

    // 2. Global Layout & Sidebar
    layout: {
      menu: {
        dashboard: "Dashboard",
        agriGpt: "Agri-GPT",
        weather: "Weather",
        fieldHub: "Field Hub",
        outbreakMap: "Outbreak Map"
      },
      language: "Language",
      logout: "Logout",
      toasts: {
        logoutSuccess: "Logged out successfully",
        logoutFail: "Logout failed"
      }
    },

    // 3. Dashboard
    dashboard: {
      greetings: {
        morning: "Good morning",
        afternoon: "Good afternoon",
        evening: "Good evening"
      },
      status: {
        active: "Station Active",
        monitoring: "Monitoring Node",
        engine: "RAG Analysis engine online. Telemetry stream stable.",
        online: "Active"
      },
      buttons: {
        report: "Report",
        newAnalysis: "New Analysis",
        openForecast: "Open Forecast",
        settings: "Settings",
        generatePlan: "Generate New Plan",
        analyzing: "Analyzing..."
      },
      weather: { title: "Weather", syncing: "Syncing..." },
      planner: {
        title: "Crop Planner",
        harvestReady: "Harvest Ready",
        complete: "Current cycle complete.",
        description: "AI schedule calibrated to your current field moisture and weather.",
        noTimeline: "No Active Timeline",
        initialize: "Initialize the station to sync your crop lifecycle.",
        due: "Due"
      },
      toasts: {
        loadError: "Unable to load field data",
        planSuccess: "Plan optimized!",
        planError: "Failed to connect to AI Planner",
        updateError: "Failed to update task",
        downloadSuccess: "Report Downloaded",
        downloadError: "PDF Export failed"
      },
      pdf: { title: "AgriAI Field Report", farmer: "Farmer", queries: "Queries" }
    },

    // 4. Agri-GPT / Queries
    queries: {
      station: "Intelligent Station",
      newChat: "New Chat",
      pastLogs: "Past Logs",
      emptyTitle: "Your Field, Digitized.",
      emptySub: "Analyze crop health or pest issues using text, images, or voice.",
      userRole: "Farmer Node",
      aiRole: "Krishi Officer AI",
      share: "Share",
      analyzing: "Analyzing Field Data...",
      voiceReady: "Voice Note Ready",
      placeholder: "Describe your crop issue...",
      addImage: "Add Image",
      voice: "Voice",
      listening: "Listening...",
      analyzeBtn: "Analyze",
      fieldLogs: "Field Logs",
      multimediaQuery: "Multimedia Query",
      errors: {
        loadChat: "Unable to load this conversation",
        emptyQuery: "Provide a query, image, or voice note",
        unreachable: "AI Station Unreachable",
        deleteFail: "Failed to delete",
        renameFail: "Failed to rename",
        browserSupport: "Browser not supported",
      }
    },

    // 5. Field Hub / Analysis
    field: {
      hero: { online: "Station Online", sensor: "Sensor", rain: "Rain", irrigate: "Irrigate" },
      stats: {
        moisture: "Soil Moisture",
        nitrogen: "Nitrogen",
        ph: "pH Level",
        health: "Health",
        optimal: "Optimal",
        needsWater: "Needs Water",
        criticallyDry: "Critically Dry"
      },
      command: {
        title: "Command Center",
        heatwave: "Simulate Heatwave",
        reset: "Reset Environment",
        impact: "Environmental Impact",
        lastRain: "Last Rainfall",
        nodeInfo: "This station uses a Rule-Based Engine to simulate soil physics."
      },
      guidance: {
        title: "Agronomic Guidance",
        priority: "Priority",
        action: "Action",
        optimalLimits: "Soil parameters are within optimal safety limits"
      },
      rainModal: {
        title: "Simulate Rain",
        subtitle: "Select Precipitation Level",
        light: "Light Drizzle",
        moderate: "Moderate Rain",
        heavy: "Heavy Storm",
        volume: "volume"
      },
      dosage: {
        title: "Rx Dosage Engine",
        unitAcre: "Acres",
        unitHectare: "Hectares",
        unitCent: "Cents",
        outputLabel: "Required Farm Volume",
        chemicals: {
          npk_19: "NPK 19:19:19 (Foliar)",
          urea: "Urea (Top Dress)",
          neem_oil: "Neem Oil 10000ppm",
          copper_50wp: "Copper Fungicide 50%",
          bordeaux: "Bordeaux (1%)",
          tricho: "Trichoderma Viride"
        }
      },
      setup: {
        title: "Register Field",
        subtitle: "Initialize Digital Twin",
        plotName: "Plot Identity",
        cropType: "Crop Type",
        soilType: "Soil Type",
        soilOptions: { laterite: "Laterite", black: "Black Soil", alluvial: "Alluvial" },
        activate: "Activate Station",
        syncing: "Syncing..."
      },
      toasts: {
        rainSuccess: "Rain simulated: Moisture increased",
        irrigationSuccess: "Irrigation sequence successful",
        heatSuccess: "Heatwave simulated: Moisture dropped",
        resetSuccess: "Field Environment Reset",
        setupFail: "Setup failed"
      }
    },

    // 6. Community Map
    map: {
      title: "Community Heatmap",
      subtitle: "Real-time local disease tracking to prevent epidemic spread.",
      liveData: "Live Data",
      demoMode: "Demo Mode",
      reportBtn: "Report Outbreak",
      stats: { threats: "Active Threats", monitoring: "Monitoring", total: "Total Reports (30d)" },
      popup: { risk: "Risk", district: "District" },
      modal: {
        title: "Report Outbreak",
        badge: "Alert nearby farmers",
        crop: "Crop Name",
        district: "District",
        disease: "Disease / Pest Name",
        severity: "Severity Level",
        severityOptions: { low: "Low - Contained", medium: "Medium - Spreading Fast", high: "High - Severe Epidemic Risk" },
        submit: "Broadcast Warning",
        submitting: "Broadcasting Warning..."
      },
      toasts: { loadFail: "Failed to load community heatmap", success: "Disease reported to community map!", submitFail: "Failed to submit report" }
    },

    // 7. Weather Page
    weather: {
      loading: "Syncing Global Data",
      hero: { status: "Station Active", clear: "Clear skies in your farm area", wind: "Wind Velocity", rain: "Rain Chance" },
      advisory: { title: "Farm Advisory", subtitle: "Smart recommendations for today" },
      gauge: { label: "Condition Index", safe: "Safe to Spray", unsafe: "Unsafe to Spray", desc: "Low wind speeds and zero rain detected. Ideal for pest control." },
      forecast: { title: "24-Hour Forecast", rain: "Rain" },
      toasts: { fail: "Failed to update weather data" }
    },

    // 8. Auth flow
    forgotPassword: {
      title: "Reset Password",
      step1Sub: "Enter email to receive a reset code",
      step2Sub: "Set your new secure password",
      labels: { email: "Email Address", otp: "OTP Code", newPassword: "New Password", confirmPassword: "Confirm Password" },
      placeholders: { email: "your-email@example.com", otp: "6-digit code", newPassword: "Min. 8 characters", confirmPassword: "Repeat new password" },
      buttons: { sendCode: "Send Reset Code", sending: "Sending...", update: "Update Password", updating: "Resetting...", back: "Back to Login" },
      toasts: { enterEmail: "Please enter your email", otpSent: "Recovery OTP sent to email", userNotFound: "User not found", fieldsRequired: "All fields are required", mismatch: "Passwords do not match", length: "Password must be at least 8 characters", success: "Password reset successful! Please login.", invalidOtp: "Invalid OTP or session expired" }
    },
    login: {
      title: "Welcome Back",
      subtitle: "Login to manage your farm and queries",
      labels: { email: "Email Address", password: "Password", forgot: "Forgot?" },
      placeholders: { email: "farmer@example.com", password: "••••••••" },
      buttons: { signIn: "Sign In", authenticating: "Authenticating...", createAccount: "Create Account" },
      footer: { new: "New to AgriAI?", link: "Create Account" },
      toasts: { required: "Please enter both email and password", success: "Login successful! Welcome back.", fail: "Login failed" }
    },
    signup: {
      title: "Create Account",
      verifyTitle: "Verify Email",
      subtitle: "Join our community of smart farmers",
      verifySubtitle: (email) => `Enter the 6-digit code sent to ${email}`,
      labels: { name: "Full Name", email: "Email Address", password: "Password", otp: "Verification Code" },
      placeholders: { name: "Enter your name", email: "farmer@example.com", password: "Min. 8 characters", otp: "000000" },
      buttons: { sendOtp: "Send OTP", processing: "Processing...", verify: "Verify & Sign In", verifying: "Verifying...", changeEmail: "Change Email Address" },
      footer: { already: "Already have an account?", login: "Login" },
      toasts: { fillAll: "Please fill all fields", invalidEmail: "Invalid email format", passLength: "Password must be at least 8 characters", otpSent: "OTP sent to your email!", regFailed: "Registration failed", enterOtp: "Please enter the OTP", success: "Account verified! Welcome to AgriAI.", verifyFailed: "Verification failed" }
    },
    profile: {
      labels: { accountDetails: "Account Details", email: "Email Address", memberSince: "Member Since", verified: "Verified Account", pending: "Verification Pending", general: "General", displayName: "Display Name", security: "Security", currentPass: "Current Password", newPass: "New Password" },
      placeholders: { name: "Enter your name", currentPass: "Current Password", newPass: "New Password" },
      buttons: { saveProfile: "Save Profile Changes", updateSecurity: "Update Security Credentials", updating: "Updating..." },
      toasts: { loadFail: "Failed to load profile", updateSuccess: "Profile updated", updateFail: "Update failed", passwordRequired: "Please fill in both password fields", passwordSuccess: "Password updated successfully", passwordFail: "Error updating password" }
    }
  }
};