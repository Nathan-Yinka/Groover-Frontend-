import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { slideIn } from "../../motion";
import BottomNavMobile from "./components/BottomNavMobile";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfileFailure, fetchProfileStart, fetchProfileSuccess } from "../../app/slice/profile.slice";
import authService from "../../app/service/auth.service";
import { toast } from "sonner";
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

    // Handle Submit
    const handleSubmit = async () => {
        // Frontend validation
        if (!amount || !password) {
            toast.error("Both amount and password are required.");
            return;
        }

        if (isNaN(amount) || Number(amount) <= 0) {
            toast.error("Please enter a valid amount.");
            return;
        }

        // Show loader on button
        setIsSubmitting(true);

        try {
            const payload = { amount: Number(amount), password };
            const response = await dispatch(makeWithdrawal(payload));

            if (response.success) {
                toast.success(response.message || "Withdrawal request successful.");
                setAmount("");
                setPassword("");
            } else {
                // Extract error message
                ErrorHandler(response.message);
            }
        } catch (error) {
            // Log and display unexpected errors
            // console.error("Unexpected error:", error);
            // toast.error("An unexpected error occurred. Please try again.");
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
        <div className="w-full space-y-5 px-3 py-4 pb-24 md:space-y-6 md:px-8 md:py-6 md:pb-8">
          <div className="rounded-[18px] border border-[#e5ded3] bg-white p-4 shadow-[0_20px_45px_-38px_rgba(39,39,39,0.6)] md:p-6">
            <BackButton className="mb-5" />
            <div className="flex items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Withdraw</h1>
                <p className="text-xs text-[#605E5E] md:text-sm">
                  Submit your withdrawal request and track history.
                </p>
              </div>
              <div className="hidden rounded-xl border border-[#EC6345]/25 bg-[#EC6345]/10 p-2.5 md:grid md:place-items-center">
                <IoWalletOutline className="text-xl text-[#EC6345]" />
              </div>
            </div>
            </div>

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
                <div className="grid grid-cols-2 gap-2 rounded-[18px] border border-[#e5ded3] bg-white p-2 md:inline-grid md:grid-cols-2 md:gap-3">
                  <button
                    type="button"
                    onClick={() => handleTabChange("withdraw")}
                    className={`rounded-xl px-3 py-2 text-xs font-semibold transition md:px-4 md:py-2.5 md:text-sm ${activeTab === "withdraw"
                      ? "border border-[#EC6345]/35 bg-[#EC6345] text-white"
                      : "border border-[#e5ded3] bg-white text-[#5f5b57] hover:border-[#EC6345]/30 hover:text-[#EC6345]"}`}
                  >
                    Withdraw Now
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTabChange("history")}
                    className={`rounded-xl px-3 py-2 text-xs font-semibold transition md:px-4 md:py-2.5 md:text-sm ${activeTab === "history"
                      ? "border border-[#EC6345]/35 bg-[#EC6345] text-white"
                      : "border border-[#e5ded3] bg-white text-[#5f5b57] hover:border-[#EC6345]/30 hover:text-[#EC6345]"}`}
                  >
                    Withdraw History
                  </button>
                </div>

                {activeTab === "withdraw" && (
                  <motion.div
                    key="withdraw"
                    initial={slideIn("right", null).initial}
                    animate={slideIn("right", 1 * 2).animate}
                    className="rounded-[18px] border border-[#e5ded3] bg-white p-4 shadow-[0_20px_45px_-38px_rgba(39,39,39,0.6)] md:p-6"
                  >
                    <div className="mb-5 rounded-2xl border border-[#EC6345]/25 bg-[#EC6345]/10 p-4 md:p-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#605E5E]">
                        Available Balance
                      </p>
                      <p className="mt-2 text-2xl font-bold text-[#EC6345] md:text-4xl">
                        {formatCurrencyFullAmount(profile?.wallet?.balance || 0)}
                      </p>
                    </div>

                    <div className="mb-5">
                      <label className="block text-sm font-semibold text-[#4a4642]">
                        Withdrawal Amount
                      </label>
                      <input
                        type="number"
                        id="amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter amount"
                        className="mt-2 w-full rounded-lg border border-[#e5ded3] bg-white px-3 py-2.5 text-sm text-[#333333] placeholder:text-[#8b8580] focus:outline-none focus:ring-2 focus:ring-[#EC6345]/30"
                      />
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-[#4a4642]">
                        Withdrawal Password
                      </label>
                      <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        className="mt-2 w-full rounded-lg border border-[#e5ded3] bg-white px-3 py-2.5 text-sm text-[#333333] placeholder:text-[#8b8580] focus:outline-none focus:ring-2 focus:ring-[#EC6345]/30"
                      />
                    </div>

                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="flex w-full items-center justify-center rounded-lg border border-[#EC6345]/35 bg-[#EC6345] py-3 font-semibold text-white transition hover:bg-[#BA5225] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSubmitting ? <Loader /> : "Submit Withdrawal"}
                    </button>
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
                      <div className="flex justify-center py-8">
                        <Loader />
                      </div>
                    ) : Array.isArray(history) ? (
                      history.length > 0 ? (
                        history.map((item) => {
                          const label = normalizedStatus(item.status);
                          return (
                            <div
                              key={item.id}
                              className="rounded-2xl border border-[#e5ded3] bg-white p-4 shadow-[0_20px_45px_-38px_rgba(39,39,39,0.55)]"
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div className="min-w-0">
                                  <p className="text-sm font-semibold text-[#333333] md:text-base">
                                    Withdrawal
                                  </p>
                                  <p className="truncate text-xs text-[#6c6661] md:text-sm">
                                    {item.transaction_id}
                                  </p>
                                  <p className="mt-2 text-lg font-bold text-[#EC6345] md:text-2xl">
                                    {formatCurrencyFullAmount(item.amount || 0)}
                                  </p>
                                </div>
                                <span
                                  className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${statusClasses[label]}`}
                                >
                                  {label}
                                </span>
                              </div>
                              <div className="mt-3 flex items-center gap-2 text-[11px] text-[#7b756f] md:text-xs">
                                <IoTimeOutline className="text-[#6c6661]" />
                                <span>
                                  {new Date(item.created_at).toLocaleDateString(
                                    "en-US",
                                    {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                    },
                                  )}{" "}
                                  at{" "}
                                  {new Date(item.created_at).toLocaleTimeString(
                                    "en-US",
                                    {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      hour12: true,
                                    },
                                  )}
                                </span>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="rounded-[18px] border border-[#e5ded3] bg-white py-10 text-center">
                          <IoCheckmarkCircle className="mx-auto mb-3 text-3xl text-[#EC6345]/70" />
                          <p className="text-sm text-[#605E5E]">No withdrawal history available.</p>
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


