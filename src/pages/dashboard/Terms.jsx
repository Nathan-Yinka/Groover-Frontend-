import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  RiFileShield2Line,
  RiVerifiedBadgeLine,
  RiLockPasswordLine,
  RiArrowDownSLine,
  RiExchangeBoxLine,
  RiAuctionLine
} from "react-icons/ri";
import BackButton from "./components/BackButton";

const TERMS_DATA = [
  {
    category: "Operational Protocols",
    icon: RiVerifiedBadgeLine,
    color: "text-[#EC6345]",
    rules: [
      {
        id: "1",
        title: "1. Task Reset",
        content: "To reset a task, you must complete the current task before you can reset it, and the account balance must be at least $100."
      },
      {
        id: "2",
        title: "2. Withdrawal Requirement",
        content: "Each user must complete all music album data submission tasks before they can meet the system withdrawal requirements."
      },
      {
        id: "7",
        title: "7. Album Assignment",
        content: "Users can only get one three-in-one music album combination for each task. The system will randomly assign albums. In the combination album, users have a higher probability of getting 1-3 music albums."
      },
      {
        id: "10",
        title: "10. Random Task Assignment",
        content: "Music album data submission tasks are randomly assigned and cannot be changed, canceled, or skipped. All users receive random packages, and no one can alter this process."
      },
      {
        id: "13",
        title: "13. Task Completion",
        content: "Users must complete and withdraw funds within 24 hours. Failure to complete tasks without notifying the record company will result in complaints and breach of contract. Long-term extensions reduce credit scores. If a score falls below 100, it must be repaired before withdrawals can be made."
      }
    ]
  },
  {
    category: "Security & Confidentiality",
    icon: RiLockPasswordLine,
    color: "text-blue-500",
    rules: [
      {
        id: "5",
        title: "5. Password Confidentiality",
        content: "Please do not disclose your account password and security code to others. The platform will not be responsible for any losses or damages caused by this."
      },
      {
        id: "6",
        title: "6. Account Security",
        content: "It is recommended that all users keep their accounts properly to avoid leakage. The platform is not responsible for any accidental leakage of any account."
      },
      {
        id: "8",
        title: "8. Security Code",
        content: "Do not set simple passwords such as birthdays, ID numbers, or phone numbers. Use a more complex password. If forgotten, reset via online customer service and immediately change it yourself afterwards."
      },
      {
        id: "9",
        title: "9. Protection Mode",
        content: "If the account balance exceeds 50,000 USD and the wrong transaction password is entered 3 times, the account enters protection mode. A deposit of 30%-50% of the balance is required to release protection mode and reset the password."
      }
    ]
  },
  {
    category: "Financial Safeguards",
    icon: RiExchangeBoxLine,
    color: "text-green-500",
    rules: [
      {
        id: "3",
        title: "3. Withdrawals",
        content: "To avoid capital loss, all withdrawals are automatically processed by the system, not manually."
      },
      {
        id: "4",
        title: "4. Fund Safety",
        content: "The user's funds are completely safe on the platform, and the platform will be liable for any accidental losses."
      },
      {
        id: "12",
        title: "12. Deposit Rules",
        content: "Each work comes from a different record company. Deposits must be made within 30 minutes and confirmed with customer service. The platform is not responsible for deposits sent to the wrong account."
      },
      {
        id: "15",
        title: "15. Excess Withdrawal",
        content: "If you withdraw excess funds, your account will be frozen and you will need to upgrade to the corresponding VIP level to unfreeze the account and withdraw all funds."
      },
      {
        id: "16",
        title: "16. Tax Regulations",
        content: "According to the regulations of different regional governments on our platform, all users with personal funds exceeding 50,000 USDT/USDC are required to pay personal income tax of 20%-40% of the account funds before the withdrawal is processed, but the personal income tax will be refunded to your work account 2 hours after the withdrawal is completed."
      }
    ]
  },
  {
    category: "Ecosystem Integrity",
    icon: RiAuctionLine,
    color: "text-purple-500",
    rules: [
      {
        id: "11",
        title: "11. Legal Action",
        content: "Legal action will be taken if the account is misused."
      },
      {
        id: "14",
        title: "14. Task Abandonment",
        content: "If you choose to give up or quit during the submission of the task music album, you will not be able to apply for a withdrawal or refund."
      }
    ]
  }
];

