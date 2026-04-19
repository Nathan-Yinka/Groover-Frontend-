import { BiMusic } from "react-icons/bi";
import { GiPowerLightning } from "react-icons/gi";
import { motion } from "framer-motion";
import { fadeIn } from "../../motion";
import { FaPeopleCarry, FaLightbulb, FaHandshake } from "react-icons/fa";
import BackButton from "./components/BackButton";
import BottomNavMobile from "./components/BottomNavMobile";

const aboutSections = [
  {
    title: "Our Story",
    icon: FaPeopleCarry,
    iconClass: "text-accent",
    paragraphs: [
      "Groover started with a friendship and grew to be a successful business that still retains its core values: putting great emphasis on teamwork, transparency, commitment, consistency, quality, and always being ready to support and help both clients and colleagues.",
      "Founded in 2013 by professional affiliate marketers and webmasters with over 20 years of experience, Groover has developed into a trusted name in the industry. What started as a shared vision has now blossomed into a platform that blends technology and human intelligence to deliver excellence.",
    ],
  },
  {
    title: "Our Vision",
    icon: FaLightbulb,
    iconClass: "text-[#ffd166]",
    paragraphs: [
      '"We were friends at school and university, brought together by our shared interest in technology and marketing, as well as the desire to find the best way to attain self-realization and success. While striving to grow financially, we did not want to get tangled up in the complex corporate culture."',
      "Groover's founders wanted to create something new, both for themselves and for the market. The result is a company with a professional IT department, experienced account managers, and a team of dedicated employees who strive to provide outstanding support and solutions for advertisers and publishers.",
    ],
  },
  {
    title: "Our Mission",
    icon: FaLightbulb,
    iconClass: "text-[#61d39b]",
    paragraphs: [
      "We connect advertisers and publishers of all sizes globally, helping them grow their capital, develop their skills, and improve as professionals to ensure a successful present and future.",
      "By setting high traffic and service quality standards, we contribute to the development of the adtech market. Through our innovative products, we aim to foster growth, share knowledge, and collaborate with the community to build a brighter future for all.",
    ],
  },
  {
    title: "Industry Recognition",
    icon: FaHandshake,
    iconClass: "text-[#66a3ff]",
    paragraphs: [
      "Today, Groover is a well-known brand with a strong reputation and has been recognized by numerous bloggers and affiliates as one of the top adtech platforms. Our blend of innovative technology and human intelligence makes us a trusted partner in the industry.",
      "We believe that our dedication to excellence and support for both advertisers and publishers is what sets us apart and drives our success.",
    ],
  },
  {
    title: "Empowering Artists Everywhere",
    icon: GiPowerLightning,
    iconClass: "text-[#ff6b6b]",
    paragraphs: [
      "Groover exists to give every artist a fair shot at being heard. Whether you are just starting out or already a platinum-selling musician, our platform connects your music with a global network of bloggers, reviewers, playlisters, radio hosts, and industry tastemakers.",
      "With curators from over 100 countries, we have already helped generate more than 1.4 million pieces of coverage for artists worldwide.",
    ],
  },
  {
    title: "Built by Music People, For Music People",
    icon: BiMusic,
    iconClass: "text-[#bc8dff]",
    paragraphs: [
      "We are industry professionals who believe music promotion should be fair, affordable, and accessible. Every submission is listened to and vetted, ensuring that if your track makes it onto our platform, it gets genuine coverage from reviews and interviews to playlists, radio plays, features, and influencer shoutouts.",
      "Groover is not just a service, it is a mission: to democratize music promotion and make sure grassroots and independent artists thrive. Because great music deserves to be discovered.",
    ],
  },
];

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-[#060606] text-white">
      <div className="w-full space-y-5 px-3 py-4 pb-24 md:space-y-6 md:px-8 md:py-6 md:pb-8">
        <div className="rounded-2xl border border-white/10 bg-[#0d0f10] p-4 shadow-[0_24px_60px_-35px_rgba(0,0,0,0.95)] md:p-6">
          <BackButton className="mb-5" />
          <h1 className="text-center text-2xl font-bold tracking-tight text-white md:text-4xl">
            About Us
          </h1>
          <p className="mx-auto mt-2 max-w-[840px] text-center text-xs text-white/65 md:text-sm">
            The story, mission, and values behind Groover.
          </p>
        </div>

        <div className="space-y-3 md:space-y-4">
          {aboutSections.map((section, index) => {
            const SectionIcon = section.icon;
            return (
              <motion.section
                key={section.title}
                initial={fadeIn("up", null).initial}
                whileInView={fadeIn("up", (index + 1) * 2).animate}
                viewport={{ once: false, amount: 0.2 }}
                className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#101214] via-[#121417] to-[#0c0d0f] p-4 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.95)] md:p-6"
              >
                <div className="mb-4 flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-[#15181b]">
                    <SectionIcon className={`text-xl ${section.iconClass}`} />
                  </span>
                  <h2 className="text-lg font-semibold text-white md:text-2xl">
                    {section.title}
                  </h2>
                </div>
                <div className="space-y-3 md:space-y-4">
                  {section.paragraphs.map((text, paragraphIndex) => (
                    <p
                      key={`${section.title}-${paragraphIndex}`}
                      className="text-sm leading-relaxed text-white/75 md:text-base"
                    >
                      {text}
                    </p>
                  ))}
                </div>
              </motion.section>
            );
          })}
        </div>

        <BottomNavMobile className="md:hidden" />
      </div>
    </div>
  );
};

export default AboutUs;
