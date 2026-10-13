import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { fadeIn } from "../../motion";
import { showAlert } from "../../app/slice/ui.slice";
import { fetchDeposits, submitDeposit } from "../../app/service/deposit.service";
import { BiCopy } from "react-icons/bi";
import { IoCheckmarkCircle, IoTimeOutline, IoWalletOutline, IoImageOutline } from "react-icons/io5";
import Loader from "./components/loader";
import Load from "./components/Load";
import ErrorHandler from "../../app/ErrorHandler";
import authService from "../../app/service/auth.service";
import { fetchProfileStart, fetchProfileSuccess, fetchProfileFailure } from "../../app/slice/profile.slice";
import BackButton from "./components/BackButton";
import BottomNavMobile from "./components/BottomNavMobile";

const Deposit = () => {
    const dispatch = useDispatch();
    const deposits = useSelector((state) => state.deposits?.deposits || []);
    const profile = useSelector((state) => state.profile.user);
    const isSubmitting = useSelector((state) => state.deposits.isSubmitting);
    const isProfileLoading = useSelector((state) => state.profile.isLoading);

    const [activeTab, setActiveTab] = useState("deposit");
    const [amount, setAmount] = useState("");
    const [isDepositPage, setIsDepositPage] = useState(false);
    const [receipt, setReceipt] = useState(null);

    const handleTabChange = (tab) => setActiveTab(tab);
    const handlePresetAmount = (value) => setAmount(value.toString());

    const handleReceiptUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setReceipt(file);
        }
    };

    useEffect(() => {
        const fetchDepositsIfEmpty = async () => {
            if (!deposits || deposits.length === 0) {
                try {
                    await dispatch(fetchDeposits());
                } catch (error) {
                    console.error("Error fetching deposits:", error);
                }
            }
        };
        fetchDepositsIfEmpty();
    }, [dispatch, deposits]);

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
                    }
                } catch (error) {
                    dispatch(fetchProfileFailure("An error occurred while fetching your profile."));
                }
            }
        };
        fetchProfileIfNeeded();
    }, [dispatch, profile]);

    if (isProfileLoading && !profile) return <Load fullScreen={true} />;

    const handleConfirmDeposit = async () => {
        if (!amount || !receipt) {
            dispatch(showAlert({
                type: 'error',
                title: 'Required',
                message: "Amount and receipt are required."
            }));
            return;
        }

        try {
            const formData = new FormData();
            formData.append("amount", amount);
            formData.append("screenshot", receipt);
            const result = await dispatch(submitDeposit(formData));
            if (result.success) {
                dispatch(showAlert({
                    type: 'success',
                    title: 'Mission Success',
                    message: "Deposit submitted successfully!"
                }));
                setIsDepositPage(false);
                setAmount("");
                setReceipt(null);
            } else {
                ErrorHandler(result.message);
            }
        } catch (error) {
            ErrorHandler(error);
        }
    };

    const copyToClipboard = (text) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        dispatch(showAlert({
            type: 'success',
            title: 'Copied',
            message: "Address copied to clipboard."
        }));
    };

    const normalizedStatus = (status) => {
      const lowered = String(status || "").toLowerCase();
      if (lowered.includes("confirm") || lowered.includes("complete") || lowered.includes("success")) return "Confirmed";
      if (lowered.includes("reject") || lowered.includes("fail")) return "Rejected";
      return "Pending";
    };

    const statusClasses = {
      Confirmed: "border-[#EC6345]/30 bg-[#EC6345]/10 text-[#EC6345]",
      Pending: "border-amber-500/30 bg-amber-50 text-amber-600",
      Rejected: "border-red-500/30 bg-red-50 text-red-600",
    };

    const canConfirmDeposit = Boolean(amount && Number(amount) > 0 && receipt);

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
              <div className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EC6345]/10 border border-[#EC6345]/20">
                    <IoWalletOutline className="text-2xl text-[#EC6345]" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-black tracking-tight text-[#333333] uppercase italic italic-heavy leading-none">
                      Deposit
                    </h1>
                    <p className="mt-2 text-sm font-medium text-[#605E5E]">
                      Securely infuse capital into your curation wallet.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {!profile ? (
            <div className="rounded-[32px] border border-red-500/20 bg-white p-12 text-center">
              <p className="text-red-500 font-bold mb-4 italic">Operational Desync: Failed to load identity data.</p>
              <button 
                onClick={() => window.location.reload()}
                className="bg-[#333333] text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest"
              >
                Retry Sync
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* BALANCE MODULE */}
              <div className="relative rounded-[32px] border border-[#EC6345]/20 bg-[#EC6345]/5 p-8 overflow-hidden group">
                <div className="absolute top-0 right-0 h-32 w-32 -translate-y-16 translate-x-16 rounded-full bg-[#EC6345]/10 blur-3xl transition-transform duration-700 group-hover:scale-150" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#605E5E]/60 mb-2">
                  Total Balance
                </p>
                <p className="text-4xl md:text-5xl font-black text-[#EC6345] tracking-tighter">
                  {profile?.wallet?.balance || "0.00"} <span className="text-xl opacity-40">USD</span>
                </p>
              </div>

              {isDepositPage ? (
                <motion.div
                  key="confirm"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="v2-card p-6 md:p-10"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* ETH TERMINAL */}
                    <div className="space-y-4 p-6 rounded-[28px] border border-[#e5ded3] bg-[#fbfaf6] relative overflow-hidden">
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#605E5E]/60">ETH (ERC20)</p>
                        <button
                          onClick={() => copyToClipboard(profile?.settings?.erc_address)}
                          className="h-8 w-8 flex items-center justify-center rounded-lg bg-white border border-[#e5ded3] text-[#333333] hover:text-[#EC6345]"
                        >
                          <BiCopy />
                        </button>
                      </div>
                      <p className="break-all font-mono text-sm font-bold text-[#333333]">
                        {profile?.settings?.erc_address || "Address Unavailable"}
                      </p>
                    </div>

                    {/* TRC20 TERMINAL */}
                    <div className="space-y-4 p-6 rounded-[28px] border border-[#e5ded3] bg-[#fbfaf6] relative overflow-hidden">
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#605E5E]/60">USDT (TRC20)</p>
                        <button
                          onClick={() => copyToClipboard(profile?.settings?.trc_address)}
                          className="h-8 w-8 flex items-center justify-center rounded-lg bg-white border border-[#e5ded3] text-[#333333] hover:text-[#EC6345]"
                        >
                          <BiCopy />
                        </button>
                      </div>
                      <p className="break-all font-mono text-sm font-bold text-[#333333]">
                        {profile?.settings?.trc_address || "Address Unavailable"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="space-y-6">
                      <div className="p-6 rounded-[28px] border border-[#e5ded3] bg-white text-center">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#605E5E]/60 mb-2">Deposit Amount</p>
                        <p className="text-3xl font-black text-[#333333] tracking-tighter">
                          {amount || "0.00"} <span className="text-[#EC6345]">USD</span>
                        </p>
                      </div>

                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#605E5E]/60 ml-2">Deposit Receipt</label>
                        <div className="relative group">
                          {receipt ? (
                            <div className="overflow-hidden rounded-[32px] border border-[#e5ded3] bg-white p-2">
                              <img
                                src={typeof receipt === "string" ? receipt : URL.createObjectURL(receipt)}
                                alt="Receipt"
                                className="h-64 w-full object-cover rounded-[24px]"
                              />
                              <button
                                onClick={() => setReceipt(null)}
                                className="w-full mt-2 py-3 text-[10px] font-black uppercase tracking-widest text-[#EC6345] hover:bg-[#EC6345]/5 transition-all rounded-xl"
                              >
                                Remove Selection
                              </button>
                            </div>
                          ) : (
                            <div className="relative h-64 w-full flex flex-col items-center justify-center rounded-[32px] border-2 border-dashed border-[#e5ded3] bg-[#fbfaf6] hover:border-[#EC6345]/40 transition-all">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleReceiptUpload}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                              />
                              <IoImageOutline className="text-4xl text-[#605E5E]/20 mb-4" />
                              <p className="text-xs font-black uppercase tracking-widest text-[#605E5E]/40">Upload Mission Receipt</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col justify-end">
                      <div className="p-6 rounded-[32px] border border-amber-500/10 bg-amber-50/30 mb-6">
                        <p className="text-xs font-medium text-[#605E5E] leading-relaxed italic">
                          Please ensure you upload a clear screenshot of your transaction confirmation. Cross-verify the payout address before submission.
                        </p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleConfirmDeposit}
                        disabled={isSubmitting || !canConfirmDeposit}
                        className="flex w-full items-center justify-center rounded-[24px] bg-[#333333] py-5 text-[11px] font-black uppercase tracking-[0.2em] text-white shadow-xl shadow-black/10 transition-all hover:bg-black disabled:opacity-40"
                      >
                        {isSubmitting ? <Loader /> : "Confirm Deposit"}
                      </motion.button>
                      <button 
                        onClick={() => setIsDepositPage(false)}
                        className="mt-4 text-[10px] font-black uppercase tracking-widest text-[#605E5E]/50 hover:text-[#EC6345]"
                      >
                        Back to Selection
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="space-y-6">
                  {/* TAB SWITCHER */}
                  <div className="flex gap-2 rounded-2xl bg-white/50 p-1.5 border border-[#e5ded3] w-fit">
                    <button
                        onClick={() => handleTabChange("deposit")}
                        className={`rounded-xl px-8 py-3 text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                          activeTab === "deposit"
                            ? "bg-[#EC6345] text-white shadow-lg shadow-[#EC6345]/20"
                            : "text-[#605E5E] hover:text-[#EC6345]"
                        }`}
                    >
                      Deposit Now
                    </button>
                    <button
                        onClick={() => handleTabChange("history")}
                        className={`rounded-xl px-8 py-3 text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                          activeTab === "history"
                            ? "bg-[#EC6345] text-white shadow-lg shadow-[#EC6345]/20"
                            : "text-[#605E5E] hover:text-[#EC6345]"
                        }`}
                    >
                      Deposit History
                    </button>
                  </div>

                  {activeTab === "deposit" ? (
                    <motion.div
                      key="amount"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="v2-card p-6 md:p-10 space-y-8"
                    >
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        {[10, 25, 50, 100, 200, 500, 1000, 2000].map((value) => (
                          <button
                            key={value}
                            onClick={() => handlePresetAmount(value)}
                            className={`relative overflow-hidden rounded-2xl border p-4 text-left transition-all duration-300 group ${
                              Number(amount) === value
                                ? "border-[#EC6345] bg-[#EC6345] text-white shadow-lg shadow-[#EC6345]/30"
                                : "border-[#e5ded3] bg-[#fbfaf6] text-[#333333] hover:border-[#EC6345]/40"
                            }`}
                          >
                            <p className="text-[9px] font-black uppercase tracking-[0.2em] mb-1 opacity-60">USD</p>
                            <p className="text-xl font-black tracking-tighter">{value}</p>
                          </button>
                        ))}
                      </div>

                      <div className="space-y-6 max-w-xl">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#605E5E]/60 ml-1">
                            Custom Deposit Amount
                          </label>
                          <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            className="w-full rounded-2xl border border-[#e5ded3] bg-[#fbfaf6] px-6 py-4 text-sm font-bold text-[#333333] placeholder:text-[#605E5E]/30 focus:outline-none focus:border-[#EC6345]/40 transition-all font-mono"
                          />
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setIsDepositPage(true)}
                          disabled={!amount || amount <= 0}
                          className="flex w-full items-center justify-center rounded-[24px] bg-[#333333] py-5 text-[11px] font-black uppercase tracking-[0.2em] text-white shadow-xl shadow-black/10 transition-all hover:bg-black disabled:opacity-40"
                        >
                          Next Stage
                        </motion.button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="history"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-4"
                    >
                      {deposits.length > 0 ? (
                        deposits.map((transaction, index) => {
                          const label = normalizedStatus(transaction.status);
                          return (
                            <motion.div
                              key={transaction.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="v2-card p-6 md:p-8"
                            >
                              <div className="flex items-start justify-between gap-6">
                                <div className="space-y-4 flex-1">
                                  <div className="flex items-center gap-3">
                                    <div className={`h-2 w-2 rounded-full ${label === 'Pending' ? 'bg-amber-400 animate-pulse' : label === 'Confirmed' ? 'bg-emerald-400' : 'bg-red-400'}`} />
                                  </div>
                                  <p className="text-3xl font-black text-[#333333] tracking-tighter">
                                    {transaction.amount} <span className="text-[#EC6345] text-xl">USD</span>
                                  </p>
                                  <div className="flex items-center gap-2 text-[10px] font-bold text-[#605E5E]/50">
                                    <IoTimeOutline />
                                    <span>
                                      {new Date(transaction.created_at).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" })} at {new Date(transaction.created_at).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })}
                                    </span>
                                  </div>
                                </div>
                                <div className={`rounded-full border px-6 py-2 text-[10px] font-black uppercase tracking-[0.2em] ${statusClasses[label]}`}>
                                  {label}
                                </div>
                              </div>
                            </motion.div>
                          );
                        })
                      ) : (
                        <div className="rounded-[40px] border border-dashed border-[#e5ded3] bg-white/50 py-32 text-center">
                          <IoWalletOutline className="mx-auto mb-6 text-4xl text-[#EC6345]/20" />
                          <h3 className="text-2xl font-black text-[#333333] uppercase italic">History Clear</h3>
                          <p className="mt-2 text-sm font-medium text-[#605E5E]">No deposit logs located in this sector.</p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              )}
            </div>
          )}
          <BottomNavMobile className="md:hidden" />
        </div>
      </div>
    );
};

export default Deposit;
