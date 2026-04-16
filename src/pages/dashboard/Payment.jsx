import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { toast } from "sonner"; // Toast for notifications
import ErrorHandler from "../../app/ErrorHandler";
import BackButton from "./components/BackButton";

const Payment = () => {
  const dispatch = useDispatch();
  const { data, isLoading } = useSelector((state) => state.payments);

  // Fetch payment method on component mount, only if not already fetched
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
          toast.error("Failed to fetch payment data.");
        }
      };

      fetchPaymentData();
    }
  }, [dispatch, data]);

  // Handle input changes (for wallet and exchange)
  const handleInputChange = (field, value) => {
    dispatch(fetchPaymentSuccess({ ...data, [field]: value }));
  };

  // Handle confirm button click with validation
  const handleConfirm = async () => {
    if (!data?.wallet || !data?.exchange) {
      toast.error("Both Wallet Address and Exchange fields are required.");
      return;
    }

    const payload = {
      wallet: data.wallet,
      exchange: data.exchange,
    };

    dispatch(postPaymentStart());
    try {
      const response = await paymentsService.postPaymentMethod(
        dispatch,
        payload,
      );
      if (response.success) {
        dispatch(postPaymentSuccess("Payment details updated successfully!"));
        toast.success("Payment details updated successfully!");
      }
    } catch (error) {
      console.error("Failed to post payment data:", error);
      dispatch(postPaymentFailure("Failed to update payment details."));
      // toast.error("Failed to update payment details.");
      ErrorHandler(error);
    }
  };

  // Show the page loader while fetching
  if (isLoading && !data) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-[#060606] px-3 py-4 text-white md:px-8 md:py-6">
      <BackButton className="mb-6" />

      <div className="space-y-4 rounded-2xl border border-white/10 bg-[#0d0f10] p-5 shadow-[0_24px_60px_-36px_rgba(0,0,0,0.95)] md:p-6">
        <p className="mb-4 rounded-lg border border-accent/25 bg-accent/10 p-4 text-sm text-accent md:text-base">
          Dear user, for your security please do not enter your bank details.
        </p>
        <div>
          <label className="text-sm font-semibold text-white/85">Name</label>
          <input
            type="text"
            value={data?.name || ""}
            readOnly
            className="mt-1 w-full cursor-not-allowed rounded-lg border border-white/10 bg-[#13171a] p-2.5 text-sm text-white/70"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-white/85">Phone Number</label>
          <input
            type="text"
            value={data?.phone_number || ""}
            readOnly
            className="mt-1 w-full cursor-not-allowed rounded-lg border border-white/10 bg-[#13171a] p-2.5 text-sm text-white/70"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-white/85">Email Address</label>
          <input
            type="email"
            value={data?.email_address || ""}
            readOnly
            className="mt-1 w-full cursor-not-allowed rounded-lg border border-white/10 bg-[#13171a] p-2.5 text-sm text-white/70"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-white/85">Wallet Address</label>
          <input
            type="text"
            value={data?.wallet || ""}
            onChange={(e) => handleInputChange("wallet", e.target.value)}
            className="mt-1 w-full rounded-lg border border-white/15 bg-[#14181b] p-2.5 text-sm text-white placeholder:text-white/45 focus:outline-none focus:ring-2 focus:ring-accent/45"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-white/85">Exchange</label>
          <input
            type="text"
            value={data?.exchange || ""}
            onChange={(e) => handleInputChange("exchange", e.target.value)}
            className="mt-1 w-full rounded-lg border border-white/15 bg-[#14181b] p-2.5 text-sm text-white placeholder:text-white/45 focus:outline-none focus:ring-2 focus:ring-accent/45"
          />
        </div>
      </div>

      <button
        onClick={handleConfirm}
        className="mt-6 mb-52 flex w-full items-center justify-center rounded-lg border border-accent/35 bg-accent py-3 font-semibold text-black transition hover:brightness-110 md:mb-2"
        disabled={isLoading}
      >
        {isLoading ? <ButtonLoader /> : "Confirm"}
      </button>
    </div>
  );
};

export default Payment;
