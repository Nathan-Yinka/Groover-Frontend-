import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IoGiftOutline, IoClose, IoWalletOutline } from "react-icons/io5";
import { AiOutlineLoading } from "react-icons/ai";
import PropTypes from "prop-types";
import bonusService from "../../../app/service/bonus.service";
import authService from "../../../app/service/auth.service";
import { formatCurrencyWithCode } from "../../../utils/currency";

const BonusPrompt = ({ onProfileRefresh }) => {
    const [bonus, setBonus] = useState(null);
    const [isChecking, setIsChecking] = useState(false);
    const [isResponding, setIsResponding] = useState("");
    const [dismissedId, setDismissedId] = useState(null);

    const checkPendingBonus = async () => {
        if (isChecking || isResponding) return;
        setIsChecking(true);
        const response = await bonusService.fetchPendingBonus();
        if (response.success) {
            const nextBonus = response.data;
            if (nextBonus?.id && nextBonus.id !== dismissedId) {
                setBonus(nextBonus);
            }
            if (!nextBonus) {
                setBonus(null);
            }
        }
        setIsChecking(false);
    };

    useEffect(() => {
        checkPendingBonus();
        const interval = setInterval(checkPendingBonus, 30000);
        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dismissedId, isResponding]);

    const handleDismiss = () => {
        setDismissedId(bonus?.id);
        setBonus(null);
    };

    const handleResponse = async (action) => {
        if (!bonus?.id) return;
        setIsResponding(action);
        const response = await bonusService.respondToBonus(bonus.id, action);
        if (response.success) {
            setBonus(null);
            setDismissedId(null);
            if (action === "accept") {
                const profileResponse = await authService.fetchProfile();
                if (profileResponse.success && onProfileRefresh) {
                    onProfileRefresh(profileResponse.data);
                }
            }
            setTimeout(checkPendingBonus, 1000);
        }
        setIsResponding("");
    };

    return (
        <AnimatePresence>
            {bonus && (
                <motion.div
                    className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/45 px-4 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="w-full max-w-md overflow-hidden rounded-3xl border border-white/70 bg-white shadow-[0_30px_90px_-35px_rgba(26,20,18,0.65)]"
                        initial={{ y: 28, scale: 0.96, opacity: 0 }}
                        animate={{ y: 0, scale: 1, opacity: 1 }}
                        exit={{ y: 20, scale: 0.96, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 260, damping: 24 }}
                    >
                        <div className="relative overflow-hidden bg-[#F7F6F0] px-6 py-6">
                            <button
                                type="button"
                                onClick={handleDismiss}
                                className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-[#e5ded3] bg-white text-[#333333]/60 transition hover:text-[#333333]"
                                aria-label="Dismiss bonus"
                            >
                                <IoClose />
                            </button>
                            <div className="flex items-center gap-4">
                                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#EC6345] text-3xl text-white shadow-lg shadow-[#EC6345]/25">
                                    <IoGiftOutline />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#EC6345]">
                                        Bonus assigned
                                    </p>
                                    <h2 className="mt-1 text-2xl font-black tracking-tight text-[#333333]">
                                        {formatCurrencyWithCode(bonus.amount)}
                                    </h2>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-5 px-6 py-6">
                            <div className="rounded-2xl border border-[#EC6345]/15 bg-[#fffaf8] p-4">
                                <div className="mb-2 flex items-center gap-2 text-sm font-bold text-[#333333]">
                                    <IoWalletOutline className="text-[#EC6345]" />
                                    Wallet credit pending
                                </div>
                                <p className="text-sm leading-6 text-[#333333]/70">
                                    The system has assigned a bonus of{" "}
                                    <span className="font-bold text-[#333333]">
                                        {formatCurrencyWithCode(bonus.amount)}
                                    </span>{" "}
                                    to you. Accept it to add the funds to your wallet, or reject it if you do not want this bonus.
                                </p>
                                {bonus.reason && (
                                    <p className="mt-3 rounded-xl bg-white p-3 text-xs font-medium text-[#333333]/65">
                                        {bonus.reason}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    disabled={Boolean(isResponding)}
                                    onClick={() => handleResponse("reject")}
                                    className="flex h-12 items-center justify-center rounded-xl border border-[#e5ded3] bg-white text-sm font-black uppercase tracking-widest text-[#333333]/70 transition hover:bg-[#F7F6F0] disabled:opacity-60"
                                >
                                    {isResponding === "reject" && (
                                        <AiOutlineLoading className="mr-2 animate-spin" />
                                    )}
                                    Reject
                                </button>
                                <button
                                    type="button"
                                    disabled={Boolean(isResponding)}
                                    onClick={() => handleResponse("accept")}
                                    className="flex h-12 items-center justify-center rounded-xl bg-[#EC6345] text-sm font-black uppercase tracking-widest text-white shadow-lg shadow-[#EC6345]/20 transition hover:bg-[#d95539] disabled:opacity-60"
                                >
                                    {isResponding === "accept" && (
                                        <AiOutlineLoading className="mr-2 animate-spin" />
                                    )}
                                    Accept
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

BonusPrompt.propTypes = {
    onProfileRefresh: PropTypes.func,
};

export default BonusPrompt;
