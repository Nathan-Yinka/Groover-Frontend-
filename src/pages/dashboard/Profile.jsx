import { useEffect } from "react";
import {
  BiUserCircle,
  BiUser,
  BiCopy,
  BiChevronRight,
  BiCreditCard,
  BiLogOutCircle,
} from "react-icons/bi";
import { GiCrown } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { fadeIn, slideIn } from "../../motion";
import { toast } from "sonner";
import BottomNavMobile from "./components/BottomNavMobile";
import authService from "../../app/service/auth.service";
import { logout } from "../../app/slice/auth.slice";
import { login } from "../../constants/app.routes";
import { useDispatch, useSelector } from "react-redux";
import Loader from "./components/Load";
import {
  fetchProfileStart,
  fetchProfileSuccess,
  fetchProfileFailure,
} from "../../app/slice/profile.slice";
import { formatCurrencyWithCode } from "../../utils/currency";

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const profile = useSelector((state) => state.profile.user);
  const isLoading = useSelector((state) => state.profile.isLoading);
  const displayName =
    [profile?.first_name, profile?.last_name].filter(Boolean).join(" ").trim()
    || profile?.username
    || "Artist";

  useEffect(() => {
    const fetchProfile = async () => {
      if (!profile) {
        dispatch(fetchProfileStart());
        try {
          const response = await authService.fetchProfile();
          if (response.success) {
            dispatch(fetchProfileSuccess(response.data));
          } else {
            dispatch(
              fetchProfileFailure(
                response.message || "Failed to load profile.",
              ),
            );
            toast.error(response.message || "Failed to load profile.");
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
          dispatch(
            fetchProfileFailure(
              "An error occurred while fetching your profile.",
            ),
          );
          toast.error("An error occurred while fetching your profile.");
        }
      }
    };

    fetchProfile();
  }, [dispatch, profile]);

  const copyReferralCode = () => {
    if (profile?.referral_code) {
      navigator.clipboard.writeText(profile.referral_code);
      toast.success("Referral code copied!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleLogout = () => {
    authService.logout();
    dispatch(logout());
    navigate(login);
  };

  if (isLoading) {
    return <Loader fullScreen={true} size="large" />;
  }

  const walletStats = [
    {
      label: "Wallet Balance",
      value: formatCurrencyWithCode(profile?.wallet?.balance || 0),
    },
    {
      label: "Frozen Amount",
      value: formatCurrencyWithCode(profile?.wallet?.on_hold || 0),
    },
    {
      label: "Commission",
      value: formatCurrencyWithCode(profile?.today_profit || 0),
      highlight: true,
    },
    {
      label: "Salary",
      value:
        profile?.wallet?.salary !== null && profile?.wallet?.salary !== undefined
          ? formatCurrencyWithCode(profile.wallet.salary)
          : "N/A",
    },
  ];

  const optionGroups = [
    {
      title: "Financial",
      items: [
        { label: "Deposit", route: "/home/deposit", icon: BiCreditCard },
        { label: "Withdraw", route: "/home/withdraw", icon: BiCreditCard },
      ],
    },
    {
      title: "Account",
      items: [
        { label: "Personal Information", route: "/home/personal", icon: BiUser },
        { label: "Payment Methods", route: "/home/payment", icon: BiCreditCard },
      ],
    },
    {
      title: "Support",
      items: [
        { label: "Contact Us", route: "/home/contact", icon: BiUser },
        { label: "Notifications", route: "/home/notifications", icon: BiUser },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#F7F6F0] text-[#333333]">
      <div className="mx-auto max-w-[1600px] space-y-5 px-3 py-4 pb-24 md:space-y-6 md:px-8 md:py-6 md:pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="v2-card p-6 md:p-10 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#EC6345]/5 rounded-full -translate-y-32 translate-x-32 blur-3xl pointer-events-none" />
          
          <div className="relative flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {profile?.profile_picture ? (
                <img
                  src={profile.profile_picture}
                  alt="Profile"
                  className="h-24 w-24 md:h-28 md:w-28 rounded-3xl object-cover ring-4 ring-[#EC6345]/10 shadow-xl"
                />
              ) : (
                <div className="h-24 w-24 md:h-28 md:w-28 flex items-center justify-center rounded-3xl bg-[#fff5f2] ring-4 ring-[#EC6345]/10 shadow-xl">
                  <BiUserCircle className="text-5xl text-[#EC6345]" />
                </div>
              )}
              
              <div className="text-center md:text-left">
                <span className="inline-block px-3 py-1 rounded-full bg-[#EC6345]/10 text-[#EC6345] text-[10px] font-black uppercase tracking-wider mb-2">
                  Music Curator
                </span>
                <p className="text-2xl md:text-3xl font-black text-[#2d2d2d] font-heading tracking-tight">
                  {displayName}
                </p>
                <p className="text-sm font-medium text-slate-500 mt-1">
                  @{profile?.username || "username"}
                </p>
                
                <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-3 text-xs">
                  <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                    <span className="text-slate-400 font-bold uppercase tracking-widest text-[9px]">Ref Code</span>
                    <span className="font-bold text-slate-700">{profile?.referral_code || "N/A"}</span>
                    <button onClick={copyReferralCode} className="hover:text-[#EC6345] transition-colors">
                      <BiCopy className="text-sm" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center md:items-end gap-3">
              <div className="v2-glass px-4 py-2 rounded-2xl flex items-center gap-3">
                {profile?.wallet?.package?.icon ? (
                  <img src={profile.wallet.package.icon} alt="Rank" className="h-8 w-8 object-contain" />
                ) : (
                  <GiCrown className="text-2xl text-[#EC6345]" />
                )}
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Current Rank</p>
                  <p className="text-sm font-bold text-slate-800">{profile?.wallet?.package?.name || "Free Artist"}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 p-5 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Trust Rating</span>
              <span className="text-sm font-black text-[#EC6345] tracking-tight">{profile?.wallet?.credit_score || 0}%</span>
            </div>
            <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${profile?.wallet?.credit_score || 0}%` }}
                transition={{ duration: 1.5, ease: "circOut" }}
                className="h-full bg-[#EC6345] rounded-full shadow-lg shadow-[#EC6345]/30"
              />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            {walletStats.map((item) => (
              <div
                key={item.label}
                className="p-4 rounded-2xl border border-slate-100 bg-white shadow-sm"
              >
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] mb-1">
                  {item.label}
                </p>
                <p className={`text-lg font-black tracking-tight font-heading ${item.highlight ? "text-[#EC6345]" : "text-slate-800"}`}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </motion.div>


        {optionGroups.map((group, groupIndex) => (
          <motion.div
            key={group.title}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * groupIndex }}
            className="v2-card overflow-hidden"
          >
            <div className="bg-slate-50 border-b border-slate-100 px-6 py-3">
              <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                {group.title}
              </p>
            </div>
            <div className="divide-y divide-slate-100">
              {group.items.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => navigate(item.route)}
                  className="flex w-full items-center justify-between px-6 py-4 text-left transition-all hover:bg-slate-50 group active:scale-[0.99]"
                >
                  <div className="flex items-center space-x-4">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-white border border-slate-200 text-slate-600 transition-all group-hover:border-[#EC6345]/30 group-hover:text-[#EC6345] group-hover:shadow-sm">
                      <item.icon className="text-xl" />
                    </span>
                    <p className="text-sm font-bold text-slate-700 md:text-base">
                      {item.label}
                    </p>
                  </div>
                  <BiChevronRight className="text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-[#EC6345]" />
                </button>
              ))}
            </div>
          </motion.div>
        ))}

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={handleLogout}
          className="flex w-full items-center justify-center rounded-2xl border-2 border-red-100 bg-red-50/30 py-4 font-black text-red-500 uppercase tracking-widest text-xs transition-all hover:bg-red-50 hover:border-red-200 active:scale-95 space-x-2"
        >
          <BiLogOutCircle className="text-lg" /> 
          <span>Log out of account</span>
        </motion.button>

      </div>
      <BottomNavMobile className="md:hidden" />
    </div>
  );
};

export default Profile;


