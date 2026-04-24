import { motion } from "framer-motion";

const MusicVisualizer = ({ barColor = "bg-[#EC6345]" }) => (
  <div className="flex gap-0.5 items-end h-3">
    {[0.4, 0.7, 0.3, 0.9, 0.5, 0.8, 0.4].map((h, i) => (
      <motion.div
        key={i}
        animate={{ height: ["20%", "100%", "40%", "80%", "20%"] }}
        transition={{ duration: 1 + Math.random(), repeat: Infinity, delay: i * 0.1, ease: "easeInOut" }}
        className={`w-[2px] ${barColor} rounded-full`}
      />
    ))}
  </div>
);

export default MusicVisualizer;
