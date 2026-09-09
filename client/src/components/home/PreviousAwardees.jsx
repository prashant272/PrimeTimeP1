import React from 'react';

const PreviousAwardees = ({ SECTION_BG, mediaPartners = [
  { name: "India Today", logo: "../india-today.png" },
  { name: "CNN ", logo: "../cnn.jpg" },
  { name: "News18 India", logo: "../news.png" },
  { name: "Bharat 24", logo: "../bharat.jpg" },
  { name: "Doordarshan's", logo: "../ddd.png" },
  { name: "News 1 India", logo: "../new1.png" },
  { name: "News 10 India", logo: "../news10.jpg" },
  { name: "Delhi Aaj Tak", tagline: "Regional Hindi News Network", logo: "../delhiaajtk.jpg" },
  { name: "Prime Time", tagline: "National News & Media Network", logo: "../prime.png" },
  { logo: "../The-SME-Times.png" },
  { name: "Xoom Studio", tagline: "Media Production & Event Coverage Partner", logo: "../xoom.jpg" },
  { logo: "../remont.jpg" },
] }) => {
  return (
    <section
      className={`relative pt-6 sm:pt-8 md:pt-10 pb-6 sm:pb-8 md:pb-10 overflow-hidden ${SECTION_BG}`}
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-50px] xs:top-[-80px] left-1/2 -translate-x-1/2 w-[580px] h-[580px] bg-[#d4af37]/5 rounded-full blur-[120px]" />
        <div className="absolute -bottom-10 xs:-bottom-20 right-[4%] xs:right-[7%] w-[350px] h-[350px] bg-[#1a120c]/20 rounded-full blur-[120px]" />
        <div className="absolute top-1/4 left-[-13%] xs:left-[-10%] w-16 xs:w-24 sm:w-36 h-24 xs:h-36 sm:h-60 bg-[#ffd966]/10 rounded-full blur-xl xs:blur-2xl rotate-12" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-2 xs:px-4 sm:px-6">
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
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

        <div className="overflow-hidden py-6 sm:py-10 lg:py-14 w-full">
          <div className="animate-marquee flex gap-8 sm:gap-12 md:gap-16 lg:gap-20 items-center">
            {[...mediaPartners, ...mediaPartners].map((partner, idx) => (
              <div key={`${partner.name}-${idx}`} className="flex-shrink-0 group">
                <div className="relative h-28 xs:h-36 sm:h-48 md:h-60 lg:h-72 xl:h-80 aspect-square rounded-2xl sm:rounded-3xl md:rounded-[2.5rem] bg-gradient-to-br from-[#1a120c]/90 via-[#0a0a0a]/98 to-[#d4af37]/5 border border-[#eed47c]/20 hover:border-[#ffd966] hover:shadow-[0_20px_60px_-15px_#efd77c33] transition-all duration-500 flex items-center justify-center p-4 xs:p-7 sm:p-10 md:p-12 lg:p-14 backdrop-blur-md">
                  {partner.logo ? (
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      className="w-full h-full object-contain group-hover:scale-110 transition-all duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <span className="text-[#ffd966] text-xl sm:text-3xl md:text-4xl font-black">{partner.name[0]}</span>
                  )}
                  <div className="absolute top-2 left-2 w-3 sm:w-4 h-3 sm:h-4 border-t border-l border-[#d4af37]/30 rounded-tl-lg group-hover:border-[#d4af37] transition-all duration-300"></div>
                  <div className="absolute bottom-2 right-2 w-3 sm:w-4 h-3 sm:h-4 border-b border-r border-[#d4af37]/30 rounded-br-lg group-hover:border-[#d4af37] transition-all duration-300"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PreviousAwardees;
