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
    <div className="min-h-screen bg-[#060606] text-white">
      <div className="w-full space-y-5 px-3 py-4 pb-24 md:space-y-6 md:px-8 md:py-6 md:pb-8">
        <div className="rounded-2xl border border-white/10 bg-[#0d0f10] p-4 shadow-[0_24px_60px_-35px_rgba(0,0,0,0.95)] md:p-6">
          <BackButton className="mb-5" />
          <h1 className="text-center text-2xl font-bold tracking-tight md:text-4xl">
            Events
          </h1>
          <p className="mt-2 text-center text-xs text-white/65 md:text-sm">
            Explore active campaigns and event highlights.
          </p>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center rounded-2xl border border-white/10 bg-[#0d0f10] py-16">
            <Loader />
          </div>
        )}

        {!isLoading && error && (
          <div className="rounded-2xl border border-red-500/30 bg-red-900/10 py-10 text-center">
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        {!isLoading && !error && eventList.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-[#0d0f10] py-10 text-center">
            <p className="text-sm text-white/70">No events available right now.</p>
          </div>
        )}

        {!isLoading && !error && eventList.length > 0 && (
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0d0f10] p-3 shadow-[0_24px_60px_-35px_rgba(0,0,0,0.95)] md:p-5">
            <div className="absolute left-0 right-0 top-1/2 z-10 flex -translate-y-1/2 justify-between px-2 md:px-3">
              <button
                type="button"
                onClick={handlePrev}
                className="rounded-full border border-white/15 bg-black/55 p-2 text-white transition hover:border-accent/35 hover:text-accent md:p-2.5"
              >
                <GoArrowLeft />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="rounded-full border border-white/15 bg-black/55 p-2 text-white transition hover:border-accent/35 hover:text-accent md:p-2.5"
              >
                <GoArrowRight />
              </button>
            </div>

            <motion.div
              key={current}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45 }}
              className="flex h-[300px] w-full items-center justify-center overflow-hidden rounded-xl bg-[#0a0c0d] md:h-[520px]"
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
                    index === current ? "bg-accent" : "bg-white/30"
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
