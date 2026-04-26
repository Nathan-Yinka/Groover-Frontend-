import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  RiHistoryLine, 
  RiRocket2Line, 
  RiMusic2Line, 
  RiArrowDownSLine
} from "react-icons/ri";
import BackButton from "./components/BackButton";

const ABOUT_DATA = [
  {
    category: "The Foundation",
    icon: RiHistoryLine,
    color: "text-[#EC6345]",
    items: [
      {
        id: "story",
        title: "Our Story",
        paragraphs: [
          "Groover started with a friendship and grew to be a successful business that still retains its core values: putting great emphasis on teamwork, transparency, commitment, consistency, quality, and always being ready to support and help both clients and colleagues.",
          "Founded in 2013 by professional affiliate marketers and webmasters with over 20 years of experience, Groover has developed into a trusted name in the industry. What started as a shared vision has now blossomed into a platform that blends technology and human intelligence to deliver excellence."
        ]
      },
      {
        id: "vision",
        title: "Our Vision",
        paragraphs: [
          "\"We were friends at school and university, brought together by our shared interest in technology and marketing, as well as the desire to find the best way to attain self-realization and success. While striving to grow financially, we did not want to get tangled up in the complex corporate culture.\"",
          "Groover's founders wanted to create something new, both for themselves and for the market. The result is a company with a professional IT department, experienced account managers, and a team of dedicated employees who strive to provide outstanding support and solutions for advertisers and publishers."
        ]
      }
    ]
  },
  {
    category: "Global Mission",
    icon: RiRocket2Line,
    color: "text-blue-500",
    items: [
      {
        id: "mission",
        title: "Our Mission",
        paragraphs: [
          "We connect advertisers and publishers of all sizes globally, helping them grow their capital, develop their skills, and improve as professionals to ensure a successful present and future.",
          "By setting high traffic and service quality standards, we contribute to the development of the adtech market. Through our innovative products, we aim to foster growth, share knowledge, and collaborate with the community to build a brighter future for all."
        ]
      },
      {
        id: "recognition",
        title: "Industry Recognition",
        paragraphs: [
          "Today, Groover is a well-known brand with a strong reputation and has been recognized by numerous bloggers and affiliates as one of the top adtech platforms. Our blend of innovative technology and human intelligence makes us a trusted partner in the industry.",
          "We believe that our dedication to excellence and support for both advertisers and publishers is what sets us apart and drives our success."
        ]
      }
    ]
  },
  {
    category: "Artist Ecosystem",
    icon: RiMusic2Line,
    color: "text-purple-500",
    items: [
      {
        id: "empower",
        title: "Empowering Artists Everywhere",
        paragraphs: [
          "Groover exists to give every artist a fair shot at being heard. Whether you are just starting out or already a platinum-selling musician, our platform connects your music with a global network of bloggers, reviewers, playlisters, radio hosts, and industry tastemakers.",
          "With curators from over 100 countries, we have already helped generate more than 1.4 million pieces of coverage for artists worldwide."
        ]
      },
      {
        id: "built",
        title: "Built by Music People, For Music People",
        paragraphs: [
          "We are industry professionals who believe music promotion should be fair, affordable, and accessible. Every submission is listened to and vetted, ensuring that if your track makes it onto our platform, it gets genuine coverage from reviews and interviews to playlists, radio plays, features, and influencer shoutouts.",
          "Groover is not just a service, it is a mission: to democratize music promotion and make sure grassroots and independent artists thrive. Because great music deserves to be discovered."
        ]
      }
    ]
  }
];

const AboutItem = ({ title, paragraphs, isOpen, toggle }) => (
  <div className={`mb-3 overflow-hidden rounded-2xl border transition-all duration-300 ${isOpen ? 'border-[#EC6345]/30 bg-white shadow-lg' : 'border-[#e5ded3] bg-white/50'}`}>
    <button onClick={toggle} className="flex w-full items-center justify-between p-4 text-left md:p-5">
      <h4 className={`text-xs font-bold transition-colors md:text-sm ${isOpen ? 'text-[#333333]' : 'text-[#5f5b57]'}`}>{title}</h4>
      <motion.div animate={{ rotate: isOpen ? 180 : 0 }} className={`text-xl ${isOpen ? 'text-[#EC6345]' : 'text-[#a56657]'}`}><RiArrowDownSLine /></motion.div>
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}>
          <div className="px-5 pb-5 pt-0">
            <div className="h-px w-full bg-[#f2ede4] mb-4" />
            <div className="space-y-4">
              {paragraphs.map((p, i) => (
                <p key={i} className="text-xs leading-relaxed text-[#5f5b57] md:text-sm">{p}</p>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const AboutUs = () => {
  const [openId, setOpenId] = useState("story");
  return (
    <div className="min-h-screen bg-[#F7F6F0] text-[#333333]">
      <div className="mx-auto max-w-[1600px] border-x border-[#e5ded3] min-h-screen bg-white md:bg-[#F7F6F0]/50 shadow-2xl">
        
        {/* PREMIUM HERO HEADER */}
        <section className="relative overflow-hidden bg-[#120d0c] px-6 py-12 md:rounded-b-[40px] md:py-20">
          <div className="absolute inset-0 z-0 opacity-20">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(236,99,69,0.15)_0%,transparent_50%)]" />
            <div className="absolute inset-0 bg-[grid-white/[0.03]_bg-[size:40px_40px]" />
          </div>
          <div className="relative z-10 flex flex-col items-center text-center">
            <BackButton dark className="mb-8" />
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-4 flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-md">
              <RiHistoryLine className="text-[#EC6345]" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">Our Legacy</span>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-4 text-4xl font-bold tracking-tighter text-white md:text-6xl">
              About <span className="text-[#EC6345]">Groover</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="max-w-[500px] text-xs font-medium leading-relaxed text-white/40 md:text-sm">
              Explore the story, mission, and the global network of tastemakers powering the platform.
            </motion.p>
          </div>
        </section>

        {/* MAIN ABOUT ENGINE */}
        <main className="px-4 py-10 pb-32 md:px-8 lg:px-20">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            
            {/* LEFT COL: CATEGORIES */}
            <aside className="lg:col-span-4">
              <div className="sticky top-8 space-y-4">
                <div className="mb-6">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-[#a56657]">Browse Heritage</h3>
                </div>
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
                  {ABOUT_DATA.map((cat, idx) => (
                    <motion.div
                      key={cat.category}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="group flex items-center gap-4 rounded-2xl border border-[#e5ded3] bg-white p-4 shadow-sm transition-all hover:border-[#EC6345]/30 hover:shadow-xl cursor-pointer"
                      onClick={() => {
                        if (cat.items.length > 0) setOpenId(cat.items[0].id);
                      }}
                    >
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 transition-all group-hover:scale-110 ${cat.color} bg-white border border-[#e5ded3] shadow-sm`}>
                        <cat.icon className="text-xl" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-tight text-[#333333]">{cat.category}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </aside>

            {/* RIGHT COL: ACCORDIONS */}
            <div className="lg:col-span-8">
              {ABOUT_DATA.map((cat) => (
                <section key={cat.category} className="mb-12">
                  <div className="mb-6 flex items-center gap-4">
                    <div className="h-px flex-1 bg-[#e5ded3]" />
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#a56657]">{cat.category}</h3>
                    <div className="h-px flex-1 bg-[#e5ded3]" />
                  </div>

                  <div className="space-y-4">
                    {cat.items.map((item) => (
                      <AboutItem 
                        key={item.id}
                        {...item}
                        isOpen={openId === item.id}
                        toggle={() => setOpenId(openId === item.id ? null : item.id)}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AboutUs;
