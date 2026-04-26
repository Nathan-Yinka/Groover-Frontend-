import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { 
  RiHome5Line, 
  RiHome5Fill, 
  RiHistoryLine, 
  RiHistoryFill,
  RiMusic2Line,
  RiMusic2Fill
} from "react-icons/ri";
import { IoMusicalNotes } from "react-icons/io5";
import PropTypes from "prop-types";

function BottomNavMobile({ className = "" }) {
  const isModalOpen = useSelector((state) => state.ui.isModalOpen);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    const scrollContainer = document.getElementById("dashboard-scroll-container");
    const target = scrollContainer || window;
    const getScrollTop = () =>
      scrollContainer ? scrollContainer.scrollTop : window.scrollY;
    let lastY = getScrollTop();

    const handleScroll = () => {
      const currentY = getScrollTop();
      const delta = currentY - lastY;

      // Professional threshold for dock retraction
      if (currentY > 60 && delta > 12) {
        setIsHidden(true);
      } else if (delta < -12 || currentY < 20) {
        setIsHidden(false);
      }

      lastY = currentY;
    };

    target.addEventListener("scroll", handleScroll, { passive: true });
    return () => target.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    {
      to: "/home",
      label: "Home",
      icon: RiHome5Line,
      activeIcon: RiHome5Fill,
      exact: true
    },
    {
      to: "/home/starting",
      label: "Start",
      icon: RiMusic2Line,
      activeIcon: RiMusic2Fill,
      isCore: true
    },
    {
      to: "/home/records",
      label: "History",
      icon: RiHistoryLine,
      activeIcon: RiHistoryFill
    }
  ];

  return (
    <div
      className={`fixed bottom-4 left-1/2 z-[1000] -translate-x-1/2 w-[88%] max-w-[340px] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] md:hidden ${
        (isHidden || isModalOpen) ? "translate-y-24 opacity-0 scale-90 pointer-events-none" : "translate-y-0 opacity-100 scale-100"
      } ${className}`}
    >
      <div className="relative overflow-hidden rounded-[24px] border border-white/40 bg-white/70 p-1.5 shadow-[0_20px_40px_-15px_rgba(39,39,39,0.3)] backdrop-blur-2xl">
        {/* INNER GLOW EFFECT */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
        
        <div className="relative flex items-center justify-between px-1 py-0.5">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              className="relative flex flex-1 flex-col items-center justify-center py-1.5 transition-all duration-300"
            >
              {({ isActive }) => (
                <>
                  {/* ACTIVE INDICATOR ORBIT */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        layoutId="activeDockIndicator"
                        className={`absolute inset-0 z-0 rounded-xl ${
                          item.isCore ? "bg-[#EC6345]/5" : "bg-black/5"
                        }`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.35, ease: "circOut" }}
                      />
                    )}
                  </AnimatePresence>

                  <div className={`relative z-10 flex flex-col items-center transition-transform duration-300 ${isActive ? '-translate-y-0.5' : ''}`}>
                    {item.isCore ? (
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-500 ${
                        isActive 
                        ? 'bg-[#EC6345] text-white shadow-[0_8px_20px_-5px_rgba(236,99,69,0.5)] rotate-0 scale-110' 
                        : 'bg-[#221d1a] text-white shadow-lg rotate-0'
                      }`}>
                        {isActive ? <IoMusicalNotes className="text-lg" /> : <item.icon className="text-lg" />}
                      </div>
                    ) : (
                      <div className={`flex flex-col items-center gap-0.5 ${isActive ? "text-[#EC6345]" : "text-[#7b756f]"}`}>
                        <div className="relative">
                           {isActive ? <item.activeIcon className="text-xl" /> : <item.icon className="text-xl" />}
                           {isActive && (
                             <motion.div 
                              layoutId="dot"
                              className="absolute -bottom-0.5 left-1/2 h-0.5 w-0.5 -translate-x-1/2 rounded-full bg-[#EC6345]" 
                             />
                           )}
                        </div>
                        <span className={`text-[8.5px] font-black uppercase tracking-[0.1em] transition-all ${isActive ? 'opacity-100 mt-0.5' : 'opacity-40'}`}>
                          {item.label}
                        </span>
                      </div>
                    )}
                  </div>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
}

BottomNavMobile.propTypes = {
  className: PropTypes.string,
};

export default BottomNavMobile;
