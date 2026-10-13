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
      label: "On Hold",
      value: formatCurrencyWithCode(profile?.wallet?.on_hold || 0),
    },
    {
      label: "Today's Profit",
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
      <div className="mx-auto max-w-[1000px] space-y-5 px-4 py-6 pb-32 md:px-8 md:py-10">

        {/* PROFILE OVERVIEW */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[28px] bg-[#221917] text-white p-6 md:p-8"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              {profile?.profile_picture ? (
                <img
                  src={profile.profile_picture}
                  alt="User"
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
                  <BiUserCircle className="text-4xl text-white/70" />
                </div>
              )}
              <div>
                <h1 className="text-xl font-bold">{displayName}</h1>
                <p className="mt-1 text-sm text-white/60">@{profile?.username || "username"}</p>
                <button
                  onClick={copyReferralCode}
                  className="mt-1 flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition-colors"
                >
                  <span>Referral code: <span className="font-semibold text-white">{profile?.referral_code || "GEN-000"}</span></span>
                  <BiCopy className="text-sm" />
                </button>
              </div>
            </div>

            <button
              onClick={() => navigate("/home/level")}
              className="flex shrink-0 flex-col items-center gap-1 rounded-2xl bg-white/10 px-3 py-2 hover:bg-white/15 transition-colors"
            >
              <GiCrown className="text-xl text-[#ffb29f]" />
              <span className="text-xs font-semibold uppercase">{profile?.wallet?.package?.name || "Basic"}</span>
            </button>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-white/80">Credit Score</span>
              <span className="font-bold">{profile?.wallet?.credit_score || 0}%</span>
            </div>
            <div className="mt-2 h-2 w-full rounded-full bg-white/10 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${profile?.wallet?.credit_score || 0}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full rounded-full bg-[#EC6345]"
              />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-5 border-t border-white/10 pt-5 sm:grid-cols-4">
            {walletStats.map((item) => (
              <div key={item.label}>
                <p className="text-xs font-medium text-white/50">{item.label}</p>
                <p className={`mt-1 text-lg font-bold ${item.highlight ? "text-[#ffb29f]" : "text-white"}`}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ACCOUNT OPTIONS */}
        <div className="space-y-3">
          {optionGroups.map((group) => (
            <div key={group.title} className="space-y-2">
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    onClick={() => navigate(item.route)}
                    className="flex w-full items-center justify-between rounded-2xl border border-[#e5ded3] bg-white px-5 py-4 transition hover:border-[#EC6345]/30"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="text-xl text-[#605E5E]" />
                      <span className="text-sm font-semibold text-[#333333]">{item.label}</span>
                    </div>
                    <BiChevronRight className="text-slate-300" />
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[#e5ded3] bg-white py-4 text-sm font-semibold text-[#d64545] transition hover:bg-red-50"
        >
          <BiLogOutCircle className="text-lg" />
          Logout
        </button>
      </div>
      <BottomNavMobile className="md:hidden" />
    </div>
  );
};

export default Profile;
