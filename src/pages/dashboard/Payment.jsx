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
    <div className="min-h-screen bg-[#F7F6F0] px-3 py-4 text-[#333333] md:px-8 md:py-6">
      <BackButton className="mb-6" />

      <div className="space-y-4 rounded-[18px] border border-[#e5ded3] bg-white p-5 shadow-[0_20px_45px_-38px_rgba(39,39,39,0.55)] md:p-6">
        <p className="mb-4 rounded-lg border border-[#EC6345]/25 bg-[#EC6345]/10 p-4 text-sm text-[#EC6345] md:text-base">
          Dear user, for your security please do not enter your bank details.
        </p>
        <div>
          <label className="text-sm font-semibold text-[#4a4642]">Name</label>
          <input
            type="text"
            value={data?.name || ""}
            readOnly
            className="mt-1 w-full cursor-not-allowed rounded-lg border border-[#e5ded3] bg-[#fbfaf6] p-2.5 text-sm text-[#605E5E]"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-[#4a4642]">Phone Number</label>
          <input
            type="text"
            value={data?.phone_number || ""}
            readOnly
            className="mt-1 w-full cursor-not-allowed rounded-lg border border-[#e5ded3] bg-[#fbfaf6] p-2.5 text-sm text-[#605E5E]"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-[#4a4642]">Email Address</label>
          <input
            type="email"
            value={data?.email_address || ""}
            readOnly
            className="mt-1 w-full cursor-not-allowed rounded-lg border border-[#e5ded3] bg-[#fbfaf6] p-2.5 text-sm text-[#605E5E]"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-[#4a4642]">Wallet Address</label>
          <input
            type="text"
            value={data?.wallet || ""}
            onChange={(e) => handleInputChange("wallet", e.target.value)}
            className="mt-1 w-full rounded-lg border border-[#e5ded3] bg-white p-2.5 text-sm text-[#333333] placeholder:text-[#8b8580] focus:outline-none focus:ring-2 focus:ring-[#EC6345]/30"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-[#4a4642]">Exchange</label>
          <input
            type="text"
            value={data?.exchange || ""}
            onChange={(e) => handleInputChange("exchange", e.target.value)}
            className="mt-1 w-full rounded-lg border border-[#e5ded3] bg-white p-2.5 text-sm text-[#333333] placeholder:text-[#8b8580] focus:outline-none focus:ring-2 focus:ring-[#EC6345]/30"
          />
        </div>
      </div>

      <button
        onClick={handleConfirm}
        className="mt-6 mb-52 flex w-full items-center justify-center rounded-lg border border-[#EC6345]/35 bg-[#EC6345] py-3 font-semibold text-white transition hover:bg-[#BA5225] md:mb-2"
        disabled={isLoading}
      >
        {isLoading ? <ButtonLoader /> : "Confirm"}
      </button>
    </div>
  );
};

export default Payment;


