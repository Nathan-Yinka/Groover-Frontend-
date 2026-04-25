import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { slideIn } from "../../motion";
import BottomNavMobile from "./components/BottomNavMobile";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfileFailure, fetchProfileStart, fetchProfileSuccess } from "../../app/slice/profile.slice";
import { showAlert } from "../../app/slice/ui.slice";
import authService from "../../app/service/auth.service";
import ErrorHandler from "../../app/ErrorHandler";
import { formatCurrencyFullAmount } from "../../utils/currency";
import { fetchWithdrawalHistory, makeWithdrawal } from "../../app/service/withdraw.service";
import { fetchWithdrawalsStart } from "../../app/slice/withdraw.slice";
import Loader from "./components/loader";
import Load from "./components/Load";
import BackButton from "./components/BackButton";
import { IoCheckmarkCircle, IoTimeOutline, IoWalletOutline } from "react-icons/io5";

import { fadeIn } from "../../motion";
const Withdraw = () => {
    const dispatch = useDispatch();
    const { history, isLoading } = useSelector((state) => state.withdrawals);
    const profile = useSelector((state) => state.profile.user);
    const isProfileLoading = useSelector((state) => state.profile.isLoading);

    // State for inputs
    const [amount, setAmount] = useState("");
    
    const [password, setPassword] = useState("");
    const [activeTab, setActiveTab] = useState("withdraw");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch withdrawal history initially if the state is empty
    useEffect(() => {
        const fetchWithdrawalsIfEmpty = async () => {
            if (!history || history.length === 0) {
                dispatch(fetchWithdrawalsStart());
                try {
                    await dispatch(fetchWithdrawalHistory());
                    console.log(history)
                } catch (error) {
                    console.error("Error fetching withdrawals:", error);
                }
            }
        };

        fetchWithdrawalsIfEmpty();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);

    // Fetch Profile if not yet fetched
    useEffect(() => {
        const fetchProfileIfNeeded = async () => {
            if (!profile) {
                try {
                    dispatch(fetchProfileStart());
                    const response = await authService.fetchProfile();
                    if (response.success) {
                        dispatch(fetchProfileSuccess(response.data));
                    } else {
                        dispatch(fetchProfileFailure(response.message || "Failed to load profile."));
                        toast.error(response.message || "Failed to load profile.");
                    }
                } catch (error) {
                    console.error("Error fetching profile:", error);
                    dispatch(fetchProfileFailure("An error occurred while fetching your profile."));
                    toast.error("An error occurred while fetching your profile.");
                }
            }
        };

        fetchProfileIfNeeded();
    }, [dispatch, profile]);

    // Only show full-screen loader on initial mount if data is missing
    const isInitialLoading = (isProfileLoading && !profile) || (isLoading && (!history || history.length === 0));
    if (isInitialLoading) return <Load fullScreen={true}  />;

    // Handle Submit
    const handleSubmit = async () => {
        if (!amount || !password) {
            dispatch(showAlert({
                type: 'error',
                title: 'Security Alert',
                message: "Please fill in all withdrawal parameters."
            }));
            return;
        }

        if (Number(amount) > Number(profile.wallet.balance)) {
            dispatch(showAlert({
                type: 'error',
                title: 'Fiscal Warning',
                message: "Amount exceeds available curation liquidity."
            }));
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await dispatch(makeWithdrawal({ amount, password }));
            if (result.success) {
                dispatch(showAlert({
                    type: 'success',
                    title: 'Mission Confirmed',
                    message: "Extraction mission initiated successfully."
                }));
                setAmount("");
                setPassword("");
                setActiveTab("history");
                await dispatch(fetchWithdrawalHistory()); // Refresh history
            } else {
                ErrorHandler(result.message);
            }
        } catch (error) {
            ErrorHandler(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleTabChange = (tab) => setActiveTab(tab);
    const normalizedStatus = (status) => {
      const lowered = String(status || "").toLowerCase();
      if (lowered.includes("complete") || lowered.includes("success")) {
        return "Completed";
      }
      if (lowered.includes("reject") || lowered.includes("failed")) {
        return "Rejected";
      }
      return "Pending";
    };
    const statusClasses = {
      Completed: "border-[#EC6345]/30 bg-[#EC6345]/10 text-[#EC6345]",
      Pending: "border-[#d6a44f]/35 bg-[#fff8e8] text-[#9b6b13]",
      Rejected: "border-[#d46a5d]/35 bg-[#fff1ee] text-[#BA5225]",
    };

    return (
      <motion.div
        initial={fadeIn("right", null).initial}
        whileInView={fadeIn("right", 1 * 2).animate}
        className="min-h-screen bg-[#F7F6F0] text-[#333333]"
      >
        <div className="mx-auto max-w-[1600px] space-y-6 px-4 py-8 pb-32 md:px-8 md:py-10">
          
          {/* HEADER STATION */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative rounded-[32px] border border-[#e5ded3] bg-white p-6 md:p-8 shadow-[0_20px_45px_-38px_rgba(39,39,39,0.6)] overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(236,99,69,0.04),transparent_50%)]" />
            <BackButton className="mb-6" />
            
            <div className="relative z-10 flex items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EC6345]/10 border border-[#EC6345]/20">
                  <IoWalletOutline className="text-2xl text-[#EC6345]" />
                </div>
                <div>
                  <h1 className="text-3xl font-black tracking-tight text-[#333333] uppercase italic italic-heavy leading-none">
                    Withdraw
                  </h1>
                  <p className="mt-2 text-sm font-medium text-[#605E5E]">
                    Securely manage your capital transfers.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

            {isProfileLoading && (
              <div className="flex items-center justify-center py-10">
                <Load />
              </div>
            )}

            {!isProfileLoading && !profile && (
              <div className="rounded-2xl border border-red-500/30 bg-red-900/10 p-6 text-center">
                <p className="mb-4 text-red-300">Failed to load profile data</p>
                <button
                  onClick={() => window.location.reload()}
                  className="rounded-lg border border-[#EC6345]/35 bg-[#EC6345] px-4 py-2 font-semibold text-white transition hover:bg-[#BA5225]"
                >
                  Retry
                </button>
              </div>
            )}

            {!isProfileLoading && profile && (
              <>
                <div className="flex gap-2 rounded-2xl bg-white/50 p-1.5 border border-[#e5ded3] w-fit">
                  <button
                    type="button"
                    onClick={() => handleTabChange("withdraw")}
                    className={`rounded-xl px-8 py-3 text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                      activeTab === "withdraw"
                        ? "bg-[#EC6345] text-white shadow-lg shadow-[#EC6345]/20"
                        : "text-[#605E5E] hover:text-[#EC6345]"
                    }`}
                  >
                    Withdraw Now
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTabChange("history")}
                    className={`rounded-xl px-8 py-3 text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                      activeTab === "history"
                        ? "bg-[#EC6345] text-white shadow-lg shadow-[#EC6345]/20"
                        : "text-[#605E5E] hover:text-[#EC6345]"
                    }`}
                  >
                    Withdraw History
                  </button>
                </div>

                {activeTab === "withdraw" && (
                  <motion.div
                    key="withdraw"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="v2-card p-6 md:p-10 space-y-8"
                  >
                    <div className="relative rounded-[32px] border border-[#EC6345]/20 bg-[#EC6345]/5 p-8 overflow-hidden group">
                      <div className="absolute top-0 right-0 h-32 w-32 -translate-y-16 translate-x-16 rounded-full bg-[#EC6345]/10 blur-3xl transition-transform duration-700 group-hover:scale-150" />
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#605E5E]/60 mb-2">
                        Available Balance
                      </p>
                      <p className="text-4xl md:text-5xl font-black text-[#EC6345] tracking-tighter">
                        {formatCurrencyFullAmount(profile?.wallet?.balance || 0)}
                      </p>
                    </div>

                    <div className="space-y-6 max-w-xl">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#605E5E]/60 ml-1">
                          Withdrawal Amount
                        </label>
                        <input
                          type="number"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          placeholder="0.00"
                          className="w-full rounded-2xl border border-[#e5ded3] bg-[#fbfaf6] px-6 py-4 text-sm font-bold text-[#333333] placeholder:text-[#605E5E]/30 focus:outline-none focus:border-[#EC6345]/40 transition-all"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#605E5E]/60 ml-1">
                          Withdrawal Password
                        </label>
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full rounded-2xl border border-[#e5ded3] bg-[#fbfaf6] px-6 py-4 text-sm font-bold text-[#333333] placeholder:text-[#605E5E]/30 focus:outline-none focus:border-[#EC6345]/40 transition-all"
                        />
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="flex w-full items-center justify-center rounded-[24px] bg-[#333333] py-5 text-[11px] font-black uppercase tracking-[0.2em] text-white shadow-xl shadow-black/10 transition-all hover:bg-black disabled:opacity-40"
                      >
                        {isSubmitting ? <Loader /> : "Submit Withdrawal"}
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {activeTab === "history" && (
                  <motion.div
                    key="history"
                    initial={slideIn("left", null).initial}
                    animate={slideIn("left", 1 * 2).animate}
                    exit={{ opacity: 0, x: 50 }}
                    className="space-y-3"
                  >
                    {isLoading ? (
                      <div className="flex justify-center py-20">
                        <Loader />
                      </div>
                    ) : Array.isArray(history) ? (
                      history.length > 0 ? (
                        <div className="space-y-4">
                          {history.map((item, index) => {
                            const label = normalizedStatus(item.status);
                            return (
                              <motion.div
                                key={item.id}
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                                className="v2-card p-6 md:p-8"
                              >
                                <div className="flex items-start justify-between gap-6">
                                  <div className="space-y-4 flex-1">
                                    <div className="flex items-center gap-3">
                                      <div className={`h-2 w-2 rounded-full ${label === 'Pending' ? 'bg-amber-400 animate-pulse' : label === 'Completed' ? 'bg-emerald-400' : 'bg-red-400'}`} />
                                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#605E5E]/40">
                                        ID: {item.transaction_id || "TRX-N/A"}
                                      </p>
                                    </div>
                                    <p className="text-3xl font-black text-[#333333] tracking-tighter">
                                      {formatCurrencyFullAmount(item.amount || 0)}
                                    </p>
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-[#605E5E]/50">
                                      <IoTimeOutline />
                                      <span>
                                        {new Date(item.created_at).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" })} at {new Date(item.created_at).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })}
                                      </span>
                                    </div>
                                  </div>
                                  <div className={`rounded-full border px-6 py-2 text-[10px] font-black uppercase tracking-[0.2em] ${statusClasses[label]}`}>
                                    {label}
                                  </div>
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="rounded-[40px] border border-dashed border-[#e5ded3] bg-white/50 py-32 text-center">
                          <IoWalletOutline className="mx-auto mb-6 text-4xl text-[#EC6345]/20" />
                          <h3 className="text-2xl font-black text-[#333333] uppercase italic">History Clear</h3>
                          <p className="mt-2 text-sm font-medium text-[#605E5E]">No withdrawal logs localized in this sector.</p>
                        </div>
                      )
                    ) : (
                      <div className="rounded-2xl border border-red-500/30 bg-red-900/10 py-10 text-center">
                        <p className="text-sm text-red-300">Failed to load withdrawal history.</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </>
            )}
          </div>
          <BottomNavMobile className="md:hidden" />
      </motion.div>
    );
};

export default Withdraw;


