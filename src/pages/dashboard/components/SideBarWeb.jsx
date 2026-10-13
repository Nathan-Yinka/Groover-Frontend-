import { BiCalendarEvent, BiBookOpen, BiMoneyWithdraw } from "react-icons/bi";
import { RiLuggageDepositLine, RiRestartLine } from "react-icons/ri";
import { GiEgyptianProfile } from "react-icons/gi";
import { NavLink, useNavigate } from "react-router-dom";
import { CiLogout } from "react-icons/ci";
import { MdOutlineDashboard } from "react-icons/md";
import {
  deposit,
  events,
  home,
  login,
  notifications as notificationsRoute,
  profile,
  records,
  starting,
  withdraw,
} from "../../../constants/app.routes";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import authService from "../../../app/service/auth.service";
import { logout } from "../../../app/slice/auth.slice";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoMusicalNotesOutline } from "react-icons/io5";
import logo from "../../../assets/logo.svg";
import MusicVisualizer from "./MusicVisualizer";

const navItemClass = ({ isActive }) =>
  isActive
    ? "text-[#EC6345] font-bold tracking-tight uppercase text-[12px] flex items-center gap-x-4 w-full px-5 py-3.5 rounded-md bg-white border border-[#EC6345]/30 shadow-sm transition-all"
    : "text-[#525252] font-semibold tracking-tight uppercase text-[12px] flex items-center gap-x-4 w-full px-5 py-3.5 rounded-md hover:bg-white hover:text-[#EC6345] transition-all group";

function SideBarWeb() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { notifications } = useSelector((state) => state.notifications);
  const unreadNotifications = notifications.filter(
    (notification) => !notification.is_read,
  ).length;

  const handleLogout = () => {
    authService.logout();
    dispatch(logout());
    navigate(login);
  };

  return (
    <aside className="hidden h-screen w-[280px] flex-col border-r border-[#e5ded3] bg-[#F7F6F0] px-6 py-8 text-[#333333] md:flex font-sans">
      {/* BRAND ALIGNED LOGO */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-10 p-6 rounded-md bg-white border border-[#e5ded3] shadow-sm relative overflow-hidden group cursor-pointer"
        onClick={() => navigate(home)}
      >
        <div className="relative z-10 flex items-center justify-between">
           <img src={logo} alt="Groover" className="h-6 w-auto" />
           <MusicVisualizer />
        </div>
      </motion.div>

      <div className="flex-1 space-y-1 overflow-y-auto pr-2 custom-scrollbar">
        {[
          { to: home, label: "Dashboard", icon: MdOutlineDashboard, end: true },
          { to: starting, label: "Starting", icon: RiRestartLine },
          { to: records, label: "Records", icon: BiBookOpen },
          { to: profile, label: "Profile", icon: GiEgyptianProfile },
          { 
            to: notificationsRoute, 
            label: "Notifications", 
            icon: IoMdNotificationsOutline,
            badge: unreadNotifications 
          },
          { to: withdraw, label: "Withdraw", icon: BiMoneyWithdraw },
          { to: deposit, label: "Deposit", icon: RiLuggageDepositLine },
          { to: events, label: "Events", icon: BiCalendarEvent },
        ].map((item, index) => (
          <motion.div 
            key={item.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <NavLink to={item.to} end={item.end} className={navItemClass}>
              <div className="relative">
                <item.icon className="text-xl" />
                {item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#EC6345] border-2 border-white flex items-center justify-center text-[8px] font-bold text-white">
                    {item.badge}
                  </span>
                )}
              </div>
              <p className="flex-1">{item.label}</p>
            </NavLink>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 pt-8 border-t border-[#e5ded3]">
         <motion.button
            whileHover={{ y: -2 }}
            className="flex w-full items-center gap-x-4 rounded-md border border-[#f2c2b8] bg-white px-6 py-4 font-bold uppercase text-[11px] tracking-widest text-[#BA5225] transition-all hover:bg-[#fff5f2] shadow-sm"
            onClick={handleLogout}
         >
            <CiLogout className="text-xl rotate-180" />
            <p>Logout</p>
         </motion.button>
      </div>
    </aside>
  );
}

export default SideBarWeb;
