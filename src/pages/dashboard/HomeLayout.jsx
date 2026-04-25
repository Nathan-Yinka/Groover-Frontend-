import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import SideBarWeb from "./components/SideBarWeb";
import logo from "../../assets/logo.svg";
import { home, login } from "../../constants/app.routes";
import { useDispatch, useSelector } from "react-redux";
import { IoMdNotificationsOutline } from "react-icons/io";
import { HiOutlineMenuAlt3, HiOutlineX } from "react-icons/hi";
import { MdOutlineDashboard } from "react-icons/md";
import { RiRestartLine, RiLuggageDepositLine } from "react-icons/ri";
import { BiBookOpen, BiCalendarEvent, BiMoneyWithdraw } from "react-icons/bi";
import { GiEgyptianProfile } from "react-icons/gi";
import { BiUserCircle } from "react-icons/bi";
import { AnimatePresence, motion } from "framer-motion";
import { CiLogout } from "react-icons/ci";
import { IoMusicalNotesOutline } from "react-icons/io5";
import MusicVisualizer from "./components/MusicVisualizer";
import authService from "../../app/service/auth.service";
import { logout } from "../../app/slice/auth.slice";

const HomeLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileTopBarHidden, setIsMobileTopBarHidden] = useState(false);
  const scrollContainerRef = useRef(null);
  const profile = useSelector((state) => state.profile.user);
  const { notifications } = useSelector((state) => state.notifications);
  const displayName =
    [profile?.first_name, profile?.last_name].filter(Boolean).join(" ").trim()
    || profile?.username
    || profile?.email
    || "";
  const profileImage = profile?.profile_picture || profile?.avatar || null;
  const unreadNotifications = notifications.filter(
    (notification) => !notification.is_read,
  ).length;

  const handleLogout = () => {
    authService.logout();
    dispatch(logout());
    setIsMobileMenuOpen(false);
    navigate(login);
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return undefined;

    let lastY = container.scrollTop;

    const handleScroll = () => {
      const currentY = container.scrollTop;
      const delta = currentY - lastY;

      // React immediately to scroll direction.
      if (currentY <= 0) {
        setIsMobileTopBarHidden(false);
      } else if (delta > 1) {
        setIsMobileTopBarHidden(true);
      } else if (delta < -1) {
        setIsMobileTopBarHidden(false);
      }

      lastY = currentY;
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      setIsMobileTopBarHidden(false);
    }
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollTo({ top: 0, left: 0, behavior: "auto" });
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
  }, [location.pathname]);

  return (
    <div className="flex h-screen bg-[#F7F6F0] text-[#333333]">
      <SideBarWeb />

      <div className="flex flex-col w-full h-full">
        {/* <div
          className={`nav-bar fixed left-0 right-0 top-0 z-40 flex h-[68px] items-center border-b border-[#e5ded3] bg-[#F7F6F0]/95 px-3 shadow-sm backdrop-blur transition-transform duration-200 will-change-transform md:hidden ${
            isMobileTopBarHidden ? "-translate-y-full" : "translate-y-0"
          }`}
        >
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            className="rounded-lg border border-[#e5ded3] bg-white p-2 text-[#333333] shadow-sm"
          >
            <HiOutlineMenuAlt3 className="text-xl" />
          </button>

          <button type="button" className="ml-3 flex items-center" onClick={() => navigate(home)}>
            <img src={logo} alt="Groover" className="h-auto w-[112px]" />
          </button>

          <div className="ml-auto flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/home/notifications")}
              className="relative rounded-full border border-[#e5ded3] bg-white p-2.5 shadow-sm"
            >
              <IoMdNotificationsOutline className="text-xl text-[#333333]" />
              {unreadNotifications > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#EC6345] px-1 text-[11px] font-semibold text-white">
                  {unreadNotifications}
                </span>
              )}
            </button>
            <div className="h-8 w-px bg-[#e5ded3]" />
            <button
              type="button"
              onClick={() => navigate("/home/profile")}
              className="flex items-center justify-center space-x-2 text-[#EC6345]"
            >
              <span className="text-sm font-medium text-[#333333] max-w-[120px] truncate">
                {displayName}
              </span>
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover ring-1 ring-[#EC6345]/25"
                />
              ) : (
                <BiUserCircle className="w-8 h-8 text-[#8b8580]" />
              )}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="fixed inset-0 z-50 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <button
                type="button"
                className="absolute inset-0 bg-[#272727]/45"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close menu backdrop"
              />
              <motion.div
                className="relative h-full w-[82%] max-w-[320px] border-r border-[#e5ded3] bg-[#F7F6F0] p-4 text-[#333333]"
                initial={{ x: -110, opacity: 0.4, scale: 0.94 }}
                animate={{ x: 0, opacity: 1, scale: 1 }}
                exit={{ x: -110, opacity: 0, scale: 0.94 }}
                transition={{ type: "spring", stiffness: 260, damping: 25 }}
              >
                <div className="mb-6 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      navigate(home);
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#EC6345] flex items-center justify-center text-white text-xl">
                      <IoMusicalNotesOutline />
                    </div>
                    <img src={logo} alt="Groover" className="h-6 w-auto" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="rounded-2xl border border-slate-100 bg-white p-2.5 text-slate-800 shadow-sm"
                  >
                    <HiOutlineX className="text-xl" />
                  </button>
                </div>

                <div className="flex h-[calc(100%-80px)] flex-col">
                  <div className="mb-8 p-4 rounded-2xl bg-white border border-slate-100 flex items-center justify-between shadow-sm">
                     <span className="text-[10px] font-black uppercase tracking-widest text-[#EC6345] italic">Live Console</span>
                     <MusicVisualizer />
                  </div>

                  <div className="space-y-1.5 flex-grow overflow-y-auto pr-1">
                    {[
                      { to: "/home", label: "Dashboard", icon: MdOutlineDashboard, end: true },
                      { to: "/home/starting", label: "Starting", icon: RiRestartLine },
                      { to: "/home/records", label: "Records", icon: BiBookOpen },
                      { to: "/home/profile", label: "Profile", icon: GiEgyptianProfile },
                      { to: "/home/notifications", label: "Notifications", icon: IoMdNotificationsOutline, badge: unreadNotifications },
                      { to: "/home/withdraw", label: "Withdraw", icon: BiMoneyWithdraw },
                      { to: "/home/deposit", label: "Deposit", icon: RiLuggageDepositLine },
                      { to: "/home/events", label: "Events", icon: BiCalendarEvent },
                    ].map((item, index) => (
                      <motion.div
                        key={item.label}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.045 }}
                      >
                        <NavLink
                          to={item.to}
                          end={item.end}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={({ isActive }) =>
                            isActive
                              ? "flex items-center gap-4 rounded-2xl border border-[#EC6345]/30 bg-white px-5 py-4 text-[#EC6345] font-black uppercase text-[11px] tracking-widest shadow-xl shadow-[#EC6345]/5"
                              : "flex items-center gap-4 rounded-2xl px-5 py-4 text-slate-400 font-bold uppercase text-[11px] tracking-widest hover:bg-white hover:text-slate-800"
                          }
                        >
                          <div className="relative">
                            <item.icon className="text-xl" />
                            {item.badge > 0 && (
                                <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#EC6345] text-[8px] font-black text-white border-2 border-white">
                                    {item.badge}
                                </span>
                            )}
                          </div>
                          <span className="flex-1">{item.label}</span>
                        </NavLink>
                      </motion.div>
                    ))}
                  </div>

                  <motion.button
                    type="button"
                    onClick={handleLogout}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mt-6 flex w-full items-center gap-4 rounded-2xl border border-orange-100 bg-white px-6 py-4 font-black uppercase text-[11px] tracking-widest text-[#BA5225]"
                  >
                    <CiLogout className="text-xl rotate-180" />
                    <span>Logout</span>
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence> */}

        <div
          id="dashboard-scroll-container"
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto"
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default HomeLayout;


