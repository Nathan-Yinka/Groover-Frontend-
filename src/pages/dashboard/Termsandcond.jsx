import React from "react";
import { motion } from "framer-motion";
import { 
  RiShieldLine, 
  RiLockLine, 
  RiExchangeDollarLine, 
  RiMusic2Line, 
  RiFlag2Line,
  RiFileList3Line,
  RiScales3Line,
  RiRefund2Line,
  RiSafe2Line,
  RiTimer2Line
} from "react-icons/ri";
import BackButton from "./components/BackButton";

const ProtocolCard = ({ title, icon: Icon, children, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.05 }}
    className="group relative overflow-hidden rounded-[32px] border border-[#e5ded3] bg-white p-6 md:p-8 transition-all hover:border-[#EC6345]/30 hover:shadow-2xl hover:shadow-[#EC6345]/5"
  >
    <div className="flex items-start gap-4 md:gap-6">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#EC6345]/5 text-[#EC6345] transition-all group-hover:bg-[#EC6345] group-hover:text-white">
        <Icon className="text-2xl" />
      </div>
      <div className="space-y-4 flex-1">
        <h3 className="text-lg font-black tracking-tight text-[#333333] uppercase italic italic-heavy">
          {title}
        </h3>
        <div className="text-xs md:text-sm font-medium leading-relaxed text-[#605E5E] space-y-2">
          {children}
        </div>
      </div>
    </div>
  </motion.div>
);

const TermsandCond = () => {
  return (
    <div className="min-h-screen bg-[#F7F6F0] text-[#333333]">
      <div className="mx-auto max-w-[1600px] space-y-6 px-4 py-8 pb-32 md:px-8 md:py-10">
        
        {/* HEADER STATION */}
        <section className="relative overflow-hidden rounded-[40px] bg-[#120d0c] px-6 py-12 md:py-20 text-center">
            <div className="absolute inset-0 z-0 opacity-20">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(236,99,69,0.1)_0%,transparent_50%)]" />
                <div className="absolute inset-0 bg-[grid-white/[0.03]_bg-[size:40px_40px]" />
            </div>

            <div className="relative z-10 max-w-3xl mx-auto">
                <div className="mb-6 flex justify-center">
                  <BackButton dark />
                </div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-4 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-md"
                >
                    <RiShieldLine className="text-[#EC6345]/60" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">Legal Protocol</span>
                </motion.div>
                
                <h1 className="mb-4 text-4xl font-black tracking-tighter text-white md:text-6xl uppercase italic italic-heavy">
                  Mission <span className="text-white/80 font-medium">Codex</span>
                </h1>
                
                <p className="max-w-[600px] mx-auto text-xs font-medium leading-relaxed text-white/40 md:text-sm italic">
                  The operative framework and contractual directives governing the Groover Music Curation Network. Symmetry in compliance ensures security of assets.
                </p>
            </div>
        </section>

        {/* GUIDELINES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          <ProtocolCard title="01. Task Reset Protocol" icon={RiRestartLine} index={0}>
            <p>To reset a curation task, you must successfully finalize the active assignment. A minimum account baseline of <span className="font-bold text-[#EC6345]">$100 USD</span> is required for account re-synchronization.</p>
          </ProtocolCard>

          <ProtocolCard title="02. Submission Directive" icon={RiMusic2Line} index={1}>
            <p>Curators are mandated to complete the full sequence of music album data submissions assigned by the system before withdrawal parameters are unlocked.</p>
          </ProtocolCard>

          <ProtocolCard title="03. Withdrawal Logic" icon={RiExchangeDollarLine} index={2}>
            <p>To mitigate capital exposure, all withdrawal requests are executed through the global automated settlement engine. Manual overrides are restricted to ensure data integrity.</p>
          </ProtocolCard>

          <ProtocolCard title="04. Asset Safeguard" icon={RiSafe2Line} index={3}>
            <p>Curator funds are secured within encrypted workstation vaults. The platform maintains full liability for accidental losses occurring within the verified network.</p>
          </ProtocolCard>

          <ProtocolCard title="05. Security Protocols" icon={RiLockLine} index={4}>
            <ul className="space-y-3 list-none">
              <li className="flex gap-2"><div className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#EC6345]" /><span>Restricted disclosure of security codes and biometric credentials.</span></li>
              <li className="flex gap-2"><div className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#EC6345]" /><span>Mandatory use of complex alphanumeric strings to secure fund terminals.</span></li>
              <li className="flex gap-2"><div className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#EC6345]" /><span>Contact Online Support for immediate password reset and re-verification.</span></li>
            </ul>
          </ProtocolCard>

          <ProtocolCard title="06. Account Protection" icon={RiShieldLine} index={5}>
            <p>Accounts exceeding <span className="font-bold text-[#EC6345]">$50,000</span> with multiple failed transaction attempts will trigger **Protection Mode**. Stabilization requires a security deposit of 30%–50% to verify ownership.</p>
          </ProtocolCard>

          <ProtocolCard title="07. Automated Assignment" icon={RiFileList3Line} index={6}>
            <p>Music album data submissions are randomly distributed via the system engine. Assignments are locked upon distribution and cannot be skipped, retracted, or manually adjusted.</p>
          </ProtocolCard>

          <ProtocolCard title="08. Legal Compliance" icon={RiScales3Line} index={7}>
            <p>The system actively monitors for network misuse. Any breach of terms will result in immediate tactical de-verification and potential legal pursuit.</p>
          </ProtocolCard>

          <ProtocolCard title="09. Deposit Parameters" icon={RiFlag2Line} index={8}>
            <p>Work is sourced from verified record companies. Deposits must be finalized within **30 minutes** and addressed only to the verified company terminal provided by customer service.</p>
          </ProtocolCard>

          <ProtocolCard title="10. Credit Score Repair" icon={RiTimer2Line} index={9}>
            <p>Curators must finalize and withdraw within a 24-hour cycle. Delays without authorization decrease the credit baseline. Scores below 100 require immediate repair for full access.</p>
          </ProtocolCard>

          <ProtocolCard title="11. Mission Finality" icon={RiRefund2Line} index={10}>
            <p>Abandoning a mission or quitting during an active album submission sequence forfeits the current balance. Withdrawals are only accessible upon 100% mission completion.</p>
          </ProtocolCard>

          <ProtocolCard title="12. Excess Settlement" icon={RiScales3Line} index={11}>
            <p>Withdrawing funds beyond tier-specific limits triggers an account freeze. Upgrade to the corresponding VIP Tier is required to unfreeze and authorize the total payout.</p>
          </ProtocolCard>

          <ProtocolCard title="13. Fiscal Regulations" icon={RiFileList3Line} index={12}>
            <p>Accounts exceeding **50,000 USDT** are subject to regional income tax (20%-40%). Tax settlements are processed prior to withdrawal and refunded to the work balance within 2 hours of completion.</p>
          </ProtocolCard>
        </div>

      </div>
    </div>
  );
};

// Internal icon for specific mapping fix
const RiRestartLine = RiShieldLine; // Fallback if not found

export default TermsandCond;
