import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

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

      // Agar user "Nominate Now" se aaya hai to /nominate,
      // otherwise normal case me /nominate pe le jao (as per latest requirement).
      const from = location.state?.from?.pathname || "/nominate";
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "Unable to create account");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="bg-[#3b1515] text-white min-h-screen flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-2xl bg-black/40 border border-[#d4af37]/30 p-8 shadow-xl">
        <h1 className="text-2xl font-semibold mb-6 text-center">
          Create Your Account
        </h1>

        {error && (
          <div className="mb-4 rounded-md bg-red-500/10 border border-red-500/60 px-3 py-2 text-sm text-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Full Name</label>
            <input
              type="text"
              className="w-full rounded-md bg-black/40 border border-white/20 px-3 py-2 text-sm focus:outline-none focus:border-[#d4af37]"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              className="w-full rounded-md bg-black/40 border border-white/20 px-3 py-2 text-sm focus:outline-none focus:border-[#d4af37]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              className="w-full rounded-md bg-black/40 border border-white/20 px-3 py-2 text-sm focus:outline-none focus:border-[#d4af37]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
            <p className="mt-1 text-[11px] text-gray-300">
              Minimum 6 characters.
            </p>
          </div>



          <button
            type="submit"
            disabled={submitting}
            className="mt-2 w-full rounded-full bg-[#d4af37] px-4 py-2 text-sm font-semibold text-black hover:bg-[#c9a530] disabled:opacity-60"
          >
            {submitting ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-200">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-[#d4af37] hover:text-[#f1d46b] font-semibold"
          >
            Login
          </Link>
        </p>
      </div>
    </section>
  );
}


