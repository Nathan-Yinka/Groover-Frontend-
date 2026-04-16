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
      className={`fixed bottom-0 left-0 z-40 w-full border-t border-white/10 bg-[#0b0b0c]/95 shadow-inner shadow-accent/10 backdrop-blur-sm transition-transform duration-300 md:hidden ${
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
            ? "text-accent font-semibold tracking-wide flex flex-col items-center"
            : "flex flex-col items-center text-gray-300 font-medium tracking-wide"
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
            ? "text-accent font-semibold tracking-wide flex flex-col items-center relative -top-3"
            : "flex flex-col items-center relative -top-3 text-gray-300 font-medium tracking-wide"
        }
      >
        <div className="rounded-full border border-accent bg-[#0b0b0c] p-2.5">
          <div className="w-10 overflow-hidden rounded-full shadow-lg">
            <img src={logo} alt="Logo" className="w-auto h-auto" />
          </div>
          <p className="text-[11px] mt-1">Starting</p>
        </div>
      </NavLink>

      {/* Records Link */}
      <NavLink
        to="/home/records"
        className={({ isActive }) =>
          isActive
            ? "text-accent font-semibold tracking-wide flex flex-col items-center"
            : "flex flex-col items-center text-gray-300 font-medium tracking-wide"
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
