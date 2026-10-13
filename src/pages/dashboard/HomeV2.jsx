import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  IoStar,
  IoTrophy,
  IoHelpCircle,
  IoWalletOutline,
  IoChevronForwardOutline,
  IoNotificationsOutline,
  IoShieldCheckmarkOutline,
  IoPulseOutline,
  IoMusicalNotesOutline,
  IoLayersOutline,
} from "react-icons/io5";
import { BiBook, BiUserCircle } from "react-icons/bi";
import { BsCalendar2Event } from "react-icons/bs";
import { CiCreditCard1 } from "react-icons/ci";
import { FaCcMastercard } from "react-icons/fa";
// import { GiCrown, GiMusicSpell } from "react-icons/gi";
import { FiPlusSquare } from "react-icons/fi";
import { fetchActivePacks } from "../../app/service/packs.service";
import { fetchProducts } from "../../app/service/products.service";
import Loader from "./components/Load";
import {
  about,
  certificate,
  deposit,
  events,
  faq,
  starting,
  terms,
  withdraw,
  notifications as notificationsRoute,
  profile as profileRoute,
  level as levelRoute,
} from "../../constants/app.routes";
import {
  fetchProfileFailure,
  fetchProfileStart,
  fetchProfileSuccess,
} from "../../app/slice/profile.slice";
import authService from "../../app/service/auth.service";
import { fetchNotifications } from "../../app/service/notifications.service";
import { formatCurrencyWithCode } from "../../utils/currency";
import BottomNavMobile from "./components/BottomNavMobile";
// import MusicVisualizer from "./components/MusicVisualizer";

// Assets
import v2HeroImage from "../../assets/v2_hero_image.png";
// import v2AlbumArt from "../../assets/v2_album_art.png";
import eyeCatcher from "../../assets/eye_catcher.png";
import tierBronze from "../../assets/tier_bg_bronze.png";
import tierSilver from "../../assets/tier_bg_silver.png";
import tierGold from "../../assets/tier_bg_gold.png";
import tierDiamond from "../../assets/tier_bg_diamond.png";
import v2HeroVar1 from "../../assets/v2_hero_variation1.png";
import v2HeroVar2 from "../../assets/v2_hero_variation2.png";
// import startingCardBg from "../../assets/starting_card_bg.png";
import v2HeroStudioCurator from "../../assets/v2_hero_studio_curator.png";
import financeCardBg from "../../assets/v2_finance_bg.png";
import supportCardBg from "../../assets/v2_support_bg.png";
import eventBg from "../../assets/v2_events_bg.png";
import missionBg from "../../assets/v2_mission_bg.png";
import certBg from "../../assets/v2_cert_bg.png";

const ACTIONS = ["just earned commission on", "successfully Status", "is now trending with", "completed a payout for", "finalized a win on", "launched a global hit with"];
const NAMES = [
 "Peter Ander", "Sarah Jenkins", "Marco Rossi", "Ellen Wu", "David Chen", "Sofia Garcia", "Liam O'Connor", "Amina Al-Farsi", "Hiroshi Tanaka", "Emma Wilson",
 "Hans Müller", "Chloe Dubois", "Arjun Patel", "Isabella Santos", "Lucas Meyer", "Yuki Sato", "Olga Ivanova", "Jean-Pierre Blanc", "Maria Hernandez", "Sven Lindberg",
 "Aisha Bello", "Keiko Mori", "Omar El-Sayed", "Elena Popova", "Carlos Ruiz", "Ingrid Vogt", "Mateo Silva", "Noor Khan", "Lars Jensen", "Fatima Zahra",
 "John Doe", "Jane Smith", "Robert Brown", "Emily Davis", "Michael Miller", "Jessica Taylor", "William Thomas", "Olivia Moore", "James Jackson", "Sophia White",
 "Alexander Harris", "Charlotte Martin", "Daniel Thompson", "Amelia Garcia", "Matthew Robinson", "Harper Clark", "Joseph Rodriguez", "Evelyn Lewis", "Samuel Lee", "Abigail Walker",
 "Sebastian Hall", "Mia Allen", "David Young", "Elizabeth Hernandez", "Andrew King", "Sofia Wright", "Anthony Lopez", "Avery Hill", "Joshua Scott", "Evelyn Green",
 "Christopher Adams", "Ella Baker", "Kevin Nelson", "Scarlett Carter", "Thomas Mitchell", "Victoria Perez", "Charles Roberts", "Grace Turner", "Edward Phillips", "Chloe Campbell",
 "Brian Parker", "Riley Evans", "Richard Edwards", "Zoey Collins", "Steven Stewart", "Lily Sanchez", "Paul Morris", "Serenity Rogers", "Andrew Reed", "Leah Cook",
 "Gregory Morgan", "Aubrey Bell", "Franklin Murphy", "Stella Bailey", "Mark Rivera", "Peyton Cooper", "Steven Richardson", "Valentina Cox", "Edward Howard", "Ruby Ward",
 "Justin Torres", "Genesis Peterson", "Brandon Gray", "Madeline Ramires", "Raymond James", "Kimberly Watson", "Jeremy Brooks", "Kylie Kelly", "Nathan Sanders", "Katherine Price"
];

