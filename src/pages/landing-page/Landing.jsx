import {
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiCopy,
  FiEdit3,
  FiPlus,
  FiSend,
  FiX,
} from "react-icons/fi";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import logo from "../../assets/logo.svg";
import heroImageOne from "../../assets/1.png";
import heroImageTwo from "../../assets/2.png";
import audiomack from "../../assets/audiomack.svg";
import ditto from "../../assets/ditto.svg";
import amuse from "../../assets/amuse.svg";
import unitedmasters from "../../assets/united-masters.svg";
import cdbaby from "../../assets/cd-baby.svg";
import tunecore from "../../assets/tunecore.svg";
import soundcloud from "../../assets/soundcloud.svg";
import symphonic from "../../assets/symphonic.svg";
import patreon from "../../assets/patreon.svg";
import labelwork from "../../assets/label-work.svg";
import bandzoogle from "../../assets/bandzoogle.svg";
import white32 from "../../assets/white-32.svg";
import spin from "../../assets/spin.svg";
import musichub from "../../assets/music-hub.svg";
import curatorTypesImage from "../../assets/discover.png";
import curatorSectionImage from "../../assets/dash.avif";
import people from "../../assets/dedicated.avif";
import globalImage from "../../assets/global.avif";
import imageOne from "../../assets/check1.avif";
import imageTwo from "../../assets/check2.avif";
import imageThree from "../../assets/check3.avif";

const applicationSteps = [
  {
    title: "Submit your application",
    description:
      "Complete the application form with your details, including your platform, audience, and music interests.",
  },
  {
    title: "Our team carefully reviews",
    description:
      "Only curators who fulfill all our criteria and requirements are accepted, ensuring that our platform remains a trusted community of talented and impactful professionals.",
  },
  {
    title: "Get verified and start discovering new talent",
    description:
      "Once approved, you'll become a verified Groover curator or pro, gaining access to new music, providing valuable feedback, and getting paid for your insights.",
  },
];

const curatorTestimonials = [
  {
    image: imageOne,
    quote:
      "Being present and active on Groover gives me the opportunity to stay closely connected to the music scene with a fresh and ultra-current perspective. The exchanges with artists are enriching for both sides: learning to analyze a track, identifying strengths and weaknesses, spotting areas for improvement and an artist's unique qualities. Being able to offer this expertise to young artists is important to me.",
    name: "Sandra Gomez",
    role: "Co-host on Apple Music & Konbini's head of music",
  },
  {
    image: imageTwo,
    quote:
      "We absolutely love working with Groover! We've discovered so many incredible artists we might never have found otherwise. The platform is incredibly easy to use and it's become a big part of our workday as we look forward to finding more amazing indie musicians",
    name: "alexrainbirdMusic",
    role: "+1.3 million subscribers on Youtube",
  },
  {
    image: imageThree,
    quote:
      "My experience with Groover has been wonderful. I have had the opportunity to discover incredible artists from all over the world, and their songs have become part of my life, helping me see a wider and more colorful world every day. As a music lover, this process has also been full of great learnings and lessons that I want to humbly share with you.",
    name: "Ricardo Durán",
    role: "Rolling Stone’s editor in chief en Español",
  },
];

