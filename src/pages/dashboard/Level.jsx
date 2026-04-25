import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { fetchActivePacks } from "../../app/service/packs.service";
import BottomNavMobile from "./components/BottomNavMobile";
import Loader from "./components/Load";
import { formatCurrencyWithCode } from "../../utils/currency";
import BackButton from "./components/BackButton";

import { IoStar, IoTrophy, IoShieldCheckmark, IoFlash, IoMusicalNotes } from "react-icons/io5";

const tierThemes = [
  {
    card: "from-[#1a1412] via-[#1c1816] to-[#0a0808]",
    border: "border-[#EC6345]/20",
    glow: "shadow-[0_0_40px_-20px_rgba(236,99,69,0.2)]",
    icon: "text-[#EC6345]",
    accent: "bg-[#EC6345]/10",
  },
  {
    card: "from-[#1c1614] via-[#241c1a] to-[#0a0808]",
    border: "border-[#d6a44f]/25",
    glow: "shadow-[0_0_40px_-20px_rgba(214,164,79,0.2)]",
    icon: "text-[#d6a44f]",
    accent: "bg-[#d6a44f]/10",
  },
  {
    card: "from-[#14161a] via-[#1a1e24] to-[#080a0c]",
    border: "border-[#e5ded3]/20",
    glow: "shadow-[0_0_40px_-20px_rgba(229,222,211,0.15)]",
    icon: "text-[#e5ded3]",
    accent: "bg-[#e5ded3]/10",
  },
  {
    card: "from-[#221814] via-[#2a1e16] to-[#0e0a08]",
    border: "border-[#EC6345]/40",
    glow: "shadow-[0_0_50px_-15px_rgba(236,99,69,0.3)]",
    icon: "text-[#EC6345]",
    accent: "bg-[#EC6345]/20",
  },
];

const tierIcons = [IoStar, IoShieldCheckmark, IoFlash, IoTrophy];

const Level = () => {
  const dispatch = useDispatch();

  // Access the packs state
  const { packs, isLoading, error } = useSelector((state) => state.packs);

  const packItems = Array.isArray(packs?.data)
    ? packs.data
    : Array.isArray(packs?.data?.data)
      ? packs.data.data
      : Array.isArray(packs)
        ? packs
        : [];

  // Fetch packs if state is empty
  useEffect(() => {
    const fetchPacks = async () => {
      if (packItems.length === 0) {
        try {
          await dispatch(fetchActivePacks());
        } catch (error) {
          console.error("Error fetching packs:", error);
        }
      }
    };
    fetchPacks();
  }, [dispatch, packItems.length]);

  if (isLoading) return <Loader fullScreen={true}  />;

  return (
    <div className="min-h-screen bg-[#F7F6F0] text-[#333333] selection:bg-[#EC6345]/30">
      <div className="mx-auto max-w-[1600px] space-y-6 px-4 py-8 pb-32 md:px-8 md:py-10">
        
        {/* HEADER STATION */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-[32px] border border-[#e5ded3] bg-white p-6 md:p-10 shadow-[0_20px_45px_-38px_rgba(39,39,39,0.6)] overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(236,99,69,0.04),transparent_50%)]" />
          <BackButton className="mb-6" />
          
          <div className="relative z-10 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EC6345]/10 border border-[#EC6345]/20">
              <IoMusicalNotes className="text-2xl text-[#EC6345]" />
            </div>
            <h2 className="text-3xl font-black tracking-tight md:text-5xl uppercase italic italic-heavy text-[#333333]">
              VIP <span className="text-[#EC6345]">Tiers</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm font-medium text-[#605E5E] md:text-base leading-relaxed">
              Ascend through the curation ranks to unlock higher submission volumes, premium mission frequencies, and elite reward multipliers.
            </p>
          </div>
        </motion.div>

        {/* TIER GRID */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {error ? (
            <div className="col-span-full py-20 text-center">
              <p className="text-[#EC6345] font-bold text-lg">{error}</p>
            </div>
          ) : packItems.length > 0 ? (
            packItems.map((pack, idx) => {
              const theme = tierThemes[idx % tierThemes.length];
              const TierIcon = tierIcons[idx % tierIcons.length];

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -8 }}
                  className={`group relative flex flex-col min-h-[300px] rounded-[40px] border ${theme.border} bg-gradient-to-br ${theme.card} p-8 ${theme.glow} transition-all duration-500 overflow-hidden`}
                >
                  {/* AMBIENT LIGHTS */}
                  <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#EC6345]/10 blur-[60px] group-hover:bg-[#EC6345]/20 transition-all duration-700" />
                  
                  {/* CARD HEADER */}
                  <div className="relative z-10 mb-8 flex items-center justify-between">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-2xl border ${theme.border} ${theme.accent} backdrop-blur-sm transition-transform duration-500 group-hover:scale-110`}>
                      {pack.icon ? (
                        <img 
                          src={pack.icon} 
                          alt={pack.name} 
                          className="h-9 w-9 object-contain grayscale group-hover:grayscale-0 transition-all duration-500" 
                        />
                      ) : (
                        <TierIcon className={`text-2xl ${theme.icon}`} />
                      )}
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Rank</span>
                      <span className={`text-sm font-bold ${theme.icon}`}>
                        {idx === 0 ? "ENTRY" : `VIP ${idx}`}
                      </span>
                    </div>
                  </div>

                  {/* IDENTIFIER */}
                  <div className="relative z-10 space-y-1">
                    <h3 className="text-2xl font-black italic tracking-tight text-white uppercase italic-heavy">
                      {pack.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <div className="h-1 w-1 rounded-full bg-[#EC6345]" />
                      <p className="text-sm font-bold tracking-wider text-[#EC6345]">
                        {formatCurrencyWithCode(pack.usd_value)}
                      </p>
                    </div>
                  </div>

                  {/* SPECS STATION */}
                  <div className="relative z-10 mt-auto pt-8 space-y-4">
                    <div className="h-[1px] w-full bg-white/5" />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white/40 uppercase tracking-widest">Rate</span>
                      <span className="text-sm font-black text-white">{pack.profit_percentage}%</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white/40 uppercase tracking-widest">Loadout</span>
                      <span className="text-sm font-black text-white">{pack.daily_missions} Tasks</span>
                    </div>

                    {pack.short_description && (
                      <p className="text-[11px] font-medium leading-relaxed text-white/30 pt-2 line-clamp-2">
                        {pack.short_description}
                      </p>
                    )}
                  </div>

                  {/* GLASS SHINE EFFECT */}
                  <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/[0.03] to-transparent pointer-events-none" />
                </motion.div>
              );
            })
          ) : null}
        </div>

        <BottomNavMobile className="md:hidden" />
      </div>
    </div>
  );
};

export default Level;
