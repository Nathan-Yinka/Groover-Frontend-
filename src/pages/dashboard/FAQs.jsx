import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  RiQuestionnaireLine, 
  RiWallet3Line, 
  RiExchangeDollarLine, 
  RiShieldFlashLine, 
  RiMusic2Line, 
  RiVipDiamondLine, 
  RiCustomerService2Line, 
  RiGroupLine, 
  RiTimer2Line,
  RiArrowDownSLine
} from "react-icons/ri";
import BackButton from "./components/BackButton";

const FAQ_DATA = [
  {
    category: "Operations",
    icon: RiMusic2Line,
    color: "text-[#333333]",
    items: [
      {
        id: "1",
        q: "Start the music album data submission task",
        points: [
          "You need to top up at least 100 USDT to reset your account and start a new task.",
          "After all tasks are completed, users must apply for a full withdrawal and receive the withdrawal amount before they can apply to reset their account."
        ]
      }
    ]
  },
  {
    category: "Withdrawal",
    icon: RiExchangeDollarLine,
    color: "text-[#333333]",
    items: [
      {
        id: "2",
        q: "Withdrawal Rules & VIP Limits",
        points: [
          "If the user has completed the task for the day and needs to withdraw money, please contact our online customer service to withdraw money.",
          "VIP Withdrawal Limits:",
          "VIP1: Up to 1,000 USD",
          "VIP2: Up to 10,000 USD",
          "VIP3: Up to 15,000 USD",
          "VIP4: Unlimited",
          "After completing all album submissions, you can apply for a full withdrawal.",
          "If you choose to give up or quit during the submission of the task music album, you will not be able to apply for a withdrawal or refund.",
          "If you do not receive the user's withdrawal request, you will not be able to process the withdrawal.",
          "If you withdraw excess funds, your account will be frozen and you will need to upgrade to the corresponding VIP level to unfreeze the account and withdraw all funds."
        ]
      }
    ]
  },
  {
    category: "Funds",
    icon: RiWallet3Line,
    color: "text-[#333333]",
    items: [
      {
        id: "3",
        q: "Funds Policy",
        points: [
          "All funds will be safely stored in the user's account and can be fully withdrawn after submitting all music album data.",
          "To avoid fund loss, all data will be processed by the system.",
          "The platform will bear full responsibility for any unexpected fund loss.",
          "Depending on the VIP level, the maximum amount of funds that can be held in the account cannot exceed 15 times the level limit."
        ]
      }
    ]
  },
  {
    category: "Albums",
    icon: RiMusic2Line,
    color: "text-[#333333]",
    items: [
      {
        id: "4",
        q: "Ordinary music albums",
        points: [
          "The platform commission is divided into ordinary commission and 12 times commission. Each user will have 1-6 opportunities to obtain 12-48 times optimization task commission every day. All users can usually obtain up to 1-3 combination product tasks per group.",
          "VIP 1 will receive 0.5% of the income for each ordinary music album completed.",
          "After each music album is submitted, the funds and income will be returned to the user account.",
          "Once the music album data is assigned to the user account, it cannot be cancelled or skipped.",
          "All users need to pay attention during work. When adding funds, you need to use your own safe and stable wallet account to add funds. If you use multiple encrypted accounts for deposits multiple times, it will easily lead to account risks (if the account has risk control, you need to pay 20% to 100% of the current balance of the account as the account risk deposit. After the cancellation, all usage rights of the account can be restored)."
        ]
      }
    ]
  },
  {
    category: "Premium",
    icon: RiVipDiamondLine,
    color: "text-[#333333]",
    items: [
      {
        id: "5",
        q: "Premium Music Albums",
        points: [
          "Users will receive 12x-48x commission for each completed combination music album.",
          "When you receive the combination music album data, all funds will be used to submit the combination album transaction, and after you complete the data submission of each album in the combination album, the funds will be returned to your account balance.",
          "The system will randomly assign Premium music albums based on the total balance of the user's account."
        ]
      }
    ]
  },
  {
    category: "Deposit",
    icon: RiExchangeDollarLine,
    color: "text-[#333333]",
    items: [
      {
        id: "6",
        q: "Deposit Procedures",
        points: [
          "The deposit amount is selected by the user. We cannot determine the user's deposit amount. It is recommended that users pay in advance according to their own ability.",
          "If the user needs to pay a deposit when receiving the combination music album, we recommend that the user pay the deposit based on the difference shown in the account.",
          "The user must confirm the address with the customer service before making a deposit. If the user transfers to the wrong address, the platform is not responsible."
        ]
      }
    ]
  },
  {
    category: "Rules",
    icon: RiShieldFlashLine,
    color: "text-[#333333]",
    items: [
      {
        id: "7",
        q: "What are the merchant cooperation rules?",
        points: [
          "Merchants depend on users to complete tasks promptly.",
          "If task data is not submitted for a long time, it will delay merchant operations.",
          "Complete tasks and withdrawals quickly to avoid affecting merchants.",
          "Deposit instructions are always provided by the merchant."
        ]
      }
    ]
  },
  {
    category: "Social",
    icon: RiGroupLine,
    color: "text-[#333333]",
    items: [
      {
        id: "8",
        q: "Can I invite other users?",
        points: [
          "Only VIP4 users are eligible to invite new users.",
          "To qualify, you must work on the platform for 10 working days.",
          "If your account still has unfinished submissions, you cannot invite others."
        ]
      }
    ]
  },
  {
    category: "Hours",
    icon: RiTimer2Line,
    color: "text-[#333333]",
    items: [
      {
        id: "9",
        q: "What are the business hours?",
        points: [
          "Platform operations: 10:00 - 22:59",
          "Customer service: 10:00 - 22:59",
          "Withdrawal requests: 10:00 - 22:59"
        ]
      }
    ]
  }
];

