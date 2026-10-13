import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GoArrowLeft, GoArrowRight } from "react-icons/go";
import { useDispatch, useSelector } from "react-redux";
import { fetchEvents } from "../../app/service/event.service";
import { IoCheckmarkCircle } from "react-icons/io5";
import Loader from "./components/Load";
import BackButton from "./components/BackButton";
import BottomNavMobile from "./components/BottomNavMobile";

const Events = () => {
  const dispatch = useDispatch();
  const [current, setCurrent] = useState(0);
  const { events, isLoading, error } = useSelector((state) => state.event);
  const eventList = Array.isArray(events) ? events : [];

  useEffect(() => {
    if (eventList.length === 0) dispatch(fetchEvents());
  }, [dispatch, eventList.length]);

  useEffect(() => {
    if (current >= eventList.length && eventList.length > 0) {
      setCurrent(0);
    }
  }, [current, eventList.length]);

  const handleNext = () => {
    if (eventList.length > 0) {
      setCurrent((prev) => (prev + 1) % eventList.length);
    }
  };

  const handlePrev = () => {
    if (eventList.length > 0) {
      setCurrent((prev) => (prev - 1 + eventList.length) % eventList.length);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F6F0] text-[#333333]">
      <div className="mx-auto max-w-[1600px] space-y-6 px-4 py-8 pb-32 md:px-8 md:py-10">
        
        {/* HEADER STATION */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-[32px] border border-[#e5ded3] bg-white p-6 md:p-8 shadow-[0_20px_45px_-38px_rgba(39,39,39,0.6)] overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(236,99,69,0.04),transparent_50%)]" />
          
          <div className="relative z-10">
            <BackButton className="mb-6" />
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EC6345]/10 border border-[#EC6345]/20">
                  <IoCheckmarkCircle className="text-2xl text-[#EC6345]" />
                </div>
                <div>
                  <h1 className="text-3xl font-black tracking-tight text-[#333333] uppercase italic italic-heavy leading-none">
                    Events
                  </h1>
                  <p className="mt-2 text-sm font-medium text-[#605E5E]">
                    Explore active events and platform highlights.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {isLoading && eventList.length === 0 && <Loader fullScreen={true}  />}

        {!isLoading && error && (
          <div className="rounded-2xl border border-red-500/30 bg-red-900/10 py-10 text-center">
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        {!isLoading && !error && eventList.length === 0 && (
          <div className="rounded-[18px] border border-[#e5ded3] bg-white py-10 text-center">
            <p className="text-sm text-[#605E5E]">No events available right now.</p>
          </div>
        )}

        {!isLoading && !error && eventList.length > 0 && (
          <div className="v2-card p-4 md:p-8 relative group">
            <div className="absolute left-6 right-6 top-1/2 z-20 flex -translate-y-1/2 justify-between pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handlePrev}
                className="pointer-events-auto h-14 w-14 flex items-center justify-center rounded-2xl bg-white border border-[#e5ded3] text-[#333333] shadow-xl backdrop-blur-xl hover:border-[#EC6345] hover:text-[#EC6345] transition-all"
              >
                <GoArrowLeft className="text-xl" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleNext}
                className="pointer-events-auto h-14 w-14 flex items-center justify-center rounded-2xl bg-white border border-[#e5ded3] text-[#333333] shadow-xl backdrop-blur-xl hover:border-[#EC6345] hover:text-[#EC6345] transition-all"
              >
                <GoArrowRight className="text-xl" />
              </motion.button>
            </div>

            <motion.div
              key={current}
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
              className="relative aspect-video w-full overflow-hidden rounded-[32px] bg-[#fbfaf6] border border-[#e5ded3]"
            >
              <img
                src={eventList[current]?.image}
                alt={`Event ${current + 1}`}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            </motion.div>

            <div className="mt-8 flex justify-center items-center gap-3">
              {eventList.map((_, index) => (
                <motion.div
                  key={index}
                  onClick={() => setCurrent(index)}
                  animate={{ 
                    width: index === current ? 32 : 8,
                    backgroundColor: index === current ? "#EC6345" : "#d9d0c4"
                  }}
                  className="h-2 cursor-pointer rounded-full transition-all duration-300"
                />
              ))}
            </div>
          </div>
        )}

        <BottomNavMobile className="md:hidden" />
      </div>
    </div>
  );
};
export default Events;


