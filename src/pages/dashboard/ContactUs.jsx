import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { 
  RiCustomerService2Line, 
  RiWhatsappLine, 
  RiTelegramLine, 
  RiChatSmile3Line,
  RiCheckDoubleLine
} from "react-icons/ri";
import logo from "../../assets/logo.svg";
import { showAlert } from "../../app/slice/ui.slice";
import authService from "../../app/service/auth.service";
import Loader from "./components/Load";
import ErrorHandler from "../../app/ErrorHandler";
import {
  fetchSettingsFailure,
  fetchSettingsStart,
  fetchSettingsSuccess,
} from "../../app/slice/auth.slice";
import BackButton from "./components/BackButton";

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
            dispatch(fetchSettingsFailure(response.message || "Failed to load profile."));
            ErrorHandler(response.message);
          }
        } catch (error) {
          dispatch(fetchSettingsFailure("An error occurred while fetching your profile."));
          ErrorHandler(error);
        }
      }
    };
    fetchSettings();
  }, [dispatch, settings]);

  const handleNavigation = (url) => {
    if (url) {
      window.open(url, "_blank");
    } else {
      dispatch(showAlert({
        type: 'error',
        title: 'Communication Error',
        message: "The target sector link is currently invalid or disconnected."
      }));
    }
  };

  if (!settings) {
    return <Loader />;
  }

  const whatsappNumber = settings?.whatsapp_contact?.replace(/[^\d]/g, "");
  const telegramUsername = settings?.telegram_username?.replace("@", "");

  return (
    <div className="min-h-screen bg-[#F7F6F0] text-[#333333] overflow-x-hidden">
      <div className="mx-auto max-w-[1600px] border-x border-[#e5ded3] min-h-screen bg-white md:bg-[#F7F6F0]/50 shadow-2xl">
        
        {/* PREMIUM SUPPORT HEADER */}
        <section className="relative overflow-hidden bg-[#120d0c] px-6 py-12 md:rounded-b-[40px] md:py-20 lg:py-24">
          <div className="absolute inset-0 z-0 opacity-30">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(236,99,69,0.2)_0%,transparent_50%)]" />
            <div className="absolute inset-0 bg-[grid-white/[0.04]_bg-[size:40px_40px]" />
          </div>
          <div className="relative z-10 flex flex-col items-center text-center">
            <BackButton className="mb-8" dark />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mb-4 flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-md">
              <RiCustomerService2Line className="text-[#EC6345]" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">Support Terminal</span>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-4 text-4xl font-bold tracking-tighter text-white md:text-6xl">
              Contact <span className="text-[#EC6345]">Support</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="max-w-[500px] text-xs font-medium leading-relaxed text-white/40 md:text-sm lg:text-base">
              Fast help for services, account issues, and payout questions.
            </motion.p>
          </div>
        </section>

        <main className="px-4 py-10 pb-32 md:px-8 lg:px-20">
          {/* WELCOME SECTION */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="group relative mb-12 overflow-hidden rounded-[32px] border border-[#e5ded3] bg-white p-10 text-center shadow-xl md:p-14"
          >
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#EC6345]/5 blur-[80px] pointer-events-none" />
            <img src={logo} alt="Groover Logo" className="mx-auto mb-8 h-auto w-36 md:w-44 transition-transform group-hover:scale-105 duration-700" />
            <h2 className="mb-3 text-xl font-bold md:text-4xl text-[#120d0c] tracking-tight">Welcome to Customer Service</h2>
            <p className="mx-auto max-w-[640px] text-sm text-[#5f5b57] md:text-lg leading-relaxed font-medium">
              We are here to support your services, inquiries, and issues 24/7.
            </p>
          </motion.div>

          {/* SUPPORT OPTIONS GRID */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
               <div className="h-px flex-1 bg-[#e5ded3]" />
               <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#a56657]">Choose a Support Option</h3>
               <div className="h-px flex-1 bg-[#e5ded3]" />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 pb-8">
              {[
                {
                  id: 'online',
                  label: "Online Chat",
                  icon: RiChatSmile3Line,
                  color: "bg-[#120d0c] text-white border-transparent",
                  iconColor: "text-[#EC6345]",
                  onClick: () => settings?.online_chat_url && handleNavigation(settings.online_chat_url)
                },
                {
                  id: 'whatsapp',
                  label: "WhatsApp Chat",
                  icon: RiWhatsappLine,
                  color: "bg-white text-[#120d0c] border-[#e5ded3]",
                  iconColor: "text-green-500",
                  onClick: () => whatsappNumber ? handleNavigation(`https://wa.me/${whatsappNumber}`) : dispatch(showAlert({ type: 'error', title: 'Link Missing', message: "WhatsApp contact is disconnected." }))
                },
                {
                  id: 'telegram',
                  label: "Telegram Chat",
                  icon: RiTelegramLine,
                  color: "bg-white text-[#120d0c] border-[#e5ded3]",
                  iconColor: "text-blue-500",
                  onClick: () => telegramUsername ? handleNavigation(`https://t.me/${telegramUsername}`) : dispatch(showAlert({ type: 'error', title: 'Link Missing', message: "Telegram contact is disconnected." }))
                }
              ].map((opt, i) => (
                <motion.div
                  key={opt.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={opt.onClick}
                  className={`group relative overflow-hidden rounded-[32px] border ${opt.color} p-8 shadow-sm transition-all hover:-translate-y-2 hover:shadow-2xl cursor-pointer`}
                >
                  <div className="flex flex-col items-center gap-4 text-center">
                    <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-black/5 text-3xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 ${opt.iconColor}`}>
                      <opt.icon />
                    </div>
                    <span className="text-sm font-black uppercase tracking-widest">{opt.label}</span>
                  </div>
                  <RiCheckDoubleLine className="absolute bottom-4 right-4 text-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                </motion.div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ContactUs;
