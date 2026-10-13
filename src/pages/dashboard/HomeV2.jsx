import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { BiUserCircle, BiBook } from "react-icons/bi";
import { BsCalendar2Event } from "react-icons/bs";
import {
  IoChevronForwardOutline,
  IoCardOutline,
  IoCashOutline,
  IoDocumentTextOutline,
  IoHelpCircleOutline,
  IoPeopleOutline,
  IoRibbonOutline,
  IoRefreshOutline,
} from "react-icons/io5";
import { fetchActivePacks } from "../../app/service/packs.service";
import {
  fetchProfileFailure,
  fetchProfileStart,
  fetchProfileSuccess,
} from "../../app/slice/profile.slice";
import authService from "../../app/service/auth.service";
import axiosInstance from "../../app/axiosConfig";
import { dashboardBannersAPI } from "../../constants/api.routes";
import { formatCurrencyWithCode } from "../../utils/currency";
import fallbackBanner from "../../assets/v2_hero_studio_curator.png";

const quickActions = [
  { label: "Submit", icon: IoRefreshOutline, route: "/home/starting" },
  { label: "Records", icon: BiBook, route: "/home/records" },
  { label: "Withdraw", icon: IoCashOutline, route: "/home/withdraw" },
  { label: "Deposit", icon: IoCardOutline, route: "/home/deposit" },
  { label: "Certificate", icon: IoRibbonOutline, route: "/home/certificate" },
  { label: "Events", icon: BsCalendar2Event, route: "/home/events" },
  { label: "FAQ", icon: IoHelpCircleOutline, route: "/home/faqs" },
  { label: "About Us", icon: IoPeopleOutline, route: "/home/about" },
  { label: "Terms", icon: IoDocumentTextOutline, route: "/home/terms" },
];

