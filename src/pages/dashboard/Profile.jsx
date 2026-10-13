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
import { showAlert } from "../../app/slice/ui.slice";
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
            dispatch(showAlert({
              type: 'error',
              title: 'Sync Error',
              message: response.message || "Failed to load profile."
            }));
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
          dispatch(
            fetchProfileFailure(
              "An error occurred while fetching your profile.",
            ),
          );
          dispatch(showAlert({
            type: 'error',
            title: 'Connection Error',
            message: "An error occurred while fetching your profile."
          }));
        }
      }
    };

    fetchProfile();
  }, [dispatch, profile]);

  const copyReferralCode = () => {
    if (profile?.referral_code) {
      navigator.clipboard.writeText(profile.referral_code);
      dispatch(showAlert({
        type: 'success',
        title: 'Referral Code',
        message: "Referral code successfully copied to the clipboard!"
      }));
    }
  };

  const handleLogout = () => {
    authService.logout();
    dispatch(logout());
    navigate(login);
  };

  if (isLoading) {
    return <Loader fullScreen={true}  />;
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
    <div className="min-h-screen bg-[#F7F6F0] text-[#333333] selection:bg-[#EC6345]/30">
      <div className="mx-auto max-w-[1600px] space-y-6 px-4 py-8 pb-32 md:px-8 md:py-10">
        
        {/* IDENTIFICATION DOSSIER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="v2-card p-6 md:p-10 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(236,99,69,0.04)_0%,transparent_70%)] pointer-events-none" />
          
          <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* ASSET AUTHORIZATION */}
              <div className="relative group">
                <div className="absolute inset-0 bg-[#EC6345]/10 blur-2xl group-hover:bg-[#EC6345]/20 transition-all duration-700" />
                {profile?.profile_picture ? (
                  <img
                    src={profile.profile_picture}
                    alt="User"
                    className="relative h-28 w-28 md:h-32 md:w-32 rounded-[40px] object-cover border-4 border-white shadow-2xl transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="relative h-28 w-28 md:h-32 md:w-32 flex items-center justify-center rounded-[40px] bg-[#fff5f2] border-4 border-white shadow-2xl">
                    <BiUserCircle className="text-6xl text-[#EC6345]" />
                  </div>
                )}
                {/* RANK OVERLAY */}
                <div className="absolute -bottom-2 -right-2 h-10 w-10 flex items-center justify-center rounded-2xl bg-white border border-[#e5ded3] shadow-lg">
                  {profile?.wallet?.package?.icon ? (
                    <img src={profile.wallet.package.icon} alt="" className="h-6 w-6 object-contain" />
                  ) : (
                    <GiCrown className="text-xl text-[#EC6345]" />
                  )}
                </div>
              </div>
              
              <div className="text-center md:text-left space-y-2">
                <div className="flex flex-col md:flex-row items-center gap-3">
                  <h1 className="text-3xl md:text-4xl font-black text-[#333333] uppercase italic italic-heavy tracking-tighter leading-none">
                    {displayName}
                  </h1>
                  <div className="v2-chip bg-[#EC6345]/10 text-[#EC6345] border border-[#EC6345]/20">
                    Active Member
                  </div>
                </div>
                <p className="text-sm font-bold text-[#EC6345] tracking-widest uppercase">
                  @{profile?.username || "username"}
                </p>
                
                <div className="pt-2 flex justify-center md:justify-start">
                  <button 
                    onClick={copyReferralCode}
                    className="flex items-center gap-3 bg-[#333333] text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:bg-[#444444] active:scale-95"
                  >
                    <BiCopy className="text-sm" />
                    <span>Ref Code: {profile?.referral_code || "GEN-000"}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* PROGRESS SENSOR */}
            <div className="lg:w-[350px] space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] font-black text-[#605E5E]/40 uppercase tracking-[0.15em]">Credit Score</p>
                  <p className="text-2xl font-black text-[#333333] tracking-tighter">{profile?.wallet?.credit_score || 0}%</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-[#EC6345] uppercase tracking-widest">Current Level</p>
                  <p className="text-sm font-bold text-[#333333] uppercase">{profile?.wallet?.package?.name || "Basic"}</p>
                </div>
              </div>
              <div className="h-3 w-full bg-[#f0ede6] rounded-full overflow-hidden border border-[#e5ded3]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${profile?.wallet?.credit_score || 0}%` }}
                  transition={{ duration: 2, ease: [0.23, 1, 0.32, 1] }}
                  className="h-full bg-gradient-to-r from-[#EC6345] to-[#ff987d] rounded-full shadow-[0_0_15px_rgba(236,99,69,0.3)]"
                />
              </div>
            </div>
          </div>

          {/* CAPITAL STORAGE MODULES */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
            {walletStats.map((item, idx) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * idx }}
                className="relative p-5 rounded-[28px] border border-[#e5ded3] bg-[#fbfaf6] group hover:border-[#EC6345]/30 transition-all duration-300"
              >
                <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-slate-200 group-hover:bg-[#EC6345]/40 transition-colors" />
                <p className="text-[10px] font-black text-[#605E5E]/50 uppercase tracking-[0.15em] mb-2">
                  {item.label}
                </p>
                <p className={`text-xl font-black tracking-tighter ${item.highlight ? "text-[#EC6345]" : "text-[#333333]"}`}>
                  {item.value}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>


        {/* SYSTEMS CONTROL GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {optionGroups.map((group, groupIndex) => (
            <motion.div
              key={group.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + (0.1 * groupIndex) }}
              className="v2-card flex flex-col overflow-hidden"
            >
              <div className="bg-[#fbfaf6] border-b border-[#e5ded3] px-6 py-4">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#333333]">
                  {group.title} <span className="text-[#EC6345]">Terminal</span>
                </p>
              </div>
              <div className="divide-y divide-[#e5ded3]/50">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.label}
                      onClick={() => navigate(item.route)}
                      className="flex w-full items-center justify-between px-6 py-5 transition-all hover:bg-slate-50 group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-[#e5ded3] text-[#333333] transition-all group-hover:border-[#EC6345]/30 group-hover:text-[#EC6345] group-hover:shadow-md">
                          <Icon className="text-xl" />
                        </div>
                        <p className="text-sm font-black uppercase tracking-tight text-[#333333]">{item.label}</p>
                      </div>
                      <BiChevronRight className="text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-[#EC6345]" />
                    </button>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {/* LOGOUT */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={handleLogout}
          className="flex w-full items-center justify-center space-x-3 rounded-[32px] border-2 border-[#EC6345]/10 bg-white py-6 transition-all hover:bg-red-50/30 hover:border-[#EC6345]/20 group"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-50 text-[#EC6345] group-hover:bg-[#EC6345] group-hover:text-white transition-all">
            <BiLogOutCircle className="text-xl" /> 
          </div>
          <span className="text-xs font-black text-[#333333] uppercase tracking-[0.3em]">Logout</span>
        </motion.button>
      </div>
      <BottomNavMobile className="md:hidden" />
    </div>
  );
};

export default Profile;
