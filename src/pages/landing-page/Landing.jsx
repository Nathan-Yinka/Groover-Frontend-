/* eslint-disable react/prop-types */
import { BiChevronDown } from "react-icons/bi";
import { BiCheck } from "react-icons/bi";
import { BiX } from "react-icons/bi";
import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import logo from "../../assets/logo.svg";
import spotifyChart from "../../assets/spotify-charts.svg";
import tiktokChart from "../../assets/tiktok-chart.svg";
import phoneImage from "../../assets/spotify-playlist-min.webp";
import peopleImage from "../../assets/people-min.webp";
import starRating from "../../assets/star-rating-4.svg";
import UMG from "../../assets/UMG.webp";
import WMG from "../../assets/WMG.webp";
import Sony from "../../assets/sony.webp";
import Ditto from "../../assets/ditto.webp";
import Symphonic from "../../assets/symphonic.webp";
import playlistsImage from "../../assets/playlists.webp";
import playlistMobile from "../../assets/playlists-mobile.webp";
import playlistSvg from "../../assets/Playlist.svg";
import artistSvg from "../../assets/Artist.svg";
import reviewsSvg from "../../assets/Reviews.svg";
import worldMap from "../../assets/world.webp";
import tiktokImage from "../../assets/tiktok.webp";
import creatorsImage from "../../assets/creators.svg";
import campaignImage from "../../assets/campaigns.svg";
import people from "../../assets/people.webp";
import trustpilot from "../../assets/trustpilot.png";
import santiagoImg from "../../assets/Santiago.webp";
import tyroneImg from "../../assets/Tyrone.webp";
import josephImg from "../../assets/Joseph.webp";
import richardImg from "../../assets/Richard.webp";
import stefanImg from "../../assets/Stefan.webp";
import reviewVideo from "../../assets/reviewvideo.mp4";
import logo1 from "../../assets/logo1.webp";

// Counter animation component
function CountUp({ end, duration = 2, decimals = 0 }) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const countRef = useRef(null);

  useEffect(() => {
    if (!hasAnimated) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setHasAnimated(true);
            const increment = end / (duration * 60);
            let current = 0;

            const timer = setInterval(() => {
              current += increment;
              if (current >= end) {
                setCount(end);
                clearInterval(timer);
              } else {
                setCount(current);
              }
            }, 1000 / 60);

            return () => clearInterval(timer);
          }
        },
        { threshold: 0.5 },
      );

      if (countRef.current) {
        observer.observe(countRef.current);
      }

      return () => observer.disconnect();
    }
  }, [end, duration, hasAnimated]);

  return (
    <span ref={countRef}>
      {decimals > 0
        ? count.toFixed(decimals)
        : Math.floor(count).toLocaleString()}
    </span>
  );
}

// Star rating component
const Stars = ({ count = 5 }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <span
        key={i}
        className={i < count ? "text-yellow-400" : "text-gray-300"}
        style={{ fontSize: 14 }}
      >
        ★
      </span>
    ))}
  </div>
);

// Review card component
const ReviewCard = ({
  name,
  role,
  stars,
  text,
  imgSrc,
  className = "",
  ...motionProps
}) => (
  <motion.div
    {...motionProps}
    className={`bg-white rounded-3xl p-6 flex flex-col gap-4 shadow-sm ${className}`}
  >
    <div className="flex items-center gap-3">
      <img
        src={imgSrc}
        alt={name}
        className="w-14 h-14 rounded-full object-cover"
      />
      <div>
        <p className="font-bold text-gray-900 text-base">{name}</p>
        <Stars count={stars} />
        <p className="text-gray-400 text-xs mt-0.5 leading-snug">{role}</p>
      </div>
    </div>
    <p className="text-gray-700 text-sm leading-relaxed">{text}</p>
  </motion.div>
);

