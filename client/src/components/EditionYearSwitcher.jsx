import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchPreviousEditions } from "../services/api.js";

export default function EditionYearSwitcher({ currentYear }) {
  const [editions, setEditions] = useState([]);

  useEffect(() => {
    fetchPreviousEditions()
      .then(res => {
        const fetchedEditions = (res.data || []).sort((a, b) => b.year - a.year);
        setEditions(fetchedEditions);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
      <div>
        <p className="text-xs uppercase tracking-widest text-[#d4af37]/80 font-bold">
          Previous Editions
        </p>
        <h2 className="text-xl md:text-2xl font-extrabold text-[#ffe9b3]">
          Global Healthcare Awards – {currentYear}
        </h2>
      </div>
      <div className="flex flex-wrap gap-2 text-xs">
        {editions.map((edition) => {
          const formattedTitle = edition.title?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "global-healthcare-awards";
          return (
            <Link
              key={edition.year}
              to={`/${edition.year}/${formattedTitle}`}
              className={`px-3 py-1 rounded-full border transition ${edition.year === currentYear
                ? "border-[#d4af37] bg-[#d4af37]/15 text-[#ffe9b3] font-semibold"
                : "border-white/20 text-gray-200 hover:bg-white hover:text-black"
                }`}
            >
              {edition.year}
            </Link>
          );
        })}
      </div>
    </div>
  );
}