const FAQItem = ({ q, points, isOpen, toggle }) => {
  return (
    <div className={`mb-3 overflow-hidden rounded-2xl border transition-all duration-300 ${isOpen ? 'border-[#333333]/10 bg-white shadow-lg' : 'border-[#e5ded3] bg-white/50'}`}>
      <button 
        onClick={toggle}
        className="flex w-full items-center justify-between p-4 text-left md:p-5"
      >
        <h4 className={`text-xs font-bold transition-colors md:text-sm ${isOpen ? 'text-[#333333]' : 'text-[#5f5b57]'}`}>
          {q}
        </h4>
        <motion.div
           animate={{ rotate: isOpen ? 180 : 0 }}
           className={`text-xl ${isOpen ? 'text-[#333333]' : 'text-[#a56657]'}`}
        >
          <RiArrowDownSLine />
        </motion.div>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
          >
            <div className="px-5 pb-5 pt-0">
              <div className="h-px w-full bg-[#f2ede4] mb-4" />
              <div className="space-y-4">
                {points.map((point, i) => {
                   const isHighlight = point.includes("VIP");
                   return (
                    <div key={i} className="flex gap-3">
                         {!point.includes("VIP:") && (
                            <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#e5ded3] flex-shrink-0" />
                         )}
                         <p className={`text-xs leading-relaxed md:text-sm ${isHighlight ? 'text-[#333333] font-bold' : 'text-[#5f5b57]'}`}>
                           {point}
                         </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQs = () => {
  const navigate = useNavigate();
  const [openId, setOpenId] = useState("1");

  return (
    <div className="min-h-screen bg-[#F7F6F0] text-[#333333] overflow-x-hidden">
      <div className="mx-auto max-w-[1600px] border-x border-[#e5ded3] min-h-screen bg-white md:bg-[#F7F6F0]/50 shadow-2xl overflow-x-hidden">
        
        {/* REFINED HEADER: Toned down red */}
        <section className="relative overflow-hidden bg-[#120d0c] px-6 py-12 md:rounded-b-[40px] md:py-20">
            <div className="absolute inset-0 z-0 opacity-20">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(236,99,69,0.1)_0%,transparent_50%)]" />
                <div className="absolute inset-0 bg-[grid-white/[0.03]_bg-[size:40px_40px]" />
            </div>

            <div className="relative z-10 w-full max-w-[1600px] mx-auto">
                <div className="flex justify-center mb-8">
                    <BackButton dark />
                </div>
                
                <div className="flex flex-col items-center text-center">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-4 flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-md"
                    >
                        <RiQuestionnaireLine className="text-[#EC6345]/60" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">Knowledge Station</span>
                    </motion.div>

                    <motion.h1 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="mb-4 text-4xl font-bold tracking-tighter text-white md:text-6xl"
                    >
                      How can we <span className="text-white/80">help?</span>
                    </motion.h1>
                    
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="max-w-[500px] text-xs font-medium leading-relaxed text-white/40 md:text-sm"
                    >
                      Explore specialized documentation for deposits, withdrawals, and premium asset submission protocols.
                    </motion.p>
                </div>
            </div>
        </section>

        <main className="px-4 py-10 pb-32 md:px-8 lg:px-20">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
                
                {/* CATEGORY SIDEBAR: Cleaner, Neutrals */}
                <aside className="lg:col-span-4">
                    <div className="sticky top-8 space-y-4">
                        <div className="mb-6">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-[#a56657]/60">Browse Sectors</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
                            {FAQ_DATA.map((cat, idx) => (
                                <motion.div
                                    key={cat.category}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="group flex items-center gap-4 rounded-2xl border border-[#e5ded3] bg-white p-3 shadow-sm transition-all hover:border-[#333333]/20 hover:shadow-xl cursor-pointer"
                                    onClick={() => {
                                        if (cat.items.length > 0) setOpenId(cat.items[0].id);
                                    }}
                                >
                                    <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-[#fbfaf6] transition-all group-hover:scale-110 text-[#333333] border border-[#e5ded3]`}>
                                        <cat.icon className="text-lg" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-[10px] font-black uppercase tracking-tight text-[#333333] truncate">{cat.category}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* ACCORDION CONTENT: Balanced, Clean */}
                <div className="lg:col-span-8">
                    {FAQ_DATA.map((cat) => (
                        <section key={cat.category} className="mb-12">
                            <div className="mb-6 flex items-center gap-4">
                                <div className="h-px flex-1 bg-[#e5ded3]" />
                                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#a56657]">{cat.category}</h3>
                                <div className="h-px flex-1 bg-[#e5ded3]" />
                            </div>

                            <div className="space-y-4">
                                {cat.items.map((item) => (
                                    <FAQItem 
                                        key={item.id}
                                        {...item}
                                        isOpen={openId === item.id}
                                        toggle={() => setOpenId(openId === item.id ? null : item.id)}
                                    />
                                ))}
                            </div>
                        </section>
                    ))}

                    <motion.div 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="mt-20 rounded-[32px] bg-gradient-to-br from-[#1b1513] to-[#120d0c] p-8 text-center text-white"
                    >
                        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#333333] border border-white/10 shadow-xl">
                            <RiCustomerService2Line className="text-3xl text-white" />
                        </div>
                        <h4 className="mb-2 text-xl font-bold italic">Still need specialized support?</h4>
                        <p className="mb-8 text-sm text-white/40">Our technical curators are active daily from 10:00 to 22:59.</p>
                        <button 
                            onClick={() => navigate('/home/contact')}
                            className="rounded-xl bg-white px-8 py-4 text-[11px] font-black uppercase tracking-widest text-[#120d0c] transition-all hover:scale-105 active:scale-95"
                        >
                            Launch Terminal Support
                        </button>
                    </motion.div>
                </div>
            </div>
        </main>
      </div>
    </div>
  );
};

export default FAQs;
// on the modal also// the cimmetn part 
// just say add comnet and the titel shouw be commet 