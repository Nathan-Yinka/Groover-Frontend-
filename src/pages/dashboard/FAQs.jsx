import { motion } from "framer-motion";
import { fadeIn } from "../../motion";
import {
  FaTasks,
  FaDollarSign,
  FaMoneyBillWave,
  FaBox,
  FaBoxes,
  FaMoneyCheckAlt,
  FaHandshake,
  FaUserFriends,
  FaClock,
} from "react-icons/fa";
import BackButton from "./components/BackButton";
import BottomNavMobile from "./components/BottomNavMobile";

const faqSections = [
  {
    title: "1. Start the music album data submission task",
    icon: FaTasks,
    iconClass: "text-[#EC6345]",
    points: [
      <>
        (1.1) You need to top up at least{" "}
        <span className="font-semibold text-[#EC6345]">100 USDT</span> to reset
        your account and start a new task.
      </>,
      "(1.2) After all tasks are completed, users must apply for a full withdrawal and receive the withdrawal amount before they can apply to reset their account.",
    ],
  },
  {
    title: "2. Withdrawal",
    icon: FaDollarSign,
    iconClass: "text-[#BA5225]",
    points: [
      "(2.1) If the user has completed the task for the day and needs to withdraw money, please contact our online customer service to withdraw money.",
      "VIP Withdrawal Limits:",
      "VIP1: Up to 1,000 USD",
      "VIP2: Up to 10,000 USD",
      "VIP3: Up to 15,000 USD",
      "VIP4: Unlimited",
      "(2.2) After completing all album submissions, you can apply for a full withdrawal.",
      "(2.3) If you choose to give up or quit during the submission of the task music album, you will not be able to apply for a withdrawal or refund.",
      "(2.4) If you do not receive the user's withdrawal request, you will not be able to process the withdrawal.",
      "(2.5) If you withdraw excess funds, your account will be frozen and you will need to upgrade to the corresponding VIP level to unfreeze the account and withdraw all funds.",
    ],
    nestedFromIndex: 2,
    nestedToIndex: 5,
  },
  {
    title: "3. Funds",
    icon: FaMoneyBillWave,
    iconClass: "text-[#EC6345]",
    points: [
      "(3.1) All funds will be safely stored in the user's account and can be fully withdrawn after submitting all music album data.",
      "(3.2) To avoid fund loss, all data will be processed by the system.",
      "(3.3) The platform will bear full responsibility for any unexpected fund loss.",
      "(3.4) Depending on the VIP level, the maximum amount of funds that can be held in the account cannot exceed 15 times the level limit.",
    ],
  },
  {
    title: "4. Ordinary music albums",
    icon: FaBox,
    iconClass: "text-[#BA5225]",
    points: [
      "(4.1) The platform commission is divided into ordinary commission and 12 times commission. Each user will have 1-6 opportunities to obtain 12-48 times optimization task commission every day. All users can usually obtain up to 1-3 combination product tasks per group.",
      "(4.2) VIP 1 will receive 0.5% of the income for each ordinary music album completed.",
      "(4.3) After each music album is submitted, the funds and income will be returned to the user account.",
      "(4.4) Once the music album data is assigned to the user account, it cannot be cancelled or skipped.",
      "(4.5) All users need to pay attention during work. When adding funds, you need to use your own safe and stable wallet account to add funds. If you use multiple encrypted accounts for deposits multiple times, it will easily lead to account risks (if the account has risk control, you need to pay 20% to 100% of the current balance of the account as the account risk deposit. After the cancellation, all usage rights of the account can be restored).",
    ],
    dangerIndex: 4,
  },
  {
    title: "5. Premium Music Albums",
    icon: FaBoxes,
    iconClass: "text-[#EC6345]",
    points: [
      "(5.1) Users will receive 12x-48x commission for each completed combination music album.",
      "(5.2) When you receive the combination music album data, all funds will be used to submit the combination album transaction, and after you complete the data submission of each album in the combination album, the funds will be returned to your account balance.",
      "(5.3) The system will randomly assign Premium music albums based on the total balance of the user's account.",
    ],
  },
  {
    title: "6. Deposit",
    icon: FaMoneyCheckAlt,
    iconClass: "text-[#7b756f]",
    points: [
      "(6.1) The deposit amount is selected by the user. We cannot determine the user's deposit amount. It is recommended that users pay in advance according to their own ability.",
      "(6.2) If the user needs to pay a deposit when receiving the combination music album, we recommend that the user pay the deposit based on the difference shown in the account.",
      "(6.3) The user must confirm the address with the customer service before making a deposit. If the user transfers to the wrong address, the platform is not responsible.",
    ],
  },
  {
    title: "7. What are the merchant cooperation rules?",
    icon: FaHandshake,
    iconClass: "text-[#BA5225]",
    points: [
      "Merchants depend on users to complete tasks promptly.",
      "If task data is not submitted for a long time, it will delay merchant operations.",
      "Complete tasks and withdrawals quickly to avoid affecting merchants.",
      "Deposit instructions are always provided by the merchant.",
    ],
  },
  {
    title: "8. Can I invite other users?",
    icon: FaUserFriends,
    iconClass: "text-[#EC6345]",
    points: [
      "Only VIP4 users are eligible to invite new users.",
      "To qualify, you must work on the platform for 10 working days.",
      "If your account still has unfinished submissions, you cannot invite others.",
    ],
  },
  {
    title: "9. What are the business hours?",
    icon: FaClock,
    iconClass: "text-[#a0a7b4]",
    points: [
      "Platform operations: 10:00 - 22:59",
      "Customer service: 10:00 - 22:59",
      "Withdrawal requests: 10:00 - 22:59",
    ],
  },
];

