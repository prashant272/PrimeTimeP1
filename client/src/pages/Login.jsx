import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { login } = useAuth();
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
      await login(email, password);
      const from = location.state?.from?.pathname || "/nominate";
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "Unable to login");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen w-full bg-gradient-to-br from-[#2c1818] via-[#1c0c0c] to-[#47361f] flex items-center justify-center px-3 py-30 sm:px-6 md:px-10 lg:px-0">
      {/* Premium Styled Glassmorphism Card */}
      <div className="relative w-full max-w-sm bg-white/5 backdrop-blur-2xl shadow-[0_10px_40px_-10px_#d4af37c5] border border-[#d4af37]/20 rounded-2xl px-5 py- md:py-9 flex flex-col items-center sm:px-7">
        {/* Removed logo circle above the card */}
        <h1 className="mt-10 text-2xl md:text-3xl font-bold text-center bg-gradient-to-r from-[#fff8e1] via-[#d4af37] to-[#c79f2a] bg-clip-text text-transparent tracking-tight drop-shadow-sm">
          Login
        </h1>
        <p className="mb-6 text-center text-base md:text-lg text-white/70">Sign in to your exclusive account</p>

        {error && (
          <div className="mb-3 w-full rounded-xl bg-red-500/10 border border-red-400/40 px-3 py-2 text-center text-sm text-red-100 shadow-sm">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="w-full space-y-4 md:space-y-5 flex flex-col"
          autoComplete="off"
        >
          <div>
            <label className="block text-sm md:text-base font-semibold text-white/80 mb-1 ml-2">
              Email
            </label>
            <input
              type="email"
              className="w-full transition-all duration-200 rounded-xl bg-white/10 border border-[#d4af37]/40 px-3 py-2 text-brown-950 text-base font-medium shadow-inner focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-[#d4af37] placeholder:text-[#d4af37]/60 placeholder:font-semibold"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-sm md:text-base font-semibold text-white/80 mb-1 ml-2">
              Password
            </label>
            <input
              type="password"
              className="w-full transition-all duration-200 rounded-xl bg-white/10 border border-[#d4af37]/40 px-3 py-2 text-brown-950 text-base font-medium shadow-inner focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-[#d4af37] placeholder:text-[#d4af37]/60 placeholder:font-semibold"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Your password"
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="mt-2 w-full rounded-full bg-gradient-to-r from-[#ffe993] via-[#d4af37] to-[#e3ca71] text-black transition-all duration-200 px-4 py-2 text-base md:text-lg font-bold shadow-lg hover:from-[#c9a530] hover:to-[#fbe69d] focus:outline-none focus:ring-2 focus:ring-[#d4af37] disabled:opacity-60 tracking-wider"
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-black" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="#d4af37" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
                Signing in...
              </span>
            ) : "Login"}
          </button>
        </form>

        <div className="w-full mt-7 flex flex-col gap-2 md:gap-1">
          <p className="text-center text-sm sm:text-base text-white/80">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="bg-gradient-to-r from-[#ffe993] via-[#d4af37] to-[#e3ca71] bg-clip-text text-transparent underline font-bold hover:text-[#e3ca71] transition-colors"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