const tierThemes = [
  {
    card: "from-[#1b1818] via-[#281f1b] to-[#100d0d]",
    border: "border-[#EC6345]/25",
    icon: "text-[#ffd9cf]",
    accent: "bg-[#EC6345]",
  },
  {
    card: "from-[#2b211d] via-[#3d2822] to-[#150f0e]",
    border: "border-[#f0bc84]/25",
    icon: "text-[#f6cca1]",
    accent: "bg-[#f0bc84]",
  },
  {
    card: "from-[#17181c] via-[#21252c] to-[#0f1114]",
    border: "border-[#c8d3e6]/20",
    icon: "text-[#dce6f7]",
    accent: "bg-[#b8c7e2]",
  },
  {
    card: "from-[#251916] via-[#4a2a20] to-[#130e0e]",
    border: "border-[#ff9f88]/25",
    icon: "text-[#ffe0d8]",
    accent: "bg-[#ff9f88]",
  },
];

const tierIcons = [IoStar, IoStar, IoStar, IoTrophy];

const HomeV2 = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const profile = useSelector((state) => state.profile.user);
  const { notifications } = useSelector((state) => state.notifications);
  const { packs, isLoading: packsLoading } = useSelector((state) => state.packs);
  const { products, isLoading: productsLoading } = useSelector((state) => state.products);

  const packItems = useMemo(() => {
    return Array.isArray(packs?.data)
      ? packs.data
      : Array.isArray(packs?.data?.data)
        ? packs.data.data
        : Array.isArray(packs)
          ? packs
          : [];
  }, [packs]);

  const unreadNotifications = notifications.filter((n) => !n.is_read).length;
  const displayName = [profile?.first_name, profile?.last_name].filter(Boolean).join(" ").trim() || profile?.username || "Curator";

  const trendingSubmissions = useMemo(() => {
    if (!products || products.length === 0) return [];
    return [...products].sort(() => 0.5 - Math.random()).slice(0, 4);
  }, [products]);

  const globalWins = useMemo(() => {
    if (!products || products.length === 0) return [];
    // Generate a set of pseudo-live community wins
    return NAMES.slice(0, 10).map((name, i) => {
      const randomAction = ACTIONS[i % ACTIONS.length];
      const randomProd = products[i % products.length];
      const randomAmount = (Math.random() * (900 - 100) + 100).toFixed(2);
      return `${name} ${randomAction} ${randomProd.product_name || randomProd.name} — Earned $${randomAmount}`;
    });
  }, [products]);

  const tickerItems = useMemo(() => {
    const personal = notifications.map(n => n.message || n.title).filter(Boolean);
    const welcome = [
      `Session active for ${profile?.first_name || 'Curator'}`,
      "Global network connected",
      "New trending campaigns available"
    ];
    // Mix global wins with personal alerts
    return [...globalWins, ...personal, ...welcome];
  }, [notifications, profile, globalWins]);

  const heroSlides = useMemo(() => {
    return [
      { type: "image", src: v2HeroStudioCurator },
      { type: "image", src: v2HeroImage },
      { type: "image", src: v2HeroVar1 },
      { type: "image", src: v2HeroVar2 },
      { type: "image", src: eyeCatcher },
    ];
  }, []);

  const [showIntroWelcome, setShowIntroWelcome] = useState(false);
  const [typingIndex, setTypingIndex] = useState(0);
  const [typedCharCount, setTypedCharCount] = useState(0);
  const [isDeletingText, setIsDeletingText] = useState(false);

  const typingLines = useMemo(
    () => [
      "Shape your daily run with smarter submissions.",
      "Track each review, payout, and performance spike.",
      "Keep momentum high while your rewards build up.",
    ],
    [],
  );

  const activeTypingText = typingLines[typingIndex]?.slice(0, typedCharCount) || "";

  const overviewStats = useMemo(
    () => [
      {
        label: "Wallet balance",
        value: formatCurrencyWithCode(profile?.wallet?.balance || 0),
        helper: "Available now",
      },
      {
        label: "Today profit",
        value: formatCurrencyWithCode(profile?.today_profit || 0),
        helper: "Updated in real time",
      },
      {
        label: "Credit score",
        value: `${profile?.wallet?.credit_score || 0}%`,
        helper: "Trust and consistency",
      },
      {
        label: "Package",
        value: profile?.wallet?.package?.name || "Starter",
        helper: "Your current tier",
      },
    ],
    [profile],
  );

  const missionHighlights = useMemo(
    () => [
      {
        label: "Submissions left",
        value: `${Math.max((profile?.total_number_can_play || 0) - (profile?.current_number_count || 0), 0)}`,
      },
      {
        label: "Wallet Balance",
        value: formatCurrencyWithCode(profile?.wallet?.balance || 0),
      },
      {
        label: "Unread alerts",
        value: `${unreadNotifications}`,
      },
    ],
    [profile, unreadNotifications],
  );



  useEffect(() => {
    if (packItems.length === 0) {
      dispatch(fetchActivePacks()).catch(e => console.error("Error fetching packs:", e));
    }
  }, [dispatch, packItems.length]);

  useEffect(() => {
    if (!profile) {
      dispatch(fetchProfileStart());
      authService.fetchProfile()
        .then(res => res.success ? dispatch(fetchProfileSuccess(res.data)) : dispatch(fetchProfileFailure(res.message)))
        .catch(e => dispatch(fetchProfileFailure(e.message)));
    }
  }, [dispatch, profile]);

  useEffect(() => {
    dispatch(fetchNotifications());
    const interval = setInterval(() => dispatch(fetchNotifications()), 120000);
    return () => clearInterval(interval);
  }, [dispatch]);

  useEffect(() => {
    const cacheKey = `hero_v2_seen_${profile?.id || 'guest'}`;
    if (!sessionStorage.getItem(cacheKey)) {
      setShowIntroWelcome(true);
      setTimeout(() => {
        setShowIntroWelcome(false);
        sessionStorage.setItem(cacheKey, "1");
      }, 3000);
    }
  }, [profile?.id]);

  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    if (heroSlides.length <= 1) return;
    const activeSlide = heroSlides[heroIndex % heroSlides.length];
    const delay = activeSlide?.type === "video" ? 8000 : 5000;
    const timer = setTimeout(() => {
      setHeroIndex((prev) => (prev + 1) % heroSlides.length);
    }, delay);
    return () => clearTimeout(timer);
  }, [heroIndex, heroSlides]);


  useEffect(() => {
    const currentLine = typingLines[typingIndex] || "";
    let delay = isDeletingText ? 34 : 56;

    if (!isDeletingText && typedCharCount === currentLine.length) {
      delay = 1400;
    }
    if (isDeletingText && typedCharCount === 0) {
      delay = 220;
    }

    const timer = setTimeout(() => {
      if (!isDeletingText && typedCharCount === currentLine.length) {
        setIsDeletingText(true);
        return;
      }

      if (isDeletingText && typedCharCount === 0) {
        setIsDeletingText(false);
        setTypingIndex((prev) => (prev + 1) % typingLines.length);
        return;
      }

      setTypedCharCount((prev) => prev + (isDeletingText ? -1 : 1));
    }, delay);

    return () => clearTimeout(timer);
  }, [isDeletingText, typedCharCount, typingIndex, typingLines]);

  useEffect(() => {
    const cacheKey = `hero_intro_seen_${profile?.id || "Curator"}`;
    const alreadyShown = sessionStorage.getItem(cacheKey) === "1";

    if (!alreadyShown) {
      setShowIntroWelcome(true);
      const timer = setTimeout(() => {
        setShowIntroWelcome(false);
        sessionStorage.setItem(cacheKey, "1");
      }, 3000);

      return () => clearTimeout(timer);
    }

    setShowIntroWelcome(false);
    return undefined;
  }, [profile?.id]);

  useEffect(() => {
    dispatch(fetchActivePacks());
    dispatch(fetchNotifications());
    dispatch(fetchProducts());
    
    const getProfile = async () => {
      dispatch(fetchProfileStart());
      try {
        const response = await authService.getProfile();
        if (response.success) {
          dispatch(fetchProfileSuccess(response.data));
        } else {
          dispatch(fetchProfileFailure(response.message));
        }
      } catch (error) {
        dispatch(fetchProfileFailure(error.message));
      }
    };
    getProfile();
  }, [dispatch]);

  if (packsLoading || productsLoading) return <Loader />;

  const tierBgs = [tierBronze, tierSilver, tierGold, tierDiamond, tierDiamond];

  return (
    <div className="min-h-screen grow bg-[#f6f1ea] text-[#221d1a] selection:bg-[#EC6345]/30 overflow-x-hidden font-sans">
      {/* BRAND TOP BAR */}
      <div className="px-4 pt-4 md:px-8 md:pt-6 sticky top-0 z-[100]">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between rounded-[22px] md:rounded-[26px] border border-white/60 bg-white/70 px-4 md:px-6 py-2.5 md:py-3 shadow-[0_20px_55px_-40px_rgba(26,20,18,0.55)] backdrop-blur-xl">
          <div className="flex items-center gap-4 md:gap-8">
            <div>
              <p className="text-[9px] md:text-[10px] font-semibold uppercase tracking-[0.32em] text-[#a56657]">
                Dashboard Mix
              </p>
              <p className="hidden md:block mt-1 text-[11px] font-medium text-[#8b8580]">
                Everything you need for today's run, in one place.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <button
              type="button"
              onClick={() => navigate(notificationsRoute)}
              className="relative flex h-9 w-9 md:h-11 md:w-11 items-center justify-center rounded-full border border-[#eadfd4] bg-[#fffaf6] text-[#2f2724] transition hover:-translate-y-0.5"
            >
              <IoNotificationsOutline className="text-lg md:text-xl" />
              {unreadNotifications > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#EC6345] px-1 text-[9px] font-semibold text-white">
                  {unreadNotifications}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => navigate(profileRoute)}
              className="flex items-center gap-2 md:gap-3 rounded-full border border-[#eadfd4] bg-[#fffaf6] p-1 md:p-1.5 md:pr-5 transition hover:-translate-y-0.5"
            >
              {profile?.profile_picture ? (
                <img
                  src={profile.profile_picture}
                  alt="Profile"
                  className="h-7 w-7 md:h-9 md:w-9 rounded-full object-cover ring-2 ring-[#EC6345]/10"
                />
              ) : (
                <div className="h-7 w-7 md:h-9 md:w-9 rounded-full bg-slate-100 flex items-center justify-center">
                  <BiUserCircle className="text-xl md:text-2xl text-slate-300" />
                </div>
              )}
              <div className="hidden md:block text-left">
                <p className="text-xs font-bold text-[#221d1a] uppercase tracking-wider">{profile?.first_name || "Curator"}</p>
                <p className="text-[10px] font-medium text-[#a56657] uppercase tracking-tighter">
                  {profile?.wallet?.package?.name || "VIP 0"}
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>


      {/* MAIN CONTENT AREA */}
      <main className="mx-auto w-full max-w-[1600px] space-y-8 px-4 py-6 md:space-y-12 md:px-8 md:py-8 lg:py-10">
        <section className="relative overflow-hidden rounded-[40px] bg-[#1b1513] shadow-3xl">
           {/* MOBILE BACKGROUND CAROUSEL (Integrated for mobile immersion) */}
           <div className="absolute inset-0 z-0 lg:hidden opacity-40">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={heroSlides[heroIndex]?.src}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 1.5 }}
                  className="h-full w-full"
                >
                  <img src={heroSlides[heroIndex]?.src} className="h-full w-full object-cover" alt="" />
                </motion.div>
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-[#1b1614] via-black/40 to-black/60" />
           </div>

           <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 p-4 md:p-6 lg:p-4">
             {/* LEFT: MISSION CONTROL */}
             <motion.div
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               className="relative z-10 flex flex-col justify-between p-8 sm:p-12 lg:p-16"
             >
               <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.25em] text-[#ffd9cf]">
                      <IoMusicalNotesOutline className="text-xs" />
                      Curator Workflow
                    </span>
                    <span className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-[10px] font-bold text-white/70 uppercase tracking-widest">
                      {profile?.wallet?.package?.name || "VIP 0"} Status
                    </span>
                  </div>

                  <div className="mt-8 min-h-[140px] sm:min-h-[120px] lg:min-h-[160px] flex flex-col justify-start">
                    <h1 className="text-3xl font-bold leading-[1.2] tracking-tighter text-white sm:text-4xl lg:text-5xl bg-gradient-to-br from-white via-white to-white/70 bg-clip-text">
                      {showIntroWelcome
                        ? `Welcome back, ${profile?.first_name || "Curator"}.`
                        : (activeTypingText || "Shape your daily run with smarter submissions.")}
                      {!showIntroWelcome && (
                        <span className="ml-1 inline-block text-[#ffb29f] animate-pulse">|</span>
                      )}
                    </h1>
                  </div>

                  <p className="mt-6 max-w-[520px] text-sm leading-relaxed text-white/70 font-medium md:text-lg">
                    Review music, manage your wallet, and move through your missions in a dashboard that feels more like a studio control room than a utility page.
                  </p>

                  <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                    <button
                      onClick={() => navigate(starting)}
                      className="group inline-flex items-center justify-center gap-3 rounded-md bg-[#EC6345] px-8 py-4 text-sm font-bold text-white shadow-xl shadow-[#EC6345]/20 transition-all hover:-translate-y-1 hover:bg-[#BA5225] hover:shadow-2xl active:scale-95"
                    >
                      <FiPlusSquare className="text-lg" />
                      Start New Submission
                    </button>
                    <button
                      onClick={() => navigate(profileRoute)}
                      className="group inline-flex items-center justify-center gap-3 rounded-md border border-white/20 bg-white/5 px-8 py-4 text-sm font-bold text-white transition hover:bg-white/10 active:scale-95"
                    >
                      View Profile
                      <IoChevronForwardOutline className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
               </div>

               <div className="mt-10 grid gap-4 grid-cols-1 sm:grid-cols-3">
                 {[
                   { ...missionHighlights[0], icon: IoLayersOutline },
                   { ...missionHighlights[1], icon: IoWalletOutline },
                   { ...missionHighlights[2], icon: IoNotificationsOutline }
                 ].map((item, i) => (
                   <div key={i} className="rounded-2xl border border-white/5 bg-white/[0.03] p-5 group hover:border-[#EC6345]/40 hover:bg-white/[0.07] transition-all relative overflow-hidden">
                      <div className="absolute -right-4 -bottom-4 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity">
                         <item.icon className="text-6xl" />
                      </div>
                      <p className="text-[9px] uppercase tracking-[0.3em] text-white/40 font-bold mb-2 flex items-center gap-2">
                        <item.icon className="text-[#EC6345]/60" />
                        {item.label}
                      </p>
                      <p className="text-xl md:text-2xl font-bold text-white tracking-tight whitespace-nowrap truncate">{item.value}</p>
                   </div>
                 ))}
               </div>
             </motion.div>

             {/* RIGHT: LIVE CAROUSEL & STATS */}
             <motion.div
               initial={{ opacity: 0, scale: 0.98 }}
               animate={{ opacity: 1, scale: 1 }}
               className="hidden lg:relative lg:block lg:min-h-[600px] overflow-hidden rounded-[32px] border border-white/5 bg-[#221917]"
             >
                  <div className="absolute top-6 left-6 z-20 flex gap-2">
                    <span className="rounded-full bg-black/40 px-3 py-1 text-[9px] font-bold text-white/70 uppercase tracking-widest backdrop-blur-md">Session spotlight</span>
                  </div>
                  <div className="absolute top-6 right-6 z-20">
                     <span className="flex items-center gap-2 rounded-full bg-black/40 px-3 py-1 text-[9px] font-bold text-white/70 uppercase tracking-widest backdrop-blur-md">
                        <IoPulseOutline className="text-[10px] text-[#EC6345]" />
                        Auto-playing showcase
                     </span>
                  </div>

                  <div className="absolute inset-0 z-0">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={heroSlides[heroIndex]?.src}
                        initial={{ opacity: 0.8, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0.8, scale: 1.05 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="absolute inset-0"
                      >
                         <img src={heroSlides[heroIndex]?.src} className="h-full w-full object-cover" alt="" />
                      </motion.div>
                    </AnimatePresence>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1b1614] via-black/10 to-transparent" />
                  </div>
                  
                  {/* OVERLAY STATS CARDS */}
                  <div className="absolute bottom-20 left-6 right-6 z-20 grid grid-cols-2 gap-4">
                      <div className="rounded-2xl border border-white/10 bg-white/10 p-4 sm:p-5 backdrop-blur-xl min-w-0">
                        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/40 mb-1 truncate">Wallet Balance</p>
                        <p className="text-lg sm:text-xl font-bold text-white whitespace-nowrap overflow-hidden text-ellipsis">{formatCurrencyWithCode(profile?.wallet?.balance || 0)}</p>
                        <p className="mt-1 text-[8px] font-medium text-white/30 uppercase truncate">Available now</p>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-white/10 p-4 sm:p-5 backdrop-blur-xl min-w-0">
                        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/40 mb-1 truncate">Today Profit</p>
                        <p className="text-lg sm:text-xl font-bold text-white whitespace-nowrap overflow-hidden text-ellipsis">{formatCurrencyWithCode(0)}</p>
                        <p className="mt-1 text-[8px] font-medium text-white/30 uppercase truncate">Updated in real time</p>
                      </div>
                  </div>

                  <div className="absolute bottom-8 left-6 right-6 z-20 flex items-center justify-between">
                    <div>
                        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/40 mb-2">Slide Progress</p>
                        <p className="text-[10px] font-bold text-white tracking-widest">{String(heroIndex + 1).padStart(2, '0')} / {String(heroSlides.length).padStart(2, '0')}</p>
                    </div>
                    <div className="flex gap-1.5">
                      {heroSlides.map((_, i) => (
                        <div key={i} className={`h-1 w-4 rounded-full transition-all duration-500 ${i === heroIndex ? 'bg-[#EC6345] w-8' : 'bg-white/20'}`} />
                      ))}
                    </div>
                  </div>
             </motion.div>
           </div>
        </section>
        <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="overflow-hidden rounded-[30px] border border-[#eadfd4] bg-white shadow-[0_26px_65px_-45px_rgba(26,20,18,0.45)]">
            <div className="flex flex-wrap items-center justify-between border-b border-[#f0e6db] px-6 py-5 md:px-8">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#a56657]">
                  Quick Launch Hub
                </p>
                <h2 className="mt-2 text-xl font-bold text-[#221d1a] md:text-2xl tracking-tighter">
                  Core actions, rebuilt as a studio control grid.
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 p-5 sm:grid-cols-3 lg:grid-cols-4 md:p-8">
              {[
                { label: "Withdraw", sub: "Wallet", icon: FaCcMastercard, route: withdraw, bg: financeCardBg },
                { label: "Deposit", sub: "Funding", icon: CiCreditCard1, route: deposit, bg: financeCardBg },
                { label: "T & C", sub: "Rules", icon: BiBook, route: terms, bg: supportCardBg },
                { label: "Events", sub: "Calendar", icon: BsCalendar2Event, route: events, bg: eventBg },
                { label: "FAQ", sub: "Support", icon: IoHelpCircle, route: faq, bg: supportCardBg },
                { label: "Cert", sub: "Milestones", icon: IoTrophy, route: certificate, bg: certBg },
                { label: "About", sub: "Mission", icon: IoMusicalNotesOutline, route: about, bg: missionBg },
                { label: "Security", sub: "Verify", icon: IoShieldCheckmarkOutline, route: profileRoute, bg: supportCardBg },
              ].map((action, i) => (
                <motion.button
                  key={i}
                  whileHover={{ y: -6 }}
                  onClick={() => navigate(action.route)}
                  className={`group relative overflow-hidden rounded-[24px] border border-[#f0e6db] bg-[linear-gradient(180deg,#fffdfa_0%,#f9f3ec_100%)] p-5 text-left transition hover:border-[#EC6345]/35 shadow-sm hover:shadow-[0_24px_50px_-35px_rgba(236,99,69,0.25)] h-[140px] md:h-[160px] flex flex-col justify-between`}
                >
                   {action.bg && (
                    <div className="absolute inset-0 z-0 opacity-[0.08] grayscale group-hover:opacity-30 group-hover:grayscale-0 transition-all duration-700">
                       <img src={action.bg} className="w-full h-full object-cover" alt="" />
                    </div>
                  )}
                  <div className="relative z-10 w-11 h-11 md:w-12 md:h-12 rounded-xl bg-[#221d1a] border border-[#333] text-white flex items-center justify-center transition group-hover:bg-[#EC6345] group-hover:border-[#EC6345] group-hover:scale-110 shadow-lg">
                    <action.icon className="text-xl md:text-2xl" />
                  </div>
                  <div className="relative z-10">
                    <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#a56657] mb-1 opacity-70">{action.sub}</p>
                    <p className="text-sm font-bold text-[#221d1a] md:text-base tracking-tight italic">{action.label}</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          <div className="grid gap-8">
            <div className="overflow-hidden rounded-[30px] border border-[#eadfd4] bg-[#221917] text-white shadow-[0_26px_65px_-45px_rgba(26,20,18,0.75)] relative h-full">
              <div className="absolute -right-12 -top-16 h-40 w-40 rounded-full bg-[#EC6345]/20 blur-3xl" />
              <div className="relative z-10 p-6 md:p-8 flex flex-col h-full justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#ffb29f]">
                    Momentum Pulse
                  </p>
                  <h3 className="mt-3 text-2xl font-bold tracking-tight italic">
                    Performance metrics.
                  </h3>
                </div>
                <div className="mt-8 space-y-4">
                  {overviewStats.slice(2).map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 group hover:bg-white/10 transition-all"
                    >
                      <div className="shrink-0">
                        <p className="text-[9px] uppercase tracking-[0.25em] text-white/40 font-bold mb-1">
                          {item.label}
                        </p>
                        <p className="text-xs text-white/60 font-medium">{item.helper}</p>
                      </div>
                      <p className="text-lg sm:text-2xl font-black text-white tracking-tighter whitespace-nowrap">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between px-2">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#a56657]">
                Milestone Access
              </p>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-[#221d1a] md:text-5xl uppercase italic leading-none">
                Elite VIP Tiers <span className="text-[#EC6345]">Status.</span>
              </h2>
            </div>
            <button
              onClick={() => navigate(levelRoute)}
              className="inline-flex items-center gap-2 self-start rounded-full border border-[#eadfd4] bg-white px-6 py-3 text-xs font-bold text-[#332823] transition hover:border-[#EC6345]/35 hover:text-[#EC6345] uppercase tracking-widest shadow-sm"
            >
              Compare all benefits
              <IoChevronForwardOutline />
            </button>
          </div>

          <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
            {packsLoading ? (
              Array(4).fill(0).map((_, i) => <div key={i} className="h-[280px] rounded-[28px] bg-white animate-pulse" />)
            ) : packItems.length > 0 ? (
              packItems.slice(0, 4).map((pack, index) => {
                const TierIcon = tierIcons[index % tierIcons.length];
                const tierTheme = tierThemes[index % tierThemes.length];
                return (
                  <motion.button
                    key={`${pack.name}-${index}`}
                    onClick={() => navigate(levelRoute)}
                    whileHover={{ y: -8 }}
                    className={`group relative overflow-hidden rounded-[32px] border ${tierTheme.border} bg-gradient-to-br ${tierTheme.card} p-8 text-left text-white shadow-2xl transition-all duration-300 min-h-[280px] flex flex-col justify-between`}
                  >
                    <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/5 blur-3xl transition duration-500 group-hover:scale-150 group-hover:bg-white/10" />
                    
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-8">
                        <div className="rounded-2xl border border-white/15 bg-white/10 p-3.5 backdrop-blur-md">
                          <TierIcon className={`text-2xl ${tierTheme.icon}`} />
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-[0.25em] text-white/50 bg-black/20 px-3 py-1 rounded-full border border-white/5">
                          {index === 0 ? "Starter" : `Level ${index}`}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <div className={`h-1 w-12 rounded-full ${tierTheme.accent} mb-4 shadow-lg`} />
                        <h3 className="text-3xl font-bold tracking-tight italic uppercase leading-none">{pack.name}</h3>
                        <p className="text-sm font-medium text-white/40 tracking-widest uppercase">
                          {formatCurrencyWithCode(pack.usd_value)}
                        </p>
                      </div>
                    </div>

                    <div className="relative z-10 pt-8 border-t border-white/10 mt-6 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[8px] uppercase tracking-widest text-white/40 font-bold mb-1">Commission</p>
                        <p className="text-sm font-bold">{pack?.profit_percentage || 0}%</p>
                      </div>
                      <div>
                        <p className="text-[8px] uppercase tracking-widest text-white/40 font-bold mb-1">Daily Tasks</p>
                        <p className="text-sm font-bold">{pack?.daily_missions || 0}</p>
                      </div>
                    </div>
                  </motion.button>
                );
              })
            ) : (
              <p className="text-slate-400">No milestone tiers detected.</p>
            )}
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[40px] border border-[#eadfd4] bg-[linear-gradient(180deg,#fffdfa_0%,#f9f3ec_100%)] p-8 md:p-12 shadow-xl flex flex-col justify-center relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                <IoMusicalNotesOutline className="text-[200px]" />
             </div>
             <div className="relative z-10 max-w-md">
               <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#a56657]">
                 Audio Corner
               </p>
               <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#221d1a] md:text-5xl italic leading-tight">
                 Keep the energy <br /> up while you <span className="text-[#EC6345]">work.</span>
               </h2>
               <p className="mt-6 text-sm leading-relaxed text-[#6b625d] font-medium md:text-lg">
                 Set the mood, stay focused, and let the playlist carry the session while you review tracks and submit missions.
               </p>
               <button 
                 onClick={() => navigate(starting)}
                 className="mt-10 px-8 py-3.5 border border-[#EC6345]/30 text-[#EC6345] rounded-full text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#EC6345] hover:text-white transition-all shadow-lg shadow-[#EC6345]/10"
               >
                 Explore Playlists
               </button>
             </div>
          </div>

          <div className="overflow-hidden rounded-[40px] border border-[#eadfd4] bg-white shadow-2xl">
            <iframe
              title="Spotify Playlist"
              src="https://open.spotify.com/embed/playlist/52ryhemOPZrgqWE98Sr3kl?utm_source=generator&theme=0"
              width="100%"
              height="400"
              allowFullScreen={false}
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            />
          </div>
        </section>
      </main>



      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 bg-[#F7F6F0]">
         <div className="absolute top-0 right-0 w-[600px] h-[600px] md:w-[800px] md:h-[800px] bg-[#EC6345]/2 rounded-full blur-[150px] md:blur-[200px]" />
      </div>
    </div>
  );
};

export default HomeV2;
