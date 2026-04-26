import { motion } from "framer-motion";
import { RiShieldCheckLine, RiVerifiedBadgeLine, RiExpandDiagonalLine } from "react-icons/ri";
import certImage from "../../assets/cert.jpg";
import BackButton from "./components/BackButton";

const Certificate = () => {
  return (
    <div className="min-h-screen bg-[#F7F6F0] text-[#333333]">
      <div className="mx-auto max-w-[1600px] border-x border-[#e5ded3] min-h-screen bg-white md:bg-[#F7F6F0]/50 shadow-2xl">
        
        {/* PREMIUM VAULT HEADER */}
        <section className="relative overflow-hidden bg-[#120d0c] px-6 py-12 md:rounded-b-[40px] md:py-20">
          <div className="absolute inset-0 z-0 opacity-20">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(236,99,69,0.15)_0%,transparent_50%)]" />
            <div className="absolute inset-0 bg-[grid-white/[0.03]_bg-[size:40px_40px]" />
          </div>
          <div className="relative z-10 flex flex-col items-center text-center">
            <BackButton className="mb-8" dark />
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-4 flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-md">
              <RiShieldCheckLine className="text-[#EC6345]" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">Verified Credentials</span>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-4 text-4xl font-bold tracking-tighter text-white md:text-6xl">
              Certificate
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="max-w-[500px] text-xs font-medium leading-relaxed text-white/40 md:text-sm">
              Company registration and incorporation certificate.
            </motion.p>
          </div>
        </section>

        {/* VAULT DISPLAY ENGINE */}
        <main className="px-4 py-10 pb-32 md:px-8 lg:px-20 flex justify-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            className="relative group w-full max-w-[900px]"
          >
            <div className="relative overflow-hidden rounded-[32px] border border-[#e5ded3] bg-white p-2 shadow-2xl md:p-4">
              <div className="relative flex items-center justify-center overflow-hidden rounded-[24px] border border-[#f0f0f0] bg-[#fbfaf6]">
                <img
                  src={certImage}
                  alt="Certificate of Incorporation"
                  className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-[1.02]"
                />
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Certificate;
