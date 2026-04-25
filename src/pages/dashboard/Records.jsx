import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeIn } from "../../motion";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchGameRecords,
  submitCurrentGame,
} from "../../app/service/products.service";
import { showAlert } from "../../app/slice/ui.slice";
import ErrorHandler from "../../app/ErrorHandler";
import Loader from "./components/Load";
import { formatCurrencyWithCode } from "../../utils/currency";
import { 
  IoDocumentText, 
  IoCheckmarkCircle, 
  IoReloadOutline 
} from "react-icons/io5";
import BottomNavMobile from "./components/BottomNavMobile";
import BackButton from "./components/BackButton";

const statusColors = {
  Completed: "border-[#EC6345]/30 bg-[#EC6345]/10 text-[#EC6345] shadow-[0_0_15px_-5px_rgba(236,99,69,0.3)]",
  Pending: "border-[#d6a44f]/30 bg-[#d6a44f]/10 text-[#d6a44f] shadow-[0_0_15px_-5px_rgba(214,164,79,0.3)]",
  Freeze: "border-[#7b756f]/30 bg-[#7b756f]/10 text-[#7b756f]",
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


  const [submittingId, setSubmittingId] = useState(null);
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
  const handleReCommit = async (record) => {
    setSubmittingId(record.id);
    try {
      const result = await dispatch(submitCurrentGame(record.id));
      if (result.success) {
        dispatch(showAlert({
          type: 'success',
          title: 'Operation Confirmed',
          message: "Curation re-synchronized successfully."
        }));
        dispatch(fetchGameRecords()); // Refresh records after success
      } else {
        ErrorHandler(result.message);
      }
    } catch (error) {
      ErrorHandler(error);
    } finally {
      setSubmittingId(null);
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

  if (isLoading && records.length === 0) return <Loader fullScreen={true}  />;

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
                <IoDocumentText className="text-2xl text-[#EC6345]" />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight text-[#333333] uppercase italic italic-heavy leading-none">
                  Curation <span className="text-[#EC6345]">Records</span>
                </h1>
                <p className="mt-2 text-sm font-medium text-[#605E5E]">
                  Diagnostic history of your curation missions.
                </p>
              </div>
            </div>

            {/* QUICK STATS HUB */}
            <div className="grid grid-cols-3 gap-2 md:gap-4 border-t md:border-t-0 md:border-l border-[#e5ded3] pt-4 md:pt-0 md:pl-8">
              <div className="text-center md:text-left">
                <p className="text-[10px] font-black uppercase tracking-[0.1em] text-[#605E5E]/60">Total</p>
                <p className="text-lg font-black text-[#333333]">{records.length}</p>
              </div>
              <div className="text-center md:text-left">
                <p className="text-[10px] font-black uppercase tracking-[0.1em] text-[#d6a44f]">Pending</p>
                <p className="text-lg font-black text-[#d6a44f]">{records.filter(r => r.pending).length}</p>
              </div>
              <div className="text-center md:text-left">
                <p className="text-[10px] font-black uppercase tracking-[0.1em] text-[#EC6345]">Profit</p>
                <p className="text-lg font-black text-[#EC6345]">
                  ${records.reduce((acc, r) => acc + (parseFloat(r.commission) || 0), 0).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* TACTICAL TABS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[24px] border border-[#e5ded3] bg-white/60 p-2 shadow-[0_20px_45px_-40px_rgba(39,39,39,0.4)] backdrop-blur-xl"
        >
          <div className="flex flex-wrap gap-2 sm:grid sm:grid-cols-4">
            {["All", "Completed", "Pending", "Freeze"].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setCurrentPage(1);
                }}
                className={`flex-1 rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                  activeTab === tab
                    ? "bg-[#333333] text-white shadow-lg"
                    : "text-[#605E5E] hover:bg-black/5"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </motion.div>

        {/* LEDGER ENTRIES */}
        <div className="space-y-4">
          {paginatedRecords.length > 0 ? (
            paginatedRecords.map((record, index) => {
              const status = getStatus(record);
              return (
                <motion.div
                  key={record.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="group relative overflow-hidden rounded-[32px] border border-[#e5ded3] bg-white p-6 shadow-[0_15px_35px_-25px_rgba(39,39,39,0.3)] transition-all duration-300 hover:shadow-[0_25px_55px_-35px_rgba(236,99,69,0.25)] hover:border-[#EC6345]/20"
                >
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
                    {/* ASSET VISUALS */}
                    <div className="flex shrink-0 gap-3">
                      {record.products.slice(0, 3).map((product) => (
                        <div key={product.id} className="relative h-24 w-24 overflow-hidden rounded-2xl border border-[#e5ded3] bg-[#fbfaf6]">
                          <img src={product.image} alt="" className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        </div>
                      ))}
                    </div>

                    {/* MISSION DATA */}
                    <div className="flex-1 space-y-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <p className="text-[11px] font-black uppercase tracking-widest text-[#a56657] font-mono bg-[#a56657]/5 px-2 py-0.5 rounded-lg border border-[#a56657]/10">
                              ID: {record.id.toString().slice(-8).toUpperCase()}
                            </p>
                            <p className="text-[10px] font-bold text-[#605E5E]/40">
                              {new Date(record.updated_at).toLocaleDateString()}
                            </p>
                          </div>
                          <h3 className="text-lg font-black text-[#333333] lg:text-2xl tracking-tight uppercase italic italic-heavy">
                            {record.products[0]?.name || "Legacy Track"}
                          </h3>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <div className={`rounded-full border px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.15em] ${statusColors[status]}`}>
                            {status}
                          </div>
                          {status === "Pending" && (
                            <motion.button
                              whileHover={{ scale: 1.05, x: 5 }}
                              whileTap={{ scale: 0.95 }}
                              disabled={submittingId !== null}
                              onClick={() => handleSubmit(record.id)}
                              className="flex items-center gap-2 rounded-xl bg-[#EC6345] px-5 py-2 text-[10px] font-black uppercase tracking-[0.1em] text-white shadow-[0_10px_20px_-5px_rgba(236,99,69,0.4)] disabled:opacity-50"
                            >
                              {submittingId === record.id ? (
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                >
                                  <IoReloadOutline className="text-sm" />
                                </motion.div>
                              ) : (
                                <IoCheckmarkCircle className="text-sm" />
                              )}
                              <span>{submittingId === record.id ? "Syncing" : "Commit"}</span>
                            </motion.button>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-8 pt-5 border-t border-dashed border-[#e5ded3]">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#605E5E]/40 mb-1">Amount</p>
                          <p className="text-xl font-black text-[#333333] tracking-tighter">{formatCurrencyWithCode(record.amount)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#605E5E]/40 mb-1">Commission</p>
                          <p className="text-xl font-black text-[#EC6345] tracking-tighter">USD {record.commission}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-[40px] border border-dashed border-[#e5ded3] bg-white/50 py-32 text-center"
            >
              <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#EC6345]/5 border border-[#EC6345]/10">
                <IoDocumentText className="text-4xl text-[#EC6345]/20" />
              </div>
              <h3 className="text-xl font-black text-[#333333] uppercase italic">No Records</h3>
              <p className="mt-2 text-sm font-medium text-[#605E5E]">No {activeTab.toLowerCase()} records found.</p>
            </motion.div>
          )}
        </div>

        {/* PAGINATION STATION */}
        <AnimatePresence>
          {filteredRecords.length > recordsPerPage && showPagination && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-24 left-4 right-4 z-50 flex items-center justify-between rounded-3xl border border-[#e5ded3] bg-white/80 p-4 shadow-2xl backdrop-blur-2xl md:bottom-10 md:left-auto md:right-10 md:w-[400px]"
            >
              <button
                onClick={() => handlePageChange("prev")}
                disabled={currentPage === 1}
                className="rounded-xl border border-[#e5ded3] bg-white px-5 py-2 text-xs font-black uppercase tracking-widest text-[#333333] disabled:opacity-20"
              >
                Prev
              </button>
              <span className="text-xs font-black uppercase tracking-widest text-[#333333]/40">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange("next")}
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

export default Records;