const Landing = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const [openBenefitIndex, setOpenBenefitIndex] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [heroImageIndex, setHeroImageIndex] = useState(0);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const heroImages = [heroImageOne, heroImageTwo];
  // eslint-disable-next-line no-unused-vars
  const [counters, setCounters] = useState({
    playlists: 0,
    campaigns: 0,
    streams: 0,
    tiktok: 0,
    videos: 0,
    views: 0,
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Animate counters when page loads
    const timer = setTimeout(() => {
      setCounters({
        playlists: 10597,
        campaigns: 13049,
        streams: 157.2,
        tiktok: 7239,
        videos: 53287,
        views: 1.7,
      });
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroImageIndex((currentIndex) => (currentIndex + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [heroImages.length]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTestimonialIndex(
        (currentIndex) => (currentIndex + 1) % curatorTestimonials.length,
      );
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const fadeIn = (direction, delay) => ({
    initial: {
      y: direction === "up" ? 100 : direction === "down" ? -100 : 0,
      x: direction === "left" ? 100 : direction === "right" ? -100 : 0,
      opacity: 0,
    },
    animate: {
      y: 0,
      x: 0,
      opacity: 1,
      transition: {
        type: "tween",
        duration: 1,
        delay: delay * 0.1,
      },
    },
  });

  const faqData = [
    {
      question: "What is Groover?",
      answer: `Groover helps artists and their representatives (label managers, PR agents, publishers etc.) get their music heard.

Through an innovative web platform, Groover connects artists who want to promote their music with the best curators, radios and labels seeking emerging talents. On Groover, artists can send their music directly to a selection of blogs, radios, playlist curators, record labels and pros of their choice, get feedback guaranteed, and coverage!

Thanks to Groover, more than 3,000 active music curators and pros have given more than 4 million pieces of feedback, 1 million+ shares (reviews, playlist adds etc.) and 1,000+ signatures on record labels.`,
    },
    {
      question: "How do I apply to become a curator on Groover?",
      answer: `In order to become a music curator/pro on Groover you will have to check all these boxes:

• Your project/work is serious and solid

• You've been active for a significant amount of time, and are currently active

• You create valuable content that helps showcase emerging artists

• You have a website and/or Facebook/Instagram page with a significant audience

• You're able to offer opportunities/coverage /wise and detailed advice to the artists that resonate with you

We remain completely free to approve or disapprove a new curator/pro to maintain the coherence of the list of contacts offered to our artists.Validation of your applicationAfter your application, we'll contact you shortly to approve your application, ask for more information or decline it.

To maximize your chances of being approved as a music curator/pro, we advise you to fully fill in your profile by indicating the musical genres you like and write about, what you want or do not want to receive, your favorite artists and a short description. You will receive an onboarding email if your application is approved. The usual delay to approve new music influencers is between 24 and 48 hours.`,
    },
    {
      question: "How do I get paid as a curator on Groover?",
      answer:
        "You earn 1 Grooviz (1€) for each track you review and provide feedback on. Your earnings are automatically added to your account, and you can cash out once you reach the minimum threshold.",
    },
    {
      question: "Are there any rules for giving feedback?",
      answer: `Each curator/pro joining Groover has to approve the Guidelines for Groover Curators. It is important that you try to put yourself in the shoes of the artists you're giving feedback to. What's important to them is to:
• Get your view on their track, obtain a clear decision regarding you sharing them or not / getting in touch with them or not
• Get constructive advice to improve their work and/or their strategy
• Understand why you liked/didn't like - and especially in that case - their track`,
    },
    {
      question: "What kind of music can I expect to receive?",
      answer: `Groover curators receive a wide range of music from independent artists across genres. You can even set preferences for the types of tracks you’d like to receive so that the music you receive is tailored to your taste.

You can refine your preferred music genres on your profile. Being as precise as you can - and selective! - will increase the chances that the artists closest to your music tastes will send you their tracks. Do not hesitate to fill in the "Preferences" box to indicated what you want and what you do not want to receive, it only takes a few minutes.`,
    },
    {
      question: "How long does it take to set up a curator account?",
      answer:
        "Setting up your curator account is quick and easy! Once you apply and are approved, you can start reviewing tracks within minutes.",
    },
    {
      question: "Can I reject tracks I don't want to review?",
      answer:
        "Yes, you have full control over which tracks you choose to review. Groover allows you to filter submissions based on your preferences.",
    },
  ];
  const handleFaqToggle = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handleBenefitToggle = (index) => {
    setOpenBenefitIndex(openBenefitIndex === index ? null : index);
  };

  const handleTestimonialChange = (direction) => {
    setTestimonialIndex((currentIndex) => {
      const nextIndex =
        (currentIndex + direction + curatorTestimonials.length) %
        curatorTestimonials.length;

      return nextIndex;
    });
  };

  const trustedLogos = [
    { source: audiomack, alt: "Audiomack" },
    { source: ditto, alt: "Ditto Music" },
    { source: amuse, alt: "Amuse" },
    { source: unitedmasters, alt: "UnitedMasters" },
    { source: cdbaby, alt: "CD Baby" },
    { source: tunecore, alt: "TuneCore" },
    { source: soundcloud, alt: "SoundCloud" },
    { source: symphonic, alt: "Symphonic" },
    { source: patreon, alt: "Patreon" },
    { source: labelwork, alt: "Label Work" },
    { source: bandzoogle, alt: "Bandzoogle" },
    { source: white32, alt: "White32" },
    { source: spin, alt: "Spin" },
    { source: musichub, alt: "Music Hub" },
  ];

  const benefitsData = [
    {
      icon: FiSend,
      title: "Create your curator account",
      description:
        "Join 3,000+ music pros. Submit your application today to discover new talent & fresh new songs",
    },
    {
      icon: FiCopy,
      title: "Curated tracks, just for you",
      description:
        "Access a constant flow of tailored new music submissions and find hidden gems for your playlists, blogs and more.",
    },
    {
      icon: FiEdit3,
      title: "Give feedback & get paid",
      description:
        "Earn for every submission you review whatever your decision is. Keep your complete editorial independence.",
    },
    {
      icon: FiClock,
      title: "Save time",
      description:
        "Quickly discover new music and connect with artists, rather than spending time sorting through your emails.",
    },
  ];

  const curatorTypes = [
    {
      title: "Visibility",
      subtitle: "Amplify emerging talent",
      description:
        "Connect directly with artists looking to expand their reach, whether you curate playlists, own a blog or music channel, or create music content. As a visibility curator, your platform brings artists closer to their audience.",
      imageClass: "bg-[#ff7f55]",
      accentClass: "bg-[#ef4f35]",
    },
    {
      title: "Partners",
      subtitle: "Boost their career",
      description:
        "Bring artists' projects to life. If you're searching for talent to sign to your label, setting up live shows as a booker, or securing publishing and sync opportunities, your expertise guides artists through key milestones in their careers.",
      imageClass: "bg-[#ffc263]",
      accentClass: "bg-[#f0a63a]",
    },
    {
      title: "Coaches",
      subtitle: "Shape sound and strategy",
      description:
        "Offer constructive & valuable feedback that artists can use to refine their music and approach. From sound quality to strategic advice, your insights provide valuable direction, helping them stand out in a crowded field.",
      imageClass: "bg-[#d6b2f5]",
      accentClass: "bg-[#b889df]",
    },
  ];

  const activeTestimonial = curatorTestimonials[testimonialIndex];

  return (
    <div className="bg-[#F7F6F0] overflow-x-clip">
      {/* HEADER */}
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-white shadow-lg" : "bg-white"
        }`}
      >
        <div className="mx-auto flex max-w-[1250px] min-w-0 items-center justify-between gap-3 px-3 py-3 sm:px-4 sm:py-4">
          <div className="flex min-w-0 flex-1 items-center">
            <img
              src={logo}
              alt="Groover"
              className="h-auto w-[118px] max-w-full sm:w-[150px]"
            />
          </div>

          <div className="flex shrink-0">
            <a
              href="/login"
              className="rounded-md bg-[#EC6345] px-3 py-2 text-[11px] font-semibold text-white transition hover:bg-[#BA5225] hover:shadow-lg sm:px-4 sm:py-3 sm:text-xs"
            >
              Apply as a Curator/pro
            </a>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative mt-12 flex min-h-[600px] items-center overflow-hidden bg-[#F7F6F0] px-3 sm:px-4 md:px-5"
      >
        <div className="relative mx-auto flex w-full flex-col items-center gap-10 py-10 md:max-w-[1250px] md:px-6 lg:flex-row lg:gap-10 lg:px-0">
          {/* ── LEFT: Text ── */}
          <div className="flex-shrink-0 w-full lg:w-[45%] text-left z-10">
            <motion.h1
              variants={fadeIn("up", 0)}
              initial="initial"
              animate="animate"
              className="md:block pt-8 hidden text-4xl md:text-[60px] font-bold mb-6 leading-tight text-[#333333] md:text-left text-center font-heading"
            >
              Join our exclusive community of music curators
            </motion.h1>

            <motion.h1
              variants={fadeIn("up", 0)}
              initial="initial"
              animate="animate"
              className="md:hidden text-[36px] font-bold my-6 leading-tight text-[#333333] text-center font-heading"
            >
              Join our exclusive community of music curators
            </motion.h1>

            <motion.p
              variants={fadeIn("up", 1)}
              initial="initial"
              animate="animate"
              className="md:block hidden font-sans text-md mb-10 text-[#333333] leading-relaxed"
            >
              On Groover, discover new artists, provide valuable feedback, and
              get paid listening to music in total independence. Join a curated
              community of 3,000+ music pros who are helping artists from all
              horizons.
            </motion.p>

            <motion.p
              variants={fadeIn("up", 1)}
              initial="initial"
              animate="animate"
              className="md:hidden text-md font-sans mb-10 text-[#333333] text-center leading-relaxed"
            >
              On Groover, discover new artists, provide valuable feedback, and
              get paid listening to music in total independence. Join a curated
              community of 3,000+ music pros who are helping artists from all
              horizons.
            </motion.p>

            <motion.div
              variants={fadeIn("up", 2)}
              initial="initial"
              animate="animate"
              className="md:flex md:flex-row grid grid-cols-1 items-center gap-4 md:mb-10"
            >
              <a
                href="/login"
                className="px-7 py-4 md:py-5 rounded-md font-bold text-white text-md text-center transition-all bg-[#EC6345] hover:brightness-90 active:scale-95"
              >
                Apply now as a curator
              </a>
            </motion.div>
          </div>

          {/* RIGHT: Rotating hero image */}
          <motion.div
            variants={fadeIn("up", 2)}
            initial="initial"
            animate="animate"
            className="z-10 flex w-full min-w-0 flex-1 justify-center px-1 sm:px-2 md:w-full md:px-0 md:pl-20"
          >
            <div className="relative aspect-[4/3] w-full max-w-[34rem] md:max-w-none">
              <AnimatePresence mode="wait">
                <motion.img
                  key={heroImageIndex}
                  src={heroImages[heroImageIndex]}
                  alt="Groover curator dashboard preview"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="absolute inset-0 w-full h-full object-contain md:scale-100"
                />
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* SOCIAL PROOF - LOGOS */}
      <section className="pb-12 px-4 bg-[#F7F6F0]">
        <div className="max-w-[1250px] mx-auto text-center">
          <p className="text-[#525252] text-[16px] mb-8 font-heading font-medium">
            Trusted by
          </p>
          <div
            className="overflow-hidden"
            style={{
              WebkitMaskImage:
                "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
              maskImage:
                "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
            }}
          >
            <motion.div
              className="flex w-max flex-nowrap items-center"
              animate={{ x: ["0%", "-50%"] }}
              transition={{
                duration: 45,
                ease: "linear",
                repeat: Infinity,
              }}
            >
              {[false, true].map((isDuplicate) => (
                <div
                  key={isDuplicate ? "duplicate" : "primary"}
                  className="flex shrink-0 items-center gap-10 pr-10"
                  aria-hidden={isDuplicate}
                >
                  {trustedLogos.map((logo) => (
                    <img
                      key={`${isDuplicate ? "duplicate" : "primary"}-${logo.alt}`}
                      src={logo.source}
                      alt={isDuplicate ? "" : logo.alt}
                      className="h-8 w-auto shrink-0 object-contain opacity-80 transition-opacity hover:opacity-100"
                    />
                  ))}
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* BENEFITS SECTION */}
      <section className="px-2 pb-12 md:px-4 bg-[#F7F6F0]">
        <div className="mx-auto max-w-[1250px]">
          <div className="hidden rounded-[24px] bg-[#272727] px-6 py-10 md:grid md:grid-cols-4 lg:px-14">
            {benefitsData.map(({ icon: Icon, title, description }, index) => (
              <div
                key={title}
                className={`px-2 text-white ${
                  index < benefitsData.length - 1
                    ? "border-r border-white/20"
                    : ""
                }`}
              >
                <Icon className="mb-5 h-6 w-6 text-white/90" />
                <h2 className="mb-4 font-heading text-[16px] font-bold leading-tight">
                  {title}
                </h2>
                <p className="font-sans text-[13px] font-semibold leading-relaxed text-white/90">
                  {description}
                </p>
              </div>
            ))}
          </div>

          <div className="space-y-1.5 md:hidden">
            {benefitsData.map(({ icon: Icon, title, description }, index) => {
              const isOpen = openBenefitIndex === index;

              return (
                <div key={title} className="rounded-lg bg-[#272727] text-white">
                  <button
                    type="button"
                    onClick={() => handleBenefitToggle(index)}
                    className="flex w-full items-center gap-3 px-5 py-4 text-left"
                    aria-expanded={isOpen}
                  >
                    <Icon className="h-4 w-4 shrink-0 text-white/80" />
                    <span className="flex-1 font-heading text-[16px] font-bold leading-tight">
                      {title}
                    </span>
                    {isOpen ? (
                      <FiX className="h-5 w-5 shrink-0 text-white/70" />
                    ) : (
                      <FiPlus className="h-5 w-5 shrink-0 text-white/70" />
                    )}
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="benefit-description"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-5 font-sans text-[12px] font-semibold leading-relaxed text-white/90">
                          {description}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CURATOR TYPES SECTION */}
      <section id="spotify" className="bg-[#F7F6F0] px-4 md:py-16 md:px-8">
        <div className="mx-auto max-w-[1250px]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[0.85fr_1fr] lg:gap-28"
          >
            <img
              src={curatorTypesImage}
              alt="Music studio session"
              className="order-2 h-[320px] w-full rounded-lg object-cover object-center md:h-[490px] lg:order-1"
            />

            <div className="order-1 space-y-8 text-[#333333] md:space-y-14 lg:order-2">
              <h2 className="font-heading text-[34px] font-bold leading-tight md:text-[44px] lg:text-[46px]">
                Discover and curate the best new music
              </h2>
              <p className="font-sans text-[16px] font-medium leading-relaxed md:text-[17px]">
                Join Groover&apos;s selective community of passionate curators
                who support emerging artists with thoughtful feedback and
                curated playlists. Our focus is on quality, not quantity - we
                prioritize real music lovers who want to make a difference in
                artists&apos; journeys.
              </p>
              <p className="font-sans text-[16px] font-medium leading-relaxed md:text-[17px]">
                Groover connects you directly with rising stars eager for your
                expert insight. While there&apos;s an opportunity to earn money,
                the real value comes from shaping the future of music and
                helping artists thrive with meaningful support.
              </p>
              <p className="font-sans text-[16px] font-medium leading-relaxed md:text-[17px]">
                At Groover, we&apos;re looking for curators from all corners of
                the music industry, with three main types: Visibility, Partners,
                and Coaches/Mentors.
              </p>
            </div>
          </motion.div>

          <div className="mt-16 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 md:mt-24 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:pb-0">
            {curatorTypes.map((type) => (
              <motion.article
                key={type.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="w-[62vw] min-w-[220px] shrink-0 snap-start text-[#333333] md:w-auto md:min-w-0"
              >
                <div
                  className={`relative mb-5 flex aspect-[2/1] items-center justify-center overflow-hidden rounded-md ${type.imageClass}`}
                >
                  <div
                    className={`absolute -left-20 -top-20 h-52 w-52 rounded-full opacity-50 ${type.accentClass}`}
                  />
                  <div
                    className={`absolute -right-16 -bottom-16 h-48 w-48 rounded-full opacity-50 ${type.accentClass}`}
                  />
                  <h3 className="relative z-10 font-heading text-[34px] font-bold leading-none md:text-[38px]">
                    {type.title}
                  </h3>
                </div>
                <h4 className="mb-2 font-heading text-[18px] font-bold leading-tight">
                  {type.subtitle}
                </h4>
                <p className="font-sans text-[15.5px] leading-relaxed">
                  {type.description}
                </p>
              </motion.article>
            ))}
          </div>

          <div className="text-center">
            <a
              href="/login"
              className="inline-block rounded-md bg-[#EC6345] md:mb-0 mb-8 px-6 py-4 md:mt-8 font-heading text-[16px] font-bold text-white transition hover:bg-[#BA5225] active:scale-95"
            >
              Join our curated community
            </a>
          </div>
        </div>
      </section>

      {/* VERIFIED CURATOR SECTION */}
      <section className="bg-[#272727] px-4 py-16 md:px-8 md:py-20">
        <div className="mx-auto max-w-[1250px]">
          <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:items-center lg:gap-24">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="order-2 flex justify-center lg:order-1"
            >
              <img
                src={curatorSectionImage}
                alt="Groover curator dashboard"
                className="w-full max-w-[520px] object-contain"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="order-1 text-white lg:order-2"
            >
              <h2 className="mb-10 max-w-2xl font-heading text-[34px] font-bold leading-tight md:text-[44px]">
                Join Groover as a verified curator or music pro in just a few
                steps
              </h2>

              <div className="space-y-9">
                {applicationSteps.map((step, index) => (
                  <div key={step.title} className="flex gap-3">
                    <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-[#f5b35f] font-heading text-[18px] font-bold text-[#f5b35f]">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="mb-2 font-heading text-[22px] font-bold leading-tight">
                        {step.title}
                      </h3>
                      <p className="max-w-xl font-sans text-[15.5px] font-semibold leading-relaxed text-white/85">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="mt-16 flex flex-col items-stretch justify-center gap-4 md:flex-row md:items-center">
            <a
              href="/login"
              className="inline-block w-full rounded-md bg-[#EC6345] px-6 py-4 text-center font-heading text-[16px] font-bold text-white transition hover:bg-[#BA5225] active:scale-95 md:w-auto"
            >
              Submit your application
            </a>
            <a
              href="/login"
              className="inline-block w-full rounded-md border border-[#EC6345] px-6 py-4 text-center font-heading text-[16px] font-bold text-[#EC6345] transition hover:bg-[#EC6345] hover:text-white active:scale-95 md:w-auto"
            >
              Learn more about Groover
            </a>
          </div>

          <div className="mx-auto my-16 h-px max-w-4xl bg-white/25 md:my-20" />

          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div className="text-white">
              <h2 className="mb-8 max-w-sm font-heading text-[34px] font-bold leading-tight md:text-[42px]">
                Check out what curators have to say about Groover
              </h2>
              <div className="flex justify-center gap-4 lg:justify-start">
                <button
                  type="button"
                  onClick={() => handleTestimonialChange(-1)}
                  className="flex h-12 w-12 items-center justify-center rounded border border-[#EC6345] text-[#EC6345] transition hover:bg-[#EC6345] hover:text-white"
                  aria-label="Previous testimonial"
                >
                  <FiChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleTestimonialChange(1)}
                  className="flex h-12 w-12 items-center justify-center rounded border border-[#EC6345] text-[#EC6345] transition hover:bg-[#EC6345] hover:text-white"
                  aria-label="Next testimonial"
                >
                  <FiChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="overflow-hidden rounded bg-[#151515]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={testimonialIndex}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="grid grid-cols-1 md:grid-cols-[0.8fr_1.5fr]"
                >
                  <img
                    src={activeTestimonial.image}
                    alt={activeTestimonial.name}
                    className="h-[280px] w-full object-cover object-top md:h-full"
                  />
                  <div className="p-7 text-white md:p-10">
                    <p className="mb-6 font-sans text-[15.5px] font-semibold leading-relaxed text-white/90">
                      &ldquo;{activeTestimonial.quote}&rdquo;
                    </p>
                    <p className="font-heading text-[18px] font-bold leading-snug text-[#EC6345]">
                      {activeTestimonial.name} ({activeTestimonial.role})
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* REWARDS CTA SECTION */}
      <section className="bg-[#EEEEEE] px-4 py-20 md:px-8 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto flex max-w-[1250px] flex-col items-center text-center"
        >
          <h2 className="mb-8 max-w-5xl font-heading text-[34px] font-bold leading-tight text-[#333333] md:text-[36px]">
            Get rewarded for your time curating new music
          </h2>
          <p className="max-w-4xl font-sans text-[17px] leading-relaxed text-[#333333] md:text-[16px]">
            For each track you listen to and provide feedback on, you&apos;ll
            earn at least 1 Grooviz, which equals to &euro;1. You get paid
            whether you decide to share the track, connect with the artist, or
            not, so that you remain completely independent on an editorial point
            of view. Discover new music, share your expertise, and get rewarded
            for every review!
          </p>
          <a
            href="/login"
            className="mt-14 inline-block rounded-md bg-[#EC6345] px-8 py-4 text-[16px] font-bold text-white transition hover:bg-[#BA5225] active:scale-95"
          >
            Get started now
          </a>
        </motion.div>
      </section>

      {/* DAILY SUPPORT SECTION */}
      <section className="bg-[#F7F6F0] px-4 py-16 md:px-8 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-[1250px]"
        >
          <h2 className="mb-12 text-center font-heading text-[28px] font-bold leading-tight text-[#333333] md:mb-14 md:text-[34px]">
            Supporting your music career every day
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
            <div className="relative flex h-[280px] items-center justify-center overflow-hidden rounded border border-[#272727] bg-[#b98ae6] text-center text-white md:col-span-5 md:h-[292px]">
              <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-white/10" />
              <div className="absolute -bottom-28 right-16 h-72 w-72 rounded-full bg-[#d2aaf2]/45" />
              <div className="relative z-10 max-w-md px-8">
                <p className="font-heading text-[58px] font-bold leading-none tracking-[0.12em] md:text-[64px]">
                  3,000+
                </p>
                <p className="mt-4 font-sans text-[17px] leading-snug md:text-[18px]">
                  blogs, playlists, radio stations, labels, bookers, and other
                  pros in our curated network
                </p>
              </div>
            </div>

            <div className="h-[280px] overflow-hidden rounded border border-[#272727] bg-[#272727] text-center text-white md:col-span-7 md:h-[292px]">
              <div className="flex h-[140px] flex-col items-center justify-center px-8 md:h-[148px]">
                <h3 className="font-heading text-[28px] font-bold leading-tight md:text-[30px]">
                  A dedicated team
                </h3>
                <p className="mt-5 max-w-2xl font-sans text-[16px] leading-snug md:text-[18px]">
                  We&apos;re a passionate crew dedicated to supporting you with
                  tools and opportunities to discover new talent and grow your
                  influence.
                </p>
              </div>
              <img
                src={people}
                alt="Groover community"
                className="h-[140px] w-full object-cover object-center md:h-[144px]"
              />
            </div>

            <div className="h-[280px] overflow-hidden rounded border border-[#272727] bg-[#272727] text-center text-white md:col-span-7 md:h-[292px]">
              <div className="flex h-[140px] flex-col items-center justify-center px-8 md:h-[148px]">
                <h3 className="font-heading text-[28px] font-bold leading-tight md:text-[30px]">
                  Global Curators & Pros
                </h3>
                <p className="mt-5 max-w-2xl font-sans text-[16px] leading-snug md:text-[18px]">
                  Be part of a global community of curators and professionals,
                  connecting with artists across sync, playlists, radio, and
                  more.
                </p>
              </div>
              <img
                src={globalImage}
                alt="Global curator categories"
                className="h-[140px] w-full object-cover object-center md:h-[144px]"
              />
            </div>

            <div className="relative flex h-[280px] items-center justify-center overflow-hidden rounded border border-[#272727] bg-[#b98ae6] text-center text-white md:col-span-5 md:h-[292px]">
              <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/10" />
              <div className="absolute -bottom-28 right-10 h-72 w-72 rounded-full bg-[#d2aaf2]/45" />
              <div className="relative z-10 max-w-md px-8">
                <p className="font-heading text-[54px] font-bold leading-none tracking-[0.08em] md:text-[62px]">
                  500,000+
                </p>
                <p className="mt-4 font-sans text-[17px] leading-snug md:text-[18px]">
                  artists are actively seeking your expertise on Groover. Give
                  feedback, discover fresh talent and get paid to listen to
                  music.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-11 text-center">
            <a
              href="/login"
              className="inline-block rounded bg-[#EC6345] px-6 py-3 font-sans text-[14px] font-bold text-white transition hover:bg-[#BA5225] active:scale-95"
            >
              Try Groover today
            </a>
          </div>
        </motion.div>
      </section>

      <section className="bg-[#272727] px-4 py-20 text-center md:px-8 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-[1250px]"
        >
          <h2 className="font-heading text-[30px] font-bold leading-tight text-white md:text-[36px]">
            Join a community that values quality and passion
          </h2>
          <p className="mx-auto mt-7 max-w-3xl font-sans text-[14px] font-bold leading-relaxed text-white/90">
            We&apos;re selective about the curators we onboard, focusing on
            those who truly want to help artists grow. Apply now to make a real
            impact.
          </p>
          <a
            href="/login"
            className="mt-12 inline-block rounded bg-[#EC6345] px-6 py-4 font-sans text-[14px] font-bold text-white transition hover:bg-[#BA5225] active:scale-95"
          >
            Submit your application
          </a>
        </motion.div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="bg-[#F7F6F0] px-4 py-20 md:px-8 md:py-24">
        <div className="mx-auto grid max-w-[1250px] grid-cols-1 gap-10 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-4">
            <h2 className="font-heading text-[36px] font-bold leading-tight text-[#333333] md:text-[42px]">
              Frequently asked
              <br />
              questions
            </h2>
          </div>

          <div className="md:col-span-8">
            <div className="space-y-1.5">
              {faqData.map((faq, index) => {
                const isOpen = openFaqIndex === index;

                return (
                  <div
                    key={faq.question}
                    className="overflow-hidden rounded bg-[#f0f0f0] text-[#333333]"
                  >
                    <button
                      onClick={() => handleFaqToggle(index)}
                      className="flex w-full items-start justify-between gap-6 px-6 py-5 text-left transition hover:bg-[#e9e9e9] md:px-8"
                    >
                      <h3 className="font-heading text-[16px] font-bold leading-tight md:text-[20px]">
                        {faq.question}
                      </h3>
                      <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center text-[#333333]">
                        {isOpen ? (
                          <FiX className="text-[20px]" />
                        ) : (
                          <FiPlus className="text-[22px]" />
                        )}
                      </span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          key="answer"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-8 font-sans text-[12px] leading-relaxed text-[#4a4a4a] whitespace-pre-line md:px-8 md:text-[14px]">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            <div className="mt-12 flex flex-col gap-4 sm:flex-row">
              <a
                href="/login"
                className="rounded bg-[#EC6345] px-7 py-4 text-center font-sans text-[16px] font-bold text-white transition hover:bg-[#BA5225] active:scale-95"
              >
                Join our exclusive community
              </a>
              <a
                href="#faq"
                className="rounded border border-[#EC6345] px-7 py-4 text-center font-sans text-[16px] font-bold text-[#EC6345] transition hover:bg-[#EC6345] hover:text-white active:scale-95"
              >
                Read the F.A.Q.
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#121212] text-gray-300 py-16 px-4">
        <div className="max-w-6xl mx-auto ">
          <div className="border-gray-800 ">
            <div className="flex flex-col items-left mb-8 text-center items-center">
              <img
                src={logo}
                alt="Groover"
                className="w-[200px] h-auto mb-6"
              />

              {/* Social Icons Under Logo (commented out per request) */}
              {/* <div className="flex gap-6">
                ...social icons removed
              </div> */}
            </div>

            <div className="text-sm text-white space-y-2 text-center items-center">
              <p>Made with ❤ by artists for artists</p>
              <p>&copy; Groover All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

