import { BiBookOpen } from "react-icons/bi";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { BiHome } from "react-icons/bi";
import PropTypes from "prop-types";
import logo from "../../../assets/logo.svg";

function BottomNavMobile({ className = "" }) {
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

      // Hide when scrolling down, show when scrolling up.
      if (currentY > 24 && delta > 8) {
        setIsHidden(true);
      } else if (delta < -8) {
        setIsHidden(false);
      }

      lastY = currentY;
    };

    target.addEventListener("scroll", handleScroll, { passive: true });
    return () => target.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-0 left-0 z-40 w-full border-t border-[#e5ded3] bg-[#F7F6F0]/95 shadow-[0_-18px_40px_-34px_rgba(39,39,39,0.7)] backdrop-blur-sm transition-transform duration-300 md:hidden ${
        isHidden ? "translate-y-full" : "translate-y-0"
      } ${className}`}
    >
      <div className="flex h-[58px] items-center justify-around">
      {/* Home Link */}
      <NavLink
        to="/home"
        end
        className={({ isActive }) =>
          isActive
            ? "text-[#EC6345] font-semibold tracking-wide flex flex-col items-center"
            : "flex flex-col items-center text-[#6c6661] font-medium tracking-wide"
        }
      >
        <BiHome className="text-xl" />
        <p className="text-[11px]">Home</p>
      </NavLink>

      {/* Starting Link - Elevated Icon */}
      <NavLink
        to="/home/starting"
        className={({ isActive }) =>
          isActive
            ? "text-[#EC6345] font-semibold tracking-wide flex flex-col items-center relative -top-3"
            : "flex flex-col items-center relative -top-3 text-[#6c6661] font-medium tracking-wide"
        }
      >
        <div className="rounded-full border border-[#EC6345]/35 bg-white p-2.5 shadow-[0_12px_28px_-22px_rgba(39,39,39,0.7)]">
          <div className="w-10 overflow-hidden rounded-full">
            <img src={logo} alt="Groover" className="h-auto w-full" />
          </div>
          <p className="text-[11px] mt-1">Starting</p>
        </div>
      </NavLink>

      {/* Records Link */}
      <NavLink
        to="/home/records"
        className={({ isActive }) =>
          isActive
            ? "text-[#EC6345] font-semibold tracking-wide flex flex-col items-center"
            : "flex flex-col items-center text-[#6c6661] font-medium tracking-wide"
        }
      >
        <BiBookOpen className="text-xl" />
        <p className="text-[11px]">Records</p>
      </NavLink>
      </div>
    </div>
  );
}

BottomNavMobile.propTypes = {
  className: PropTypes.string,
};

export default BottomNavMobile;
