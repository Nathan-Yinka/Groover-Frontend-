import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../../app/service/notifications.service";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { IoNotifications, IoCheckmarkCircle } from "react-icons/io5";
import BottomNavMobile from "./components/BottomNavMobile";
import BackButton from "./components/BackButton";
import Load from "./components/Load";

const Notification = () => {
  const dispatch = useDispatch();
  const { notifications, isLoading } = useSelector(
    (state) => state.notifications,
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState("All");
  const [showPagination, setShowPagination] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);


  const itemsPerPage = 20;
  const unreadCount = notifications.filter((item) => !item.is_read).length;

  // Pagination logic
  const filteredNotifications =
    activeFilter === "Unread"
      ? notifications.filter((item) => !item.is_read)
      : activeFilter === "Read"
        ? notifications.filter((item) => item.is_read)
        : notifications;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedNotifications = filteredNotifications.slice(
    startIndex,
    startIndex + itemsPerPage,
  );
  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);

  // Fetch notifications on mount and set up polling
  useEffect(() => {
    const fetchNotificationsInterval = () => {
      dispatch(fetchNotifications());
    };

    fetchNotificationsInterval();

    const interval = setInterval(fetchNotificationsInterval, 120000);

    return () => clearInterval(interval);
  }, [dispatch]);

  if (isLoading && notifications.length === 0) return <Load fullScreen={true}  />;

  // Mark all notifications as read
  const handleMarkAllRead = () => {
    dispatch(markAllNotificationsAsRead());
  };

  // Mark a single notification as read
  const handleMarkAsRead = (id) => {
    dispatch(markNotificationAsRead(id));
  };

  // Navigate to the previous page
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  // Navigate to the next page
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  // Handle scroll to show/hide pagination
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;

          if (currentScrollY > lastScrollY && currentScrollY > 100) {
            // Scrolling down and not at top - hide pagination
            setShowPagination(false);
          } else if (currentScrollY < lastScrollY) {
            // Scrolling up - show pagination
            setShowPagination(true);
          }

          setLastScrollY(currentScrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter]);

  return (
    <div className="min-h-screen bg-[#F7F6F0] text-[#333333] selection:bg-[#EC6345]/30">
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
          </div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EC6345]/10 border border-[#EC6345]/20">
                <IoNotifications className="text-2xl text-[#EC6345]" />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight text-[#333333] uppercase italic italic-heavy leading-none">
                  Notifications
                </h1>
                <p className="mt-2 text-sm font-medium text-[#605E5E]">
                  {filteredNotifications.length} notification{filteredNotifications.length !== 1 ? "s" : ""} securely stored.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden border-l border-[#e5ded3] pl-8 md:block">
                <p className="text-[10px] font-black uppercase tracking-[0.1em] text-[#605E5E]/60">Unread</p>
                <p className="text-lg font-black text-[#EC6345]">{unreadCount}</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleMarkAllRead}
                disabled={isLoading || notifications.every((notif) => notif.is_read)}
                className="flex items-center gap-2 rounded-xl bg-[#333333] px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-white disabled:opacity-20 transition-all hover:bg-black"
              >
                <IoCheckmarkCircle className="text-sm" />
                <span>Mark all read</span>
              </motion.button>
            </div>
          </div>

          <div className="relative z-10 mt-8 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {["All", "Unread", "Read"].map((type) => (
              <button
                key={type}
                onClick={() => setActiveFilter(type)}
                className={`whitespace-nowrap px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                  activeFilter === type
                    ? "bg-[#EC6345] text-white shadow-lg shadow-[#EC6345]/20"
                    : "bg-[#fbfaf6] text-[#605E5E] border border-[#e5ded3] hover:border-[#EC6345]/30 hover:text-[#EC6345]"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Notifications List */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, idx) => (
              <div
                key={`skeleton-${idx}`}
                className="animate-pulse rounded-[32px] border border-[#e5ded3] bg-white p-6 md:p-8"
              >
                <div className="h-4 w-1/4 rounded-full bg-[#e5ded3] mb-4" />
                <div className="h-4 w-full rounded-full bg-[#e5ded3] mb-2" />
                <div className="h-4 w-3/4 rounded-full bg-[#e5ded3]" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {paginatedNotifications.map((notif, index) => (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className={`group relative overflow-hidden rounded-[32px] border transition-all duration-300 p-6 shadow-sm ${
                  !notif.is_read
                    ? "bg-white border-[#EC6345]/30 shadow-[#EC6345]/10 shadow-xl"
                    : "bg-white/60 border-[#e5ded3] backdrop-blur-sm grayscale opacity-70 hover:grayscale-0 hover:opacity-100"
                } hover:shadow-lg`}
              >
                {!notif.is_read && (
                  <div className="absolute right-0 top-0 h-24 w-24 translate-x-12 -translate-y-12 rounded-full bg-[#EC6345]/5 blur-2xl" />
                )}

                <div className="relative z-10 flex items-start justify-between gap-6">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className={`h-2 w-2 rounded-full ${!notif.is_read ? "bg-[#EC6345] animate-pulse" : "bg-slate-300"}`} />
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#605E5E]/50">
                        {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true })}
                      </p>
                    </div>
                    
                    <p className="text-sm font-bold text-[#333333] md:text-base leading-relaxed selection:bg-[#EC6345]/20">
                      {notif.message}
                    </p>
                  </div>

                  {!notif.is_read && (
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleMarkAsRead(notif.id)}
                      className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EC6345] text-white shadow-lg shadow-[#EC6345]/30 transition-all hover:bg-[#BA5225]"
                    >
                      <IoCheckmarkCircle className="text-xl" />
                    </motion.button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* EMPTY SIGNAL */}
        {!isLoading && filteredNotifications.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-[40px] border border-dashed border-[#e5ded3] bg-white/50 py-32 text-center"
          >
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#EC6345]/5 border border-[#EC6345]/10">
              <IoNotifications className="text-4xl text-[#EC6345]/20" />
            </div>
            <h3 className="text-2xl font-black text-[#333333] uppercase italic">No notifications</h3>
            <p className="mt-2 text-sm font-medium text-[#605E5E]">You are all caught up.</p>
          </motion.div>
        )}

        {/* PAGINATION STATION */}
        <AnimatePresence>
          {totalPages > 1 && showPagination && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-24 left-4 right-4 z-50 flex items-center justify-between rounded-3xl border border-[#e5ded3] bg-white/80 p-4 shadow-2xl backdrop-blur-2xl md:bottom-10 md:left-auto md:right-10 md:w-[400px]"
            >
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="rounded-xl border border-[#e5ded3] bg-white px-5 py-2 text-xs font-black uppercase tracking-widest text-[#333333] disabled:opacity-20"
              >
                Previous
              </button>
              <span className="text-xs font-black uppercase tracking-widest text-[#333333]/40">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="rounded-xl border border-[#e5ded3] bg-white px-5 py-2 text-xs font-black uppercase tracking-widest text-[#333333] disabled:opacity-20"
              >
                Next
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <BottomNavMobile />
    </div>
  );
};

export default Notification;
