import React from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import logo from "../../../assets/logo.svg";

const Loader = ({ fullScreen = false, size = "default" }) => {
  const sizeClasses = {
    small: { height: "h-8", width: "w-[2px]", gap: "gap-0.5", bars: 10 },
    default: { height: "h-20 md:h-28", width: "w-1.5 md:w-2.5", gap: "gap-1 md:gap-1.5", bars: 15 },
    large: { height: "h-32 md:h-48", width: "w-2 md:w-4", gap: "gap-1.5 md:gap-2.5", bars: 20 },
  };

  const containerClasses = fullScreen
    ? "fixed inset-0 flex flex-col justify-center items-center bg-[#F7F6F0] z-[999999] w-full h-[100dvh] overflow-hidden"
    : "flex flex-col justify-center items-center min-h-[400px] w-full";

  const currentSize = sizeClasses[size] || sizeClasses.default;

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center gap-12">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <img src={logo} alt="Groover" className={`${size === "large" ? "h-12 md:h-16" : "h-8 md:h-10"} w-auto mb-4 opacity-80`} />
        </motion.div>

        <div className={`flex items-end ${currentSize.gap} ${currentSize.height} relative`}>
        {[...Array(currentSize.bars)].map((_, i) => {
          // Calculate distance from center for Gaussian distribution
          const center = (currentSize.bars - 1) / 2;
          const dist = Math.abs(i - center);
          // Base height multiplier based on proximity to center (bell curve)
          const multiplier = Math.max(0.3, 1 - dist / (center * 1.5));
          
          return (
            <motion.div
              key={i}
              className={`${currentSize.width} rounded-full`}
              style={{
                background: "linear-gradient(to top, #BA5225, #EC6345, #FF8A65)",
                boxShadow: "0 0 15px rgba(236,99,69,0.2)",
              }}
              animate={{
                height: [
                  `${multiplier * 20}%`,
                  `${multiplier * 100}%`,
                  `${multiplier * 40}%`,
                  `${multiplier * 85}%`,
                  `${multiplier * 20}%`,
                ],
                opacity: [0.6, 1, 0.8, 1, 0.6],
              }}
              transition={{
                duration: 1.2 + (dist * 0.1), // Center moves faster
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.04,
              }}
            />
          );
        })}
      </div>
      </div>
    </div>
  );
};

Loader.propTypes = {
  fullScreen: PropTypes.bool,
  size: PropTypes.oneOf(["small", "default", "large"]),
};

export default Loader;
