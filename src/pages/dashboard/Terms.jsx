import {
  FaRegCheckCircle,
  FaLock,
  FaTasks,
  FaUserShield,
  FaExclamationTriangle,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { fadeIn } from "../../motion";
import BackButton from "./components/BackButton";
import BottomNavMobile from "./components/BottomNavMobile";

const termsRules = [
  {
    title: "1. Task Reset",
    icon: FaRegCheckCircle,
    iconClass: "text-accent",
    content: (
      <>
        To reset a task, you must complete the current task before you can
        reset it, and the account balance must be at least{" "}
        <span className="font-semibold text-accent">$100</span>.
      </>
    ),
  },
  {
    title: "2. Withdrawal Requirement",
    icon: FaTasks,
    iconClass: "text-[#66a3ff]",
    content:
      "Each user must complete all music album data submission tasks before they can meet the system withdrawal requirements.",
  },
  {
    title: "3. Withdrawals",
    icon: FaLock,
    iconClass: "text-[#8ca2ff]",
    content:
      "To avoid capital loss, all withdrawals are automatically processed by the system, not manually.",
  },
  {
    title: "4. Fund Safety",
    icon: FaUserShield,
    iconClass: "text-[#61d39b]",
    content:
      "The user's funds are completely safe on the platform, and the platform will be liable for any accidental losses.",
  },
  {
    title: "5. Password Confidentiality",
    icon: FaLock,
    iconClass: "text-[#ffd166]",
    content:
      "Please do not disclose your account password and security code to others. The platform will not be responsible for any losses or damages caused by this.",
  },
  {
    title: "6. Account Security",
    icon: FaUserShield,
    iconClass: "text-[#bc8dff]",
    content:
      "It is recommended that all users keep their accounts properly to avoid leakage. The platform is not responsible for any accidental leakage of any account.",
  },
  {
    title: "7. Album Assignment",
    icon: FaTasks,
    iconClass: "text-[#57d1c9]",
    content:
      "Users can only get one three-in-one music album combination for each task. The system will randomly assign albums. In the combination album, users have a higher probability of getting 1-3 music albums.",
  },
  {
    title: "8. Security Code",
    icon: FaLock,
    iconClass: "text-[#8ca2ff]",
    content:
      "Do not set simple passwords such as birthdays, ID numbers, or phone numbers. Use a more complex password. If forgotten, reset via online customer service and immediately change it yourself afterwards.",
  },
  {
    title: "9. Protection Mode",
    icon: FaExclamationTriangle,
    iconClass: "text-[#ff9f43]",
    content: (
      <>
        If the account balance exceeds{" "}
        <span className="font-semibold text-accent">50,000 USD</span> and the
        wrong transaction password is entered 3 times, the account enters
        protection mode. A deposit of 30%-50% of the balance is required to
        release protection mode and reset the password.
      </>
    ),
  },
  {
    title: "10. Random Task Assignment",
    icon: FaTasks,
    iconClass: "text-[#ff6b6b]",
    content:
      "Music album data submission tasks are randomly assigned and cannot be changed, canceled, or skipped. All users receive random packages, and no one can alter this process.",
  },
  {
    title: "11. Legal Action",
    icon: FaExclamationTriangle,
    iconClass: "text-[#ff7ac1]",
    content: "Legal action will be taken if the account is misused.",
  },
  {
    title: "12. Deposit Rules",
    icon: FaRegCheckCircle,
    iconClass: "text-[#61d39b]",
    content:
      "Each work comes from a different record company. Deposits must be made within 30 minutes and confirmed with customer service. The platform is not responsible for deposits sent to the wrong account.",
  },
  {
    title: "13. Task Completion",
    icon: FaTasks,
    iconClass: "text-[#a0a7b4]",
    content:
      "Users must complete and withdraw funds within 24 hours. Failure to complete tasks without notifying the record company will result in complaints and breach of contract. Long-term extensions reduce credit scores. If a score falls below 100, it must be repaired before withdrawals can be made.",
  },
  {
    title: "14. Task Abandonment",
    icon: FaExclamationTriangle,
    iconClass: "text-[#ff6b6b]",
    content:
      "If you choose to give up or quit during the submission of the task music album, you will not be able to apply for a withdrawal or refund.",
  },
  {
    title: "15. Excess Withdrawal",
    icon: FaLock,
    iconClass: "text-[#ff9f43]",
    content:
      "If you withdraw excess funds, your account will be frozen and you will need to upgrade to the corresponding VIP level to unfreeze the account and withdraw all funds.",
  },
  {
    title: "16. Tax Regulations",
    icon: FaUserShield,
    iconClass: "text-[#66a3ff]",
    content:
      "According to the regulations of different regional governments on our platform, all users with personal funds exceeding 50,000 USDT/USDC are required to pay personal income tax of 20%-40% of the account funds before the withdrawal is processed, but the personal income tax will be refunded to your work account 2 hours after the withdrawal is completed.",
  },
];

const Terms = () => {
  return (
    <div className="min-h-screen bg-[#060606] text-white">
      <div className="w-full space-y-5 px-3 py-4 pb-24 md:space-y-6 md:px-8 md:py-6 md:pb-8">
        <div className="rounded-2xl border border-white/10 bg-[#0d0f10] p-4 shadow-[0_24px_60px_-35px_rgba(0,0,0,0.95)] md:p-6">
          <BackButton className="mb-5" />
          <h1 className="text-center text-2xl font-bold tracking-tight text-white md:text-4xl">
            Contract Rules
          </h1>
          <p className="mx-auto mt-2 max-w-[880px] text-center text-xs text-white/65 md:text-sm">
            These contract rules apply to all users of the platform. By
            registering and using the platform, you agree to the following
            obligations.
          </p>
        </div>

        <div className="space-y-3 md:space-y-4">
          {termsRules.map((rule, idx) => {
            const RuleIcon = rule.icon;
            return (
              <motion.section
                key={rule.title}
                {...fadeIn("up", idx + 1)}
                className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#101214] via-[#121417] to-[#0c0d0f] p-4 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.95)] md:p-5"
              >
                <div className="mb-3 flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-[#15181b]">
                    <RuleIcon className={`text-xl ${rule.iconClass}`} />
                  </span>
                  <h2 className="text-base font-semibold text-white md:text-xl">
                    {rule.title}
                  </h2>
                </div>
                <p className="text-sm leading-relaxed text-white/75 md:text-base">
                  {rule.content}
                </p>
              </motion.section>
            );
          })}
        </div>

        <BottomNavMobile className="md:hidden" />
      </div>
    </div>
  );
};

export default Terms;