const HomeV2 = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const profile = useSelector((state) => state.profile.user);
  const { packs } = useSelector((state) => state.packs);

  const [banners, setBanners] = useState([]);
  const [slide, setSlide] = useState(0);

  const packItems = useMemo(() => {
    return Array.isArray(packs?.data)
      ? packs.data
      : Array.isArray(packs?.data?.data)
        ? packs.data.data
        : Array.isArray(packs)
          ? packs
          : [];
  }, [packs]);

  // Hero images come from the backend (Django admin > Dashboard Banners).
  useEffect(() => {
    let active = true;
    axiosInstance
      .get(dashboardBannersAPI)
      .then((response) => {
        if (!active) return;
        const payload = response?.data?.data;
        const list = Array.isArray(payload) ? payload : payload?.results || [];
        setBanners(list.map((b) => b.image).filter(Boolean));
      })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  const slides = banners.length > 0 ? banners : [fallbackBanner];

  useEffect(() => {
    if (slides.length <= 1) return undefined;
    const timer = setInterval(() => setSlide((prev) => (prev + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    if (packItems.length === 0) {
      dispatch(fetchActivePacks()).catch(() => {});
    }
  }, [dispatch, packItems.length]);

  useEffect(() => {
    if (!profile) {
      dispatch(fetchProfileStart());
      authService.fetchProfile()
        .then((res) => (res.success ? dispatch(fetchProfileSuccess(res.data)) : dispatch(fetchProfileFailure(res.message))))
        .catch((e) => dispatch(fetchProfileFailure(e.message)));
    }
  }, [dispatch, profile]);

  const packageName = profile?.wallet?.package?.name || "Basic";
  const packageIcon = profile?.wallet?.package?.icon;

  return (
    <div className="min-h-screen bg-[#F7F6F0] text-[#221d1a]">
      <div className="w-full space-y-5 px-4 py-5 pb-32 md:px-6 md:py-6 md:pb-10">

        {/* GREETING */}
        <div className="flex items-center justify-between gap-4 rounded-2xl bg-[#221917] p-5 text-white">
          <div className="flex items-center gap-4">
            {profile?.profile_picture ? (
              <img src={profile.profile_picture} alt="" className="h-14 w-14 rounded-full object-cover" />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10">
                <BiUserCircle className="text-3xl text-white/70" />
              </div>
            )}
            <div>
              <h1 className="text-xl font-bold">Hi, {profile?.first_name || profile?.username || "there"} 👋</h1>
              <p className="text-sm text-white/60">Welcome back to your dashboard</p>
            </div>
          </div>
          <button
            onClick={() => navigate("/home/level")}
            className="flex shrink-0 items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-sm font-semibold hover:bg-white/15"
          >
            {packageIcon && <img src={packageIcon} alt="" className="h-6 w-6 object-contain" />}
            {packageName}
          </button>
        </div>

        {/* SUMMARY */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { label: "Wallet Balance", value: formatCurrencyWithCode(profile?.wallet?.balance || 0) },
            { label: "Today's Profit", value: formatCurrencyWithCode(profile?.today_profit || 0) },
            { label: "Submissions Left", value: Math.max((profile?.total_number_can_play || 0) - (profile?.current_number_count || 0), 0) },
            { label: "Credit Score", value: `${profile?.wallet?.credit_score || 0}%` },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-[#e5ded3] bg-white p-4">
              <p className="text-xs text-[#8b8580]">{item.label}</p>
              <p className="mt-1 text-lg font-bold">{item.value}</p>
            </div>
          ))}
        </div>

        {/* HERO IMAGE (from backend) */}
        <div className="relative h-[220px] overflow-hidden rounded-2xl bg-[#221917] md:h-[340px]">
          <img src={slides[slide % slides.length]} alt="" className="h-full w-full object-cover" />
          {slides.length > 1 && (
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Show image ${i + 1}`}
                  onClick={() => setSlide(i)}
                  className={`h-2 rounded-full transition-all ${i === slide % slides.length ? "w-6 bg-[#EC6345]" : "w-2 bg-white/60"}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* QUICK ACTIONS */}
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-9">
          {quickActions.map((item) => (
            <button
              key={item.label}
              onClick={() => navigate(item.route)}
              className="flex flex-col items-center gap-2 rounded-2xl border border-[#e5ded3] bg-white px-2 py-4 text-xs font-semibold text-[#333333] transition hover:border-[#EC6345]/40 hover:text-[#EC6345]"
            >
              <item.icon className="text-2xl" />
              {item.label}
            </button>
          ))}
        </div>

        {/* PACKAGES */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-bold">Packages</h2>
            <button
              onClick={() => navigate("/home/level")}
              className="flex items-center gap-1 rounded-full border border-[#e5ded3] bg-white px-4 py-1.5 text-sm font-semibold hover:border-[#EC6345]/40"
            >
              View more <IoChevronForwardOutline />
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {packItems.slice(0, 4).map((pack) => (
              <div key={pack.id || pack.name} className="rounded-2xl border border-[#e5ded3] bg-white p-4">
                <div className="flex items-center gap-3">
                  {pack.icon && <img src={pack.icon} alt="" className="h-10 w-10 object-contain" />}
                  <div>
                    <p className="font-bold">{pack.name}</p>
                    <p className="text-sm text-[#EC6345]">{formatCurrencyWithCode(pack.usd_value)}</p>
                  </div>
                </div>
                <p className="mt-3 text-sm text-[#605E5E]">
                  {pack.short_description || `Commission ${pack.profit_percentage}% · ${pack.daily_missions} submissions per day`}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* PLAYLIST */}
        <div>
          <h2 className="mb-3 text-lg font-bold">Playlist</h2>
          <div className="overflow-hidden rounded-2xl border border-[#e5ded3] bg-white">
            <iframe
              title="Spotify Playlist"
              src="https://open.spotify.com/embed/playlist/52ryhemOPZrgqWE98Sr3kl?utm_source=generator&theme=0"
              width="100%"
              height="352"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeV2;
