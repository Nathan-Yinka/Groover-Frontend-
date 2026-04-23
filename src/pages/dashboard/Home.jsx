import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { IoHelpCircle, IoStar, IoTrophy } from "react-icons/io5";
import { IoMdNotificationsOutline } from "react-icons/io";
import { FaCcMastercard } from "react-icons/fa";
import { BiBook, BiUserCircle } from "react-icons/bi";
import { BsCalendar2Event } from "react-icons/bs";
import { CiCreditCard1 } from "react-icons/ci";
import {
  FiArrowRight,
  FiHeadphones,
  FiPlay,
  FiPlusSquare,
  FiTrendingUp,
} from "react-icons/fi";
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

  const notificationList = Array.isArray(notifications) ? notifications : [];
  const unreadNotifications = notificationList.filter(
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
        label: "Frozen funds",
        value: formatCurrencyWithCode(profile?.wallet?.on_hold || 0),
      },
      {
        label: "Unread alerts",
        value: `${unreadNotifications}`,
      },
    ],
    [profile, unreadNotifications],
  );

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
    <div className="min-h-screen w-full bg-[#f6f1ea] text-[#221d1a]">
      <div className="hidden px-5 pt-5 md:block md:px-8 md:pt-6">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between rounded-[26px] border border-white/60 bg-white/70 px-5 py-3 shadow-[0_20px_55px_-40px_rgba(26,20,18,0.55)] backdrop-blur-xl">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#a56657]">
              Dashboard Mix
            </p>
            <p className="mt-1 text-sm text-[#6b625d]">
              Everything you need for today&apos;s run, in one place.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/home/notifications")}
              className="relative flex h-12 w-12 items-center justify-center rounded-full border border-[#eadfd4] bg-[#fffaf6] text-[#2f2724] transition hover:-translate-y-0.5 hover:border-[#EC6345]/35 hover:text-[#EC6345]"
            >
              <IoMdNotificationsOutline className="text-xl" />
              {unreadNotifications > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#EC6345] px-1 text-[11px] font-semibold text-white">
                  {unreadNotifications}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => navigate("/home/profile")}
              className="flex items-center gap-3 rounded-full border border-[#eadfd4] bg-[#fffaf6] px-2 py-2 pr-4 transition hover:-translate-y-0.5 hover:border-[#EC6345]/35"
            >
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="h-10 w-10 rounded-full object-cover ring-2 ring-[#EC6345]/15"
                />
              ) : (
                <BiUserCircle className="h-10 w-10 text-[#8b8580]" />
              )}
              <div className="text-left">
                <p className="text-sm font-semibold text-[#221d1a]">{displayName}</p>
                <p className="text-xs text-[#7a706a]">
                  {profile?.wallet?.package?.name || "Starter tier"}
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1600px] space-y-5 px-3 py-4 pb-28 md:space-y-6 md:px-8 md:py-6 md:pb-8">
        <section className="relative overflow-hidden rounded-[34px] border border-[#eadfd4] bg-[#1b1614] shadow-[0_28px_80px_-45px_rgba(26,20,18,0.75)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,183,157,0.2),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(236,99,69,0.22),transparent_30%)]" />
          <div className="grid gap-6 p-4 md:p-6 xl:grid-cols-[1.08fr_0.92fr] xl:gap-8 xl:p-8">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="relative z-10 flex flex-col justify-between rounded-[28px] border border-white/10 bg-white/5 p-5 text-white backdrop-blur-sm md:p-8"
            >
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#ffd9cf]">
                    <FiHeadphones className="text-sm" />
                    Artist Workflow
                  </span>
                  <span className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs text-white/70">
                    {profile?.wallet?.package?.name || "Starter"} unlocked
                  </span>
                </div>

                <h1 className="mt-6 max-w-[720px] text-3xl font-semibold leading-[1.05] tracking-[-0.03em] text-white sm:text-4xl lg:text-5xl xl:text-6xl">
                  {showIntroWelcome
                    ? `Welcome back, ${displayName}.`
                    : (activeTypingText || "Shape your daily run with smarter submissions.")}
                  {!showIntroWelcome && (
                    <span className="ml-1 inline-block text-[#ffb29f] animate-pulse">|</span>
                  )}
                </h1>

                <p className="mt-4 max-w-[580px] text-sm leading-6 text-white/72 md:text-base">
                  Review music, manage your wallet, and move through your tasks in a
                  dashboard that feels more like a studio control room than a utility page.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => navigate(starting)}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#EC6345] px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#d9583b] md:text-base"
                  >
                    <FiPlusSquare className="text-base" />
                    Start New Submission
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/home/profile")}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/15 md:text-base"
                  >
                    View Profile
                    <FiArrowRight className="text-base" />
                  </button>
                </div>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {missionHighlights.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-white/10 bg-black/20 p-4"
                  >
                    <p className="text-[11px] uppercase tracking-[0.22em] text-white/45">
                      {item.label}
                    </p>
                    <p className="mt-2 text-xl font-semibold text-white">{item.value}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: "easeOut", delay: 0.08 }}
              className="relative min-h-[420px] overflow-hidden rounded-[28px] border border-white/10 bg-[#221917]"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${heroSlides[currentHeroSlide]?.type}-${heroSlides[currentHeroSlide]?.src}`}
                  initial={{ opacity: 0.35, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0.3, scale: 1.02 }}
                  transition={{ duration: 0.75, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  {heroSlides[currentHeroSlide]?.type === "video" ? (
                    <video
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="h-full w-full object-cover object-center"
                    >
                      <source src={heroSlides[currentHeroSlide]?.src} type="video/mp4" />
                    </video>
                  ) : (
                    <img
                      src={heroSlides[currentHeroSlide]?.src}
                      alt="Hero media"
                      className="h-full w-full object-cover object-center"
                    />
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(7,6,6,0.82),rgba(15,11,10,0.2)_50%,rgba(7,6,6,0.76))]" />
              <div className="absolute left-5 top-5 right-5 flex items-start justify-between gap-4">
                <div className="rounded-full border border-white/10 bg-black/25 px-4 py-2 text-xs text-white/70 backdrop-blur-md">
                  Session spotlight
                </div>
                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-4 py-2 text-xs text-white/70 backdrop-blur-md">
                  <FiPlay className="text-[#ffb29f]" />
                  Auto-playing showcase
                </div>
              </div>

              <div className="absolute bottom-5 left-5 right-5 space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  {overviewStats.slice(0, 2).map((item) => (
                    <div
                      key={item.label}
                      className="rounded-[22px] border border-white/10 bg-white/10 p-4 text-white backdrop-blur-md"
                    >
                      <p className="text-[11px] uppercase tracking-[0.22em] text-white/50">
                        {item.label}
                      </p>
                      <p className="mt-2 text-xl font-semibold text-white md:text-2xl">
                        {item.value}
                      </p>
                      <p className="mt-1 text-xs text-white/65">{item.helper}</p>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between rounded-[22px] border border-white/10 bg-black/30 px-4 py-3 text-white/80 backdrop-blur-md">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.22em] text-white/45">
                      Slide progress
                    </p>
                    <p className="mt-1 text-sm">
                      {String(currentHeroSlide + 1).padStart(2, "0")} /{" "}
                      {String(heroSlides.length).padStart(2, "0")}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    {heroSlides.map((slide, index) => (
                      <button
                        key={`${slide.src}-${index}`}
                        type="button"
                        onClick={() => setCurrentHeroSlide(index)}
                        className={`h-2.5 rounded-full transition ${
                          index === currentHeroSlide
                            ? "w-10 bg-[#EC6345]"
                            : "w-2.5 bg-white/35 hover:bg-white/55"
                        }`}
                        aria-label={`Go to hero slide ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="overflow-hidden rounded-[30px] border border-[#eadfd4] bg-white shadow-[0_26px_65px_-45px_rgba(26,20,18,0.45)]">
            <div className="flex items-center justify-between border-b border-[#f0e6db] px-5 py-4 md:px-6">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#a56657]">
                  Quick Launch
                </p>
                <h2 className="mt-1 text-lg font-semibold text-[#221d1a] md:text-xl">
                  Your core actions, rebuilt as a cleaner control grid.
                </h2>
              </div>
              <button
                type="button"
                onClick={() => navigate(starting)}
                className="hidden items-center gap-2 rounded-full border border-[#eadfd4] bg-[#fffaf6] px-4 py-2 text-sm font-medium text-[#332823] transition hover:border-[#EC6345]/35 hover:text-[#EC6345] md:inline-flex"
              >
                Jump into Starting
                <FiArrowRight />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 lg:grid-cols-4 md:p-6">
              {quickActions.map((item, index) => (
                <motion.button
                  key={item.label}
                  type="button"
                  onClick={() => navigate(item.route)}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: index * 0.04 }}
                  className="group rounded-[24px] border border-[#f0e6db] bg-[linear-gradient(180deg,#fffdfa_0%,#f9f3ec_100%)] p-4 text-left transition hover:-translate-y-1 hover:border-[#EC6345]/35 hover:shadow-[0_24px_50px_-35px_rgba(236,99,69,0.55)]"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#221d1a] text-white transition group-hover:bg-[#EC6345] md:h-14 md:w-14">
                    <item.icon className="text-xl md:text-2xl" />
                  </span>
                  <p className="mt-4 text-sm font-semibold text-[#221d1a] md:text-base">
                    {item.label}
                  </p>
                  <p className="mt-1 text-xs text-[#7a706a]">
                    Open and continue without losing flow.
                  </p>
                </motion.button>
              ))}
            </div>
          </div>

          <div className="grid gap-5">
            <div className="overflow-hidden rounded-[30px] border border-[#eadfd4] bg-[#221917] text-white shadow-[0_26px_65px_-45px_rgba(26,20,18,0.75)]">
              <div className="relative p-5 md:p-6">
                <div className="absolute -right-12 -top-16 h-36 w-36 rounded-full bg-[#EC6345]/20 blur-3xl" />
                <p className="relative text-[11px] font-semibold uppercase tracking-[0.24em] text-[#ffb29f]">
                  Momentum
                </p>
                <h3 className="relative mt-2 text-2xl font-semibold tracking-tight">
                  Today&apos;s performance pulse.
                </h3>
                <div className="relative mt-5 space-y-3">
                  {overviewStats.slice(2).map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                    >
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.2em] text-white/45">
                          {item.label}
                        </p>
                        <p className="mt-1 text-sm text-white/70">{item.helper}</p>
                      </div>
                      <p className="text-lg font-semibold text-white">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-[30px] border border-[#eadfd4] bg-white shadow-[0_26px_65px_-45px_rgba(26,20,18,0.45)]">
              <div className="flex items-start justify-between gap-4 p-5 md:p-6">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#a56657]">
                    Audio Corner
                  </p>
                  <h3 className="mt-2 text-xl font-semibold tracking-tight text-[#221d1a]">
                    Keep the energy up while you review.
                  </h3>
                </div>
                <div className="rounded-full bg-[#fff0eb] p-3 text-[#EC6345]">
                  <FiTrendingUp className="text-lg" />
                </div>
              </div>
              <div className="px-5 pb-5 text-sm text-[#6b625d] md:px-6 md:pb-6">
                Daily playlists, fast actions, and your current stats are now arranged to feel
                smoother and easier to scan.
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#a56657]">
                VIP Access
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#221d1a] md:text-3xl">
                Explore premium tiers with a stronger storefront feel.
              </h2>
            </div>
            <button
              type="button"
              onClick={() => navigate("/home/level")}
              className="inline-flex items-center gap-2 self-start rounded-full border border-[#eadfd4] bg-white px-4 py-2 text-sm font-medium text-[#332823] transition hover:border-[#EC6345]/35 hover:text-[#EC6345]"
            >
              Compare all benefits
              <FiArrowRight />
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {error ? (
              <p className="text-red-400">Failed to load packs.</p>
            ) : packItems.length > 0 ? (
              packItems.slice(0, 4).map((pack, index) => {
                const TierIcon = tierIcons[index % tierIcons.length];
                const tierTheme = tierThemes[index % tierThemes.length];
                const hasCommission =
                  pack?.profit_percentage !== null
                  && pack?.profit_percentage !== undefined;
                const hasDailyMissions =
                  pack?.daily_missions !== null && pack?.daily_missions !== undefined;

                return (
                  <motion.button
                    key={`${pack.name}-${index}`}
                    type="button"
                    onClick={() => navigate("/home/level")}
                    whileHover={{ y: -6 }}
                    transition={{ duration: 0.2 }}
                    className={`group relative overflow-hidden rounded-[28px] border ${tierTheme.border} bg-gradient-to-br ${tierTheme.card} p-5 text-left text-white shadow-[0_25px_65px_-40px_rgba(0,0,0,0.9)]`}
                  >
                    <div className="absolute -right-12 -top-10 h-28 w-28 rounded-full bg-white/10 blur-2xl transition duration-300 group-hover:scale-125" />
                    <div className="relative">
                      <div className="flex items-center justify-between">
                        <div className="rounded-full border border-white/15 bg-white/10 p-3">
                          <TierIcon className={`text-xl ${tierTheme.icon}`} />
                        </div>
                        <span className="rounded-full border border-white/10 bg-black/25 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/80">
                          {index === 0 ? "Default" : `VIP ${index}`}
                        </span>
                      </div>

                      <div className="mt-8">
                        <div className={`mb-3 h-1.5 w-12 rounded-full ${tierTheme.accent}`} />
                        <p className="text-2xl font-semibold tracking-tight">{pack.name}</p>
                        <p className="mt-2 text-sm text-white/65">
                          {formatCurrencyWithCode(pack.usd_value)}
                        </p>
                      </div>

                      <div className="mt-6 space-y-3 text-sm">
                        <div className="flex items-center justify-between text-white/70">
                          <span>Commission</span>
                          <span className="font-semibold text-white">
                            {hasCommission ? `${pack.profit_percentage}%` : "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-white/70">
                          <span>Daily orders</span>
                          <span className="font-semibold text-white">
                            {hasDailyMissions ? pack.daily_missions : "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.button>
                );
              })
            ) : (
              <p className="text-[#605E5E]">No packs available.</p>
            )}
          </div>
        </section>

        <section className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[30px] border border-[#eadfd4] bg-[linear-gradient(180deg,#fffdfa_0%,#f9f3ec_100%)] p-5 shadow-[0_26px_65px_-45px_rgba(26,20,18,0.45)] md:p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#a56657]">
              Playlist Lounge
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#221d1a]">
              Put something smooth on while you work through your queue.
            </h2>
            <p className="mt-4 max-w-[480px] text-sm leading-6 text-[#6b625d]">
              Set the mood, stay focused, and let the playlist carry the session while you review
              tracks, submit tasks, and keep your momentum up.
            </p>
          </div>

          <div className="overflow-hidden rounded-[30px] border border-[#eadfd4] bg-white shadow-[0_26px_65px_-45px_rgba(26,20,18,0.45)]">
            <iframe
              title="Spotify Playlist"
              src="https://open.spotify.com/embed/playlist/52ryhemOPZrgqWE98Sr3kl?utm_source=generator&theme=0"
              width="100%"
              height="352"
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
