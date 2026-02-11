import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { getBaseUrl } from "../services/api.js";
import { FiUser, FiMail, FiLock, FiArrowRight, FiHome } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setSubmitting(true);
      await register(name, email, password);
      // Navigate to OTP verification page instead of nominate
      navigate("/verify-email", { state: { email } });
    } catch (err) {
      setError(err.message || "Unable to create account");
    } finally {
      setSubmitting(false);
    }
  };

  const goldGrad = "linear-gradient(90deg,#e9d781 0%,#dac24a 29.69%,#fee19a 70%,#bc9830 100%)";

  return (
    <section className="min-h-[100dvh] w-full bg-[#080808] relative flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#d4af37]/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#d4af37]/5 rounded-full blur-[150px] animate-pulse" />

      <Link
        to="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-white/40 hover:text-[#d4af37] transition-all text-sm font-bold uppercase tracking-widest group"
      >
        <FiHome className="text-lg group-hover:-translate-y-0.5 transition-transform" />
        <span>Back to Home</span>
      </Link>

      <div className="relative w-full max-w-[440px] md:max-w-[520px] lg:max-w-[560px] flex flex-col items-center">
        {/* Decorative Top Accent */}
        <div
          className="w-24 h-1 mb-6 rounded-full opacity-50"
          style={{ background: goldGrad }}
        />

        <div className="w-full bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-6 sm:p-8 md:px-12 md:py-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)]">
          <div className="text-center mb-6">
            <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-b from-white via-white to-[#d4af37] bg-clip-text text-transparent tracking-tighter mb-2">
              Join Awards
            </h1>
            <p className="text-gray-500 text-[11px] font-black uppercase tracking-[0.3em] ml-1">
              Start your nomination journey
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-3 group">
              <label className="flex items-center gap-2 text-xs md:text-sm font-black uppercase tracking-widest text-[#d4af37]/70 group-focus-within:text-[#d4af37] transition-colors ml-1">
                <FiUser /> Full Name / Org
              </label>
              <input
                type="text"
                className="w-full bg-white/[0.03] border border-[#d4af37]/20 rounded-2xl px-6 py-4 text-white text-base placeholder:text-white/40 focus:outline-none focus:border-[#d4af37] focus:bg-white/[0.06] focus:shadow-[0_0_15px_rgba(212,175,55,0.1)] transition-all"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Ex. Dr. John Doe"
              />
            </div>

            <div className="space-y-3 group">
              <label className="flex items-center gap-2 text-xs md:text-sm font-black uppercase tracking-widest text-[#d4af37]/70 group-focus-within:text-[#d4af37] transition-colors ml-1">
                <FiMail /> Email
              </label>
              <input
                type="email"
                className="w-full bg-white/[0.03] border border-[#d4af37]/20 rounded-2xl px-6 py-4 text-white text-base placeholder:text-white/40 focus:outline-none focus:border-[#d4af37] focus:bg-white/[0.06] focus:shadow-[0_0_15px_rgba(212,175,55,0.1)] transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@company.com"
              />
            </div>

            <div className="space-y-3 group">
              <label className="flex items-center gap-2 text-xs md:text-sm font-black uppercase tracking-widest text-[#d4af37]/70 group-focus-within:text-[#d4af37] transition-colors ml-1">
                <FiLock /> Set Your Password
              </label>
              <input
                type="password"
                className="w-full bg-white/[0.03] border border-[#d4af37]/20 rounded-2xl px-6 py-4 text-white text-base placeholder:text-white/40 focus:outline-none focus:border-[#d4af37] focus:bg-white/[0.06] focus:shadow-[0_0_15px_rgba(212,175,55,0.1)] transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="Min. 6 characters"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full group relative flex items-center justify-center h-16 rounded-2xl overflow-hidden transition-all active:scale-95 disabled:opacity-50 mt-4"
            >
              <div
                className="absolute inset-0 transition-transform group-hover:scale-110"
                style={{ background: goldGrad }}
              />
              <span className="relative flex items-center gap-3 text-black font-black uppercase tracking-widest text-lg">
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account <FiArrowRight className="text-xl group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
            </button>
          </form>

          <div className="mt-6">
            <div className="relative flex items-center justify-center mb-6">
              <div className="flex-grow border-t border-white/5"></div>
              <span className="flex-shrink mx-4 text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">
                Or Continue With
              </span>
              <div className="flex-grow border-t border-white/5"></div>
            </div>

            <button
              onClick={() => {
                const apiUrl = getBaseUrl();
                window.location.href = `${apiUrl}/api/auth/google`;
              }}
              className="w-full flex items-center justify-center gap-3 h-14 rounded-2xl bg-white/[0.03] border border-white/10 text-white font-bold hover:bg-white/[0.06] transition-all active:scale-[0.98]"
            >
              <FcGoogle className="text-2xl" />
              <span className="uppercase tracking-widest text-xs">Google Account</span>
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">
              If you are already registered, please login{" "}
              <Link
                to="/login"
                className="text-white hover:text-[#d4af37] transition-colors ml-2 underline decoration-[#d4af37]/30"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
