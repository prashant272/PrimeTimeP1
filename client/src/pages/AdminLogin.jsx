import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { FiShield, FiMail, FiLock, FiChevronRight, FiHome } from "react-icons/fi";

export default function AdminLogin() {
  const { loginAsAdmin, user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setSubmitting(true);
      await loginAsAdmin(email, password);
    } catch (err) {
      setError(err.message || "Unable to login as admin");
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      const from = location.state?.from?.pathname || "/admin";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, user, navigate, location]);

  const goldGrad = "linear-gradient(90deg,#e9d781 0%,#dac24a 29.69%,#fee19a 70%,#bc9830 100%)";

  return (
    <section className="min-h-[100dvh] w-full bg-[#050810] relative flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[150px] animate-pulse" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#d4af37]/5 rounded-full blur-[150px]" />

      <Link
        to="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-blue-400/40 hover:text-white transition-all text-sm font-bold uppercase tracking-widest group"
      >
        <FiHome className="text-lg group-hover:-translate-y-0.5 transition-transform" />
        <span>Back to Home</span>
      </Link>

      <div className="relative w-full max-w-[440px] flex flex-col items-center pt-10 md:pt-16">
        {/* Admin Shield Icon */}
        <div className="mx-auto mb-6 w-24 h-24 bg-gradient-to-tr from-blue-600 via-blue-400 to-[#d4af37] rounded-[2rem] rotate-[15deg] flex items-center justify-center shadow-2xl shadow-blue-600/20 group">
          <FiShield className="h-12 w-12 text-white -rotate-[15deg] group-hover:scale-110 transition-transform" />
        </div>

        <div className="w-full bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.8)]">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-b from-white via-white to-blue-400 bg-clip-text text-transparent tracking-tight mb-2">
              System Admin
            </h1>
            <p className="text-blue-400/40 text-[9px] font-black uppercase tracking-[0.4em] ml-1">
              Restricted Protocol Access
            </p>
          </div>

          {error && (
            <div className="mb-8 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2 group">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-400/60 group-focus-within:text-blue-400 transition-colors ml-1">
                <FiMail /> Administrator ID
              </label>
              <input
                type="email"
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white text-base placeholder:text-white/10 focus:outline-none focus:border-blue-500/40 focus:bg-white/[0.06] transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@internal.com"
              />
            </div>

            <div className="space-y-2 group">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#d4af37]/70 group-focus-within:text-[#d4af37] transition-colors ml-1">
                <FiLock /> Security Key
              </label>
              <input
                type="password"
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white text-base placeholder:text-white/10 focus:outline-none focus:border-[#d4af37]/40 focus:bg-white/[0.06] transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full group relative flex items-center justify-center h-16 rounded-2xl overflow-hidden transition-all active:scale-95 disabled:opacity-50 mt-4"
            >
              <div
                className="absolute inset-0 transition-transform group-hover:scale-110"
                style={{ background: `linear-gradient(135deg, #2563eb, #3b82f6, #d4af37)` }}
              />
              <span className="relative flex items-center gap-3 text-white font-black uppercase tracking-widest text-sm">
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Checking Clearance...
                  </>
                ) : (
                  <>
                    Initialize Portal <FiChevronRight className="text-xl group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-white/5 text-center">
            <p className="text-blue-200/20 text-[10px] font-black uppercase tracking-widest">
              Need access?{" "}
              <Link
                to="/admin/register"
                className="text-blue-400 hover:text-white transition-colors ml-2 underline decoration-blue-400/20"
              >
                Request Credentials
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

