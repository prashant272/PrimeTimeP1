import { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";


// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper modules
import { Autoplay, Navigation, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Centralized brand background
const PRIMARY_BG = "bg-[#23140f]"; // deep rich brown-gold
const SECTION_BG = "bg-[#261610]"; // lighter brown for sections
const HIGHLIGHT_BG = "bg-gradient-to-br from-[#2d1b0f] via-[#22140e] to-[#3d291a]";

export default function Home() {
  const videoRef = useRef(null);
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const sectionRefs = useRef([]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.9;
    }
  }, []);

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0", "!z-10");
          }
        });
      },
      { threshold: 0.1 }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      sectionRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  const handleNominateClick = () => {
    if (!isAuthenticated || user?.role !== "user") {
      navigate("/login", { state: { from: { pathname: "/nominate" } } });
    } else {
      navigate("/nominate");
    }
  };

  //Event Data

  const events = [
    {
      title: "Global Healthcare Awards 2026 – Dubai Edition 🇦🇪 ",
      desc: "Recognising excellence and innovation in healthcare leadership.",
      date: "26 April 2026",
      place: "Dubai",
    },
    {
      title: "Global Healthcare Awards 2026 – London Edition 🇬🇧",
      desc: "Recognising excellence and innovation in healthcare leadership.",
      date: "9 June 2026",
      place: "London",
    },
  ];

  //Guest Data

  const guests = [
    { name: "Virender Sehwag", designation: "Indian Cricket Commentator & Former Cricketer" },
    { name: "Sunil Manohar Gavaskar", designation: "Indian Cricket Commentator & Former Cricketer" },
    { name: "Shri Ashwini Kumar Choubey", designation: "Hon’ble Minister of State for Health and Family Welfare" },
    { name: "Dr. Yoganand Shashtri", designation: "Former Reader, Shaheed Bhagat Singh College, Delhi" },
    { name: "Shri G. V. L. Narsimha Rao", designation: "National Spokesperson, BJP" },
    { name: "Mr. Brad Hogg", designation: "Former Australian Cricketer" },
    { name: "Dr. Najma A. Heptulla", designation: "Former Governor, Manipur" },
    { name: "Shri Anand Kumar", designation: "Founder & Director, Super 30" },
  ];

  // Previous Media Partners
  const mediaPartners = [
    // ===== Premium National & International Media =====
    {
      name: "India Today",
      tagline: "India’s Leading News & Media Network",
      logo: "../india-today.png",
    },
    // {
    //   name: "Aaj Tak",
    //   tagline: "India’s No.1 Hindi News Channel",
    //   logo: "../aaj-tak.png",
    // },
    {
      name: "CNN ",
      tagline: "Global & National News Network",
      logo: "../cnn.jpg",
    },
    {
      name: "News18 India",
      tagline: "Trusted Hindi News Network",
      logo: "../news.png",
    },

    // ===== Strong National Hindi News =====
    {
      name: "Bharat 24",
      tagline: "Hindi News & Current Affairs Channel",
      logo: "../bharat.jpg",
    },
    {
      name: "Doordarshan's",
      tagline: "India’s Public Service News Channel",
      logo: "../ddd.png",
    },
    {
      name: "News 1 India",
      tagline: "National Hindi News Channel",
      logo: "../new1.png",
    },
    {
      name: "News 10 India",
      tagline: "National News & Current Affairs Network",
      logo: "../news10.jpg",
    },

    // ===== Regional / Specialised Media =====
    {
      name: "Delhi Aaj Tak",
      tagline: "Regional Hindi News Network",
      logo: "../delhiaajtk.jpg",
    },

    // ===== Event & Partner Media =====
    {
      name: "Prime Time Research Media Pvt. Ltd",
      tagline: "National News & Media Network",
      logo: "../prime.png",
    },
    {
      logo: "../The-SME-Times.png",
    },

    // ===== Production & Foundation =====
    {
      name: "Xoom Studio",
      tagline: "Media Production & Event Coverage Partner",
      logo: "../xoom.jpg",
    },
    {
      logo: "../remont.jpg"
    },
  ];
  const nomineeCategories = [
    {
      title: "Hospitals & Healthcare Institutions",
      desc: "Recognising excellence in patient care, infrastructure, safety standards, and overall healthcare delivery.",
      icon: "🏥",
      color: "from-[#ffeec3] to-[#d4af37]"
    },
    {
      title: "Clinics & Diagnostic Centers",
      desc: "Honouring clinics and diagnostic centres for accuracy, affordability, and quality medical services.",
      icon: "🧪",
      color: "from-[#ffd966] to-[#b6932f]"
    },
    {
      title: "Healthcare Professionals & Leaders",
      desc: "Celebrating doctors, nurses, surgeons, and healthcare leaders for exceptional service and leadership.",
      icon: "👩‍⚕️",
      color: "from-[#fff5d2] to-[#a28533]"
    },
    {
      title: "HealthTech & Digital Healthcare",
      desc: "Recognising innovation in digital health, telemedicine, AI-driven healthcare, and medical technology platforms.",
      icon: "💊",
      color: "from-[#ffeec3] to-[#d4af37]"
    }
  ];

  const upcomingAwards = [
    {
      title: "14th Global Healthcare Awards & Summit 2026",
      desc: "Honouring excellence, innovation, and leadership in the global healthcare industry.",
      date: "26 April 2026",
      location: "Dubai",
      banner: "/healthcaredubai.png",
      link: "https://www.globalhealthcareawards.com",
      color: "from-[#ffecd2] to-[#fcb69f]"
    },
    {
      title: "14th Global Education Excellence Awards 2026",
      desc: "Celebrating outstanding contributions and leadership in the education sector.",
      date: "14 March 2026",
      location: "New Delhi, India",
      banner: "/educationdelhi.png",
      link: "https://globaleducationawards.in",
      color: "from-[#e0c3fc] to-[#8ec5fc]"
    },
    {
      title: "India Excellence Awards & Conference 2026",
      desc: "Recognising excellence, innovation, and leadership across Indian industries.",
      date: "14 March 2026",
      location: "New Delhi, India",
      banner: "/excellencedelhi.png",
      link: "https://www.primetimemedia.in/india-excellence-awards",
      color: "from-[#fddb92] to-[#d1fdff]"
    },
    {
      title: "Global Achievers Awards 2026",
      desc: "Honouring global leaders and achievers across multiple industries.",
      date: "9 June 2026",
      location: "House of Commons, London",
      banner: "/archiverlondon.png",
      link: "https://www.primetimemedia.in/global-achievers-awards",
      color: "from-[#cfd9df] to-[#e2ebf0]"
    },
    {
      title: "USA Business Leadership Summit 2026",
      desc: "A premier summit recognising visionary business leaders and entrepreneurs.",
      date: "31 March 2026",
      location: "Washington, DC, USA",
      banner: "/USA.png",
      link: "https://www.primetimemedia.in/usa-business-summit",
      color: "from-[#fdfbfb] to-[#ebedee]"
    }
  ];

  const homeFaqs = [
    {
      q: "What is Global Healthcare Awards 2026?",
      a: "Global Healthcare Awards 2026 is an international recognition platform that honours hospitals, doctors, clinics, healthcare organisations, and healthtech companies for excellence, innovation, and quality patient care.",
    },
    {
      q: "Who can apply for nomination?",
      a: "Hospitals and healthcare institutions, clinics and diagnostic centres, individual doctors and medical professionals, healthcare startups, healthtech companies, and medical or wellness organisations can apply for nomination.",
    },
    {
      q: "What is the nomination process and deadline?",
      a: "The nomination process is completely online. Applicants need to fill out the nomination form and submit the required details and documents. The current extended deadline mentioned on this page is 15 April 2026; for any change, updated dates will always be shown on the website.",
    },
    {
      q: "How are the winners selected?",
      a: "Winners are selected through a structured evaluation process that includes research-based assessment, service quality, innovation, patient impact, and ethical practices, as explained in the Research Methodology and Selection Process sections.",
    },
    {
      q: "What are the benefits of participating?",
      a: "Participants receive global recognition and credibility, enhanced brand visibility and media exposure, greater trust among patients and partners, networking with healthcare leaders, and marketing assets such as certificates and winner logos.",
    },
    {
      q: "Is self-nomination allowed?",
      a: "Yes, eligible organisations and individuals can nominate themselves directly for relevant categories.",
    },
  ];

  // Responsive and premium utility variables
  const getGridCols = (len) => {
    if (len >= 4) {
      return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
    }
    if (len === 3) {
      return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3";
    }
    if (len === 2) {
      return "grid-cols-1 sm:grid-cols-2";
    }
    return "grid-cols-1";
  };

  return (
    <div className={`w-full text-[#f5f3f0] ${PRIMARY_BG}`}>
      {/* SEO H1 - Hidden */}
      <h1 className="sr-only">
        Healthcare Awards – Global Healthcare Awards by Prime Time Research Media Pvt. Ltd
      </h1>
      {/* ================= HERO ================= */}
      <section className="relative min-h-screen w-full overflow-hidden bg-[#210a0e]">
        {/* ===== BACKGROUND VIDEO: Responsive & Premium ===== */}
        <div className="absolute inset-0 z-0 w-full h-full pointer-events-none select-none">
          <video
            ref={videoRef}
            className={`
              absolute inset-0 w-full h-full
              object-cover object-center
              sm:object-[center_30%]
              transition-all duration-700
              brightness-95 sm:brightness-100
              max-h-[120vh] min-h-full
            `}
            src="/videos/hero.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster="/videos/hero-poster.jpg"
            style={{
              background: "linear-gradient(180deg,#2d180a,#210a0e 80%)",
              minHeight: "100%",
              maxHeight: "120vh",
              minWidth: "100%",
            }}
          />
          {/* Fallback Image for mobile if video fails */}
          <noscript>
            <img
              src="/videos/hero-poster.jpg"
              alt="Award Ceremony"
              className="w-full h-full object-cover object-center"
            />
          </noscript>
          {/* Top, bottom subtle overlays for extra premium depth */}
          <div className="absolute top-0 left-0 w-full h-1/6 bg-gradient-to-b from-black/60 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-full h-1/6 bg-gradient-to-t from-[#2d180a]/80 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* ===== LIGHTER GRADIENT OVERLAY: less dark so video is more visible ===== */}
        <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-black/70 via-black/30 to-[#2d180a]/60" />

        {/* ===== CONTENT ===== */}
        <div className="relative z-20 flex min-h-screen flex-col items-center justify-center px-4 sm:px-6 md:px-8 pt-20 pb-10 text-center">
          {/* pt-16 yaha pehle pt-24 tha, ab kam kia taki content upar aaye */}
          {/* ===== FLOATING PARTICLES ===== */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className={`absolute rounded-full animate-bounce shadow-lg`}
                style={{
                  width: i % 3 === 0 ? '1.5rem' : i % 2 === 0 ? '1rem' : '0.75rem',
                  height: i % 3 === 0 ? '1.5rem' : i % 2 === 0 ? '1rem' : '0.75rem',
                  background: i % 2 === 0 ? '#d4af37aa' : '#ffd96666',
                  opacity: i % 2 === 0 ? 0.33 : 0.18,
                  left: `${10 + i * (7 + i)}%`,
                  top: `${25 + ((i * 11) % 60)}%`,
                  animationDelay: `${i * 0.35}s`,
                  animationDuration: `${2.7 + i * 0.77}s`,
                  zIndex: 3 + i,
                  filter: "blur(0.6px)",
                }}
              />
            ))}
          </div>
          {/* ===== HERO TEXT ===== */}
          <div className="max-w-[48rem] mx-auto space-y-5 sm:space-y-1 animate-fade-in">
            {/* space-y-4/sm:space-y-7 pehle space-y-5 sm:space-y-8 tha => kam kia taki text elements paas aaye aur upar dikhें */}
            <h1 className="text-2xl xs:text-3xl md:text-5xl lg:text-6xl font-extrabold font-heading tracking-tight leading-tight drop-shadow-lg">
              <span className="inline-block whitespace-nowrap text-center">
                Global{" "}
                <span className="bg-gradient-to-r from-[#d4af37] via-[#f1d46b] to-[#b6932f] bg-clip-text text-transparent inline-block font-semibold">
                  Healthcare
                </span>{" "}
                Awards
                <span className="align-middle text-[#ffeec3] drop-shadow px-1">
                  , 2026
                </span>
              </span>
            </h1>
            {/* Yaha se dho lines ko upar laya, space decrease ki */}
            <div className="mx-auto w-24 sm:w-32 h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent rounded-full mt-6" />
            {/* mt-2 diya taki thoda hi gap aaye, pehle default tha */}
            <p className="mt-1 text-base xs:text-lg md:text-xl text-[#f4ecd8] font-medium leading-7 drop-shadow-md">
              {/* mt-1 lagaya taki text bhi ekdum divider ke upar aaye */}
              Organised by{" "}
              <span className="font-semibold bg-gradient-to-r from-[#c62828] to-[#d4af37] bg-clip-text text-transparent hover:brightness-125 transition duration-200">
                Prime Time Research Media Pvt. Ltd
              </span>{" "}
              – Global Award Events
            </p>
            {/* Yaha ka text & divider ab aur upar hai. pt/space-y aur margin-top kam karke, see comments above */}
          </div>
          {/* ===== EVENTS SECTION ===== */}
          <div className="mt-0 sm:mt-2 w-full max-w-5xl mx-auto flex flex-col items-center">
            {/* Section headline hidden, using the golden dot only as separator for ultra-premium touch */}
            <h2 className="mb-6 sm:mb-10 text-0.5xl md:text-0.5xl font-heading font-bold text-center bg-gradient-to-r from-white via-[#d4af37] to-white bg-clip-text text-transparent drop-shadow">
              .
            </h2>
            <div
              className={`
                grid gap-7 sm:gap-8 ${getGridCols(events.length)} mx-auto
                relative
              `}
              style={{
                marginTop: '-2.5rem',
                zIndex: 40,
              }}
            >
              {events.map((event, index) => (
                <div
                  key={event.title + index}
                  ref={(el) => (sectionRefs.current[index] = el)}
                  className={`
                    group relative opacity-0 translate-y-8 transition-all duration-700 flex justify-center
                  `}
                  style={{
                    top: '-2.5rem'
                  }}
                >
                  <div className="
                    relative w-full bg-gradient-to-br
                    from-[#1e1e2136] via-[#000000c5] to-[#332108bb]
                    rounded-2xl sm:rounded-3xl p-4 xs:p-5 sm:p-7 md:p-9
                    border border-[#e1c26c]/25 hover:border-[#ffeb98] hover:shadow-[#d4af37]/40
                    transition-all duration-500 hover:-translate-y-2 hover:scale-[1.033] 
                    hover:shadow-[0_16px_60px_-14px_#ffd966cc]
                    backdrop-blur-lg
                    before:absolute before:inset-0 before:z-[-2] before:rounded-inherit before:bg-gradient-to-br before:from-[#d4af37]/10 before:via-transparent before:to-[#c69823]/10
                  "
                    style={{
                      background: "rgba(34, 17, 9, 0.48)",
                      boxShadow: "0 4px 36px -8px #d4af3744, 0 0px 0 #fde68a09 inset",
                    }}
                  >
                    {/* PREMIUM CORNER ORNAMENTS */}
                    <div className="absolute top-0 left-0 w-10 md:w-12 h-10 md:h-12 border-t-2 border-l-2 border-[#ffe7a1]/30 rounded-tl-2xl group-hover:border-[#d4af37] transition-all duration-300"></div>
                    <div className="absolute top-0 right-0 w-10 md:w-12 h-10 md:h-12 border-t-2 border-r-2 border-[#ffe7a1]/30 rounded-tr-2xl group-hover:border-[#d4af37] transition-all duration-300"></div>
                    <div className="absolute bottom-0 left-0 w-10 md:w-12 h-10 md:h-12 border-b-2 border-l-2 border-[#ffe7a1]/30 rounded-bl-2xl group-hover:border-[#d4af37] transition-all duration-300"></div>
                    <div className="absolute bottom-0 right-0 w-10 md:w-12 h-10 md:h-12 border-b-2 border-r-2 border-[#ffe7a1]/30 rounded-br-2xl group-hover:border-[#d4af37] transition-all duration-300"></div>

                    {/* CROWN & PREMIUM TITLE */}
                    <div className="flex items-center gap-2 mb-3 md:mb-5">
                      <span className="inline-block align-middle scale-125 drop-shadow-lg">
                        <svg width="26" height="20" viewBox="0 0 26 20" fill="none" className="text-[#d4af37]">
                          <path d="M2 17L7 2L13 10L19 2L24 17H2Z" stroke="currentColor" strokeWidth="2.1" strokeLinejoin="round" fill="#d4af37" className="opacity-70 group-hover:opacity-100 transition" />
                        </svg>
                      </span>
                      <h3 className="text-xl md:text-2xl font-black font-heading tracking-tight bg-gradient-to-r from-[#fbf6df] via-[#d4af37] to-[#ffeec3] bg-clip-text text-transparent drop-shadow group-hover:from-[#fffbe7] group-hover:to-[#d4af37] transition duration-300">
                        {event.title}
                      </h3>
                    </div>

                    <p className="mb-6 sm:mb-7 text-[#f4ecd8] text-[1.09rem] leading-relaxed font-medium group-hover:text-[#fffbe7] transition-colors text-justify drop-shadow-lg">
                      <span className="inline-block bg-gradient-to-br from-[#d4af37]/90 via-[#ffeec3]/70 to-[#fff5d2]/80 bg-clip-text text-transparent font-semibold tracking-wide">
                        {event.desc}
                      </span>
                    </p>

                    <div className="mb-6 space-y-2 text-sm text-left sm:text-base font-semibold">
                      <div className="flex items-center gap-3 text-[#ffe7a1] group-hover:text-[#feca57] tracking-wide transition-all duration-200">
                        <span className="text-lg sm:text-xl">
                          <svg className="w-6 h-6 inline-block" viewBox="0 0 20 20" fill="none">
                            <circle cx="10" cy="10" r="8" stroke="#ffd966" strokeWidth="1.6" fill="none" />
                            <rect x="8.5" y="5" width="3" height="6.5" rx="1.2" fill="#ffd966" />
                            <circle cx="10" cy="14.1" r="1.1" fill="#d4af37" />
                          </svg>
                        </span>
                        <span className="font-bold text-md">{event.date}</span>
                      </div>
                      <div className="flex items-center gap-3 text-[#ffe7a1] group-hover:text-[#feca57] tracking-wide transition-all duration-200">
                        <span className="text-lg sm:text-xl">
                          <svg className="w-6 h-6 inline-block" viewBox="0 0 20 20" fill="none">
                            <circle cx="10" cy="10" r="8" stroke="#ffd966" strokeWidth="1.1" fill="none" />
                            <circle cx="10" cy="12.1" r="3" fill="#d4af37" />
                            <rect x="9.2" y="6" width="1.6" height="5" rx="0.7" fill="#ffd966" />
                          </svg>
                        </span>
                        <span className="font-bold text-md">{event.place}</span>
                      </div>
                    </div>
                    {/* Royal Button */}
                    <button
                      onClick={handleNominateClick}
                      className="relative overflow-hidden rounded-full bg-gradient-to-r from-[#ffeec3] via-[#d4af37] to-[#a28533] px-7 sm:px-10 py-2.5 sm:py-3.5 text-md sm:text-lg font-black uppercase tracking-wider text-[#644b0d] shadow-[#d4af3733] shadow-md hover:shadow-xl transition-all duration-400 hover:scale-105 focus:scale-100 focus:outline-none focus:ring-2 focus:ring-[#ffeec3] group"
                      style={{
                        letterSpacing: '0.065em',
                        boxShadow: '0 6px 34px -8px #fddc8a44, 0 0.5px 0 #ffeec398 inset',
                      }}
                    >
                      <span className="relative z-10 flex items-center gap-2 font-extrabold">
                        <svg className="w-5 h-5 text-[#d4af37] drop-shadow" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M4 10h12M10 4l6 6-6 6" stroke="#b79024" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                        </svg>
                        <span>Nominate Now</span>
                      </span>
                      <span className="absolute inset-0 bg-gradient-to-r from-[#fbf7e1]/30 to-[#ffd966]/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-700 pointer-events-none rounded-full"></span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* OVERVIEW + DATES: Main theme background (use SECTION_BG to keep consistent) */}
      <section className={`relative py-12 lg:py-20 overflow-hidden ${SECTION_BG} border-b border-[#d4af37]/20`}>
        {/* Gradient Glow Background */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] bg-gradient-to-br from-[#d4af37]/20 via-[#d4af37]/10 to-transparent rounded-full mix-blend-screen blur-[120px] animate-blob" />
          <div className="absolute bottom-[20%] right-[-15%] w-[600px] h-[600px] bg-gradient-to-br from-[#c62828]/20 via-[#d4af37]/10 to-transparent rounded-full mix-blend-screen blur-[120px] animate-blob animation-delay-2000" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-16 gap-x-12">
            {/* ==== LEFT: OVERVIEW ==== */}
            <div className="flex flex-col justify-center h-full lg:pr-6 xl:pr-12">
              {/* Section Badge */}
              <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-[#2a1b12]/20 backdrop-blur-2xl border border-[#d4af37]/20 shadow-2xl hover:bg-[#392818]/20 hover:border-[#d4af37]/40 transition-all duration-500 group/badge mb-4">
                <div className="relative">
                  <svg className="w-5 h-5 text-[#d4af37] group-hover/badge:scale-110 transition-transform duration-500" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path d="M12 2l2.39 7.24h7.61l-6.19 4.5L16.92 22 12 17.27 7.08 22l1.11-8.26-6.19-4.5h7.61L12 2z" /></svg>
                  <div className="absolute inset-0 bg-[#d4af37]/20 blur-xl rounded-full animate-pulse"></div>
                </div>
                <span className="text-sm font-bold tracking-wider text-[#ffeec3]">ABOUT THE AWARDS</span>
              </div>

              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight">
                <span className="bg-gradient-to-r from-white via-[#ffeec3] to-[#d4af37] bg-clip-text text-transparent">
                  Overview of Healthcare Awards 2026
                </span>
              </h2>
              <div className="w-20 h-1.5 bg-gradient-to-r from-[#ffeec3] via-[#d4af37] to-[#c5b471] rounded-full mb-7" />

              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#d4af37]/20 via-[#392818]/10 to-[#ffd966]/20 opacity-0 group-hover:opacity-100 blur-2xl transition-all duration-1000 rounded-3xl" />
                <div className="relative bg-[#2a1b12]/80 backdrop-blur-2xl rounded-3xl border border-[#d4af37]/20 shadow-xl overflow-hidden hover:bg-[#392818]/40 hover:border-[#ffeec3]/30 transition-all duration-700 p-8 lg:p-10">
                  {/* SEO Paragraph - Hidden */}
                  <p className="sr-only">
                    Healthcare Awards by Prime Time Research Media Pvt. Ltd, also known as Global Healthcare
                    Awards, recognize excellence, innovation, hospitals, doctors, and healthcare
                    leaders worldwide.
                  </p>
                  {/* Gold Bar */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#ffd966] via-[#d4af37] to-transparent" />
                  {/* Decorative Orb */}
                  <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-br from-[#d4af37]/10 to-[#ffd966]/5 blur-2xl rounded-full translate-x-1/2 -translate-y-1/2 opacity-10 group-hover:opacity-20 transition-opacity duration-700" />
                  <div className="relative space-y-6">
                    {/* Award Name + Icon */}
                    <div className="flex items-start gap-4">
                      <div className="relative flex-shrink-0">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37] to-[#ffeec3] opacity-30 blur-lg rounded-xl" />
                        <div className="relative p-3.5 rounded-xl bg-gradient-to-br from-[#d4af37] via-[#ffeec3] to-[#b2994c] shadow-xl">
                          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                            <path d="M12 2l2.39 7.24h7.61l-6.19 4.5L16.92 22 12 17.27 7.08 22l1.11-8.26-6.19-4.5h7.61L12 2z" />
                          </svg>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-2xl lg:text-3xl font-black text-[#ffeec3] leading-tight">
                          Global Healthcare Excellence Awards, 2026
                        </h3>
                        <p className="text-[#ffd966] font-semibold mt-1 text-sm tracking-wide">
                          Achieving Excellence in Healthcare
                        </p>
                      </div>
                    </div>
                    <p className="text-[#e6dfcc] leading-relaxed text-lg font-medium">
                      The <span className="font-bold text-[#ffd966]">Global Healthcare Awards, 2026</span> recognize significant contributions in the healthcare sector.<br /><br />
                      The Awards showcase the highest academic goals and outstanding achievements through <span className="font-semibold text-[#f1d46b]">innovation, leadership, dedication,</span> and commitment towards learning.<br /><br />
                      <span className="font-semibold text-[#f1d46b]">Global Healthcare Excellence Awards, 2026</span> will be a converging point of the industry's elite – a celebration and recognition of excellence, reputation, and exemplary service.
                    </p>
                    {/* Feature Pills */}
                    <div className="flex flex-wrap gap-3 pt-4">
                      {['Excellence', 'Innovation', 'Leadership'].map((feature, idx) => (
                        <span
                          key={idx}
                          className="px-4 py-2 rounded-xl text-sm font-bold bg-[#ffeec3]/10 text-[#ffeec3] border border-[#d4af37]/20 hover:bg-[#ffeec3]/20 hover:border-[#d4af37]/40 hover:scale-105 hover:-translate-y-0.5 transition-all duration-300 cursor-default"
                        >{feature}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* ==== RIGHT: Key Dates ==== */}
            <div className="flex flex-col justify-center h-full lg:pl-8 xl:pl-16 space-y-8">
              <div>
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight">
                  <span className="bg-gradient-to-r from-[#ffeec3] via-[#ffd966] to-[#d4af37] bg-clip-text text-transparent">
                    Key Dates
                  </span>
                </h2>
                <div className="w-20 h-1.5 bg-gradient-to-r from-[#ffeec3] to-[#d4af37] rounded-full" />
              </div>
              {/* Timeline Style Cards */}
              <div className="space-y-6">
                {[
                  {
                    title: 'Award Ceremony – Dubai',
                    date: '26 April 2026',
                    icon: (
                      <span className="block w-10 h-10 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#ead481] flex items-center justify-center shadow-lg">
                        <span className="text-xl">🇦🇪</span>
                      </span>
                    ),
                    border: 'from-[#d4af37] to-[#ead481]',
                  },
                  {
                    title: 'Award Ceremony – London',
                    date: '9 June 2026',
                    icon: (
                      <span className="block w-10 h-10 rounded-xl bg-gradient-to-br from-[#386bb7] to-[#81b0ea] flex items-center justify-center shadow-lg">
                        <span className="text-xl">🇬🇧</span>
                      </span>
                    ),
                    border: 'from-[#386bb7] to-[#81b0ea]',
                  },
                ].map((item, idx) => (
                  <div key={idx} className="relative group"
                    style={{ animation: `fadeInUp 0.8s ease-out ${(idx + 1) * 120}ms both` }}>
                    <div className={`absolute -inset-1 bg-gradient-to-r ${item.border} opacity-0 group-hover:opacity-20 blur-xl transition-all duration-700 rounded-2xl`} />
                    <div className="relative bg-[#1f140d]/80 backdrop-blur-2xl rounded-2xl border border-[#ffeec3]/10 shadow-xl overflow-hidden hover:bg-[#2a1b12]/50 hover:border-[#d4af37]/20 hover:shadow-2xl hover:shadow-[#ffeec3]/10 transform hover:-translate-x-1 hover:scale-[1.02] transition-all duration-500">
                      <div className={`absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b ${item.border}`} />
                      <div className="p-6 flex items-center gap-5">
                        {/* Icon */}
                        <div>{item.icon}</div>
                        {/* Content */}
                        <div className="flex-1 pt-1">
                          <h3 className="text-lg sm:text-xl lg:text-2xl font-black text-[#ffeec3] mb-1 leading-tight group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-[#ffeec3] group-hover:to-white group-hover:bg-clip-text transition-all duration-500">{item.title}</h3>
                          <div className="flex items-center gap-2 text-[#ffd966] text-sm sm:text-base">
                            <svg className="w-4 h-4 text-[#d4af37]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M8 7V3m8 4V3M3 11h18M5 5h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" /></svg>
                            <span className="font-bold">{item.date}</span>
                          </div>
                        </div>
                        {/* Checkmark */}
                        <div className="flex-shrink-0">
                          <div className="p-2 rounded-lg bg-[#ffeec3]/10 group-hover:bg-[#ffeec3]/20 transition-colors duration-300">
                            <svg className="w-5 h-5 text-[#d4af37] opacity-50 group-hover:opacity-100 transition-opacity duration-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M9 13l2.25 2L15 11" /></svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* CTA Card */}
              <div className="relative group mt-8">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#ffeec3] via-[#d4af37] to-[#d4af37] opacity-20 group-hover:opacity-40 blur-xl transition-all duration-700 rounded-2xl" />
                <div className="relative bg-[#2a1b12]/70 backdrop-blur-xl rounded-2xl border border-[#ffeec3]/30 shadow-2xl overflow-hidden hover:bg-[#392818]/40 hover:border-[#d4af37]/50 transition-all duration-500 p-8">
                  {/* Gold Bar */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#ffd966] via-[#ffeec3] to-[#d4af37]" />
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-2xl text-[#ffd966] animate-pulse">✨</span>
                    <h4 className="text-xl font-black text-[#ffeec3]">Don't Miss Out!</h4>
                  </div>
                  <p className="text-[#eedea7] leading-relaxed mb-6 font-medium">
                    Submit your nomination before the deadline and be recognized for healthcare excellence.
                  </p>
                  <button onClick={handleNominateClick} className="relative w-full py-4 px-6 rounded-xl font-black text-[#392818] overflow-hidden group/btn transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 bg-gradient-to-r from-[#ffeec3] via-[#d4af37] to-[#a28533] shadow hover:shadow-lg ">
                    <span className="relative z-10 text-lg tracking-wide">Nominate Now</span>
                    <svg className="w-5 h-5 relative z-10 group-hover/btn:rotate-12 transition-transform duration-500 text-[#392818]" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24"><path d="M12 2l2.39 7.24h7.61l-6.19 4.5L16.92 22 12 17.27 7.08 22l1.11-8.26-6.19-4.5h7.61L12 2z" /></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Decorative */}
          <div className="mt-20 text-center">
            <div className="inline-flex items-center gap-2 text-[#ffeec3]/70 text-sm">
              <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#ffeec3]/50" />
              <svg className="w-4 h-4 animate-pulse text-[#ffd966]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M12 2l2.39 7.24h7.61l-6.19 4.5L16.92 22 12 17.27 7.08 22l1.11-8.26-6.19-4.5h7.61L12 2z" /></svg>
              <span className="font-medium">Celebrating Excellence in Healthcare</span>
              <svg className="w-4 h-4 animate-pulse animation-delay-1000 text-[#ffd966]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M12 2l2.39 7.24h7.61l-6.19 4.5L16.92 22 12 17.27 7.08 22l1.11-8.26-6.19-4.5h7.61L12 2z" /></svg>
              <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#ffeec3]/50" />
            </div>
          </div>
        </div>
      </section>
      {/* ================= WHY ENTER ================= */}
      <section className={`relative pt-6 pb-16 md:pb-24 overflow-hidden ${HIGHLIGHT_BG}`}>
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-0 right-1/4 w-[320px] sm:w-[420px] md:w-[500px] h-[320px] sm:h-[420px] md:h-[500px] bg-[#d4af37]/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-1/4 w-[320px] sm:w-[420px] md:w-[500px] h-[320px] sm:h-[420px] md:h-[500px] bg-[#c62828]/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>
        {/* ...rest code unchanged... */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          {/* Heading and grid as before */}
          {/* ... code unchanged ... */}
          <div
            ref={(el) => (sectionRefs.current[4] = el)}
            className="opacity-0 transform translate-y-8 transition-all duration-700 text-center mb-14 sm:mb-20"
          >
            <h2 className="text-2xl xs:text-4xl md:text-5xl font-extrabold font-heading mb-3 sm:mb-7 bg-gradient-to-r from-white via-[#d4af37] to-white bg-clip-text text-transparent drop-shadow">
              Why Enter Healthcare Awards – Global Healthcare Awards 2026
            </h2>
            <div className="w-24 sm:w-32 h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto"></div>
          </div>
          {/* ...grid ... */}
          <div
            className={`w-full grid ${getGridCols(2)} md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8 md:gap-10`}
          >
            {/* ...cards unchanged... */}
            {[
              {
                title: "National & Global Recognition",
                desc: "Gain prestigious recognition across the healthcare industry and position your organisation among the most trusted and respected leaders.",
                icon: "🌟",
              },
              {
                title: "Independent Jury Validation",
                desc: "All nominations are evaluated by an eminent and independent jury panel, ensuring credibility, transparency, and unbiased assessment.",
                icon: "⚖️",
              },
              {
                title: "Showcase Innovation & Impact",
                desc: "Highlight your innovations, achievements, and measurable impact before policymakers, industry leaders, and stakeholders.",
                icon: "💡",
              },
              {
                title: "Strengthen Brand Authority",
                desc: "Enhance brand reputation and reinforce trust among partners, clients, investors, and the broader healthcare ecosystem.",
                icon: "🏆",
              },
              {
                title: "Benchmark Against Industry Leaders",
                desc: "Measure your performance against industry best practices, global standards, and emerging healthcare trends.",
                icon: "📊",
              },
              {
                title: "Future-Ready Positioning",
                desc: "Demonstrate your organisation's readiness for future challenges through leadership, scalability, and sustainable growth.",
                icon: "🚀",
              },
            ].map((item, index) => (
              <div
                key={index}
                ref={(el) => (sectionRefs.current[5 + index] = el)}
                className="group relative opacity-0 transform translate-y-8 transition-all duration-700 min-h-[250px] flex"
              >
                <div className="relative bg-gradient-to-br from-black/40 via-black/30 to-black/40 backdrop-blur-xl rounded-3xl flex flex-col flex-grow p-6 sm:p-8 md:p-10 border border-[#eed47c]/30 hover:border-[#ffeb98] hover:shadow-[#d4af37]/40 transition-all duration-500 hover:shadow-[0_8px_48px_-10px_#d4af37cc] hover:-translate-y-2 hover:scale-[1.03]">
                  {/* Decorative Corners */}
                  <div className="absolute top-0 left-0 w-9 sm:w-11 h-9 sm:h-11 border-t-2 border-l-2 border-[#eee9bd]/30 rounded-tl-3xl group-hover:border-[#d4af37] transition-all duration-300"></div>
                  <div className="absolute top-0 right-0 w-9 sm:w-11 h-9 sm:h-11 border-t-2 border-r-2 border-[#eee9bd]/30 rounded-tr-3xl group-hover:border-[#d4af37] transition-all duration-300"></div>
                  <div className="absolute bottom-0 left-0 w-9 sm:w-11 h-9 sm:h-11 border-b-2 border-l-2 border-[#eee9bd]/30 rounded-bl-3xl group-hover:border-[#d4af37] transition-all duration-300"></div>
                  <div className="absolute bottom-0 right-0 w-9 sm:w-11 h-9 sm:h-11 border-b-2 border-r-2 border-[#eee9bd]/30 rounded-br-3xl group-hover:border-[#d4af37] transition-all duration-300"></div>
                  {/* Icon */}
                  <div className="text-3xl sm:text-4xl mb-1 sm:mb-3 flex-shrink-0 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    {item.icon}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4 text-[#eed47c] group-hover:text-[#fffbe5] transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-sm sm:text-base text-[#e6d7c8] leading-relaxed group-hover:text-[#fffce6] transition-colors duration-300 flex-grow">
                    {item.desc}
                  </p>
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#d4af37]/0 via-[#d4af37]/0 to-[#d4af37]/0 group-hover:via-[#d4af37]/10 group-hover:to-[#d4af37]/20 transition-all duration-700 -z-10"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* ================= RESEARCH METHODOLOGY ================= */}
      <section className={`relative overflow-hidden pt-6 md:pt-10 pb-6 ${SECTION_BG}`}>
        {/* Glow Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-1/3 right-0 w-40 sm:w-60 md:w-80 h-40 sm:h-60 md:h-80 bg-[#d4af37]/8 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 left-0 w-40 sm:w-60 md:w-80 h-40 sm:h-60 md:h-80 bg-[#c62828]/8 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          {/* Heading */}
          <div className="text-center mb-16">
            <h2 className="text-2xl xs:text-4xl md:text-5xl font-semibold font-heading mb-3 sm:mb-7 bg-gradient-to-r from-white via-[#d4af37] to-white bg-clip-text text-transparent">
              Research Methodology
            </h2>
            <div className="w-24 sm:w-32 h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto"></div>
          </div>

          {/* DATA */}
          {(() => {
            const items = [
              {
                title: "Data Collection & Screening",
                desc: "All nominations are collected through a structured submission process. Each entry undergoes an initial screening to ensure eligibility, completeness, and alignment with the award category.",
                number: "01",
              },
              {
                title: "Qualitative & Quantitative Analysis",
                desc: "Submissions are evaluated using a balanced research framework combining qualitative insights and quantitative metrics to assess performance, innovation, and impact.",
                number: "02",
              },
              {
                title: "Expert Jury Evaluation",
                desc: "An independent panel of industry experts, academicians, and subject-matter specialists reviews shortlisted entries to ensure unbiased and credible assessment.",
                number: "03",
              },
              {
                title: "Benchmarking & Industry Standards",
                desc: "Each nomination is benchmarked against industry best practices, regulatory standards, and emerging global trends to measure relevance and excellence.",
                number: "04",
              },
              {
                title: "Score Normalisation & Validation",
                desc: "Scores from multiple evaluators are normalised to eliminate bias and ensure consistency, fairness, and transparency across all categories.",
                number: "05",
              },
              {
                title: "Final Review & Approval",
                desc: "The final results undergo an internal audit and validation process before approval, ensuring accuracy, integrity, and credibility of the award outcomes.",
                number: "06",
              },
            ];

            return (
              <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
                {items.map((item, index) => (
                  <div key={index} className="relative group flex flex-col items-center">

                    {/* CARD */}
                    <div className="relative w-full flex flex-col min-h-[250px] bg-gradient-to-br from-black/80 via-black/40 to-black/70 backdrop-blur-lg rounded-3xl p-6 sm:p-8 md:p-10 border border-[#efd779]/10 hover:border-[#ffe98c]/60 hover:scale-105 hover:shadow-[0_8px_32px_-10px_#eed47ccc] transition-all duration-500">

                      {/* Number */}
                      <div className="absolute -top-4 -left-4 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-[#f7e7a1] via-[#eed47c] to-[#c9a530] flex items-center justify-center text-black font-bold text-base sm:text-lg shadow-lg border-2 border-[#d4af37] ring-2 ring-white/10">
                        {item.number}
                      </div>

                      {/* Title */}
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-4 bg-gradient-to-r from-[#f1d46b] to-[#d4af37] bg-clip-text text-transparent">
                        {item.title}
                      </h3>

                      {/* Desc */}
                      <p className="text-sm sm:text-base text-[#e6ddcc] leading-relaxed flex-grow">
                        {item.desc}
                      </p>

                      <div className="mt-5 sm:mt-6 h-1 w-12 sm:w-14 bg-gradient-to-r from-[#d4af37] to-transparent opacity-40 rounded-full"></div>
                    </div>

                    {/* ARROWS */}
                    {index !== items.length - 1 && (
                      <>
                        {/* Desktop Right Arrow */}
                        <div className="hidden md:flex absolute right-[-40px] top-1/2 -translate-y-1/2 z-20">
                          <div className="bg-gradient-to-br from-[#fffbe9] via-[#d4af37] to-[#c62828]/70 rounded-full shadow-lg p-[2.5px] border-2 border-[#eed47c]/50 animate-pulse-slow transition-all group-hover:scale-110 group-hover:shadow-[0_0_24px_2px_#d4af3766]">
                            <div className="bg-black/30 rounded-full p-0.5 flex items-center justify-center">
                              <svg width="34" height="34" viewBox="0 0 34 34" className="drop-shadow-lg" fill="none">
                                <defs>
                                  <radialGradient id={`arrowGradient${index}`} cx="50%" cy="50%" r="70%">
                                    <stop offset="0%" stopColor="#ffd657" />
                                    <stop offset="80%" stopColor="#d4af37" />
                                    <stop offset="100%" stopColor="#c62828" />
                                  </radialGradient>
                                </defs>
                                <circle cx="17" cy="17" r="16" fill="url(#arrowGradient0)" opacity="0.21" />
                                <path
                                  d="M10 17h14m0 0l-5-5m5 5l-5 5"
                                  stroke="#d4af37"
                                  strokeWidth="2.7"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  filter="url(#dropshadow)"
                                />
                                <filter id="dropshadow" x="0" y="0" width="200%" height="200%">
                                  <feDropShadow dx="0" dy="0" stdDeviation="1.5" floodColor="#ffe68488" />
                                </filter>
                              </svg>
                            </div>
                          </div>
                        </div>

                        {/* Mobile Down Arrow */}
                        <div className="md:hidden flex flex-col items-center mt-4 z-20">
                          <div className="bg-gradient-to-br from-[#fffbe9] via-[#d4af37] to-[#c62828]/70 rounded-full shadow-lg p-[2.5px] border-2 border-[#eed47c]/50 animate-pulse-slow transition-all group-hover:scale-110 group-hover:shadow-[0_0_24px_2px_#d4af3766]">
                            <div className="bg-black/30 rounded-full p-0.5 flex items-center justify-center">
                              <svg width="34" height="34" viewBox="0 0 34 34" className="drop-shadow-lg" fill="none">
                                <defs>
                                  <radialGradient id={`arrowGradientMobile${index}`} cx="50%" cy="50%" r="70%">
                                    <stop offset="0%" stopColor="#ffd657" />
                                    <stop offset="80%" stopColor="#d4af37" />
                                    <stop offset="100%" stopColor="#c62828" />
                                  </radialGradient>
                                </defs>
                                <circle cx="17" cy="17" r="16" fill="url(#arrowGradientMobile0)" opacity="0.21" />
                                <path
                                  d="M17 10v14m0 0l5-5m-5 5l-5-5"
                                  stroke="#d4af37"
                                  strokeWidth="2.7"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  filter="url(#dropshadowMobile)"
                                />
                                <filter id="dropshadowMobile" x="0" y="0" width="200%" height="200%">
                                  <feDropShadow dx="0" dy="0" stdDeviation="1.5" floodColor="#ffe68488" />
                                </filter>
                              </svg>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      </section>

      {/* ================= GUESTS & SPEAKERS ================= */}
      <section className={`relative pt-6 md:pt-12 pb-8 overflow-hidden ${HIGHLIGHT_BG}`}>
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] xs:w-[480px] md:w-[800px] h-[360px] xs:h-[480px] md:h-[800px] bg-[#d4af37]/10 rounded-full blur-3xl animate-pulse"></div>
        </div>
        {/* Rest of the section content unchanged */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          {/* ...headings and cards as is... */}
          <div
            ref={(el) => (sectionRefs.current[11] = el)}
            className="opacity-0 transform translate-y-8 transition-all duration-700 text-center mb-14 md:mb-20"
          >
            <h2 className="text-2xl xs:text-4xl md:text-5xl font-heading font-bold mb-3 sm:mb-6 bg-gradient-to-r from-white via-[#d4af37] to-white bg-clip-text text-transparent drop-shadow">
              Our Esteemed Guests & Speakers
            </h2>
            <div className="w-24 sm:w-32 h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto"></div>
          </div>
          {/* Guest grid improved styling */}
          <div className="grid grid-cols-2 xs:grid-cols-3 md:grid-cols-4 gap-y-9 gap-x-5 xs:gap-x-8">
            {guests.map((member, index) => (
              <div
                key={index}
                ref={(el) => (sectionRefs.current[12 + index] = el)}
                className="text-center group opacity-0 transform translate-y-8 transition-all duration-700 flex flex-col items-center"
              >
                {/* Profile Circle Improved */}
                <div
                  className="relative mx-auto mb-5 sm:mb-6 h-32 w-32 xs:h-44 xs:w-44 md:h-56 md:w-56 rounded-full overflow-visible bg-gradient-to-br from-[#d4af37]/30 via-[#fffbe9]/20 to-[#c62828]/25 p-[4px] group-hover:p-[7px] transition-all duration-400 shadow-xl group-hover:shadow-2xl"
                  style={{
                    boxShadow: '0 6px 28px 0 rgba(212,175,55,0.12), 0 1.5px 6px 0 #fffbe950'
                  }}
                >
                  {/* Animated Border Ring */}
                  <div
                    className="absolute inset-0 rounded-full border-2 xs:border-4 border-transparent bg-gradient-to-r from-[#ffe684] via-[#c62828] to-[#d4af37] opacity-0 group-hover:opacity-90 group-hover:animate-spin"
                    style={{ animationDuration: '7s', zIndex: 1 }}
                  ></div>
                  {/* Inner Glow Ring - thoda visible aur soft kiya */}
                  <div className="absolute inset-[7px] xs:inset-2 rounded-full border-2 border-[#d4af37]/50 group-hover:border-[#ffd966]/90 transition-all duration-500" style={{
                    boxShadow: '0 0 8px 2px #ffeec390,0 2px 8px #d4af3740'
                  }}></div>
                  {/* Image with fallback bg */}
                  <div className="relative z-10 h-full w-full rounded-full overflow-hidden bg-[#2a1b12]">
                    <img
                      src={`/images/jury${index + 1}.jpeg`}
                      alt={member.name}
                      className="h-full w-full rounded-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-105 bg-[#221710]"
                      loading="lazy"
                      style={{
                        backgroundColor: '#211609',
                        objectFit: 'cover'
                      }}
                      onError={e => {
                        // hide img if not found & show empty avatar bg
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                  {/* Shine/Highlight Overlay */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/10 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                  {/* Soft shadow at bottom for floating feel */}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-4 w-20 md:w-28 bg-black/10 rounded-full blur-md"></div>
                </div>
                {/* Name and details */}
                <p className="font-bold text-base xs:text-lg md:text-xl text-white mb-1 md:mb-2 group-hover:text-[#d4af37] transition-colors duration-300 line-clamp-1 drop-shadow">
                  {member.name}
                </p>
                <div className="w-9 xs:w-12 h-0.5 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto mb-1 xs:mb-3 opacity-60 group-hover:opacity-100 group-hover:w-16 transition-all duration-500"></div>
                <p className="text-xs xs:text-sm md:text-base text-[#dbc6ad] leading-relaxed group-hover:text-[#fffbe9] transition-colors duration-300 line-clamp-2">
                  {member.designation}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* ================= PREVIOUS MEDIA PARTNERS ================= */}
      <section
        className={`relative pt-8 sm:pt-10 md:pt-16 pb-8 sm:pb-12 md:pb-20 overflow-hidden ${SECTION_BG}`}
        style={{ WebkitTapHighlightColor: "transparent" }}
      >
        {/* Decorative mesh gradients for premium depth - responsive sizes */}
        <div className="absolute inset-0 pointer-events-none -z-10">
          <div className="absolute top-[-50px] xs:top-[-80px] left-1/2 -translate-x-1/2 w-[160px] xs:w-[260px] sm:w-[350px] md:w-[500px] lg:w-[580px] h-[160px] xs:h-[260px] sm:h-[350px] md:h-[500px] lg:h-[580px] bg-[#d4af37]/15 rounded-full blur-[32px] xs:blur-[80px] sm:blur-[110px] animate-pulse -z-10" />
          <div className="absolute -bottom-10 xs:-bottom-20 right-[4%] xs:right-[7%] w-[90px] xs:w-[140px] sm:w-[200px] md:w-[310px] lg:w-[350px] h-[90px] xs:h-[160px] sm:h-[200px] md:h-[310px] lg:h-[350px] bg-[#c62828]/10 rounded-full blur-[32px] xs:blur-[80px] sm:blur-[120px] animate-pulse delay-1000 -z-10" />
          <div className="absolute top-1/4 left-[-13%] xs:left-[-10%] w-16 xs:w-24 sm:w-36 h-24 xs:h-36 sm:h-60 bg-[#ffd966]/10 rounded-full blur-xl xs:blur-2xl rotate-12" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-2 xs:px-4 sm:px-6">
          <div className="text-center mb-6 sm:mb-8 md:mb-14">
            <h2 className="text-xl xs:text-2xl sm:text-4xl md:text-5xl font-heading font-extrabold mb-2 sm:mb-4 md:mb-6 bg-gradient-to-r from-[#f7e791] via-[#d4af37] to-[#f7e791] bg-clip-text text-transparent drop-shadow-lg tracking-tight">
              Our Previous Media Partners
            </h2>
            <div className="w-20 xs:w-28 sm:w-36 md:w-40 h-1 rounded-full bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto mb-1 sm:mb-2" />
            <p className="mt-2 text-sm xs:text-base sm:text-lg md:text-xl text-[#faecc6] max-w-xs xs:max-w-lg sm:max-w-2xl mx-auto leading-snug font-semibold drop-shadow">
              <span className="italic text-[#ffd966] font-display text-base sm:text-lg md:text-2xl">“</span>
              <span className="font-serif">
                A strong network of media partners has helped amplify the <span className="text-[#ffd966] font-semibold">Global Healthcare Awards</span> across India and internationally.
              </span>
              <span className="italic text-[#ffd966] font-display text-base sm:text-lg md:text-2xl">”</span>
            </p>
          </div>

          {/* Automatic Infinite Slider */}
          <div className="overflow-hidden py-6 sm:py-10 lg:py-14 w-full">
            <div className="animate-marquee flex gap-8 sm:gap-12 md:gap-16 lg:gap-20 items-center">
              {/* Combine original list twice for seamless loop */}
              {[...mediaPartners, ...mediaPartners].map((partner, idx) => (
                <div
                  key={`${partner.name}-${idx}`}
                  className="flex-shrink-0 group"
                >
                  <div
                    className="
                      relative h-28 xs:h-36 sm:h-48 md:h-60 lg:h-72 xl:h-80
                      aspect-square rounded-2xl sm:rounded-3xl md:rounded-[2.5rem]
                      bg-gradient-to-br from-[#1d140e]/95 via-[#251c10]/98 to-[#b0872b1a]
                      border border-[#eed47c]/25
                      hover:border-[#ffd966]
                      hover:shadow-[0_20px_60px_-15px_#efd77c66,0_0_0_3px_#ffd96622]
                      transition-all duration-500
                      flex items-center justify-center
                      overflow-hidden p-4 xs:p-7 sm:p-10 md:p-12 lg:p-14
                    "
                    style={{ backdropFilter: "blur(4px)" }}
                  >
                    {/* Glow Background */}
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#d4af37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                    {partner.logo ? (
                      <img
                        src={partner.logo}
                        alt={partner.name}
                        className="w-full h-full object-contain group-hover:scale-110 group-hover:brightness-105 transition-all duration-500"
                        loading="lazy"
                        draggable="false"
                      />
                    ) : (
                      <span className="text-[#ffd966] text-xl sm:text-3xl md:text-4xl font-black drop-shadow-lg">
                        {partner.name[0]}
                      </span>
                    )}

                    {/* Corner Ornaments */}
                    <div className="absolute top-2 left-2 w-3 sm:w-4 h-3 sm:h-4 border-t border-l border-[#d4af37]/30 rounded-tl-lg group-hover:border-[#d4af37] transition-all duration-300"></div>
                    <div className="absolute bottom-2 right-2 w-3 sm:w-4 h-3 sm:h-4 border-b border-r border-[#d4af37]/30 rounded-br-lg group-hover:border-[#d4af37] transition-all duration-300"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* Selection Process */}
      <section className={`relative pt-10 md:pt-20 pb-16 md:pb-24 overflow-hidden ${SECTION_BG}`}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] xs:w-[450px] md:w-[600px] h-[320px] xs:h-[450px] md:h-[600px] bg-[#d4af37]/10 rounded-full blur-3xl animate-pulse"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          {/* ...content unchanged... */}
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-2xl xs:text-4xl md:text-5xl font-heading font-bold mb-3 sm:mb-6 bg-gradient-to-r from-white via-[#d4af37] to-white bg-clip-text text-transparent drop-shadow">
              Selection Process.
            </h2>
            <div className="w-24 sm:w-32 h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto"></div>
          </div>
          {/* Cards */}
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 md:gap-12">
            {[
              {
                title: "Judging Criteria",
                desc: "A structured and transparent evaluation framework ensures credibility, consistency, and fairness across all nominations.",
                icon: "📋",
              },
              {
                title: "Persistent Fairness & Integrity",
                desc: "Each entry is reviewed independently by an eminent jury panel, maintaining complete impartiality and ethical standards.",
                icon: "⚖️",
              },
              {
                title: "Confidentiality",
                desc: "All nomination data, documentation, and evaluation outcomes are treated with the highest level of confidentiality.",
                icon: "🔒",
              },
            ].map((item, index) => (
              <div key={item.title} className="group h-full flex">
                {/* CARD */}
                <div className="relative flex flex-col text-center flex-grow bg-gradient-to-br from-black/70 via-black/40 to-black/70 backdrop-blur-md rounded-3xl p-7 sm:p-9 md:p-10 border border-[#eed47c]/20 hover:border-[#ffd966]/70 hover:scale-105 hover:shadow-[0_8px_32px_-10px_#eed47ccc] transition-all duration-500">
                  {/* Icon */}
                  <div className="text-3xl sm:text-5xl mb-3 sm:mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    {item.icon}
                  </div>
                  {/* Title */}
                  <h3 className="text-lg sm:text-2xl font-bold mb-2 sm:mb-4 bg-gradient-to-r from-[#f1d46b] to-[#d4af37] bg-clip-text text-transparent">
                    {item.title}
                  </h3>
                  {/* Description */}
                  <p className="text-sm sm:text-base text-[#ecdcb9] leading-relaxed flex-grow">
                    {item.desc}
                  </p>
                  {/* Bottom Accent */}
                  <div className="mt-4 sm:mt-6 h-1 w-10 sm:w-14 mx-auto bg-gradient-to-r from-[#d4af37] to-transparent opacity-40 rounded-full"></div>
                  {/* Hover Glow */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#d4af37]/0 via-[#d4af37]/0 to-[#d4af37]/0 group-hover:via-[#d4af37]/10 group-hover:to-[#d4af37]/20 transition-all duration-700 -z-10"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* ================= KEY FAQ SNAPSHOT ================= */}
      <section className={`relative pt-12 md:pt-20 pb-16 md:pb-28 overflow-hidden ${HIGHLIGHT_BG}`}>
        {/* Premium Glow Ornaments */}
        <div className="absolute inset-0 pointer-events-none -z-10">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-gradient-to-br from-[#d4af37]/25 via-transparent to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-[-6rem] right-1/6 w-96 h-96 bg-gradient-to-tr from-[#c62828]/15 via-[#d4af37]/10 to-transparent rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-2 xs:px-3 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl xs:text-5xl md:text-6xl font-heading font-extrabold bg-gradient-to-r from-[#fffbe7] via-[#ffe79b] via-50% to-[#d4af37] bg-clip-text text-transparent drop-shadow-lg tracking-tight">
              Frequently Asked Questions
            </h2>
            <div className="mt-4 w-28 sm:w-40 h-[5px] mx-auto rounded-full bg-gradient-to-r from-transparent via-[#ffd966] to-transparent shadow-[0_0_24px_2px_#ffeec3]" />
            <p className="mt-6 text-base sm:text-lg md:text-xl text-[#ffefb0] max-w-2xl mx-auto font-medium tracking-wide leading-relaxed">
              <span className="bg-gradient-to-br from-[#fffbe7] via-[#ffe79b] to-[#d4af37] bg-clip-text text-transparent font-bold">Your most essential queries about nominations, eligibility, and benefits—</span>
              for the complete FAQ, please visit our FAQ page.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
            {homeFaqs.map((item, index) => (
              <div
                key={index}
                className="relative flex h-full"
              >
                <div
                  className="
                    group
                    relative
                    flex flex-col
                    flex-grow
                    overflow-visible
                    bg-gradient-to-br from-[#2a1b12]/70 via-[#3c230f]/90 to-[#dac377]/10
                    border border-[#eed47c]/20
                    hover:border-[#ffd966]
                    rounded-2xl sm:rounded-3xl
                    p-5 xs:p-6 sm:p-7 md:p-8
                    shadow-[0_8px_22px_-8px_#eed47c66]
                    hover:shadow-[0_16px_28px_-8px_#ffd96677]
                    transition-all duration-300
                    cursor-pointer
                    w-full
                    min-h-[240px] xs:min-h-[200px] sm:min-h-[240px] md:min-h-[220px]
                    max-w-full
                    box-border
                  "
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                  }}
                >
                  {/* Q Number Circle - moved INSIDE card content */}
                  <div className="flex items-center mb-3">
                    <span className="inline-flex items-center justify-center bg-gradient-to-r from-[#fbf6df] via-[#ffe7a1] to-[#d4af37] rounded-full shadow-lg w-8 h-8 text-base sm:text-xl font-bold text-[#a28533] border-2 border-[#ffeec3]/70">
                      Q{index + 1}
                    </span>
                  </div>
                  {/* Decorative Glow */}
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#ffeec3]/10 via-transparent to-transparent opacity-70 -z-10 rounded-b-3xl pointer-events-none" />
                  {/* Inner Content */}
                  <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Question */}
                    <h3 className="mb-2 sm:mb-3 text-base xs:text-lg md:text-xl font-bold tracking-wide bg-gradient-to-r from-[#ffeec3] via-[#ffe07d] to-[#d4af37] bg-clip-text text-transparent drop-shadow group-hover:scale-105 group-hover:drop-shadow-[0_2px_12px_#ffeec399] transition duration-300 break-words">
                      {item.q}
                    </h3>
                    {/* Answer */}
                    <p className="text-xs xs:text-sm sm:text-base md:text-lg text-[#ffeec3]/90 leading-relaxed font-medium bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#fff7cf] group-hover:via-[#ffefb0] group-hover:to-[#ffe07d] group-hover:text-transparent transition-colors duration-300 break-words line-clamp-6 sm:line-clamp-5">
                      {item.a}
                    </p>
                  </div>

                  {/* Bottom premium accent */}
                  <div className="mt-6 h-1 w-14 sm:w-20 mx-auto rounded-full bg-gradient-to-r from-[#ffeec3] via-[#ffd966] to-transparent opacity-60" />

                  {/* Subtle floating gold particles effect (decorative dots) */}
                  <div className="absolute left-2 bottom-2 h-2 w-2 bg-[#ffeec3]/30 rounded-full blur-[2px] animate-pulse"></div>
                  <div className="absolute right-3 top-3 h-2 w-2 bg-[#ffd966]/20 rounded-full blur-[1.5px] animate-pulse delay-500"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* CTA section - keep visually distinct but aligned */}
      <section className={`relative pt-10 sm:pt-14 md:pt-20 pb-12 sm:pb-20 md:pb-28 text-center overflow-hidden ${PRIMARY_BG}`}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-0 left-1/4 w-64 sm:w-80 h-64 sm:h-80 bg-[#d4af37]/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-64 sm:w-80 h-64 sm:h-80 bg-[#c62828]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        <div
          ref={(el) => (sectionRefs.current[21] = el)}
          className="relative z-10 opacity-0 transform translate-y-8 transition-all duration-700 max-w-2xl md:max-w-4xl mx-auto px-4 sm:px-6"
        >
          <h2 className="text-xl xs:text-3xl md:text-5xl font-extrabold font-heading mb-4 md:mb-6 bg-gradient-to-r from-white via-[#d4af37] to-white bg-clip-text text-transparent">
            Get the recognition you and your team deserve
          </h2>
          <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto mb-5 sm:mb-8"></div>
          <p className="mb-8 sm:mb-12 text-[#ebdcc8] text-base sm:text-lg md:text-xl">
            Nomination Extended Deadline – <span className="font-semibold bg-gradient-to-r from-[#d4af37] to-[#f1d46b] bg-clip-text text-transparent">15 April 2026</span>
          </p>
          <button
            type="button"
            onClick={handleNominateClick}
            className="relative overflow-hidden group/btn rounded-full bg-gradient-to-r from-[#d4af37] via-[#f1d46b] to-[#d4af37] text-black font-extrabold px-8 sm:px-12 md:px-16 py-4 sm:py-5 text-base md:text-lg transition-all duration-300 tracking-wide hover:scale-110 hover:shadow-[0_4px_32px_-4px_#d4af3780] hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-[#d4af37]/60"
          >
            <span className="relative z-10">Nominate Now</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-1000 pointer-events-none"></div>
          </button>
        </div>
      </section>

      {/* OUR OTHER UPCOMING AWARDS section */}
      <section className={`relative pt-12 sm:pt-24 md:pt-32 pb-14 sm:pb-24 md:pb-32 overflow-hidden ${HIGHLIGHT_BG}`}>
        {/* Responsive glowing background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-[20%] left-[12%] w-[60px] xs:w-[110px] sm:w-[190px] md:w-[240px] lg:w-[350px] h-[60px] xs:h-[110px] sm:h-[190px] md:h-[240px] lg:h-[350px] bg-[#d4af37]/5 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-[15%] right-[16%] w-[60px] xs:w-[110px] sm:w-[190px] md:w-[240px] lg:w-[350px] h-[60px] xs:h-[110px] sm:h-[190px] md:h-[240px] lg:h-[350px] bg-[#c62828]/5 rounded-full blur-2xl animate-pulse delay-700"></div>
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-2 xs:px-4 sm:px-6">
          <div className="text-center mb-8 xs:mb-14 sm:mb-20 md:mb-28">
            <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-3 sm:mb-5 bg-gradient-to-r from-white via-[#d4af37] to-white bg-clip-text text-transparent drop-shadow-xl">
              Our Other Upcoming Awards
            </h2>
            <div className="w-16 xs:w-20 sm:w-32 h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto"></div>
            <p className="mt-3 xs:mt-4 sm:mt-6 text-[#ebdcc8] text-xs xs:text-sm sm:text-base md:text-lg max-w-xl xs:max-w-2xl mx-auto">
              Join us in celebrating excellence across various industries globally.
            </p>
          </div>

          <div className="w-full">
            <Swiper
              modules={[Autoplay, Pagination]}
              spaceBetween={8}
              slidesPerView={1.05}
              loop={true}
              speed={1400}
              autoplay={{
                delay: 2600,
                disableOnInteraction: false,
              }}
              pagination={{
                clickable: true,
                dynamicBullets: true,
              }}
              breakpoints={{
                0: {
                  slidesPerView: 1.05,
                  spaceBetween: 8,
                },
                390: {
                  slidesPerView: 1.12,
                  spaceBetween: 9,
                },
                440: {
                  slidesPerView: 1.2,
                  spaceBetween: 12,
                },
                580: {
                  slidesPerView: 1.6,
                  spaceBetween: 14,
                },
                700: {
                  slidesPerView: 2,
                  spaceBetween: 14,
                },
                900: {
                  slidesPerView: 2.5,
                  spaceBetween: 16,
                },
                1100: {
                  slidesPerView: 3,
                  spaceBetween: 18,
                },
                1400: {
                  slidesPerView: 4,
                  spaceBetween: 22,
                },
              }}
              className="pb-12 xs:pb-16 sm:pb-20"
              style={{paddingLeft: 0, paddingRight: 0}}
            >
              {upcomingAwards.map((award, index) => (
                <SwiperSlide key={index} className="!px-0">
                  <div
                    className="
                      group relative flex flex-col rounded-lg xs:rounded-xl sm:rounded-2xl
                      bg-gradient-to-br from-[#2a1b12]/95 via-[#1a110a]/90 to-[#2a1b12]/95
                      border border-[#d4af37]/10 hover:border-[#d4af37]/80
                      transition-all duration-500 hover:shadow-[0_8px_26px_-10px_#e5c75b55]
                      overflow-hidden w-full
                      h-[280px] xs:h-[330px] sm:h-[370px] md:h-[390px] lg:h-[400px] xl:h-[410px]
                      p-0 shadow-md hover:scale-[1.025]
                    "
                    style={{ maxWidth: '100%' }}
                  >
                    {/* Premium Glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/5 via-[#ffedbb]/0 to-[#c62828]/10 opacity-0 group-hover:opacity-60 transition duration-500 pointer-events-none z-10 rounded-lg xs:rounded-xl sm:rounded-2xl blur-sm"></div>

                    {/* Image on upper half - strongly responsive height */}
                    <div className="relative w-full" style={{ height: "51%" }}>
                      <img
                        src={award.banner}
                        alt={award.title}
                        className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                        style={{ borderTopLeftRadius: 'inherit', borderTopRightRadius: 'inherit', borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
                        loading="lazy"
                      />
                      {/* Top Black gradient for some depth */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent z-10 rounded-t-lg xs:rounded-t-xl sm:rounded-t-2xl pointer-events-none"></div>
                      {/* Gold shine at bottom of image */}
                      <div className="absolute bottom-0 left-0 w-full h-3 xs:h-4 sm:h-7 md:h-8 bg-gradient-to-t from-[#ffe18b77] via-transparent to-transparent opacity-75 blur-[2px] pointer-events-none z-10"></div>
                      <div className="absolute bottom-2 left-1 xs:left-2 z-20">
                        <span className="px-1.5 py-[1px] xs:px-2.5 xs:py-1 rounded-full bg-gradient-to-r from-[#ffe9a3] to-[#d4af37] text-black text-[9px] xs:text-[10px] sm:text-[12px] font-bold uppercase tracking-wide shadow-md border border-[#fff4]/20 backdrop-blur">
                          {award.location}
                        </span>
                      </div>
                    </div>

                    {/* Text Content fills lower half */}
                    <div className="
                      flex flex-col flex-grow justify-between
                      px-2.5 xs:px-3.5 sm:px-5 pt-2 xs:pt-3 sm:pt-4 pb-2.5 sm:pb-5
                      h-full
                    ">
                      <div>
                        <h3 className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl font-black mb-0.5 xs:mb-1 sm:mb-2.5 bg-gradient-to-r from-[#ffeec3] via-[#d4af37] to-[#efd270] bg-clip-text text-transparent group-hover:from-white group-hover:to-[#ffeec3] transition-all duration-300 leading-tight drop-shadow-[0_2px_8px_#d4af3720] line-clamp-2">
                          {award.title}
                        </h3>
                        <p className="text-[#d4af37] font-semibold text-[10px] xs:text-xs sm:text-sm mb-0.5 xs:mb-1 sm:mb-2">
                          {award.date}
                        </p>
                        <p className="text-[#dbc6ad] text-[10px] xs:text-xs sm:text-sm md:text-base leading-snug group-hover:text-white transition-colors mb-2 xs:mb-3 sm:mb-4 drop-shadow-[0_1px_4px_#23140f11] font-medium line-clamp-3">
                          {award.desc}
                        </p>
                      </div>
                      <a
                        href={award.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative overflow-hidden group/btn rounded-md xs:rounded-lg sm:rounded-xl bg-gradient-to-r from-[#fcecb0] via-[#d4af37] to-[#a28533] text-[#23140f] hover:text-white font-extrabold px-2.5 xs:px-3 sm:px-4 py-1.5 xs:py-2 text-xs xs:text-sm sm:text-base text-center transition-all duration-300 hover:scale-105 hover:shadow-[0_2px_16px_-2px_#d4af3780] border border-[#ffe99b44] group-hover/btn:border-[#fff7d1] tracking-wide"
                      >
                        <span className="relative z-10 flex items-center justify-center gap-1 xs:gap-1.5 sm:gap-2">
                          Visit Website
                          <svg className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-4.5 sm:h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </span>
                        <div className="absolute left-0 top-0 h-full w-1/3 bg-gradient-to-r from-[#fff7d1] via-[#f1d46b90] to-transparent opacity-0 group-hover/btn:opacity-70 scale-x-0 group-hover/btn:scale-x-100 origin-left transition-all duration-700 z-0" />
                      </a>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>
      {/* WHO SHOULD NOMINATE section */}
      <section className={`relative pt-14 sm:pt-24 pb-16 sm:pb-24 overflow-hidden ${HIGHLIGHT_BG}`}>
        {/* Animated Gradient Glows */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-1/4 right-1/4 w-[260px] md:w-[440px] h-[260px] md:h-[440px] bg-gradient-radial from-[#d4af37]/30 via-transparent to-transparent rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 left-1/4 w-[200px] md:w-[380px] h-[200px] md:h-[380px] bg-gradient-radial from-[#fde68a]/30 via-transparent to-transparent rounded-full blur-[60px] animate-pulse delay-1000" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center mb-10 md:mb-20">
            {/* Premium Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#ffe9a3]/30 via-[#d4af37]/10 to-[#c8b36b]/20 border border-[#d4af37]/30 shadow-md mb-6 group transition-all duration-200 hover:bg-[#ffeec340] hover:border-[#ffeec3] hover:scale-105">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#f2e7b6] drop-shadow-[0_2px_4px_#d4af3720]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2l2.618 5.808 6.382.738-4.9 4.064L15.236 18 10 14.868 4.764 18l1.136-5.39-4.9-4.064 6.382-.738L10 2z"/>
              </svg>
              <span className="text-xs sm:text-sm font-extrabold tracking-[0.2em] bg-gradient-to-r from-[#fffbe8] via-[#d4af37] to-[#efd270] bg-clip-text text-transparent uppercase drop-shadow-[0_2px_8px_#d4af3710]">
                Nomination Categories
              </span>
            </div>

            <h2 className="text-3xl xs:text-4xl md:text-5xl font-heading font-extrabold mb-2 sm:mb-5 bg-gradient-to-tl from-white via-[#efd270] to-[#ffeec3] bg-clip-text text-transparent drop-shadow-[0_2px_22px_#d4af3722] tracking-tight">
              Who Should Nominate?
            </h2>
            <div className="w-24 sm:w-32 h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto rounded-full shadow-[0_4px_22px_#d4af3733]" />
            <p className="mt-7 text-[#ffe8b9] text-base sm:text-lg max-w-xl mx-auto leading-relaxed font-medium bg-gradient-to-r from-[#dbc6ad] via-[#fffbe8] to-[#d4af37] bg-clip-text text-transparent">
              Join an elite circle inspiring global education. We invite visionaries, educators, and leading institutions to become part of our prestigious honors.
            </p>
          </div>

          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {nomineeCategories.map((item, index) => (
              <div
                key={index}
                ref={(el) => (sectionRefs.current[25 + index] = el)}
                className="group relative opacity-0 translate-y-8 transition-all duration-900"
              >
                {/* Improved Card */}
                <div className="relative flex flex-col items-center h-full min-h-[300px] max-h-[410px] p-6 sm:p-7 bg-gradient-to-br from-[#35210e]/90 via-[#22140e]/96 to-[#2a1b10]/90 rounded-2xl border border-[#ffeec3]/10 hover:border-[#efd270]/80 shadow-lg hover:shadow-[0_12px_32px_-8px_#d4af3730] transition-all duration-500 hover:-translate-y-2 overflow-hidden">
                  {/* Subtle Gold Vertical Line */}
                  <div className="absolute left-1/2 top-3 w-0.5 h-20 bg-gradient-to-b from-[#ffeec3]/30 via-[#d4af37]/50 to-transparent opacity-50 -translate-x-1/2" />
                  {/* Decorative corner shimmer */}
                  <div className="absolute top-0 right-0 w-14 h-14 bg-gradient-to-br from-[#ffeec3]/40 to-transparent rounded-tr-2xl blur-[8px] opacity-0 group-hover:opacity-90 transition-opacity duration-500" />

                  {/* Icon with Subtle Glow */}
                  <div className="relative mb-5 flex-shrink-0">
                    <span className="absolute -inset-2 rounded-full bg-[#d4af3760] blur-2xl opacity-0 group-hover:opacity-70 transition-opacity duration-400"></span>
                    <span className="relative text-4xl md:text-5xl filter drop-shadow-[0_0_14px_rgba(212,175,55,0.10)] text-[#efe6be]">
                      {item.icon}
                    </span>
                  </div>

                  {/* Card Text Content */}
                  <div className="flex-1 w-full flex flex-col justify-start">
                    <h3 className="text-lg sm:text-xl font-extrabold mb-2 bg-gradient-to-r from-[#fffbe8] via-[#d4af37] to-[#efd270] bg-clip-text text-transparent group-hover:from-white group-hover:to-[#fffbe8] transition-all duration-400 leading-snug tracking-wide drop-shadow-[0_2px_6px_#d4af3722]">
                      {item.title}
                    </h3>
                    <p className="text-sm sm:text-base text-[#ffe8b9] leading-relaxed group-hover:text-white/95 transition-colors font-medium mt-1">
                      {item.desc}
                    </p>
                  </div>

                  {/* Gold underline bar */}
                  <div className="mt-6 h-1 w-12 bg-gradient-to-r from-[#ffeec3] via-[#d4af37] to-transparent rounded-full group-hover:w-20 transition-all duration-400 opacity-70 group-hover:opacity-100 shadow-[0_2px_7px_#d4af3711]"></div>
                </div>
                {/* Subtle glowing halo */}
                <div className="absolute -inset-[1.5px] bg-gradient-to-br from-[#ffeec340] via-transparent to-[#d4af37]/30 rounded-2xl opacity-0 group-hover:opacity-100 blur-sm -z-10 transition-opacity duration-400 pointer-events-none"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
