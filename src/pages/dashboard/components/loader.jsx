import React from "react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";

const Loader = ({
  visible = true,
  height = 16,
  width = 16,
  color = "#ffffff", // Default to white for buttons
}) => {
  if (!visible) return null;

  return (
    <div className="flex gap-0.5 items-end" style={{ height: `${height}px` }}>
      {[0.4, 1.0, 0.6].map((h, i) => (
        <motion.div
          key={i}
          animate={{ height: ["20%", "100%", "40%", "80%", "20%"] }}
          transition={{ 
            duration: 0.8 + Math.random() * 0.4, 
            repeat: Infinity, 
            delay: i * 0.1, 
            ease: "easeInOut" 
          }}
          className="w-[2.5px] rounded-full"
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  );
};

Loader.propTypes = {
  visible: PropTypes.bool,
  height: PropTypes.number,
  width: PropTypes.number,
  color: PropTypes.string,
};

export default Loader;
