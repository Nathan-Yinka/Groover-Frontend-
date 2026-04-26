import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import Loader from "./components/Load";
import ButtonLoader from "./components/loader";
import {
  fetchPaymentStart,
  fetchPaymentSuccess,
  fetchPaymentFailure,
  postPaymentStart,
  postPaymentSuccess,
  postPaymentFailure,
} from "../../app/slice/payments.slice";
import paymentsService from "../../app/service/payments.service";
import { showAlert } from "../../app/slice/ui.slice";
import ErrorHandler from "../../app/ErrorHandler";
import BackButton from "./components/BackButton";
import BottomNavMobile from "./components/BottomNavMobile";
import { IoShieldCheckmarkOutline, IoWalletOutline, IoInformationCircleOutline } from "react-icons/io5";

const Payment = () => {
  const dispatch = useDispatch();
  const { data, isLoading } = useSelector((state) => state.payments);

  useEffect(() => {
    if (!data) {
      const fetchPaymentData = async () => {
        dispatch(fetchPaymentStart());
        try {
          const response = await paymentsService.fetchPaymentMethod(dispatch);
          if (response.success) {
            dispatch(fetchPaymentSuccess(response.data));
          }
        } catch (error) {
          console.error("Failed to fetch payment data:", error);
          dispatch(fetchPaymentFailure("Failed to fetch payment data."));
          dispatch(showAlert({
            type: 'error',
            title: 'Sync Error',
            message: "Failed to establish secure connection to payment gateway."
          }));
        }
      };
      fetchPaymentData();
    }
  }, [dispatch, data]);

  const handleInputChange = (field, value) => {
    dispatch(fetchPaymentSuccess({ ...data, [field]: value }));
  };

  const handleConfirm = async () => {
    if (!data?.wallet || !data?.exchange) {
      dispatch(showAlert({
        type: 'error',
        title: 'Validation Failed',
        message: "Wallet Address and Exchange terminal fields are mandatory."
      }));
      return;
    }

    const payload = {
      wallet: data.wallet,
      exchange: data.exchange,
    };

    dispatch(postPaymentStart());
    try {
      const response = await paymentsService.postPaymentMethod(dispatch, payload);
      if (response.success) {
        dispatch(postPaymentSuccess("Payment details updated successfully!"));
        dispatch(showAlert({
          type: 'success',
          title: 'Mission Success',
          message: "Secure wallet parameters updated and synchronized."
        }));
      }
    } catch (error) {
      console.error("Failed to post payment data:", error);
      dispatch(postPaymentFailure("Failed to update payment details."));
      ErrorHandler(error);
    }
  };

  if (isLoading && !data) return <Loader />;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
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
                  Payments
                </h1>
                <p className="mt-2 text-sm font-medium text-[#605E5E]">
                  Configure your digital asset reception terminals.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* SECURITY BRIEFING */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-start gap-4 rounded-[28px] border border-amber-500/10 bg-amber-50/30 p-5 md:p-6"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
            <IoShieldCheckmarkOutline className="text-xl" />
          </div>
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-amber-600/60 mb-1">Security Directive</p>
            <p className="text-xs md:text-sm font-medium text-[#605E5E] leading-relaxed italic">
              For your account security, only digital asset addresses (USDT/ETH) are accepted. <span className="text-amber-600 font-bold uppercase tracking-tight">Do not enter traditional bank details</span> in these terminals.
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-8">
          {/* MAIN CONFIGURATION HUB */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="v2-card p-6 md:p-10 space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* READ-ONLY SECTOR */}
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#605E5E]/60 ml-1">Identity Baseline</label>
                  <div className="mt-2 space-y-4">
                    {[
                      { label: "Full Name", value: data?.name },
                      { label: "Sync Phone", value: data?.phone_number },
                      { label: "Secure Email", value: data?.email_address }
                    ].map((field, i) => (
                      <div key={i} className="rounded-2xl border border-[#e5ded3] bg-[#fbfaf6] px-5 py-3.5 opacity-60">
                        <p className="text-[8px] font-bold text-[#605E5E]/50 uppercase tracking-widest">{field.label}</p>
                        <p className="mt-1 text-sm font-black text-[#333333] truncate">{field.value || "---"}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ACTION SECTOR */}
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#605E5E]/60 ml-1">Configuration Terminals</label>
                  <div className="mt-2 space-y-4">
                    <div className="space-y-2">
                       <p className="text-[9px] font-black text-[#EC6345] uppercase tracking-widest ml-1">Digital Wallet Address</p>
                       <input
                        type="text"
                        value={data?.wallet || ""}
                        onChange={(e) => handleInputChange("wallet", e.target.value)}
                        placeholder="Enter USDT/ETH Address"
                        className="w-full rounded-2xl border border-[#e5ded3] bg-[#fbfaf6] px-6 py-4 text-sm font-bold text-[#333333] placeholder:text-[#605E5E]/30 focus:outline-none focus:border-[#EC6345]/40 transition-all font-mono"
                      />
                    </div>
                    <div className="space-y-2">
                       <p className="text-[9px] font-black text-[#EC6345] uppercase tracking-widest ml-1">Exchange Platform</p>
                       <input
                        type="text"
                        value={data?.exchange || ""}
                        onChange={(e) => handleInputChange("exchange", e.target.value)}
                        placeholder="e.g. Binance, OKX, Coinbase"
                        className="w-full rounded-2xl border border-[#e5ded3] bg-[#fbfaf6] px-6 py-4 text-sm font-bold text-[#333333] placeholder:text-[#605E5E]/30 focus:outline-none focus:border-[#EC6345]/40 transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleConfirm}
                    disabled={isLoading}
                    className="flex w-full items-center justify-center rounded-[24px] bg-[#333333] py-5 text-[11px] font-black uppercase tracking-[0.2em] text-white shadow-xl shadow-black/10 transition-all hover:bg-black disabled:opacity-40"
                  >
                    {isLoading ? <ButtonLoader /> : "Authorize Configuration"}
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

      </div>
      <BottomNavMobile />
    </motion.div>
  );
};

export default Payment;
