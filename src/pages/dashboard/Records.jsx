import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeIn } from "../../motion";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchGameRecords,
  submitCurrentGame,
} from "../../app/service/products.service";
import { toast } from "sonner";
import ErrorHandler from "../../app/ErrorHandler";
import Loader from "./components/Load";
import { formatCurrencyWithCode } from "../../utils/currency";
import { IoDocumentText, IoCheckmarkCircle } from "react-icons/io5";
import BottomNavMobile from "./components/BottomNavMobile";
import BackButton from "./components/BackButton";

const statusColors = {
  Completed: "border border-[#2ccd79]/35 bg-[#132319] text-[#7ef1b2]",
  Pending: "border border-[#d6a44f]/35 bg-[#241d12] text-[#f3c879]",
  Freeze: "border border-[#8891a3]/35 bg-[#1b1f29] text-[#c8cfde]",
};

// Function to derive status
const getStatus = (record) => {
  if (record.pending) return "Pending";
  if (!record.pending && record.rating_score === 0) return "Freeze";
  return "Completed";
};

const Records = () => {
  const dispatch = useDispatch();
  const records = useSelector((state) => state.products.gameRecords); // Access game records from the state
  const isLoading = useSelector((state) => state.products.isLoading);

  const [activeTab, setActiveTab] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [showPagination, setShowPagination] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const recordsPerPage = 20;

  // Filter Records Based on Active Tab
  const filteredRecords =
    activeTab === "All"
      ? records
      : records.filter((record) => getStatus(record) === activeTab);

  // Paginate Records
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);
  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage,
  );

  // Fetch Game Records
  useEffect(() => {
    dispatch(fetchGameRecords());
  }, [dispatch]);

  // Handle Submit Button for Pending Products
  const handleSubmit = async () => {
    try {
      const response = await dispatch(submitCurrentGame(4, ""));
      if (response.success) {
        toast.success("Submission successful!");
        dispatch(fetchGameRecords()); // Refresh the game records
      } else {
        ErrorHandler(response.message);
      }
    } catch (error) {
      ErrorHandler(error);
    }
  };

  // Handle Page Change
  const handlePageChange = (direction) => {
    if (direction === "next" && currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    } else if (direction === "prev" && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
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

  return (
    <div className="min-h-screen bg-[#060606] text-white">
      <div className="w-full space-y-5 px-3 py-4 pb-24 md:space-y-6 md:px-8 md:py-6 md:pb-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-white/10 bg-[#0d0e10] p-4 shadow-[0_20px_45px_-30px_rgba(0,0,0,0.9)] md:p-6"
        >
          {/* Back Button */}
          <BackButton className="mb-4 md:mb-5" />

          {/* Page Title */}
          <div className="mb-4 flex items-center space-x-3 md:mb-0">
            <div className="rounded-xl border border-accent/25 bg-accent/10 p-2.5 md:p-3">
              <IoDocumentText className="text-xl text-accent md:text-2xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
                Game Records
              </h1>
              <p className="text-xs text-white/65 md:text-sm">
                {filteredRecords.length} record
                {filteredRecords.length !== 1 ? "s" : ""} found
              </p>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={fadeIn("right", null).initial}
          animate={fadeIn("right", 1 * 2).animate}
          className="rounded-2xl border border-white/10 bg-[#0d0e10] p-2 md:p-3"
        >
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            {["All", "Completed", "Pending", "Freeze"].map((tab) => (
              <motion.button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setCurrentPage(1); // Reset to page 1 when switching tabs
                }}
                className={`rounded-xl px-4 py-2 text-xs font-semibold tracking-wide transition-all duration-200 md:text-sm ${
                  activeTab === tab
                    ? "border border-accent/35 bg-accent text-black shadow-[0_10px_30px_-14px_rgba(44,205,121,0.85)]"
                    : "border border-white/10 bg-[#131518] text-white/75 hover:border-accent/35 hover:text-accent"
                }`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {tab}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Records List */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader />
          </div>
        ) : paginatedRecords.length > 0 ? (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3 md:space-y-4"
          >
            {paginatedRecords.map((record, index) => {
              const status = getStatus(record); // Derive status
              return (
                <motion.div
                  key={record.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.06 }}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#0f1112] via-[#121417] to-[#0c0d0f] shadow-[0_20px_50px_-30px_rgba(0,0,0,0.95)] transition-all duration-300 hover:border-accent/30 hover:shadow-[0_25px_55px_-35px_rgba(44,205,121,0.6)]"
                >
                  <div className="p-3 md:p-5">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:space-x-5 md:gap-0">
                      {/* Product Images */}
                      <div className="flex shrink-0 flex-wrap gap-2.5 md:gap-3">
                        {record.products.map((product) => (
                          <div
                            key={product.id}
                            className="h-24 w-[74px] md:h-28 md:w-24"
                          >
                            <img
                              src={product.image}
                              alt={product.name}
                              className="h-[70px] w-[74px] rounded-lg border border-white/10 object-cover md:h-24 md:w-24"
                            />
                            <p className="mt-1 line-clamp-1 w-full text-center text-[10px] text-white/70 md:text-xs">
                              {product.name}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Product Info */}
                      <div className="flex-grow min-w-0">
                        <div className="mb-3 flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0 pr-4">
                            <p className="mb-1 text-[11px] text-white/60 md:text-xs">
                              {new Date(record.updated_at).toLocaleString()}
                            </p>
                            <p className="break-words text-sm font-semibold text-white md:text-base">
                              {record.products[0]?.name}
                            </p>
                          </div>

                          {/* Status Badge and Submit Button */}
                          <div className="flex items-center space-x-2 flex-shrink-0">
                            <div
                              className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusColors[status]}`}
                            >
                              {status}
                            </div>
                            {/* Submit Button for Pending Status - Keeping it small */}
                            {status === "Pending" && (
                              <motion.button
                                onClick={() => handleSubmit(record.id)}
                                className="flex items-center space-x-1 rounded-full border border-accent/30 bg-accent px-2.5 py-1 text-[11px] font-semibold text-black transition hover:brightness-110"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <IoCheckmarkCircle className="text-xs" />
                                <span>Submit</span>
                              </motion.button>
                            )}
                          </div>
                        </div>

                        {/* Amounts */}
                        <div className="flex items-end justify-between border-t border-white/10 pt-3">
                          <div>
                            <p className="text-[11px] text-white/60 md:text-xs">
                              Total Amount
                            </p>
                            <p className="text-sm font-semibold text-white md:text-base">
                              {formatCurrencyWithCode(record.amount)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-[11px] text-white/60 md:text-xs">
                              Commission
                            </p>
                            <p className="text-sm font-semibold text-accent md:text-base">
                              USD {record.commission}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl border border-white/10 bg-[#0d0e10] py-12 text-center"
          >
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full border border-accent/25 bg-accent/10">
              <IoDocumentText className="text-3xl text-accent" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              No {activeTab} records
            </h3>
            <p className="text-sm text-white/65">No records found for this filter</p>
          </motion.div>
        )}

        {/* Pagination */}
        <AnimatePresence>
          {filteredRecords.length > recordsPerPage && showPagination && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.3 }}
              className="fixed bottom-16 left-3 right-3 z-50 flex items-center justify-between rounded-2xl border border-white/10 bg-[#0f1113]/95 p-3 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.95)] backdrop-blur md:bottom-4 md:left-[286px] md:right-8 lg:left-[374px]"
            >
              <motion.button
                onClick={() => handlePageChange("prev")}
                disabled={currentPage === 1}
                className="rounded-lg border border-white/10 bg-[#171a1d] px-3 py-1.5 text-sm font-medium text-white/85 transition hover:border-accent/30 hover:text-accent disabled:cursor-not-allowed disabled:opacity-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Previous
              </motion.button>

              <span className="text-sm font-medium text-white/80">
                Page {currentPage} of {totalPages}
              </span>

              <motion.button
                onClick={() => handlePageChange("next")}
                disabled={currentPage === totalPages}
                className="rounded-lg border border-white/10 bg-[#171a1d] px-3 py-1.5 text-sm font-medium text-white/85 transition hover:border-accent/30 hover:text-accent disabled:cursor-not-allowed disabled:opacity-50"
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

export default Records;
