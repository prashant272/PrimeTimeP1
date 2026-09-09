import { useState } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";

const reels = [
  {
    id: "kwWlXq-YsxU",
    title: "Prime Time Research Media | Awards Highlights",
  },
  {
    id: "uQVIrUzUtPY",
    title: `Global Healthcare Awards | Ceremony Moments`,
  },
  { 
    id: "wQyIGMZnkQg",
    title: "Business & Leadership Summit | Award Reel",
  },
  {
    id: "otjWjh44h5c",
    title: "India Excellence Awards 2026 | Red Carpet",
  },
  {
    id: "T64_Km02LSw",
    title: `Global Healthcare Awards | Highlights`,
  },
];

function ReelCard({ reel }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative w-[200px] h-[355px] sm:w-[260px] sm:h-[462px] lg:w-[300px] lg:h-[533px] rounded-[2rem] overflow-hidden shadow-[0_30px_70px_-15px_rgba(0,0,0,0.8)] border border-white/10 hover:border-[#d4af37]/60 transition-all duration-700 cursor-pointer flex-shrink-0 group perspective-1000"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes borderBeamReels {
          0% { offset-distance: 0%; }
          100% { offset-distance: 100%; }
        }
        .reels-beam-path {
          offset-path: rect(0% 100% 100% 0% round 2rem);
          animation: borderBeamReels 4s linear infinite;
        }
      `}} />

      {/* Border Beam on Hover */}
      <div className={`absolute -inset-[1px] rounded-[2rem] overflow-hidden transition-opacity duration-500 pointer-events-none ${hovered ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute top-0 left-0 w-24 h-24 bg-[#d4af37] blur-[15px] reels-beam-path" />
      </div>

      {hovered ? (
        <iframe
          src={`https://www.youtube.com/embed/${reel.id}?autoplay=1&mute=1&playsinline=1&controls=0&rel=0&modestbranding=1&hd=1&vq=hd720`}
          title={reel.title}
          className="w-full h-full"
          allow="autoplay; encrypted-media"
          allowFullScreen
          style={{ border: "none" }}
        />
      ) : (
        <div className="w-full h-full relative">
          <img
            src={`https://img.youtube.com/vi/${reel.id}/maxresdefault.jpg`}
            onError={(e) => { e.target.src = `https://img.youtube.com/vi/${reel.id}/hqdefault.jpg`; }}
            alt={reel.title}
            className="w-full h-full object-cover transform transition-transform duration-1000 group-hover:scale-110"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Premium Gold Play Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-[#d4af37] via-[#f7e7a1] to-[#b6932f] flex items-center justify-center shadow-[0_10px_30px_rgba(212,175,55,0.4)] transition-all duration-500 group-hover:scale-125">
              <svg className="w-7 h-7 text-black transform translate-x-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5.14v14l11-7-11-7z" />
              </svg>
            </div>
          </div>

          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-xl rounded-full px-3 py-1.5 flex items-center gap-2 border border-white/10">
            <svg className="w-3.5 h-3.5 text-[#d4af37]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805z" />
            </svg>
            <span className="text-[#f7e7a1] text-[10px] font-black tracking-widest uppercase">Shorts</span>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
            <p className="text-[#f7e7a1] text-sm sm:text-base font-black leading-tight line-clamp-2 drop-shadow-lg tracking-tight uppercase">
              {reel.title}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ReelsSection({ SECTION_BG }) {
  return (
    <section className={`relative py-12 md:py-16 overflow-hidden ${SECTION_BG}`}>
      {/* Cinematic Studio Lighting & Dust */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-[#d4af37]/5 rounded-full blur-[180px] opacity-20" />
        
        {/* Floating Gold Dust */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              opacity: [0.1, 0.4, 0.1],
              y: [0, -100, 0],
              x: [0, 50, 0]
            }}
            transition={{ duration: 10 + i * 2, repeat: Infinity }}
            className="absolute w-1 h-1 bg-[#d4af37] rounded-full blur-[1px]"
            style={{ 
              top: `${Math.random() * 100}%`, 
              left: `${Math.random() * 100}%` 
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 md:mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/20 mb-6 group hover:bg-[#d4af37]/20 transition-all duration-300">
            <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-pulse"></span>
            <span className="text-[10px] sm:text-xs font-bold tracking-[0.3em] text-[#f7e7a1] uppercase">Media Highlights</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-black font-heading mb-6 tracking-tight leading-tight bg-gradient-to-r from-white via-[#d4af37] to-white bg-clip-text text-transparent">
            Trending Media Reels & Shorts
          </h2>
          
          <div className="flex items-center justify-center gap-6 mt-8">
            <div className="h-[1px] w-12 sm:w-20 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent opacity-60" />
            <div className="w-2 h-2 rounded-full border-2 border-[#d4af37] rotate-45" />
            <div className="h-[1px] w-12 sm:w-20 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent opacity-60" />
          </div>

          <p className="mt-8 text-[#dbc6ad] text-base sm:text-lg md:text-xl max-w-3xl mx-auto font-medium tracking-wide">
            Witness the viral moments, prestigious celebrity highlights, and 
            exclusive red-carpet coverage from our signature events.
          </p>
        </div>

        <Swiper
          modules={[Autoplay, FreeMode]}
          slidesPerView="auto"
          spaceBetween={24}
          freeMode={true}
          loop={true}
          speed={5000}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
            pauseOnMouseEnter: true
          }}
          className="!overflow-visible"
        >
          {[...reels, ...reels, ...reels].map((reel, idx) => (
            <SwiperSlide key={idx} className="!w-auto">
              <ReelCard reel={reel} />
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="text-center mt-10 md:mt-12">
          <a
            href="https://www.youtube.com/@primetimermedia"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-4 px-10 py-5 rounded-2xl bg-gradient-to-br from-[#1a120c] to-[#050505] border border-[#d4af37]/40 text-[#f7e7a1] font-black text-sm uppercase tracking-[0.2em] transition-all duration-500 hover:border-[#d4af37] hover:shadow-[0_15px_40px_-5px_#d4af3744] hover:-translate-y-2 overflow-hidden"
          >
             {/* Glow Effect */}
             <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
             
            <svg className="w-6 h-6 transform group-hover:scale-125 transition-transform" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />
            </svg>
            <span className="relative z-10">Expand Experience on YouTube</span>
          </a>
        </div>
      </div>
    </section>
  );
}
