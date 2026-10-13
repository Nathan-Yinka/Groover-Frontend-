import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { showAlert } from "../../app/slice/ui.slice";
import {
  IoStar,
  IoTrophy,
  IoHelpCircle,
} from "react-icons/io5";
import { IoMdNotificationsOutline } from "react-icons/io";
import { FaCcMastercard } from "react-icons/fa";
import { BiBook } from "react-icons/bi";
import { BiUserCircle } from "react-icons/bi";
import { BsCalendar2Event } from "react-icons/bs";
import { CiCreditCard1 } from "react-icons/ci";
import { FiPlusSquare } from "react-icons/fi";
import heroAsset1 from "../../assets/soundcamp_hero_home.svg";
import heroAsset2 from "../../assets/soundcamp_homehero.svg";
import heroAsset3 from "../../assets/soundcamp_herohome3.svg";
import homeVideo from "../../assets/home_video.mp4";
import reviewVideo from "../../assets/reviewvideo.mp4";
import BottomNavMobile from "./components/BottomNavMobile";
import {
  about,
  certificate,
  deposit,
  events,
  faq,
  starting,
  terms,
  withdraw,
} from "../../constants/app.routes";
import { fetchActivePacks } from "../../app/service/packs.service";
import Loader from "./components/Load";
import {
  fetchProfileFailure,
  fetchProfileStart,
  fetchProfileSuccess,
} from "../../app/slice/profile.slice";
import authService from "../../app/service/auth.service";
import { fetchNotifications } from "../../app/service/notifications.service";
import { formatCurrencyWithCode } from "../../utils/currency";

const quickActions = [
  { label: "Starting", icon: IoStar, route: starting },
  { label: "Withdraw", icon: FaCcMastercard, route: withdraw },
  { label: "Deposit", icon: CiCreditCard1, route: deposit },
  { label: "T & C", icon: BiBook, route: terms },
  { label: "Events", icon: BsCalendar2Event, route: events },
  { label: "FAQ", icon: IoHelpCircle, route: faq },
  { label: "Cert", icon: IoTrophy, route: certificate },
  { label: "About Us", icon: IoHelpCircle, route: about },
];

const tierThemes = [
  {
    card: "from-slate-900 via-slate-800 to-slate-900",
    border: "border-primary/30",
    icon: "text-[#FFB29F]",
  },
  {
    card: "from-[#2C1814] via-[#3D251E] to-[#2C1814]",
    border: "border-primary/25",
    icon: "text-[#F0BC84]",
  },
  {
    card: "from-slate-800 via-slate-700 to-slate-800",
    border: "border-white/10",
    icon: "text-slate-100",
  },
  {
    card: "from-[#3D251E] via-[#523229] to-[#3D251E]",
    border: "border-primary/40",
    icon: "text-[#FFD1C6]",
  },
];