const FAQs = () => {
  return (
    <div className="min-h-screen bg-[#F7F6F0] text-[#333333]">
      <div className="w-full space-y-5 px-3 py-4 pb-24 md:space-y-6 md:px-8 md:py-6 md:pb-8">
        <div className="rounded-[18px] border border-[#e5ded3] bg-white p-4 shadow-[0_20px_45px_-38px_rgba(39,39,39,0.6)] md:p-6">
          <BackButton className="mb-5" />
          <h1 className="text-center text-2xl font-bold tracking-tight text-[#333333] md:text-4xl">
            FAQ
          </h1>
          <p className="mx-auto mt-2 max-w-[840px] text-center text-xs text-[#605E5E] md:text-sm">
            Quick answers to deposits, withdrawals, tasks, and account rules.
          </p>
        </div>

        <div className="space-y-3 md:space-y-4">
          {faqSections.map((section, sectionIndex) => {
            const SectionIcon = section.icon;
            return (
              <motion.section
                key={section.title}
                initial={fadeIn("up", null).initial}
                whileInView={fadeIn("up", (sectionIndex + 1) * 2).animate}
                viewport={{ once: false, amount: 0.2 }}
                className="rounded-2xl border border-[#e5ded3] bg-white p-4 shadow-[0_20px_45px_-38px_rgba(39,39,39,0.55)] md:p-6"
              >
                <div className="mb-4 flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl border border-[#e5ded3] bg-[#fbfaf6]">
                    <SectionIcon className={`text-xl ${section.iconClass}`} />
                  </span>
                  <h2 className="text-base font-semibold text-[#333333] md:text-2xl">
                    {section.title}
                  </h2>
                </div>

                <ul className="list-inside list-disc space-y-2 pl-1 text-sm text-[#5f5b57] md:text-base">
                  {section.points.map((point, idx) => {
                    if (
                      section.nestedFromIndex !== undefined &&
                      section.nestedToIndex !== undefined &&
                      idx >= section.nestedFromIndex &&
                      idx <= section.nestedToIndex
                    ) {
                      return null;
                    }

                    if (section.dangerIndex === idx) {
                      return (
                        <li key={`${section.title}-${idx}`} className="font-semibold text-red-400">
                          {point}
                        </li>
                      );
                    }

                    if (idx === section.nestedFromIndex - 1) {
                      return (
                        <li key={`${section.title}-${idx}`}>
                          {point}
                          <ul className="mt-2 list-inside list-disc space-y-1 pl-4 text-[#605E5E]">
                            {section.points
                              .slice(section.nestedFromIndex, section.nestedToIndex + 1)
                              .map((nestedPoint, nestedIdx) => (
                                <li key={`${section.title}-nested-${nestedIdx}`}>
                                  {nestedPoint}
                                </li>
                              ))}
                          </ul>
                        </li>
                      );
                    }

                    return <li key={`${section.title}-${idx}`}>{point}</li>;
                  })}
                </ul>
              </motion.section>
            );
          })}
        </div>

        <BottomNavMobile className="md:hidden" />
      </div>
    </div>
  );
};

export default FAQs;


