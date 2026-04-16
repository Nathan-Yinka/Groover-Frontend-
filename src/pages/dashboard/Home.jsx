import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
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
    card: "from-[#0f3f2a]/90 via-[#195837]/70 to-[#101214]",
    border: "border-[#2ccd79]/35",
    icon: "text-[#b7f7d6]",
  },
  {
    card: "from-[#4c2f17]/90 via-[#6a3f1a]/70 to-[#101214]",
    border: "border-[#d28c41]/35",
    icon: "text-[#f0bc84]",
  },
  {
    card: "from-[#3a3d44]/95 via-[#5b5d63]/60 to-[#101214]",
    border: "border-[#a4a8af]/35",
    icon: "text-[#e5e7eb]",
  },
  {
    card: "from-[#4a430a]/95 via-[#7f7112]/60 to-[#101214]",
    border: "border-[#d9c329]/35",
    icon: "text-[#ffe866]",
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
    [displayName],
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
            dispatch(
              fetchProfileFailure(response.message || "Failed to load profile."),
            );
            toast.error(response.message || "Failed to load profile.");
          }
        } catch (profileError) {
          console.error("Error fetching profile:", profileError);
          dispatch(
            fetchProfileFailure("An error occurred while fetching your profile."),
          );
          toast.error("An error occurred while fetching your profile.");
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
    <div className="min-h-screen w-full bg-[#060606] text-white">
      <div className="hidden h-[68px] border-b border-white/10 bg-[#0b0b0c] px-3 md:px-8 md:flex items-center gap-3 md:gap-6">
        <div className="ml-auto flex items-center gap-3 md:gap-5">
          <button
            type="button"
            onClick={() => navigate("/home/notifications")}
            className="relative rounded-full border border-white/10 bg-black/70 p-2.5 hover:border-accent/50 transition"
          >
            <IoMdNotificationsOutline className="text-xl" />
            {unreadNotifications > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[11px] font-semibold text-black">
                {unreadNotifications}
              </span>
            )}
          </button>
          <div className="hidden md:block h-8 w-px bg-white/15" />
          <button
            type="button"
            onClick={() => navigate("/home/profile")}
            className="flex items-center gap-2 rounded-full bg-transparent px-0.5 py-1"
          >
            <div className="hidden text-right md:block">
              <p className="text-sm font-medium leading-tight">{displayName}</p>
            </div>
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="h-10 w-10 rounded-full object-cover ring-1 ring-white/20"
              />
            ) : (
              <BiUserCircle className="h-10 w-10 text-white/75" />
            )}
          </button>
        </div>
      </div>

      <div className="w-full space-y-5 md:space-y-6 px-3 md:px-8 py-4 md:py-6">
        <section
          className="relative overflow-hidden rounded-[26px] border border-white/10 min-h-[320px] md:min-h-[360px]"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={`${heroSlides[currentHeroSlide]?.type}-${heroSlides[currentHeroSlide]?.src}`}
              initial={{ opacity: 0.4, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0.35, scale: 1.01 }}
              transition={{ duration: 0.65, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              {heroSlides[currentHeroSlide]?.type === "video" ? (
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="h-full w-full object-cover object-center scale-[1.06]"
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
          <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/20 to-black/35" />
          <div className="relative z-10 max-w-[700px] p-5 md:p-10">
            <h1
              className="text-xl font-bold leading-snug md:text-5xl md:leading-tight min-h-[56px] md:min-h-[120px]"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {showIntroWelcome
                ? `Welcome back, ${displayName}`
                : (activeTypingText || "Start your submission and earn daily rewards.")}
              {!showIntroWelcome && <span className="ml-0.5 inline-block animate-pulse">|</span>}
            </h1>
            <p className="mt-3 max-w-[560px] text-sm text-white/80 md:text-lg">
              Ready to discover your next favorite artist and earn from each completed review.
            </p>
            <p className="mt-2 min-h-[52px] max-w-[560px] text-sm text-accent md:text-lg">
              {showIntroWelcome ? "Your dashboard is ready." : "Track progress, submit faster, get paid daily."}
            </p>
            <button
              type="button"
              onClick={() => navigate(starting)}
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-accent px-6 py-3 text-sm font-semibold text-black transition hover:brightness-110 md:text-base"
            >
              <FiPlusSquare className="text-base" />
              New Submission
            </button>
          </div>
        </section>

        <section className="rounded-[26px] border border-white/10 bg-[#0d0d0e] px-3 py-5 md:px-8 md:py-7">
          <div className="grid grid-cols-4 gap-3 md:flex md:items-center md:justify-center md:flex-wrap md:gap-10">
            {quickActions.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => navigate(item.route)}
                className="group text-center transition"
              >
                <span className="mx-auto mb-2 grid h-12 w-12 md:h-[74px] md:w-[74px] place-items-center rounded-full border border-white/15 bg-white/5 transition group-hover:border-accent/50 group-hover:bg-accent/10">
                  <item.icon className="text-lg md:text-3xl text-white/75 group-hover:text-accent" />
                </span>
                <p className="text-[11px] md:text-xs font-medium text-white/85">
                  {item.label}
                </p>
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-5 pb-28 md:pb-8">
          <div className="flex flex-col items-center justify-center gap-3 text-center">
            <div className="max-w-2xl">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold tracking-tight">VIP Tier Access</h2>
              <p className="mt-1 text-xs sm:text-sm lg:text-base text-white/60">
                Scale your outreach with premium musician tiers.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate("/home/level")}
              className="text-xs md:text-sm font-semibold text-accent hover:underline"
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
                    whileHover={{ y: -3 }}
                    key={`${pack.name}-${index}`}
                    type="button"
                    onClick={() => navigate("/home/level")}
                    className={`rounded-2xl md:rounded-[30px] border ${tierTheme.border} bg-gradient-to-br ${tierTheme.card} p-4 md:p-5 text-left min-h-[168px] md:min-h-[205px] shadow-[0_20px_50px_-35px_rgba(0,0,0,0.95)]`}
                  >
                    <div className="mb-4 md:mb-6 flex items-center justify-between">
                      <div className="rounded-full border border-white/25 bg-black/30 p-2">
                        <TierIcon className={`${tierTheme.icon}`} />
                      </div>
                      <span className="rounded-full bg-accent px-2 py-1 text-[9px] sm:text-[10px] font-bold uppercase text-black">
                        {index === 0 ? "Default" : `VIP ${index}`}
                      </span>
                    </div>
                    <p className="text-lg sm:text-xl lg:text-2xl font-semibold leading-tight">{pack.name}</p>
                    <p className="mt-1 text-[11px] sm:text-xs lg:text-sm text-white/70">
                      {formatCurrencyWithCode(pack.usd_value)}
                    </p>
                    {(hasCommission || hasDailyMissions) && (
                      <div className="mt-4 md:mt-5 space-y-2 text-[11px] sm:text-xs lg:text-sm">
                        {hasCommission && (
                          <div className="flex items-center justify-between text-white/65">
                            <span>Commission Rate</span>
                            <span className="font-semibold text-accent">{commissionRate}</span>
                          </div>
                        )}
                        {hasDailyMissions && (
                          <div className="flex items-center justify-between text-white/65">
                            <span>Daily Orders</span>
                            <span className="font-semibold text-white">{dailyOrders}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </motion.button>
                );
              })
            ) : (
              <p className="text-white/70">No packs available.</p>
            )}
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/40">
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