const RuleItem = ({ title, content, isOpen, toggle }) => (
  <div className={`mb-3 overflow-hidden rounded-2xl border transition-all duration-300 ${isOpen ? 'border-[#EC6345]/30 bg-white shadow-lg' : 'border-[#e5ded3] bg-white/50'}`}>
    <button onClick={toggle} className="flex w-full items-center justify-between p-4 text-left md:p-5">
      <h4 className={`text-xs font-bold transition-colors md:text-sm ${isOpen ? 'text-[#333333]' : 'text-[#5f5b57]'}`}>{title}</h4>
      <motion.div animate={{ rotate: isOpen ? 180 : 0 }} className={`text-xl ${isOpen ? 'text-[#EC6345]' : 'text-[#a56657]'}`}><RiArrowDownSLine /></motion.div>
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}>
          <div className="px-5 pb-5 pt-0"><div className="h-px w-full bg-[#f2ede4] mb-4" /><p className="text-xs leading-relaxed text-[#5f5b57] md:text-sm">{content}</p></div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const Terms = () => {
  const [openId, setOpenId] = useState("1");
  return (
    <div className="min-h-screen bg-[#F7F6F0] text-[#333333]">
      <div className="mx-auto max-w-[1600px] border-x border-[#e5ded3] min-h-screen bg-white md:bg-[#F7F6F0]/50 shadow-2xl">
        <section className="relative overflow-hidden bg-[#120d0c] px-6 py-12 md:rounded-b-[40px] md:py-20">
          <div className="absolute inset-0 z-0 opacity-20"><div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(236,99,69,0.15)_0%,transparent_50%)]" /><div className="absolute inset-0 bg-[grid-white/[0.03]_bg-[size:40px_40px]" /></div>
          <div className="relative z-10 flex flex-col items-center text-center">
            <BackButton dark className="mb-8" />
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.1 }} 
              className="mb-4 text-4xl font-bold tracking-tighter text-white md:text-6xl"
            >
              Terms & <span className="text-[#EC6345]">Conditions</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="max-w-[500px] text-xs font-medium leading-relaxed text-white/40 md:text-sm">Formalized governance guidelines for all high-fidelity music asset submission tasks and financial reconciliations.</motion.p>
          </div>
        </section>
        <main className="px-4 py-10 pb-32 md:px-8 lg:px-20">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            <aside className="lg:col-span-4"><div className="sticky top-8 space-y-4"><div className="mb-6"><h3 className="text-[10px] font-black uppercase tracking-widest text-[#a56657]">Browse Clauses</h3></div><div className="grid grid-cols-2 gap-3 lg:grid-cols-1">{TERMS_DATA.map((cat, idx) => (<motion.div key={cat.category} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }} className="group flex items-center gap-4 rounded-2xl border border-[#e5ded3] bg-white p-4 shadow-sm transition-all hover:border-[#EC6345]/30 hover:shadow-xl cursor-pointer" onClick={() => { if (cat.rules.length > 0) setOpenId(cat.rules[0].id); }}><div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 transition-all group-hover:scale-110 ${cat.color} bg-white border border-[#e5ded3] shadow-sm`}><cat.icon className="text-xl" /></div><div><p className="text-[10px] font-black uppercase tracking-tight text-[#333333]">{cat.category}</p><p className="text-[9px] font-bold text-[#a56657] uppercase opacity-40">{cat.rules.length} Provisions</p></div></motion.div>))}</div></div></aside>
            <div className="lg:col-span-8">{TERMS_DATA.map((cat) => (<section key={cat.category} className="mb-12"><div className="mb-6 flex items-center gap-4"><div className="h-px flex-1 bg-[#e5ded3]" /><h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#a56657]">{cat.category}</h3><div className="h-px flex-1 bg-[#e5ded3]" /></div><div className="space-y-4">{cat.rules.map((rule) => (<RuleItem key={rule.id} {...rule} isOpen={openId === rule.id} toggle={() => setOpenId(openId === rule.id ? null : rule.id)} />))}</div></section>))}</div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Terms;
