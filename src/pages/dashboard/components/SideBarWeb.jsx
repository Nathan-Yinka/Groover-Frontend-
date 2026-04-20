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
    ? "text-[#EC6345] font-semibold tracking-wide flex items-center gap-x-3 w-full px-4 py-3 rounded-lg bg-white border border-[#EC6345]/25 shadow-[0_14px_30px_-24px_rgba(39,39,39,0.65)]"
    : "text-[#5f5b57] font-medium tracking-wide flex items-center gap-x-3 w-full px-4 py-3 rounded-lg hover:bg-white hover:text-[#EC6345] transition";

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
    <aside className="hidden h-screen w-[284px] flex-col border-r border-[#e5ded3] bg-[#F7F6F0] px-4 py-5 text-[#333333] md:flex">
      <motion.div
        initial={zoomIn(1, "min").initial}
        whileInView={zoomIn(1, "min").animate}
        className="mb-6 rounded-xl border border-[#e5ded3] bg-white px-4 py-4 shadow-[0_20px_45px_-38px_rgba(39,39,39,0.6)]"
      >
        <button type="button" onClick={() => navigate(home)} className="block">
          <img src={logo} alt="Groover" className="h-auto w-[148px]" />
        </button>
        <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#8b8580]">
          Curator dashboard
        </p>
      </motion.div>

      <div className="rounded-xl border border-[#e5ded3] bg-[#fbfaf6] p-2 text-[15px] shadow-[0_20px_45px_-40px_rgba(39,39,39,0.55)]">
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
                <span className="absolute -right-2 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-[#EC6345] px-1 text-[10px] font-semibold text-white">
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
        className="mt-auto flex items-center gap-x-3 rounded-lg border border-[#f2c2b8] bg-white px-4 py-3 font-semibold text-[#BA5225] transition hover:border-[#EC6345]/45 hover:bg-[#fff5f2]"
        onClick={handleLogout}
      >
        <CiLogout className="text-xl" />
        <p>Logout</p>
      </motion.button>
    </aside>
  );
}

export default SideBarWeb;
