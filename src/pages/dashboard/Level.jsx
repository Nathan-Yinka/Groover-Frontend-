import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { IoStar, IoTrophy } from "react-icons/io5";
import { fetchActivePacks } from "../../app/service/packs.service";
import BottomNavMobile from "./components/BottomNavMobile";
import Loader from "./components/Load";
import { formatCurrencyWithCode } from "../../utils/currency";
import BackButton from "./components/BackButton";

const tierThemes = [
  {
    card: "from-[#272727] via-[#302b29] to-[#191919]",
    border: "border-[#EC6345]/30",
    icon: "text-[#ffb29f]",
  },
  {
    card: "from-[#3a2b27] via-[#4b302a] to-[#191919]",
    border: "border-[#EC6345]/25",
    icon: "text-[#f0bc84]",
  },
  {
    card: "from-[#272727] via-[#383431] to-[#191919]",
    border: "border-[#e5ded3]/30",
    icon: "text-[#e5e7eb]",
  },
  {
    card: "from-[#4b302a] via-[#6d3a2e] to-[#191919]",
    border: "border-[#EC6345]/35",
    icon: "text-[#ffd1c6]",
  },
];

const tierIcons = [IoStar, IoStar, IoStar, IoTrophy];

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

  if (isLoading) {
    return (
      <>
        <Loader />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F6F0] text-[#333333]">
      <div className="w-full space-y-5 px-3 py-4 pb-24 md:space-y-6 md:px-8 md:py-6 md:pb-8">
        <div className="rounded-[18px] border border-[#e5ded3] bg-white p-4 shadow-[0_20px_45px_-38px_rgba(39,39,39,0.6)] md:p-6">
          <BackButton className="mb-5" />
          <h2 className="text-center text-2xl font-bold tracking-tight md:text-4xl">
            VIP Levels
          </h2>
          <p className="mt-1 text-center text-xs text-[#605E5E] md:text-sm">
            Choose the best tier for stronger submission volume and better rewards.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-2 md:gap-5 xl:grid-cols-4 xl:gap-6">
        {isLoading ? (
          <p className="text-center"></p>
        ) : error ? (
          <p className="text-[#EC6345] text-center">{error}</p>
        ) : packItems.length > 0 ? (
          packItems.map((pack, idx) => (
            <motion.div
              key={idx}
              className={`rounded-2xl border ${tierThemes[idx % tierThemes.length].border} bg-gradient-to-br ${tierThemes[idx % tierThemes.length].card} p-3.5 md:rounded-[30px] md:p-6 flex flex-col items-start min-h-[176px] md:min-h-[230px] shadow-[0_20px_50px_-35px_rgba(0,0,0,0.95)]`}
              whileHover={{ y: -4, scale: 1.012 }}
            >
              <div className="mb-4 flex w-full items-center justify-between md:mb-5">
                <div className="rounded-full border border-white/25 bg-black/30 p-2 md:p-2.5">
                  {pack.icon ? (
                    <img
                      src={pack.icon}
                      alt={`${pack.name} icon`}
                      className="w-6 h-6 object-contain"
                    />
                  ) : (
                    <span className={`text-lg md:text-xl ${tierThemes[idx % tierThemes.length].icon}`}>
                      {(() => {
                        const TierIcon = tierIcons[idx % tierIcons.length];
                        return <TierIcon />;
                      })()}
                    </span>
                  )}
                </div>
                <span className="rounded-full bg-[#EC6345] px-2 py-1 text-[9px] font-bold uppercase text-white md:text-[10px]">
                  {idx === 0 ? "Default" : `VIP ${idx}`}
                </span>
              </div>

              <h3 className="text-base font-semibold text-white md:text-2xl">{pack.name}</h3>
              <p className="mb-3 text-[10px] font-semibold text-[#EC6345] md:mb-4 md:text-sm">
                {formatCurrencyWithCode(pack.usd_value)}
              </p>

              <div className="mt-auto w-full space-y-1.5 text-[10px] md:space-y-2 md:text-sm">
                {pack?.profit_percentage !== undefined && pack?.profit_percentage !== null && (
                  <div className="flex items-center justify-between text-[#605E5E]">
                    <span>Commission Rate</span>
                    <span className="font-semibold text-[#EC6345]">{pack.profit_percentage}%</span>
                  </div>
                )}
                {pack?.daily_missions !== undefined && pack?.daily_missions !== null && (
                  <div className="flex items-center justify-between text-[#605E5E]">
                    <span>Daily Orders</span>
                    <span className="font-semibold text-white">{pack.daily_missions}</span>
                  </div>
                )}
                {pack?.short_description && (
                  <p className="pt-1 text-[10px] text-[#605E5E] md:pt-2 md:text-xs">{pack.short_description}</p>
                )}
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-center"></p>
        )}
        </div>

        <BottomNavMobile className="md:hidden" />
      </div>
    </div>
  );
};

export default Level;