const tierIcons = [IoStar, IoStar, IoStar, IoTrophy];

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const profile = useSelector((state) => state.profile.user);
  const { notifications } = useSelector((state) => state.notifications);
  const { packs, isLoading, error } = useSelector((state) => state.packs);

  const packItems = Array.isArray(packs?.data)
    ? packs.data
    : Array.isArray(packs?.data?.data)
      ? packs.data.data
      : Array.isArray(packs)
        ? packs
        : [];

  const unreadNotifications = notifications.filter(
    (notification) => !notification.is_read,
  ).length;
  const displayName =
    [profile?.first_name, profile?.last_name].filter(Boolean).join(" ").trim()
    || profile?.username
    || profile?.email
    || "Artist";
  const profileImage = profile?.profile_picture || profile?.avatar || null;
  const heroSlides = useMemo(() => {
    const slides = [];
    if (profile?.settings?.video) {
      slides.push({ type: "video", src: profile.settings.video });
    }
    slides.push({ type: "video", src: homeVideo });
    slides.push({ type: "video", src: reviewVideo });
    slides.push({ type: "image", src: heroAsset1 });
    slides.push({ type: "image", src: heroAsset2 });
    slides.push({ type: "image", src: heroAsset3 });
    return slides;
  }, [profile?.settings?.video]);
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);
  const [showIntroWelcome, setShowIntroWelcome] = useState(false);
  const [typingIndex, setTypingIndex] = useState(0);
  const [typedCharCount, setTypedCharCount] = useState(0);
  const [isDeletingText, setIsDeletingText] = useState(false);
  const typingLines = useMemo(
    () => [
      "Start submissions and earn daily rewards.",
      "Review tracks daily and level up faster.",
      "Stay consistent, your payout is getting closer.",
    ],
    [],
  );
  const activeTypingText = typingLines[typingIndex]?.slice(0, typedCharCount) || "";

  useEffect(() => {
    const fetchPacks = async () => {
      if (packItems.length === 0) {
        try {
          await dispatch(fetchActivePacks());
        } catch (fetchError) {
          console.error("Error fetching packs:", fetchError);
        }
      }
    };

    fetchPacks();
  }, [dispatch, packItems.length]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!profile) {
        dispatch(fetchProfileStart());
        try {
          const response = await authService.fetchProfile();
          if (response.success) {
            dispatch(fetchProfileSuccess(response.data));
          } else {
            dispatch(fetchProfileFailure(response.message || "Failed to load profile."));
            dispatch(showAlert({ type: 'error', title: 'Profile Error', message: response.message || "Failed to load profile." }));
          }
        } catch (profileError) {
          console.error("Error fetching profile:", profileError);
          dispatch(fetchProfileFailure("An error occurred while fetching your profile."));
          dispatch(showAlert({ type: 'error', title: 'Connection Error', message: "An error occurred while fetching your profile." }));
        }
      }
    };

    fetchProfile();
  }, [dispatch, profile]);

  useEffect(() => {
    const fetchNotificationsInterval = () => {
      dispatch(fetchNotifications());
    };

    fetchNotificationsInterval();
    const interval = setInterval(fetchNotificationsInterval, 120000);

    return () => clearInterval(interval);
  }, [dispatch]);

  useEffect(() => {
    const cacheKey = `hero_intro_seen_${profile?.id || displayName}`;
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
  }, [displayName, profile?.id]);

  useEffect(() => {
    if (heroSlides.length <= 1) {
      return undefined;
    }

    const activeSlide = heroSlides[currentHeroSlide % heroSlides.length];
    const delay = activeSlide?.type === "video" ? 10000 : 6500;

    const timer = setTimeout(() => {
      setCurrentHeroSlide((prev) => (prev + 1) % heroSlides.length);
    }, delay);

    return () => clearTimeout(timer);
  }, [currentHeroSlide, heroSlides]);

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

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen w-full bg-[#F7F6F0] text-[#333333]">
      <div className="hidden h-[80px] border-b border-[#e5ded3] bg-white px-8 md:flex items-center gap-6 sticky top-0 z-30 shadow-sm backdrop-blur-md bg-white/90">
        <div className="ml-auto flex items-center gap-6">
          <button
            type="button"
            onClick={() => navigate("/home/notifications")}
            className="relative rounded-full border border-[#e5ded3] bg-white p-3 text-[#333333] shadow-sm transition-all hover:border-[#EC6345]/50 hover:text-[#EC6345] hover:scale-105 active:scale-95"
          >
            <IoMdNotificationsOutline className="text-2xl" />
            {unreadNotifications > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#EC6345] px-1 text-[10px] font-bold text-white ring-2 ring-white">
                {unreadNotifications}
              </span>
            )}
          </button>
          <div className="h-10 w-px bg-[#e5ded3]" />
          <button
            type="button"
            onClick={() => navigate("/home/profile")}
            className="flex items-center gap-3 rounded-full bg-white border border-[#e5ded3] pl-4 pr-1.5 py-1.5 shadow-sm transition-all hover:border-[#EC6345]/30 hover:shadow-md"
          >
            <div className="hidden text-right md:block">
              <p className="text-sm font-bold leading-tight text-[#2d2d2d]">{displayName}</p>
            </div>
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="h-10 w-10 rounded-full object-cover ring-2 ring-[#EC6345]/10"
              />
            ) : (
              <div className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-100 ring-2 ring-[#EC6345]/10">
                <BiUserCircle className="text-3xl text-slate-400" />
              </div>
            )}
          </button>
        </div>
      </div>


      <div className="w-full space-y-5 px-3 py-4 md:space-y-6 md:px-8 md:py-6">
        <section
          className="relative overflow-hidden rounded-[32px] border border-[#e5ded3] min-h-[340px] md:min-h-[400px] shadow-lg"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={`${heroSlides[currentHeroSlide]?.type}-${heroSlides[currentHeroSlide]?.src}`}
              initial={{ opacity: 0.4, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0.35, scale: 1.02 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute inset-0"
            >
              {heroSlides[currentHeroSlide]?.type === "video" ? (
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="h-full w-full object-cover object-center scale-[1.08]"
                >
                  <source src={heroSlides[currentHeroSlide]?.src} type="video/mp4" />
                </video>
              ) : (
                <img
                  src={heroSlides[currentHeroSlide]?.src}
                  alt="Hero media"
                  className="h-full w-full object-cover object-center scale-[1.12]"
                />
              )}
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
          <div className="relative z-10 max-w-[750px] p-8 md:p-14 h-full flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h1
                className="min-h-[60px] text-2xl md:text-5xl lg:text-6xl font-black leading-tight text-white font-heading text-balance"
              >
                {showIntroWelcome
                  ? `Welcome back, ${displayName}`
                  : (activeTypingText || "Start your submission and earn daily rewards.")}
                {!showIntroWelcome && <span className="ml-1 inline-block animate-pulse text-[#EC6345]">|</span>}
              </h1>
              <p className="mt-4 max-w-[560px] text-base md:text-xl text-white/90 font-medium leading-relaxed">
                {showIntroWelcome 
                  ? "Your dashboard is ready. Track your progress and earn daily."
                  : "Ready to discover your next favorite artist and earn from each completed review."}
              </p>
              <button
                type="button"
                onClick={() => navigate(starting)}
                className="mt-8 v2-button-primary px-8 py-4 flex items-center gap-3 text-lg"
              >
                <FiPlusSquare className="text-xl" />
                New Submission
              </button>
            </motion.div>
          </div>
        </section>


        <section className="v2-card bg-white px-5 py-6 md:px-10 md:py-8">
          <div className="grid grid-cols-4 gap-4 md:flex md:items-center md:justify-between md:flex-wrap">
            {quickActions.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => navigate(item.route)}
                className="group flex flex-col items-center gap-3 transition-all hover:scale-105"
              >
                <span className="grid h-12 w-12 place-items-center rounded-2xl border border-[#e5ded3] bg-[#F7F6F0] transition-all group-hover:border-[#EC6345]/50 group-hover:bg-[#fff5f2] group-hover:shadow-md md:h-[72px] md:w-[72px]">
                  <item.icon className="text-xl text-[#5f5b57] group-hover:text-[#EC6345] md:text-3xl" />
                </span>
                <p className="text-[10px] md:text-[13px] font-bold text-[#333] transition-colors group-hover:text-[#EC6345]">
                  {item.label}
                </p>
              </button>
            ))}
          </div>
        </section>


        <section className="space-y-6 pb-28 md:pb-8">
          <div className="flex flex-col items-center justify-center gap-2 text-center">
            <div className="max-w-2xl px-4">
              <span className="text-[10px] font-black text-[#EC6345] uppercase tracking-[0.25em] mb-2 block">Premium Tiers</span>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 font-heading tracking-tight">
                VIP Tier Access
              </h2>
              <p className="mt-3 text-slate-500 font-medium text-sm md:text-base text-balance">
                Elevate your experience and unlock exclusive rights and higher commission rates.
              </p>
            </div>
          </div>
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => navigate("/home/level")}
              className="text-xs font-semibold text-[#EC6345] hover:underline md:text-sm"
            >
              Compare all benefits
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {error ? (
              <p className="text-red-300">Failed to load packs.</p>
            ) : packItems.length > 0 ? (
              packItems.slice(0, 4).map((pack, index) => {
                const TierIcon = tierIcons[index % tierIcons.length];
                const tierTheme = tierThemes[index % tierThemes.length];
                const hasCommission = pack?.profit_percentage !== null && pack?.profit_percentage !== undefined;
                const hasDailyMissions = pack?.daily_missions !== null && pack?.daily_missions !== undefined;
                const commissionRate = hasCommission ? `${pack.profit_percentage}%` : null;
                const dailyOrders = hasDailyMissions ? pack.daily_missions : null;

                return (
                  <motion.button
                    whileHover={{ y: -6, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    key={`${pack.name}-${index}`}
                    type="button"
                    onClick={() => navigate("/home/level")}
                    className={`rounded-[32px] border ${tierTheme.border} bg-gradient-to-br ${tierTheme.card} p-5 md:p-7 text-left min-h-[180px] md:min-h-[240px] shadow-2xl relative overflow-hidden group`}
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16 group-hover:bg-white/10 transition-colors" />
                    
                    <div className="mb-6 flex items-center justify-between relative z-10">
                      <div className="rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur-md">
                        <TierIcon className={`text-2xl ${tierTheme.icon}`} />
                      </div>
                      <span className="rounded-full bg-primary/20 border border-primary/30 px-3 py-1 text-[10px] font-black uppercase text-primary tracking-wider backdrop-blur-md">
                        {index === 0 ? "Basic" : `VIP ${index}`}
                      </span>
                    </div>
                    
                    <div className="relative z-10">
                      <p className="text-xl md:text-2xl font-black leading-tight text-white font-heading">{pack.name}</p>
                      <p className="mt-1 text-sm text-white/60 font-medium">
                        {formatCurrencyWithCode(pack.usd_value)}
                      </p>
                      
                      {(hasCommission || hasDailyMissions) && (
                        <div className="mt-6 space-y-3 pt-6 border-t border-white/10">
                          {hasCommission && (
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-white/50 font-medium uppercase tracking-wider">Commission</span>
                              <span className="text-sm font-bold text-primary-light">{commissionRate}</span>
                            </div>
                          )}
                          {hasDailyMissions && (
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-white/50 font-medium uppercase tracking-wider">Daily Rev</span>
                              <span className="text-sm font-bold text-white">{dailyOrders}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.button>
                );

              })
            ) : (
              <p className="text-[#605E5E]">No packs available.</p>
            )}
          </div>

          <div className="overflow-hidden rounded-2xl border border-[#e5ded3] bg-white">
            <iframe
              title="Spotify Playlist"
              src="https://open.spotify.com/embed/playlist/52ryhemOPZrgqWE98Sr3kl?utm_source=generator&theme=0"
              width="100%"
              height="152"
              allowFullScreen={false}
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            />
          </div>
        </section>
      </div>

      <BottomNavMobile className="md:hidden" />
    </div>
  );
};

export default Home;


