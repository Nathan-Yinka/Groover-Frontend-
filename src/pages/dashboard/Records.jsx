import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import BackButton from "./components/BackButton";

const statusColors = {
  Completed: "border-[#EC6345]/30 bg-[#EC6345]/10 text-[#EC6345] shadow-[0_0_15px_-5px_rgba(236,99,69,0.3)]",
  Pending: "border-[#d6a44f]/30 bg-[#d6a44f]/10 text-[#d6a44f] shadow-[0_0_15px_-5px_rgba(214,164,79,0.3)]",
  Freeze: "border-[#7b756f]/30 bg-[#7b756f]/10 text-[#7b756f]",
};

const getStatus = (record) => {
  if (record.pending) return "Pending";
  if (!record.pending && record.rating_score === 0) return "Freeze";
  return "Completed";
};

const Records = () => {
  const dispatch = useDispatch();
  const records = useSelector((state) => state.products.gameRecords);
  const isLoading = useSelector((state) => state.products.isLoading);

  const [activeTab, setActiveTab] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [showPagination, setShowPagination] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const [submittingId, setSubmittingId] = useState(null);
  const recordsPerPage = 20;

  const filteredRecords =
    activeTab === "All"
      ? records
      : records.filter((record) => getStatus(record) === activeTab);

  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);
  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage,
  );

  useEffect(() => {
    dispatch(fetchGameRecords());
  }, [dispatch]);

  const handleReCommit = async (id) => {
    setSubmittingId(id);
    try {
      const result = await dispatch(submitCurrentGame(id));
      if (result.success) {
        dispatch(showAlert({
          type: 'success',
          title: 'Success',
          message: "Committed successfully."
        }));
        dispatch(fetchGameRecords());
      } else {
        ErrorHandler(result.message);
      }
    } catch (error) {
      ErrorHandler(error);
    } finally {
      setSubmittingId(null);
    }
  };

  const handlePageChange = (direction) => {
    if (direction === "next" && currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    } else if (direction === "prev" && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowPagination(false);
      } else if (currentScrollY < lastScrollY) {
        setShowPagination(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  if (isLoading && records.length === 0) return <Loader fullScreen={true}  />;

  return (
    <div className="min-h-screen bg-[#F7F6F0] text-[#333333] overflow-x-hidden">
      <div className="mx-auto max-w-[1600px] space-y-6 px-3 py-6 pb-32 md:px-8 md:py-10">
        
        {/* HEADER STATION */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-[32px] border border-[#e5ded3] bg-white p-6 shadow-[0_20px_45px_-38px_rgba(39,39,39,0.6)] overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(236,99,69,0.04),transparent_50%)]" />
          <div className="relative z-10 flex flex-col items-center text-center">
            <BackButton className="mb-8" dark />
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EC6345]/10 border border-[#EC6345]/20 mb-4">
              <IoDocumentText className="text-2xl text-[#EC6345]" />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-[#333333] uppercase italic italic-heavy leading-none md:text-5xl">
              Submission <span className="text-[#EC6345]">Records</span>
            </h1>
            <p className="mt-2 text-sm font-medium text-[#605E5E]">History of your previous submissions.</p>
          </div>
        </motion.div>

        {/* TACTICAL TABS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[24px] border border-[#e5ded3] bg-white/60 p-2 shadow-[0_20px_45px_-40px_rgba(39,39,39,0.4)] backdrop-blur-xl"
        >
          <div className="grid grid-cols-4 gap-1.5">
            {["All", "Completed", "Pending", "Freeze"].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setCurrentPage(1);
                }}
                className={`flex-1 rounded-xl px-1 py-3 text-[10px] font-black uppercase tracking-tighter transition-all duration-300 ${
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
                  className="group relative overflow-hidden rounded-[32px] border border-[#e5ded3] bg-white p-5 shadow-[0_15px_35px_-25px_rgba(39,39,39,0.3)] transition-all duration-300 hover:border-[#EC6345]/20"
                >
                  <div className="flex flex-col gap-6">
                    {/* ASSET VISUALS: Responsive Wrap */}
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                      {record.products.slice(0, 3).map((product) => (
                        <div key={product.id} className="relative h-16 w-16 sm:h-24 sm:w-24 overflow-hidden rounded-2xl border border-[#e5ded3] bg-[#fbfaf6]">
                          <img src={product.image} alt="" className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        </div>
                      ))}
                    </div>

                    {/* MISSION DATA: Stackable tiers */}
                    <div className="flex-1 space-y-5">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-[9px] font-bold text-[#605E5E]/40 whitespace-nowrap">
                              {new Date(record.updated_at).toLocaleDateString()}
                            </p>
                          </div>
                          <h3 className="text-lg font-black text-[#333333] lg:text-3xl tracking-tight uppercase italic italic-heavy leading-tight">
                            {record.products[0]?.name || "Legacy Track"}
                          </h3>
                        </div>
                        
                        <div className="flex items-center gap-2 flex-wrap">
                          <div className={`rounded-full border px-3 py-1 text-[9px] font-black uppercase tracking-widest ${statusColors[status]}`}>
                            {status}
                          </div>
                          {status === "Pending" && (
                            <button
                              disabled={submittingId !== null}
                              onClick={() => handleReCommit(record.id)}
                              className="flex items-center gap-2 rounded-xl bg-[#EC6345] px-4 py-1.5 text-[9px] font-black uppercase tracking-widest text-white shadow-lg disabled:opacity-50"
                            >
                              {submittingId === record.id ? (
                                <IoReloadOutline className="animate-spin text-sm" />
                              ) : (
                                <IoCheckmarkCircle className="text-sm" />
                              )}
                              <span>{submittingId === record.id ? "Syncing" : "Commit"}</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* STATS GRID: Stabilized */}
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-dashed border-[#e5ded3]">
                        <div className="shrink-0">
                          <p className="text-[9px] font-black uppercase tracking-widest text-[#605E5E]/40 mb-1">Amount</p>
                          <p className="text-lg font-black text-[#333333] tracking-tighter whitespace-nowrap">{formatCurrencyWithCode(record.amount)}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-[9px] font-black uppercase tracking-widest text-[#605E5E]/40 mb-1">Commission</p>
                          <p className="text-lg font-black text-[#EC6345] tracking-tighter whitespace-nowrap">USD {record.commission}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="rounded-[40px] border border-dashed border-[#e5ded3] bg-white/50 py-32 text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#EC6345]/5">
                <IoDocumentText className="text-3xl text-[#EC6345]/20" />
              </div>
              <h3 className="text-xl font-black text-[#333333] uppercase italic">No Records</h3>
              <p className="mt-1 text-sm font-medium text-[#605E5E]">No data found for this sector.</p>
            </div>
          )}
        </div>

        {/* PAGINATION STATION */}
        <AnimatePresence>
          {filteredRecords.length > recordsPerPage && showPagination && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-24 left-3 right-3 z-50 flex items-center justify-between rounded-2xl border border-[#e5ded3] bg-white/90 p-3 shadow-2xl backdrop-blur-xl md:bottom-10 md:left-auto md:right-10 md:w-[400px]"
            >
              <button
                onClick={() => handlePageChange("prev")}
                disabled={currentPage === 1}
                className="rounded-xl border border-[#e5ded3] bg-white px-4 py-2 text-[10px] font-black uppercase tracking-widest text-[#333333] disabled:opacity-20"
              >
                Prev
              </button>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#333333]/40">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => handlePageChange("next")}
                disabled={currentPage === totalPages}
                className="rounded-xl border border-[#e5ded3] bg-white px-4 py-2 text-[10px] font-black uppercase tracking-widest text-[#333333] disabled:opacity-20"
              >
                Next
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Records;
