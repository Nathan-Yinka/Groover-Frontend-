import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { fadeIn, slideIn } from "../../motion";
import { toast } from "sonner";
import { fetchDeposits, submitDeposit } from "../../app/service/deposit.service";
import { BiCopy } from "react-icons/bi";
import { IoCheckmarkCircle, IoTimeOutline, IoWalletOutline } from "react-icons/io5";
import Loader from "./components/loader";
import Load from "./components/Load";
import ErrorHandler from "../../app/ErrorHandler";
// import { formatCurrencyWithCode, formatCurrencyFullAmount } from "../../utils/currency";
import authService from "../../app/service/auth.service";
import { fetchProfileStart, fetchProfileSuccess, fetchProfileFailure } from "../../app/slice/profile.slice";
import BackButton from "./components/BackButton";
import BottomNavMobile from "./components/BottomNavMobile";

const Deposit = () => {
    const dispatch = useDispatch();
    const deposits = useSelector((state) => state.deposits?.deposits || []); // Fallback to empty array
    const profile = useSelector((state) => state.profile.user);
    const isSubmitting = useSelector((state) => state.deposits.isSubmitting);
    const isProfileLoading = useSelector((state) => state.profile.isLoading);

    const [activeTab, setActiveTab] = useState("deposit");
    const [amount, setAmount] = useState("");
    const [isDepositPage, setIsDepositPage] = useState(false); // State to toggle the new deposit page
    const [receipt, setReceipt] = useState(null); // State for uploaded file


    // Handle Tab Changes
    const handleTabChange = (tab) => setActiveTab(tab);

    // Handle Preset Amount
    const handlePresetAmount = (value) => setAmount(value.toString());

    // Handle Receipt Upload
    const handleReceiptUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setReceipt(file); // File for submission
        }
    };

    // Fetch Deposits if State is Empty
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

    // Submit Deposit
    const handleConfirmDeposit = async () => {
        if (!amount || !receipt) {
            toast.error("Amount and receipt are required!");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("amount", amount);
            formData.append("screenshot", receipt);

            const result = await dispatch(submitDeposit(formData));

            if (result.success) {
                toast.success("Deposit submitted successfully!");
                setIsDepositPage(false);
                setAmount("");
                setReceipt(null);
            }
            //     // Handle backend error messages
            //     const backendErrors = result.message; // Adjust to access `message` object
            //     if (typeof backendErrors === "object") {
            //         // Display all errors in a toast
            //         Object.entries(backendErrors).forEach(([field, errors]) => {
            //             errors.forEach((error) => toast.error(`${field}: ${error}`));
            //         });
            else {
                ErrorHandler(result.message);
            }

        } catch (error) {
            // const errorMessage =
            //     error.response?.data?.message || "An unexpected error occurred.";
            // if (typeof errorMessage === "object") {
            //     // Parse backend error messages
            //     Object.entries(errorMessage).forEach(([field, errors]) => {
            //         errors.forEach((error) => toast.error(`${field}: ${error}`));
            //     });
            ErrorHandler(error)
            // } else {
            //     toast.error(errorMessage);
            // }
            // console.error("Deposit submission error:", error.response || error);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success("Address copied to clipboard!", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
    };

    const normalizedStatus = (status) => {
      const lowered = String(status || "").toLowerCase();
      if (lowered.includes("confirm") || lowered.includes("complete") || lowered.includes("success")) {
        return "Confirmed";
      }
      if (lowered.includes("reject") || lowered.includes("fail")) {
        return "Rejected";
      }
      return "Pending";
    };

    const statusClasses = {
      Confirmed: "border-[#2ccd79]/35 bg-[#132319] text-[#7ef1b2]",
      Pending: "border-[#d6a44f]/35 bg-[#241d12] text-[#f3c879]",
      Rejected: "border-[#b85454]/35 bg-[#2a1717] text-[#f3a7a7]",
    };
    const canConfirmDeposit = Boolean(amount && Number(amount) > 0 && receipt);

    return (
      <motion.div
        initial={fadeIn("right", null).initial}
        whileInView={fadeIn("right", 1 * 2).animate}
        className="min-h-screen bg-[#060606] text-white"
      >
        <div className="w-full space-y-5 px-3 py-4 pb-24 md:space-y-6 md:px-8 md:py-6 md:pb-8">
          <div className="rounded-2xl border border-white/10 bg-[#0d0f10] p-4 shadow-[0_24px_60px_-35px_rgba(0,0,0,0.95)] md:p-6">
            <BackButton className="mb-5" />
            <div className="flex items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Deposit</h1>
                <p className="text-xs text-white/65 md:text-sm">
                  Add funds securely and track your deposit status.
                </p>
              </div>
              <div className="hidden rounded-xl border border-accent/25 bg-accent/10 p-2.5 md:grid md:place-items-center">
                <IoWalletOutline className="text-xl text-accent" />
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
                className="rounded-lg border border-accent/35 bg-accent px-4 py-2 font-semibold text-black transition hover:brightness-110"
              >
                Retry
              </button>
            </div>
          )}

          {!isProfileLoading && profile && (
            <div className="space-y-5">
              <div className="rounded-2xl border border-accent/25 bg-accent/10 p-4 md:p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-white/70">
                  Total Balance
                </p>
                <p className="mt-2 text-2xl font-bold text-accent md:text-4xl">
                  {profile?.wallet?.balance || "0.00"} USD
                </p>
              </div>

              {isDepositPage ? (
                <motion.div
                  key="deposit-confirmation"
                  initial={slideIn("right", null).initial}
                  whileInView={slideIn("right", 1 * 2).animate}
                  className="rounded-2xl border border-white/10 bg-[#0d0f10] p-4 shadow-[0_24px_60px_-35px_rgba(0,0,0,0.95)] md:p-6"
                >
                  <div className="space-y-3 rounded-xl border border-white/10 bg-[#121518] p-4">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-white/65">
                        ETH Address
                      </p>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(profile?.settings?.erc_address)}
                        className="rounded-md border border-accent/25 bg-accent/10 p-1.5 text-accent transition hover:bg-accent/20"
                      >
                        <BiCopy className="cursor-pointer" />
                      </button>
                    </div>
                    <p className="break-all text-sm text-accent">
                      {profile?.settings?.erc_address || "0x2835a3a46a193946b395d877a29dc3bc51bd49"}
                    </p>

                    <div className="mt-2 flex items-start justify-between gap-2">
                      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-white/65">
                        TRC20 Address
                      </p>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(profile?.settings?.trc_address)}
                        className="rounded-md border border-accent/25 bg-accent/10 p-1.5 text-accent transition hover:bg-accent/20"
                      >
                        <BiCopy className="cursor-pointer" />
                      </button>
                    </div>
                    <p className="break-all text-sm text-accent">
                      {profile?.settings?.trc_address || "TTXWm4XjoRXem2Ce1KeevUcBrzK2Whpv61"}
                    </p>
                  </div>

                  <div className="mt-4 rounded-xl border border-white/10 bg-[#121518] px-4 py-3 text-center">
                    <p className="text-xs uppercase tracking-[0.08em] text-white/65">Deposit Amount</p>
                    <p className="mt-1 text-lg font-semibold text-white">
                      {amount || "N/A"} USD
                    </p>
                  </div>

                  <div className="mt-5 mb-6">
                    <label className="mb-2 block text-sm font-semibold text-white/85">
                      Deposit Receipt
                    </label>
                    {receipt && (
                      <div className="mb-3 overflow-hidden rounded-xl border border-accent/25 bg-[#101417]">
                        <img
                          src={
                            typeof receipt === "string"
                              ? receipt
                              : URL.createObjectURL(receipt)
                          }
                          alt="Receipt Preview"
                          className="h-56 w-full object-cover md:h-72"
                        />
                        <div className="flex items-center justify-between gap-2 border-t border-white/10 px-3 py-2">
                          <p className="truncate text-xs text-white/70">
                            {typeof receipt === "string" ? "Uploaded receipt" : receipt.name}
                          </p>
                          <button
                            type="button"
                            onClick={() => setReceipt(null)}
                            className="rounded-md border border-white/15 bg-[#171b1e] px-2 py-1 text-[11px] font-semibold text-white/75 transition hover:border-accent/30 hover:text-accent"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleReceiptUpload}
                      className="block w-full rounded-lg border border-white/15 bg-[#14181b] p-2.5 text-sm text-white file:mr-3 file:rounded-md file:border-0 file:bg-accent file:px-3 file:py-1.5 file:font-semibold file:text-black"
                    />
                  </div>

                  <button
                    onClick={handleConfirmDeposit}
                    disabled={isSubmitting || !canConfirmDeposit}
                    className={`flex w-full items-center justify-center rounded-lg border py-3 font-semibold transition ${
                      isSubmitting || !canConfirmDeposit
                        ? "cursor-not-allowed border-white/15 bg-[#1a1d20] text-white/45"
                        : "border-accent/35 bg-accent text-black hover:brightness-110"
                    }`}
                  >
                    {isSubmitting ? <Loader /> : "Confirm Deposit"}
                  </button>
                </motion.div>
              ) : (
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-[#0d0f10] p-2 md:inline-grid md:grid-cols-2 md:gap-3">
                    <button
                      type="button"
                      onClick={() => handleTabChange("deposit")}
                      className={`rounded-xl px-3 py-2 text-xs font-semibold transition md:px-4 md:py-2.5 md:text-sm ${activeTab === "deposit"
                        ? "border border-accent/35 bg-accent text-black"
                        : "border border-white/10 bg-[#15181b] text-white/80 hover:border-accent/30 hover:text-accent"}`}
                    >
                      Deposit Now
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTabChange("history")}
                      className={`rounded-xl px-3 py-2 text-xs font-semibold transition md:px-4 md:py-2.5 md:text-sm ${activeTab === "history"
                        ? "border border-accent/35 bg-accent text-black"
                        : "border border-white/10 bg-[#15181b] text-white/80 hover:border-accent/30 hover:text-accent"}`}
                    >
                      Deposit History
                    </button>
                  </div>

                  {activeTab === "deposit" && (
                    <motion.div
                      key="deposit"
                      initial={slideIn("right", null).initial}
                      whileInView={slideIn("right", 1 * 2).animate}
                      className="rounded-2xl border border-white/10 bg-[#0d0f10] p-4 shadow-[0_24px_60px_-35px_rgba(0,0,0,0.95)] md:p-6"
                    >
                      <div className="mb-6 grid grid-cols-3 gap-3 md:hidden">
                        {[10, 50, 100].map((value) => (
                          <button
                            key={value}
                            onClick={() => handlePresetAmount(value)}
                            className={`rounded-xl border p-3 text-left transition ${Number(amount) === value
                              ? "border-accent/35 bg-accent text-black"
                              : "border-white/10 bg-[#15181b] text-white hover:border-accent/30 hover:text-accent"}`}
                          >
                            <p className="text-[11px] uppercase tracking-[0.08em]">USD</p>
                            <p className="text-base font-semibold">{value}.00</p>
                          </button>
                        ))}
                      </div>
                      <div className="mb-6 hidden grid-cols-4 gap-3 md:grid">
                        {[10, 25, 50, 100, 200, 500, 1000, 2000].map((value) => (
                          <button
                            key={value}
                            onClick={() => handlePresetAmount(value)}
                            className={`rounded-xl border p-3 text-left transition ${Number(amount) === value
                              ? "border-accent/35 bg-accent text-black"
                              : "border-white/10 bg-[#15181b] text-white hover:border-accent/30 hover:text-accent"}`}
                          >
                            <p className="text-[11px] uppercase tracking-[0.08em]">USD</p>
                            <p className="text-base font-semibold">{value}.00</p>
                          </button>
                        ))}
                      </div>

                      <div className="mb-6">
                        <label
                          htmlFor="amount"
                          className="block text-sm font-semibold text-white/85"
                        >
                          Deposit Amount
                        </label>
                        <input
                          type="number"
                          id="amount"
                          value={amount}
                          min="0"
                          step="0.01"
                          onChange={(e) => setAmount(e.target.value)}
                          placeholder="Enter amount"
                          className="mt-2 w-full rounded-lg border border-white/15 bg-[#14181b] px-3 py-2.5 text-sm text-white placeholder:text-white/45 focus:outline-none focus:ring-2 focus:ring-accent/45"
                          required
                        />
                      </div>

                      <button
                        onClick={() => setIsDepositPage(true)}
                        disabled={!amount || amount <= 0}
                        className={`w-full rounded-lg border py-3 font-semibold transition ${
                          !amount || amount <= 0
                            ? "cursor-not-allowed border-white/15 bg-[#1a1d20] text-white/45"
                            : "border-accent/35 bg-accent text-black hover:brightness-110"
                        }`}
                      >
                        Next
                      </button>
                    </motion.div>
                  )}

                  {activeTab === "history" && (
                    <motion.div
                      key="history"
                      initial={slideIn("left", null).initial}
                      whileInView={slideIn("left", 1 * 2).animate}
                      className="space-y-3"
                    >
                      {deposits.length > 0 ? (
                        deposits.map((transaction) => {
                          const label = normalizedStatus(transaction.status);
                          return (
                            <div
                              key={transaction.id}
                              className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#101214] via-[#121417] to-[#0c0d0f] p-4 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.95)]"
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div className="min-w-0">
                                  <p className="text-sm font-semibold text-white md:text-base">
                                    Deposit
                                  </p>
                                  <p className="truncate text-xs text-white/60 md:text-sm">
                                    {transaction.transaction_id || transaction.date}
                                  </p>
                                  <p className="mt-2 text-lg font-bold text-accent md:text-2xl">
                                    {transaction.amount} USD
                                  </p>
                                </div>
                                <span
                                  className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${statusClasses[label]}`}
                                >
                                  {label}
                                </span>
                              </div>
                              <div className="mt-3 flex items-center gap-2 text-[11px] text-white/55 md:text-xs">
                                <IoTimeOutline className="text-white/60" />
                                <span>
                                  {new Date(
                                    transaction.created_at,
                                  ).toLocaleDateString("en-US", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  })}{" "}
                                  at{" "}
                                  {new Date(
                                    transaction.created_at,
                                  ).toLocaleTimeString("en-US", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true,
                                  })}
                                </span>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="rounded-2xl border border-white/10 bg-[#0d0f10] py-10 text-center">
                          <IoCheckmarkCircle className="mx-auto mb-3 text-3xl text-accent/70" />
                          <p className="text-sm text-white/70">
                            No deposit history available.
                          </p>
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
      </motion.div>
    );
};

export default Deposit;
