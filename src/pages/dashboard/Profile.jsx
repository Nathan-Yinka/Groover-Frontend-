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
    return <Loader />;
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
    <div className="min-h-screen bg-[#060606] text-white">
      <div className="w-full space-y-5 px-3 py-4 pb-24 md:space-y-6 md:px-8 md:py-6 md:pb-8">
        <motion.div
          initial={slideIn("down", null).initial}
          whileInView={slideIn("down", 1 * 2).animate}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#121417] via-[#101214] to-[#0b0d0f] p-4 shadow-[0_24px_60px_-36px_rgba(0,0,0,0.95)] md:p-8"
        >
          <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-accent/10 blur-3xl" />
          <div className="relative flex items-start justify-between gap-4">
            <div className="flex items-center">
              {profile?.profile_picture ? (
                <img
                  src={profile.profile_picture}
                  alt="Profile"
                  className="mr-3 h-16 w-16 rounded-full border-2 border-accent/30 object-cover shadow-md md:mr-5 md:h-20 md:w-20 lg:h-24 lg:w-24"
                />
              ) : (
                <div className="mr-3 flex h-16 w-16 items-center justify-center rounded-full border-2 border-accent/30 bg-[#15191b] md:mr-5 md:h-20 md:w-20 lg:h-24 lg:w-24">
                  <BiUserCircle className="text-2xl md:text-3xl lg:text-4xl" />
                </div>
              )}
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-accent/80">
                  Profile
                </p>
                <p className="text-lg font-bold tracking-tight text-white md:text-2xl">
                  {displayName}
                </p>
                <p className="text-xs text-white/60 md:text-sm">
                  @{profile?.username || "unknown"}
                </p>
                <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-3 py-1">
                  <span className="text-[11px] text-white/75 md:text-xs">
                    Ref
                  </span>
                  <span className="text-xs font-semibold text-accent md:text-sm">
                    {profile?.referral_code || "N/A"}
                  </span>
                  <BiCopy
                    onClick={copyReferralCode}
                    className="cursor-pointer text-white/80 transition hover:scale-110 hover:text-accent"
                  />
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#15181a] px-3 py-2">
                {profile?.wallet?.package?.icon ? (
                  <img
                    src={profile.wallet.package.icon}
                    alt={profile.wallet.package.name || "Package Icon"}
                    className="h-6 w-6 object-contain"
                  />
                ) : (
                  <GiCrown className="text-xl text-accent" />
                )}
                <p className="text-xs font-semibold text-white/90 md:text-sm">
                  {profile?.wallet?.package?.name || "N/A"}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-white/10 bg-[#0f1214] p-3 md:mt-6 md:p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-white/80">Credit Score</span>
              <span className="text-sm font-bold text-accent">
                {profile?.wallet?.credit_score || 0}%
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-white/10 md:h-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${profile?.wallet?.credit_score || 0}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full rounded-full bg-gradient-to-r from-accent/75 to-accent shadow-lg shadow-accent/25"
              />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 md:mt-6 md:grid-cols-4 md:gap-3">
            {walletStats.map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-white/10 bg-[#0f1113] p-3 md:p-4"
              >
                <p className="text-[11px] text-white/60 md:text-xs">{item.label}</p>
                <p
                  className={`mt-1 text-sm font-semibold md:text-base ${item.highlight ? "text-accent" : "text-white"}`}
                >
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {optionGroups.map((group, groupIndex) => (
          <motion.div
            key={group.title}
            initial={fadeIn("right", null).initial}
            whileInView={fadeIn("right", (groupIndex + 1) * 2).animate}
            className="overflow-hidden rounded-2xl border border-white/10 bg-[#0d0f10] shadow-[0_20px_50px_-35px_rgba(0,0,0,0.95)]"
          >
            <div className="border-b border-white/10 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/55">
                {group.title}
              </p>
            </div>
            {group.items.map((item, itemIndex) => (
              <button
                key={item.label}
                type="button"
                onClick={() => navigate(item.route)}
                className={`flex w-full items-center justify-between p-4 text-left transition hover:bg-accent/5 ${itemIndex !== group.items.length - 1 ? "border-b border-white/10" : ""}`}
              >
                <div className="flex items-center space-x-3">
                  <span className="grid h-9 w-9 place-items-center rounded-lg border border-accent/20 bg-accent/10">
                    <item.icon className="text-accent" />
                  </span>
                  <p className="text-sm font-semibold text-white md:text-base">{item.label}</p>
                </div>
                <BiChevronRight className="text-white/40" />
              </button>
            ))}
          </motion.div>
        ))}

        <motion.button
          initial={fadeIn("right", null).initial}
          whileInView={fadeIn("right", 9 * 2).animate}
          onClick={handleLogout}
          className="mb-52 flex w-full items-center justify-center rounded-full border border-red-500/35 bg-[#0f1011] py-3 font-semibold text-red-400 transition hover:bg-red-900/20 md:mb-2"
        >
          <BiLogOutCircle className="mr-2" /> Logout
        </motion.button>
      </div>
      <BottomNavMobile className="md:hidden" />
    </div>
  );
};

export default Profile;
