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
import { slideIn, zoomIn } from "../../../motion";
import { useDispatch, useSelector } from "react-redux";
import authService from "../../../app/service/auth.service";
import { logout } from "../../../app/slice/auth.slice";
import { IoMdNotificationsOutline } from "react-icons/io";
import logo from "../../../assets/logo.svg";

const navItemClass = ({ isActive }) =>
  isActive
    ? "text-accent font-semibold tracking-wide flex items-center gap-x-3 w-full px-4 py-3 rounded-xl bg-gradient-to-r from-accent/20 via-accent/10 to-transparent border border-accent/35 shadow-[0_0_24px_-16px_rgba(30,215,96,0.9)]"
    : "text-white/80 font-medium tracking-wide flex items-center gap-x-3 w-full px-4 py-3 rounded-xl hover:bg-accent/10 hover:text-accent transition";

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
    <div className="w-[270px] bg-[#0a0a0a] px-4 py-6 hidden md:flex flex-col h-screen border-r border-white/10">
      <motion.div
        initial={zoomIn(1, "min").initial}
        whileInView={zoomIn(1, "min").animate}
        className="mb-8"
      >
        <button type="button" onClick={() => navigate(home)}>
          <img src={logo} alt="Logo" className="w-auto h-auto" />
        </button>
      </motion.div>

      <div className="flex flex-col gap-2 text-[15px]">
        <motion.div initial={slideIn("left", 0).initial} whileInView={slideIn("left", 2).animate}>
          <NavLink to={home} end className={navItemClass}>
            <MdOutlineDashboard className="text-xl" />
            <p>Home</p>
          </NavLink>
        </motion.div>

        <motion.div initial={slideIn("left", 0).initial} whileInView={slideIn("left", 2).animate}>
          <NavLink to={starting} className={navItemClass}>
            <RiRestartLine className="text-xl" />
            <p>Starting</p>
          </NavLink>
        </motion.div>

        <motion.div initial={slideIn("left", 0).initial} whileInView={slideIn("left", 2).animate}>
          <NavLink to={records} className={navItemClass}>
            <BiBookOpen className="text-xl" />
            <p>Records</p>
          </NavLink>
        </motion.div>

        <motion.div initial={slideIn("left", 0).initial} whileInView={slideIn("left", 2).animate}>
          <NavLink to={profile} className={navItemClass}>
            <GiEgyptianProfile className="text-xl" />
            <p>Profile</p>
          </NavLink>
        </motion.div>

        <motion.div initial={slideIn("left", 0).initial} whileInView={slideIn("left", 2).animate}>
          <NavLink to={notificationsRoute} className={navItemClass}>
            <div className="relative flex items-center">
              <IoMdNotificationsOutline className="text-xl" />
              {unreadNotifications > 0 && (
                <span className="absolute -right-2 -top-1 h-4 min-w-4 rounded-full bg-accent px-1 text-[10px] font-semibold text-black grid place-items-center">
                  {unreadNotifications}
                </span>
              )}
            </div>
            <p>Notifications</p>
          </NavLink>
        </motion.div>

        <motion.div initial={slideIn("left", 0).initial} whileInView={slideIn("left", 2).animate}>
          <NavLink to={withdraw} className={navItemClass}>
            <BiMoneyWithdraw className="text-xl" />
            <p>Withdraw</p>
          </NavLink>
        </motion.div>

        <motion.div initial={slideIn("left", 0).initial} whileInView={slideIn("left", 2).animate}>
          <NavLink to={deposit} className={navItemClass}>
            <RiLuggageDepositLine className="text-xl" />
            <p>Deposit</p>
          </NavLink>
        </motion.div>

        <motion.div initial={slideIn("left", 0).initial} whileInView={slideIn("left", 2).animate}>
          <NavLink to={events} className={navItemClass}>
            <BiCalendarEvent className="text-xl" />
            <p>Events</p>
          </NavLink>
        </motion.div>
      </div>

      <motion.button
        initial={slideIn("up", null).initial}
        whileInView={slideIn("up", 2).animate}
        className="mt-auto flex items-center gap-x-3 py-2.5 px-4 text-red-300 hover:bg-red-400/10 rounded-xl border border-red-400/20"
        onClick={handleLogout}
      >
        <CiLogout className="text-xl" />
        <p>Logout</p>
      </motion.button>
    </div>
  );
}

export default SideBarWeb;
