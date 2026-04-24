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

  if (isLoading) return <Load fullScreen={true} size="large" />;

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
    <div className="min-h-screen bg-[#F7F6F0] text-[#333333]">
      <div className="mx-auto max-w-[1600px] space-y-4 px-3 py-4 pb-24 md:space-y-6 md:px-8 md:py-6 md:pb-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[18px] border border-[#e5ded3] bg-white p-3 shadow-[0_20px_45px_-30px_rgba(0,0,0,0.9)] md:p-6"
        >
          {/* Back Button */}
          <BackButton className="mb-3 md:mb-5" />

          {/* Page Title */}
          <div className="mb-1 flex flex-col justify-between gap-2 sm:flex-row sm:items-center md:gap-4">
            <div className="flex items-center space-x-3">
              <div className="rounded-lg border border-[#EC6345]/25 bg-[#EC6345]/10 p-2 md:rounded-xl md:p-3">
                <IoNotifications className="text-lg text-[#EC6345] md:text-2xl" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-[#333333] md:text-3xl">
                  Notifications
                </h1>
                <p className="text-[11px] text-[#605E5E] md:text-sm">
                  {filteredNotifications.length} notification
                  {filteredNotifications.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            <motion.button
              onClick={handleMarkAllRead}
              disabled={
                isLoading || notifications.every((notif) => notif.is_read)
              }
              className="flex items-center space-x-1.5 self-start rounded-lg border border-[#EC6345]/35 bg-[#EC6345] px-2.5 py-1.5 text-xs font-semibold text-white transition hover:bg-[#BA5225] disabled:cursor-not-allowed disabled:border-[#e5ded3] disabled:bg-[#fbfaf6] disabled:text-[#8b8580] sm:self-auto md:px-3 md:py-2 md:text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <IoCheckmarkCircle className="text-sm md:text-base" />
              <span>Mark all read</span>
            </motion.button>
          </div>

          <div className="mt-3 hidden grid-cols-4 gap-2 md:grid">
            <div className="rounded-xl border border-[#e5ded3] bg-[#fbfaf6] px-3 py-2.5">
              <p className="text-xs text-[#7b756f]">Total</p>
              <p className="text-base font-semibold text-[#333333]">
                {notifications.length}
              </p>
            </div>
            <div className="rounded-xl border border-[#EC6345]/25 bg-[#EC6345]/10 px-3 py-2.5">
              <p className="text-xs text-[#605E5E]">Unread</p>
              <p className="text-base font-semibold text-[#EC6345]">
                {unreadCount}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveFilter("All")}
              className={`rounded-xl border px-3 py-2.5 text-left transition ${activeFilter === "All"
                ? "border-[#EC6345]/35 bg-[#EC6345] text-white"
                : "border-[#e5ded3] bg-[#fbfaf6] text-[#5f5b57] hover:border-[#EC6345]/30 hover:text-[#EC6345]"}`}
            >
              <p className="text-xs">Filter</p>
              <p className="text-base font-semibold">All</p>
            </button>
            <div className="grid grid-cols-2 gap-2">
              {["Unread", "Read"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setActiveFilter(type)}
                  className={`rounded-xl border px-2 py-2 text-xs font-semibold transition ${activeFilter === type
                    ? "border-[#EC6345]/35 bg-[#EC6345] text-white"
                    : "border-[#e5ded3] bg-[#fbfaf6] text-[#5f5b57] hover:border-[#EC6345]/30 hover:text-[#EC6345]"}`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Notifications List */}
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, idx) => (
              <div
                key={`skeleton-${idx}`}
                className="animate-pulse rounded-2xl border border-[#e5ded3] bg-[#fbfaf6] p-4 md:p-5"
              >
                <div className="h-3 w-11/12 rounded bg-[#e5ded3]" />
                <div className="mt-2 h-3 w-8/12 rounded bg-[#e5ded3]" />
                <div className="mt-3 h-2 w-4/12 rounded bg-[#e5ded3]" />
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            {paginatedNotifications.map((notif, index) => (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
                className={`overflow-hidden rounded-2xl border bg-white shadow-[0_20px_45px_-38px_rgba(39,39,39,0.55)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#EC6345]/30 hover:shadow-[0_24px_55px_-35px_rgba(236,99,69,0.28)] ${
                  !notif.is_read
                    ? "border-[#EC6345]/30 ring-1 ring-[#EC6345]/20"
                    : "border-[#e5ded3]"
                }`}
              >
                <div className="p-4 md:p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      {/* Message */}
                      <p className="whitespace-pre-line text-sm leading-relaxed text-[#333333] md:text-base">
                        {notif.message}
                      </p>

                      {/* Timestamp */}
                      <p className="mt-2 flex items-center text-[11px] text-[#7b756f] md:text-xs">
                        <span className="mr-2 h-1 w-1 rounded-full bg-[#EC6345]"></span>
                        {formatDistanceToNow(new Date(notif.created_at), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>

                    {/* Mark as Read Button */}
                    {!notif.is_read && (
                      <motion.button
                        onClick={() => handleMarkAsRead(notif.id)}
                        className="ml-4 flex flex-shrink-0 items-center space-x-1 rounded-lg border border-[#EC6345]/30 bg-[#EC6345] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#BA5225]"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <IoCheckmarkCircle className="text-sm" />
                        <span>Read</span>
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Empty State */}
        {!isLoading && filteredNotifications.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-[18px] border border-[#e5ded3] bg-white py-12 text-center"
          >
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full border border-[#EC6345]/25 bg-[#EC6345]/10">
              <IoNotifications className="text-3xl text-[#EC6345]" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-[#333333]">
              No {activeFilter.toLowerCase()} notifications
            </h3>
            <p className="text-sm text-[#605E5E]">You are all caught up.</p>
          </motion.div>
        )}

        {/* Pagination */}
        <AnimatePresence>
          {totalPages > 1 && showPagination && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.3 }}
              className="fixed bottom-16 left-3 right-3 z-50 flex items-center justify-between rounded-2xl border border-[#e5ded3] bg-[#fbfaf6]/95 p-3 shadow-[0_20px_45px_-38px_rgba(39,39,39,0.55)] backdrop-blur md:bottom-4 md:left-[286px] md:right-8 lg:left-[374px]"
            >
              <motion.button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="rounded-lg border border-[#e5ded3] bg-white px-3 py-1.5 text-sm font-medium text-[#4a4642] transition hover:border-[#EC6345]/30 hover:text-[#EC6345] disabled:cursor-not-allowed disabled:opacity-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Previous
              </motion.button>

              <span className="text-sm font-medium text-[#5f5b57]">
                Page {currentPage} of {totalPages}
              </span>

              <motion.button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="rounded-lg border border-[#e5ded3] bg-white px-3 py-1.5 text-sm font-medium text-[#4a4642] transition hover:border-[#EC6345]/30 hover:text-[#EC6345] disabled:cursor-not-allowed disabled:opacity-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Next
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <BottomNavMobile />
    </div>
  );
};

export default Notification;


