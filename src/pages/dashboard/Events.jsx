import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GoArrowLeft, GoArrowRight } from "react-icons/go";
import { useDispatch, useSelector } from "react-redux";
import { fetchEvents } from "../../app/service/event.service";
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
      <div className="mx-auto max-w-[1600px] space-y-5 px-3 py-4 pb-24 md:space-y-6 md:px-8 md:py-6 md:pb-8">
        <div className="rounded-[18px] border border-[#e5ded3] bg-white p-4 shadow-[0_20px_45px_-38px_rgba(39,39,39,0.6)] md:p-6">
          <BackButton className="mb-5" />
          <h1 className="text-center text-2xl font-bold tracking-tight md:text-4xl">
            Events
          </h1>
          <p className="mt-2 text-center text-xs text-[#605E5E] md:text-sm">
            Explore active campaigns and event highlights.
          </p>
        </div>

        {isLoading && <Loader fullScreen={true} size="large" />}

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
          <div className="relative overflow-hidden rounded-[18px] border border-[#e5ded3] bg-white p-3 shadow-[0_20px_45px_-38px_rgba(39,39,39,0.55)] md:p-5">
            <div className="absolute left-0 right-0 top-1/2 z-10 flex -translate-y-1/2 justify-between px-2 md:px-3">
              <button
                type="button"
                onClick={handlePrev}
                className="rounded-full border border-[#e5ded3] bg-white/90 p-2 text-[#333333] shadow-[0_12px_28px_-20px_rgba(39,39,39,0.8)] backdrop-blur transition hover:border-[#EC6345]/35 hover:text-[#EC6345] md:p-2.5"
              >
                <GoArrowLeft />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="rounded-full border border-[#e5ded3] bg-white/90 p-2 text-[#333333] shadow-[0_12px_28px_-20px_rgba(39,39,39,0.8)] backdrop-blur transition hover:border-[#EC6345]/35 hover:text-[#EC6345] md:p-2.5"
              >
                <GoArrowRight />
              </button>
            </div>

            <motion.div
              key={current}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45 }}
              className="flex h-[300px] w-full items-center justify-center overflow-hidden rounded-xl bg-[#fbfaf6] md:h-[520px]"
            >
              <img
                src={eventList[current]?.image}
                alt={`Event ${current + 1}`}
                className="h-full w-full object-contain"
              />
            </motion.div>

            <div className="mt-4 flex justify-center space-x-2">
              {eventList.map((_, index) => (
                <span
                  key={index}
                  onClick={() => setCurrent(index)}
                  className={`h-2.5 w-2.5 cursor-pointer rounded-full transition ${
                    index === current ? "bg-[#EC6345]" : "bg-[#d9d0c4]"
                  }`}
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


