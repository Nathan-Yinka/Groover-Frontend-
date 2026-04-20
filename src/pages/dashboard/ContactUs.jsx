import {
  FaHeadset,
  FaWhatsapp,
  FaTelegramPlane,
  FaCommentDots,
} from "react-icons/fa";
import logo from "../../assets/logo.svg";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { useEffect } from "react";
import authService from "../../app/service/auth.service";
import Loader from "./components/Load";
import ErrorHandler from "../../app/ErrorHandler";
import {
  fetchSettingsFailure,
  fetchSettingsStart,
  fetchSettingsSuccess,
} from "../../app/slice/auth.slice";
import BackButton from "./components/BackButton";
import BottomNavMobile from "./components/BottomNavMobile";

const ContactUs = () => {
  const settings = useSelector((state) => state.auth.settings);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchSettings = async () => {
      if (!settings) {
        dispatch(fetchSettingsStart());
        try {
          const response = await authService.fetchSettings();
          if (response.success) {
            dispatch(fetchSettingsSuccess(response.data));
          } else {
            dispatch(
              fetchSettingsFailure(
                response.message || "Failed to load profile.",
              ),
            );
            ErrorHandler(response.message);
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
          dispatch(
            fetchSettingsFailure(
              "An error occurred while fetching your profile.",
            ),
          );
          // toast.error("An error occurred while fetching your profile.");
          ErrorHandler(error);
        }
      }
    };

    fetchSettings();
  }, [dispatch, settings]);

  const handleNavigation = (url) => {
    if (url) {
      window.open(url, "_blank"); // Open the URL in a new tab
    } else {
      toast.error("Unable to navigate. URL is invalid."); // Provide user feedback if URL is invalid
    }
  };

  if (!settings) {
    return <Loader />;
  }

  const whatsappNumber = settings?.whatsapp_contact?.replace(/[^\d]/g, "");
  const telegramUsername = settings?.telegram_username?.replace("@", "");

  return (
    <div className="min-h-screen bg-[#F7F6F0] text-[#333333]">
      <div className="w-full space-y-5 px-3 py-4 pb-24 md:space-y-6 md:px-8 md:py-6 md:pb-8">
        <div className="rounded-[18px] border border-[#e5ded3] bg-white p-4 shadow-[0_20px_45px_-38px_rgba(39,39,39,0.6)] md:p-6">
          <BackButton className="mb-5" />
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                Contact Support
              </h1>
              <p className="text-xs text-[#605E5E] md:text-sm">
                Fast help for services, account issues, and payout questions.
              </p>
            </div>
            <div className="hidden rounded-xl border border-[#EC6345]/25 bg-[#EC6345]/10 p-2.5 md:grid md:place-items-center">
              <FaHeadset className="text-xl text-[#EC6345]" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#e5ded3] bg-white p-5 text-center shadow-[0_20px_45px_-38px_rgba(39,39,39,0.55)] md:p-8">
          <img
            src={logo}
            alt="Groover Logo"
            className="mx-auto mb-4 h-auto w-36 md:w-44"
          />
          <h2 className="text-xl font-bold md:text-2xl">
            Welcome to Customer Service
          </h2>
          <p className="mx-auto mt-2 max-w-[640px] text-sm text-[#605E5E] md:text-base">
            We are here to support your services, inquiries, and issues 24/7.
          </p>
        </div>

        <div className="rounded-[18px] border border-[#e5ded3] bg-white p-4 shadow-[0_20px_45px_-38px_rgba(39,39,39,0.6)] md:p-6">
          <h3 className="mb-4 text-lg font-semibold text-[#333333] md:text-xl">
            Choose a Support Option
          </h3>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <button
              onClick={() =>
                settings?.online_chat_url &&
                handleNavigation(settings.online_chat_url)
              }
              className="rounded-xl border border-[#EC6345]/30 bg-[#EC6345] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#BA5225] md:text-base"
            >
              <span className="inline-flex items-center gap-2">
                <FaCommentDots />
                Online Chat
              </span>
            </button>

            <button
              onClick={() => {
                if (whatsappNumber) {
                  handleNavigation(`https://wa.me/${whatsappNumber}`);
                } else {
                  toast.error("WhatsApp contact is missing or invalid.");
                }
              }}
              className="rounded-xl border border-[#e5ded3] bg-[#fbfaf6] px-4 py-3 text-sm font-semibold text-[#333333] transition hover:border-[#EC6345]/35 hover:text-[#EC6345] md:text-base"
            >
              <span className="inline-flex items-center gap-2">
                <FaWhatsapp />
                WhatsApp Chat
              </span>
            </button>

            <button
              onClick={() => {
                if (telegramUsername) {
                  handleNavigation(`https://t.me/${telegramUsername}`);
                } else {
                  toast.error("Telegram username is missing or invalid.");
                }
              }}
              className="rounded-xl border border-[#e5ded3] bg-[#fbfaf6] px-4 py-3 text-sm font-semibold text-[#333333] transition hover:border-[#EC6345]/35 hover:text-[#EC6345] md:text-base"
            >
              <span className="inline-flex items-center gap-2">
                <FaTelegramPlane />
                Telegram Chat
              </span>
            </button>
          </div>
        </div>
      </div>
      <BottomNavMobile className="md:hidden" />
    </div>
  );
};

export default ContactUs;