const Landing = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
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

  // Scroll-fade animation variant (fades in AND out on scroll)
  const scrollFade = (delay = 0) => ({
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: false, amount: 0.3 },
    transition: { duration: 0.6, delay, ease: "easeOut" },
  });

  const faqData = [
    {
      question: "What is SoundCampaign and how does it work? Is it legit?",
      answer: `SoundCampaign is an online music promotion service. It helps artists get access to relevant playlists and TikTok creators, enabling them to be discovered by new music fans.

We operate officially and in accordance with Spotify’s policies. Curators are compensated for reviews, not for placements on their playlists, which is not organic and against Spotify’s rules. Therefore, we can’t guarantee playlist placement for all reviews.

However, we do offer organic and honest reviews from real curators who add music to their playlists because they genuinely like it.`,
    },
    {
      question: "How do I promote my music?",
      answer: `Effective music promotion is all about reaching out, communicating with music lovers, and sharing your music with influential curators. You can create a music marketing strategy, build your own website, cold call influencers, pitch music to top bloggers, and perform many more time-consuming tasks.

One of the most popular ways to perform online music promotion today, however, involves sharing your music for review with playlist creators from global streaming platforms such as Spotify. They might leave you a favorable review and some constructive feedback. And if they really like your track, they might just add it to their playlist.

If you want to spend most of your time making and playing music rather than promoting it, you can leave this process to a service like SoundCampaign. It’s a no-risk strategy, as you only pay when Spotify playlist curators listen and review your track.`,
    },
    {
      question: "How can I promote my music?",
      answer: `Fortunately, there are more online music marketing and music distribution options than ever before. Here are just a few of the most effective:

1. Create viral videos with your music and boost your music career
2. Get your tracks on Spotify’s most popular curated playlists
3. Build an online presence with a website and social media marketing
4. Collaborate with other indie artists
5. Reach out to influencers and bloggers
6. License your music for use by other indie artists
7. Advertising
8. PPC ads on Google or other search engines
9. Share your music online
10. Ask music industry professionals for help

But let’s be honest, most people working in the music industry prefer to spend their time making music rather than promoting it. All of these independent music promotions are time-consuming — and some are expensive. 

Indie music promotion sites such as SoundCampaign combine points 1 and 2 on this list, however. And unlike other music promotion services, you only pay when you get results. Out service shares your music with influential playlist curators on Spotify.

SoundCampaign also gives you the chance to go viral on TikTok by making your tracks available to the social media platform’s most successful creators. It’s a professional service for artist development and playlist promotion. And it’s much easier than other methods, including YouTube music promotion or any expensive online ad campaigns.,`,
    },
    {
      question: "Can I promote my music for free?",
      answer: `Yes, it’s possible to promote music online for free, but in most cases, it will involve time, a lot of hard work, and many rejections. You can, for example, offer to collaborate with other independent artists or agree to share their music if they share yours. As an independent artist, you can also gradually build a following via a blog or social media, but without expert help, this process is long and difficult. 

Paying for an affordable music promotion services actually makes more sense — particularly when you only have to pay for results. A music promotion service such as SoundCampaign will get your music in front of TikTok creators and influential Spotify playlist curators. But you only pay for this service when someone reviews your music. 

If SoundCampaign doesn’t deliver genuine reviews from Spotify playlist creators or TikTok creators, you will get your promotion credits back!`,
    },
    {
      question: "Where can I promote my own music?",
      answer: `There are more places for music promotion right now than ever before. Make no mistake: this is a great time to be an independent artist in the music industry. 

Streaming Platforms: Upload your music to popular streaming platforms like Spotify, Apple Music, and YouTube to reach a wider audience with the right music marketing strategy.

Sign up for Spotify music promotion services online: Powerful music promotion services such as SoundCampaign promote tracks to influential playlist creators on Spotify and music video creators on TikTok. If they like what they hear, you might just earn a place on a popular genre-based playlist or viral video. 

Social media marketing: Promote your music on social media platforms like Instagram, Facebook, Twitter and TikTok to engage with fans and gain visibility.

Create a website: Establish a professional website to showcase your music, share updates, and connect with your audience.

Build an email list: Collect email addresses from fans to send them updates, music marketing newsletters, and exclusive content.

Engage with podcasts: Collaborate with podcasters in your genre to feature your music and share your story.

Live performances: Some of the world’s most successful artists started by developing a local fan base in their area. Over time, word of mouth and a buzz around the artist can generate interest beyond the area. Just ask Ed Sheeran!`,
    },
    {
      question: "Do you offer music promotion for independent music artists?",
      answer:
        "Yes, we offer a complete music promotion service that focuses on TikTok and Spotify. Our services are available to anyone who makes music—whether their platinum-selling artists or aspiring musicians making tracks in their bedrooms.",
    },
    {
      question: "What is your approach to music promotion campaigns online?",
      answer:
        "We offer music promotion campaigns that apply to one song. Set a budget, and our platform will market your track to relevant playlist curators and TikTok creators. You’ll receive a notification when your track has been reviewed with feedback or when your track has been added to a Spotify playlist.",
    },
    {
      question: "How much do the best music promotion services cost?",
      answer:
        "You can set the budget you want. Additionally, you only pay for curator submissions when your song is successfully reviewed, or when you receive a TikTok video you like. On SoundCampaign, we provide the best music promotion services and offer a credit back if a submission to a curator or creator doesn’t result in a review.",
    },
    {
      question:
        "I want to be a curator and an artist with SoundCampaign. Is this possible?",
      answer:
        "Yes, you can submit your tracks and curate the music of others, but you will need a separate account (with a unique email address) for each role.",
    },
    {
      question: "Do I need to interact with curators or creators?",
      answer:
        "No, and that’s the beauty of our powerful music promotion service. Our unique matching algorithm handles everything automatically.",
    },
    {
      question: "How do I track the performance of a music promotion campaign?",
      answer:
        "SoundCampaign has real-time campaign reports — ensuring you can track the performance of your music promotion campaigns.",
    },
    {
      question: "How does the TikTok music promotion service work?",
      answer: `Once you’ve paid for a TikTok music promotion campaign, your track will become available to suitable creators — chosen for you based on your requirements and preferences.

If a creator likes your track, they can start working it into a video immediately. This is when you should allow TikTok creators to do what they do best. If you don’t like the video that a creator has made with your song, you can reject it and you won’t have to pay for it.`,
    },
    {
      question: "Once I’ve paid, am I guaranteed Spotify playlist placements?",
      answer:
        "No one is allowed to pay for spots on Spotify playlists, as it violates Spotify’s terms and conditions. This is not the purpose of the SoundCampaign music promotion service. Instead, we focus on a process called playlist consideration. We work to get your music heard by influential playlist curators. If these curators appreciate your track, the likelihood of it being added to their playlists increases significantly.",
    },
    {
      question:
        "Can I limit my Spotify music promotion campaign to my home country?",
      answer:
        "Right now, we don’t offer the option of geographical promotion preferences. We do, however, allow you to target specific languages. You can also choose to limit your song’s exposure to instrumental playlists.",
    },
    {
      question:
        "I need assistance with my music promotion campaign. What should I do?",
      answer:
        "Here at SoundCampaign, we have assembled a fantastic customer support team that is always available to answer your questions and offer advice on how to promote your music across the Spotify and TikTok platforms. We’ve made the process as easy and simple as possible with our live chat.",
    },
  ];

  const handleFaqToggle = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="bg-black">
      {/* PROMO BAR */}
      {/* {promoBarVisible && (
        <div className="bg-red-600 text-white text-center py-3 px-4 relative">
          <p>Limited Time Offer: Get 50% off your first campaign. Offer ends soon!</p>
          <button
            onClick={() => setPromoBarVisible(false)}
            className="absolute right-4 top-3 text-white text-xl hover:opacity-80"
          >
            ×
          </button>
        </div>
      )} */}

      {/* HEADER */}
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? "bg-black shadow-lg" : "bg-black"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <img src={logo} alt="SoundCampaign" className="w-[150px] h-auto" />
          </div>

          <div className="flex">
            <a
              href="/login"
              className="px-6 py-1 bg-white text-black font-semibold rounded-2xl hover:shadow-lg transition"
            >
              Become a Curator
            </a>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative overflow-hidden min-h-[600px] flex items-center mt-12  md:px-auto px-5"
        style={{
          background:
            "linear-gradient(to bottom, #1a1a1a 0%, #111111 30%, #000000 100%)",
        }}
      >
        {/* Subtle top-edge lightness via radial glow */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 40% at 50% -10%, rgba(255,255,255,0.06) 0%, transparent 0%)",
          }}
        />

        <div className="relative w-full max-w-7xl mx-auto px-6 lg:px-12 py-20 flex flex-col lg:flex-row items-center gap-12 lg:gap-10">
          {/* ── LEFT: Text ── */}
          <div className="flex-shrink-0 w-full lg:w-[45%] text-left z-10">
            <motion.h1
              variants={fadeIn("up", 0)}
              initial="initial"
              animate="animate"
              className="md:block hidden text-4xl md:text-5xl font-bold mb-6 leading-tight text-white md:text-left text-center"
            >
              Music promotion
              <br />
              with <span style={{ color: "#1ed760" }}>proven</span> results.
            </motion.h1>

            <motion.h1
              variants={fadeIn("up", 0)}
              initial="initial"
              animate="animate"
              className="md:hidden text-[26px] font-bold mb-6 leading-tight text-white text-center"
            >
              Music promotion with
              <br />
              <span style={{ color: "#1ed760" }}>proven</span> results.
            </motion.h1>

            <motion.p
              variants={fadeIn("up", 1)}
              initial="initial"
              animate="animate"
              className="md:block hidden text-base md:text-lg mb-10 text-gray-300 max-w-md leading-relaxed"
            >
              SoundCampaign is the easiest way for musicians to promote their
              music with real placements, and honest curator feedback.
            </motion.p>

            <motion.p
              variants={fadeIn("up", 1)}
              initial="initial"
              animate="animate"
              className="md:hidden text-sm md:text-lg mb-10 text-white text-center max-w-lg leading-relaxed"
            >
              SoundCampaign is the easiest way for musicians to promote their
              music with real placements, and honest curator feedback.
            </motion.p>

            <motion.div
              variants={fadeIn("up", 2)}
              initial="initial"
              animate="animate"
              className="md:flex md:flex-row grid grid-cols-1 items-center gap-4 mb-10"
            >
              <a
                href="/login"
                className="px-7 py-4 md:py-3.5 rounded-full font-bold text-black text-sm text-center transition-all hover:brightness-90 active:scale-95"
                style={{ background: "#1ed760" }}
              >
                Become a Curator
              </a>
              <a
                href="#spotify"
                className="px-7 py-3.5 font-bold text-white text-center text-sm items-center gap-2 hover:gap-3 transition-all"
              >
                Learn more <span>→</span>
              </a>
            </motion.div>

            {/* Social proof */}
            <motion.div
              variants={fadeIn("up", 3)}
              initial="initial"
              animate="animate"
              className="md:flex md:flex-row grid grid-cols-1 items-center text-center gap-3"
            >
              <img
                src={peopleImage}
                alt="Artists and labels"
                className="h-10 items-center mx-auto md:mx-0"
              />
              <div>
                <img
                  src={starRating}
                  alt="4.5 star rating"
                  className="h-5 mb-0.5 items-center mx-auto md:mx-0"
                />
                <div className="text-white text-xs">
                  Trusted by artists &amp; labels
                </div>
              </div>
            </motion.div>
          </div>

          {/* ── RIGHT: All three images grouped ── */}
          <div className="flex-1 flex flex-row items-center gap-4 z-10 min-w-0">
            {/* Charts stacked vertically, narrower */}
            <div className="flex flex-col gap-4 w-[45%] flex-shrink-0">
              <motion.div
                variants={fadeIn("up", 2)}
                initial="initial"
                animate="animate"
              >
                <img
                  src={spotifyChart}
                  alt="Spotify Campaign chart"
                  className="w-full drop-shadow-2xl"
                />
              </motion.div>
              <motion.div
                variants={fadeIn("up", 3)}
                initial="initial"
                animate="animate"
              >
                <img
                  src={tiktokChart}
                  alt="TikTok Campaign chart"
                  className="w-full drop-shadow-2xl"
                />
              </motion.div>
            </div>

            {/* Phone — taller, takes remaining width */}
            <motion.div
              variants={fadeIn("up", 4)}
              initial="initial"
              animate="animate"
              className="flex-1 flex justify-center"
            >
              <img
                src={phoneImage}
                alt="Spotify playlist on phone"
                className="w-full drop-shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* SOCIAL PROOF - LOGOS */}
      <section className="py-12 px-4 bg-black">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-white text-xl font-bold mb-8">
            Trusted by the industry
          </p>
          <div className="flex flex-wrap justify-center gap-8 items-center">
            {[
              { source: UMG, alt: "Universal Music Group" },
              { source: WMG, alt: "Warner Music Group" },
              { source: Sony, alt: "Sony Music" },
              { source: Ditto, alt: "Ditto Music" },
              { source: Symphonic, alt: "Symphonic Distribution" },
            ].map((logo, index) => (
              <img
                key={index}
                src={logo.source}
                alt={logo.alt}
                className="h-16 object-contain w-auto opacity-80 hover:opacity-100 transition-opacity"
              />
            ))}
          </div>
        </div>
      </section>

      {/* SPOTIFY SECTION */}
      <section id="spotify" className="py-20 px-8 md:px-4 bg-black">
        {/* Outer container - darker background */}
        <div className="max-w-7xl md:mx-auto mx-4 rounded-[30px] bg-[#191919] p-4 md:p-12">
          {/* Inner card - lighter background with playlist image */}
          <div className="rounded-[30px] bg-[#272727] relative overflow-hidden">
            {/* Background image - right side on desktop, hidden on mobile */}
            <div
              className="absolute inset-0 bg-cover bg-right hidden md:block"
              style={{
                backgroundImage: `url(${playlistsImage})`,
              }}
            />

            {/* Gradient overlay - only on desktop */}
            <div
              className="absolute inset-0 hidden md:block"
              style={{
                background:
                  "linear-gradient(to right, #272727 0%, #272727 20%, rgba(39, 39, 39, 0.85) 40%, rgba(39, 39, 39, 0.3) 60%, transparent 80%)",
              }}
            />

            <div className="relative z-10">
              {/* Content */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-8 p-8 md:p-12 lg:p-16 lg:w-1/2"
              >
                {/* Tag */}
                <div className="inline-block">
                  <span
                    className="px-3 py-1 rounded-lg md:font-bold font-bold text-[10px] md:text-lg tracking-wide"
                    style={{ background: "#1ed760", color: "#000" }}
                  >
                    SPOTIFY PLAYLIST PROMOTION
                  </span>
                </div>

                {/* Heading */}
                <h2 className="md:text-4xl text-xl text-left font-bold text-white leading-tight">
                  Promote your music with
                  <br />
                  Spotify playlists
                </h2>

                {/* Numbered list */}
                <ul className="space-y-5">
                  <li className="flex items-start gap-4">
                    <div
                      className="flex-shrink-0 w-6 h-6 md:w-8 md:h-8 my-auto rounded-full flex items-center justify-center text-black md:text-sm text-xs"
                      style={{ background: "#1ed760" }}
                    >
                      1
                    </div>
                    <span className="text-white md:text-lg text-[13.5px] pt-0.5">
                      Gain access to the biggest Spotify playlists
                    </span>
                  </li>
                  <li className="flex items-start gap-4">
                    <div
                      className="flex-shrink-0 my-auto w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-black text-xs md:text-sm"
                      style={{ background: "#1ed760" }}
                    >
                      2
                    </div>
                    <span className="text-white md:text-lg text-[13.5px] pt-0.5">
                      Automatically match your tracks with the right playlists
                    </span>
                  </li>
                  <li className="flex items-start gap-4">
                    <div
                      className="flex-shrink-0 my-auto w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-black text-xs md:text-sm"
                      style={{ background: "#1ed760" }}
                    >
                      3
                    </div>
                    <span className="text-white md:text-lg text-[13.5px] pt-0.5">
                      Get feedback from curators to help you continue growing
                      and improving
                    </span>
                  </li>
                  <li className="flex items-start gap-4">
                    <div
                      className="flex-shrink-0 my-auto w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-black text-xs md:text-sm"
                      style={{ background: "#1ed760" }}
                    >
                      4
                    </div>
                    <span className="text-white md:text-lg text-[13.5px] pt-0.5">
                      Pay only when playlist curators review your track
                    </span>
                  </li>
                </ul>
              </motion.div>

              {/* Mobile-only image at bottom */}
              <div
                className="block md:hidden w-full h-64 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${playlistMobile})`,
                }}
              />
            </div>
          </div>

          {/* Subsections - narrower width, centered */}
          <div className="max-w-6xl mx-auto md:mt-28 mt-12 space-y-16">
            {/* First subsection: Text first on mobile, image left on desktop */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 lg:grid-cols-2 max-w-4xl mx-auto gap-8 lg:gap-12 items-center"
            >
              {/* Image on left - below text on mobile */}
              <div className="flex justify-center lg:justify-start order-2 lg:order-1">
                <img
                  src={playlistSvg}
                  alt="Playlist matching"
                  className="w-full max-w-md"
                />
              </div>

              {/* Text on right - above image on mobile */}
              <div className="space-y-4 order-1 lg:order-2">
                <h3 className="md:text-3xl text-xl font-bold text-white leading-tight">
                  Perfect match with your track and Spotify playlists
                </h3>
                <p className="text-white text-sm md:text-lg leading-relaxed">
                  In our music promotion service, there&apos;s no need to search
                  for curators, analyze their playlists, contact them, or
                  negotiate — automatically find the perfect match for your
                  track.
                </p>
              </div>
            </motion.div>

            {/* Second subsection: Text left, feedback bubbles right */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-1 lg:grid-cols-2 max-w-4xl mx-auto gap-8 lg:gap-12 items-center"
            >
              {/* Text on left */}
              <div className="space-y-4 lg:order-1">
                <h3 className="md:text-3xl text-xl font-bold text-white leading-tight">
                  Get feedback from
                  <br />
                  playlist curators
                </h3>
                <p className="text-white text-sm md:text-lg leading-relaxed">
                  Make your music promotion process even better with valuable
                  feedback on your track.
                </p>
              </div>

              {/* Image on right */}
              <div className="flex justify-center lg:justify-end lg:order-2">
                <img
                  src={reviewsSvg}
                  alt="Curator feedback"
                  className="w-full max-w-md"
                />
              </div>
            </motion.div>

            {/* Third subsection: Text first on mobile, image left on desktop */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto lg:gap-12 items-center"
            >
              {/* Image on left - below text on mobile */}
              <div className="flex justify-center lg:justify-start order-2 lg:order-1">
                <img
                  src={artistSvg}
                  alt="Playlist matching"
                  className="w-full max-w-sm"
                />
              </div>

              {/* Text on right - above image on mobile */}
              <div className="space-y-4 order-1 lg:order-2">
                <h3 className="md:text-3xl text-xl font-bold text-white leading-tight">
                  Pay only when playlist curators review your track
                </h3>
                <p className="text-white text-sm md:text-lg leading-relaxed">
                  If curators haven&apos;t reviewed your track with at least
                  feedback provided, we return your budget for this specific
                  review.
                </p>
              </div>
            </motion.div>

            {/* Statistics section with world map */}
            <div className="mt-16 text-center">
              {/* Title */}
              <h2 className="md:text-4xl text-xl md:mt-40 font-bold text-white mb-12">
                Our Power in Numbers
              </h2>

              {/* Stats + map wrapper */}
              <div className="relative">
                {/* World map - absolute on mobile, centered behind middle stat */}
                <div className="absolute md:hidden w-full top-1/3 -translate-y-1/2 opacity-60 pointer-events-none z-0">
                  <img
                    src={worldMap}
                    alt="World map"
                    className="w-full h-auto"
                  />
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-4 relative z-10">
                  {/* Stat 1 */}
                  <div>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      className="md:text-5xl text-3xl font-bold text-white mb-2"
                    >
                      <CountUp end={10597} duration={2.5} />+
                    </motion.div>
                    <p className="text-white text-md">Available playlists</p>
                  </div>

                  {/* Stat 2 */}
                  <div>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="md:text-5xl text-3xl font-bold text-white mb-2"
                    >
                      <CountUp end={13049} duration={2.5} />+
                    </motion.div>
                    <p className="text-white text-md">Created campaigns</p>
                  </div>

                  {/* Stat 3 */}
                  <div>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      className="md:text-5xl text-3xl font-bold text-white mb-2"
                    >
                      <CountUp end={157.2} decimals={1} duration={2.5} />
                      M+
                    </motion.div>
                    <p className="text-white text-md">Streams</p>
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="relative z-10"
                >
                  <a
                    href="/login"
                    className="inline-block px-16 py-4 rounded-full font-bold text-black transition-all hover:brightness-90 active:scale-95"
                    style={{ background: "#1ed760" }}
                  >
                    Become a Curator
                  </a>
                </motion.div>

                {/* World map - desktop only in normal flow */}
                <div className="relative w-full md:-mt-20 hidden md:block">
                  <img
                    src={worldMap}
                    alt="World map"
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TIKTOK SECTION */}
      <section className="py-20 px-4 -mt-20 bg-black">
        {/* Outer container - darker background */}
        <div className="max-w-7xl mx-8 md:mx-auto rounded-[30px] bg-[#191919] p-4 md:p-16">
          {/* Inner card - lighter background with playlist image */}
          <div className="rounded-[30px] bg-[#272727] relative overflow-visible md:mb-0 mb-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center p-8 md:p-12 lg:p-16 relative z-10">
              {/* Left side - Content */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-8"
              >
                {/* Tag */}
                <div className="inline-block">
                  <span
                    className="px-3 py-1 rounded-lg md:font-bold font-bold text-[10px] md:text-lg tracking-wide"
                    style={{ background: "#1ed760", color: "#000" }}
                  >
                    TIKTOK MUSIC PROMOTION
                  </span>
                </div>

                {/* Heading */}
                <h2 className="md:text-4xl text-xl text-left font-bold text-white leading-tight">
                  Promote your music with
                  <br />
                  influencers&apos; TikTok videos
                </h2>

                {/* Numbered list */}
                <ul className="space-y-5">
                  <li className="flex items-start gap-4">
                    <div
                      className="flex-shrink-0 w-6 h-6 md:w-8 md:h-8 my-auto rounded-full flex items-center justify-center text-black md:text-sm text-xs"
                      style={{ background: "#1ed760" }}
                    >
                      1
                    </div>
                    <span className="text-white md:text-lg text-[13.5px] pt-0.5">
                      Creators use your music in their videos
                    </span>
                  </li>
                  <li className="flex items-start gap-4">
                    <div
                      className="flex-shrink-0 my-auto w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-black text-xs md:text-sm"
                      style={{ background: "#1ed760" }}
                    >
                      2
                    </div>
                    <span className="text-white md:text-lg text-[13.5px] pt-0.5">
                      Grow your global audience in just days
                    </span>
                  </li>
                  <li className="flex items-start gap-4">
                    <div
                      className="flex-shrink-0 my-auto w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-black text-xs md:text-sm"
                      style={{ background: "#1ed760" }}
                    >
                      3
                    </div>
                    <span className="text-white md:text-lg text-[13.5px] pt-0.5">
                      High opportunity to go viral
                    </span>
                  </li>
                  <li className="flex items-start gap-4">
                    <div
                      className="flex-shrink-0 my-auto w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-black text-xs md:text-sm"
                      style={{ background: "#1ed760" }}
                    >
                      4
                    </div>
                    <span className="text-white md:text-lg text-[13.5px] pt-0.5">
                      Get videos you can share with your followers
                    </span>
                  </li>
                </ul>
              </motion.div>
              {/* Right side - Phone mockup overflowing card */}
              <div className="hidden lg:block absolute right-16 top-1/2 -translate-y-1/2 h-full w-1/2 overflow-visible">
                <img
                  src={tiktokImage}
                  alt="TikTok creators using music"
                  className="absolute top-1/2 -translate-y-1/2 right-0 h-[125%] w-auto object-contain"
                />
              </div>
            </div>

            {/* Mobile-only image at bottom */}
            <div className="block md:hidden w-full pb-8">
              <img
                src={tiktokImage}
                alt="TikTok creators using music"
                className="w-52 h-auto object-contain object-center mx-auto mt-4"
              />
            </div>
          </div>

          {/* Subsections - narrower width, centered */}
          <div className="max-w-6xl mx-auto md:mt-28 mt-12 space-y-16">
            {/* First subsection: Playlist cards left, text right */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 lg:grid-cols-2 max-w-4xl mx-auto gap-8 lg:gap-12 items-center"
            >
              {/* Image on left - below text on mobile */}
              <div className="flex justify-center lg:justify-start order-2 lg:order-1">
                <img
                  src={creatorsImage}
                  alt="Playlist matching"
                  className="w-full max-w-xs"
                />
              </div>

              {/* Text on right - above image on mobile */}
              <div className="space-y-4 order-1 lg:order-2">
                <h3 className="md:text-3xl text-xl font-bold text-white leading-tight">
                  Manually moderated creator base
                </h3>
                <p className="text-white text-sm md:text-lg leading-relaxed">
                  In our TikTok music promotion, we manually moderate our
                  creators&apos; base. This ensures the highest quality and
                  authenticity in the videos you receive from our creators.
                </p>
              </div>
            </motion.div>

            {/* Second subsection: Text left, feedback bubbles right */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-1 lg:grid-cols-2 max-w-4xl mx-auto gap-8 lg:gap-12 items-center"
            >
              {/* Text on left */}
              <div className="space-y-4 lg:order-1">
                <h3 className="md:text-3xl text-xl font-bold text-white leading-tight">
                  Scalable platform for musicians
                </h3>
                <p className="text-white text-sm md:text-lg leading-relaxed">
                  From emerging artists to seasoned pros, our music promotion
                  service provides the tools and resources to help you grow your
                  fan base and elevate your music career to new heights.
                </p>
              </div>

              {/* Image on right */}
              <div className="flex justify-center lg:justify-end lg:order-2">
                <img
                  src={campaignImage}
                  alt="Curator feedback"
                  className="w-full max-w-md"
                />
              </div>
            </motion.div>

            {/* Third subsection: Playlist cards left, text right */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto lg:gap-12 items-center"
            >
              {/* Image on left - below text on mobile */}
              <div className="flex justify-center lg:justify-start order-2 lg:order-1">
                <img
                  src={tiktokChart}
                  alt="Playlist matching"
                  className="w-full max-w-sm"
                />
              </div>

              {/* Text on right - above image on mobile */}
              <div className="space-y-4 order-1 lg:order-2">
                <h3 className="md:text-3xl text-xl font-bold text-white leading-tight">
                  In-depth analytics & reporting
                </h3>
                <p className="text-white text-sm md:text-lg leading-relaxed">
                  Get useful insights for your music promotion and make smart
                  choices using our detailed analytics and reports. Keep an eye
                  on your TikTok campaign&apos;s performance, evaluate its
                  success, and adjust your strategy to achieve the best results
                  in promoting your music.
                </p>
              </div>
            </motion.div>

            {/* Statistics section with world map */}
            <div className="mt-16 text-center">
              {/* Stats grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 rounded-[50px] bg-[#272727] p-16 gap-8 mb-8 relative z-10">
                {/* Stat 1 */}
                <div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="md:text-5xl text-3xl font-bold text-white mb-2"
                  >
                    <CountUp end={7239} duration={2.5} />+
                  </motion.div>
                  <p className="text-white text-md">Available playlists</p>
                </div>

                {/* Stat 2 */}
                <div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="md:text-5xl text-3xl font-bold text-white mb-2"
                  >
                    <CountUp end={53287} duration={2.5} />+
                  </motion.div>
                  <p className="text-white text-md">Created campaigns</p>
                </div>

                {/* Stat 3 */}
                <div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="md:text-5xl text-3xl font-bold text-white mb-2"
                  >
                    <CountUp end={1.7} decimals={1} duration={2.5} />
                    B+
                  </motion.div>
                  <p className="text-white text-md">Streams</p>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <a
                  href="/login"
                  className="inline-block px-16 py-4 rounded-full font-bold text-black transition-all hover:brightness-90 active:scale-95"
                  style={{ background: "#1ed760" }}
                >
                  Become a Curator
                </a>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* People section */}
      <section className="relative w-full py-24 mt-20 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src={people}
            alt="Artists background"
            className="w-full h-full object-cover"
          />
          {/* Dark overlay so text is readable */}
          <div className="absolute inset-0 bg-black/60" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 gap-6">
          <h2 className="text-2xl md:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-6xl">
            We&apos;ve helped over 100,000 artists be heard
          </h2>

          {/* Star rating SVG */}
          <img src={starRating} alt="4.5+ star rating" className="h-7 w-auto" />

          {/* Trustpilot line */}
          <p className="text-white/80 text-sm md:text-base flex items-center gap-2">
            See our <span className="font-bold text-white">2,045 reviews</span>{" "}
            on
            <a
              href="https://www.trustpilot.com/review/soundcamps.com"
              className="underline hover:text-white transition"
            >
              <img src={trustpilot} alt="Trustpilot" className="h-6 w-auto" />
            </a>
          </p>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="bg-black py-20 px-6 md:px-12">
        <div className="max-w-5xl mx-6 md:mx-auto md:columns-3 columns-1 gap-5">
          {/* COLUMN 1 */}
          <ReviewCard
            name="Tyrone"
            role="Rapper"
            stars={5}
            imgSrc={tyroneImg}
            text="Although pricey, it sure is worth the investment. If SoundCampaign does ever lower their price or have some special deals on, then I'll definitely take advantage of them!"
            className="break-inside-avoid mb-5"
            {...scrollFade(0.2)}
          />

          <motion.div
            {...scrollFade(0.2)}
            className="break-inside-avoid mb-5 relative rounded-3xl overflow-hidden bg-black"
            style={{ minHeight: 470 }}
          >
            <video
              className="w-full h-full object-cover absolute inset-0"
              autoPlay
              muted
              loop
              playsInline
            >
              <source src={reviewVideo} type="video/mp4" />
            </video>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white text-xs px-3 py-1.5 rounded-full whitespace-nowrap">
              It&apos;s helped me get on Spotify playlist.
            </div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-14 h-14 rounded-full bg-white/80 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-black ml-1"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </motion.div>

          {/* COLUMN 2 */}
          <ReviewCard
            name="Santiago"
            role="Singer & Music Producer / Reached over 500K streams on Spotify"
            stars={5}
            imgSrc={santiagoImg}
            text="SoundCampaign is an excellent service! It certainly has access to good playlist curators as well as having a large audience base. Generally, if I send a song to the right curator or genre, I tend to have way more success than I would've gotten by my efforts!"
            className="break-inside-avoid mb-5"
            style={{ minHeight: 310 }}
            {...scrollFade(0)}
          />

          <ReviewCard
            name="Joseph"
            role="Singer / Reached over 350K streams on Spotify"
            stars={5}
            imgSrc={josephImg}
            text="I'm so glad I decided to work with you fellas at SoundCampaign! I, for sure, enjoyed the service! You definitely gave me awesome feedback and insights from every listener about my songs. One thing I would've liked is if there was a much better way for artists to respond or reply to curators. I was given a lot of great feedback, so it would've been nice to thank them all personally. Besides that, fantastic results all around. I'm definitely looking forward to my next campaign!"
            className="break-inside-avoid mb-5"
            {...scrollFade(0)}
          />

          {/* COLUMN 3 */}
          <ReviewCard
            name="Stefan"
            role="DJ & Music Producer"
            stars={4}
            imgSrc={stefanImg}
            text="SoundCampaign did pretty much what they said they'd do or promised. My genre is quite specific or unconventional, so I only wished they had more different playlists that matched my music. Anyway, overall, I received very good exposure and was still able to get connected with the right playlist curators."
            className="break-inside-avoid mb-5"
            style={{ minHeight: 310 }}
            {...scrollFade(0.15)}
          />

          <ReviewCard
            name="Richard"
            role="Singer"
            stars={5}
            imgSrc={richardImg}
            text="This music promotion service sure does give top notch service. It sure is the place for anybody who has any real aspirations for a career in music. It's common for so many music artists to blow up easily in this industry, but with SoundCampaign's help, your chances will increase! I know for me it did. It's safe to say that majority of the curators for my specific genre, which is hip hop, were pretty honest with their reviews, and as a result, the streams for my songs have significantly grown! I'd say that I surely got my money's worth. I'll be making a mixtape soon, so I'll be sure to work with you guys again and recommend to any aspiring artists I come across!"
            className="break-inside-avoid mb-5"
            {...scrollFade(0.15)}
          />
        </div>
      </section>

      {/* COMPARISON SECTION */}
      <section className="bg-black py-20 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="md:text-5xl text-2xl font-bold text-white text-center mb-16">
            Why promote with us
          </h2>

          <div className="space-y-0">
            {/* Header Row */}
            <div className="grid grid-cols-[4fr_1fr_1fr] gap-0 border-b border-gray-600">
              {/* Empty space for features column */}
              <div></div>

              {/* DIY Header */}
              <div className="flex-1 bg-white min-w-[90px] md:px-6 py-5 md:py-6 rounded-tl-[30px] flex items-center justify-center">
                <h3 className="text-sm md:text-xl font-bold text-black text-center w-full">
                  DIY
                </h3>
              </div>

              {/* SoundCampaign Header */}
              <div className="flex-1 min-w-[90px] bg-[#06D960] flex items-center justify-center rounded-tr-[30px] md:px-6 py-5 md:py-6">
                <img
                  src={logo1}
                  alt="SoundCampaign Logo"
                  className="h-4 md:h-6 w-auto object-contain"
                />
              </div>
            </div>

            {/* Feature Rows */}
            <div className="border-gray-600">
              {[
                "Access to extensive network (10,000+)",
                "No bot streams, only active listeners",
                "100% guaranteed response rate from curators",
                "Comprehensive campaign tracking in real-time",
                "Quick results within days",
              ].map((feature, index) => (
                <div
                  key={index}
                  className="grid grid-cols-[4fr_1fr_1fr] gap-0 border-b border-gray-600"
                >
                  {/* Feature Text */}
                  <div className="px-6 py-6 text-white text-sm md:text-lg">
                    {feature}
                  </div>

                  {/* DIY Column */}
                  <div className="md:px-6 px-12 py-6 flex items-center justify-center">
                    <BiX
                      size={24}
                      className="text-black rounded-full bg-white"
                    />
                  </div>

                  {/* SoundCampaign Column */}
                  <div className="px-6 py-6 flex items-center justify-center">
                    <BiCheck
                      size={24}
                      className="text-black rounded-full bg-[#06D960]"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom borders */}
            <div className="grid grid-cols-[4fr_1fr_1fr] gap-0">
              <div className="border-b border-gray-600 rounded-bl-2xl h-0"></div>
              <div className="border-b border-gray-600 h-0"></div>
              <div className="border-b border-gray-600 rounded-br-2xl h-0"></div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-4xl md:mx-auto mx-8">
          <h2 className="md:text-4xl text-xl text-white font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {faqData.map((faq, index) => (
              <div key={index}>
                <div className="bg-[#191919] rounded-lg shadow-sm">
                  <button
                    onClick={() => handleFaqToggle(index)}
                    className="w-full px-6 py-4 flex justify-between items-center transition"
                  >
                    <h3 className="text-left md:text-base text-sm text-white">
                      {faq.question}
                    </h3>
                    <motion.div
                      animate={{ rotate: openFaqIndex === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <BiChevronDown className="text-white text-3xl" />
                    </motion.div>
                  </button>
                </div>

                <AnimatePresence initial={false}>
                  {openFaqIndex === index && (
                    <motion.div
                      key="answer"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 py-4 md:text-base text-sm text-white whitespace-pre-line">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
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
                alt="SoundCampaign"
                className="w-[200px] h-auto mb-6"
              />

              {/* Social Icons Under Logo (commented out per request) */}
              {/* <div className="flex gap-6">
                ...social icons removed
              </div> */}
            </div>

            <div className="text-sm text-white space-y-2 text-center items-center">
              <p>Made with ❤ by artists for artists</p>
              <p>&copy; SoundCampaign All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
