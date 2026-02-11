import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiMail, FiLock, FiShield, FiArrowRight, FiHome } from "react-icons/fi";
import { resetPassword } from "../services/api.js";

export default function ResetPassword() {
    const navigate = useNavigate();
    const location = useLocation();
    const initialEmail = location.state?.email || "";

    const [email, setEmail] = useState(initialEmail);
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");
        try {
            setSubmitting(true);
            const data = await resetPassword({ email, otp, newPassword });
            setMessage(data.message);
            // Wait a bit then go to login
            setTimeout(() => {
                navigate("/login");
            }, 3000);
        } catch (err) {
            setError(err.message || "Something went wrong. Please check your code.");
        } finally {
            setSubmitting(false);
        }
    };

    const goldGrad = "linear-gradient(90deg,#e9d781 0%,#dac24a 29.69%,#fee19a 70%,#bc9830 100%)";

    return (
        <section className="min-h-[100dvh] w-full bg-[#080808] relative flex items-center justify-center p-4 sm:p-6 overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#d4af37]/10 rounded-full blur-[150px] animate-pulse" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#d4af37]/5 rounded-full blur-[150px]" />

            <Link
                to="/forgot-password"
                className="absolute top-6 left-6 flex items-center gap-2 text-white/40 hover:text-[#d4af37] transition-all text-sm font-bold uppercase tracking-widest group"
            >
                <FiHome className="text-lg group-hover:-translate-y-0.5 transition-transform" />
                <span>Request New Code</span>
            </Link>

            <div className="relative w-full max-w-[440px] md:max-w-[520px] lg:max-w-[560px] flex flex-col items-center">
                {/* Decorative Top Accent */}
                <div
                    className="w-24 h-1 mb-8 rounded-full opacity-50"
                    style={{ background: goldGrad }}
                />

                <div className="w-full bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-6 sm:p-8 md:px-12 md:py-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)]">
                    <div className="text-center mb-6">
                        <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-b from-white via-white to-[#d4af37] bg-clip-text text-transparent tracking-tighter mb-3">
                            Authentication
                        </h1>
                        <p className="text-gray-500 text-[11px] font-black uppercase tracking-[0.3em] ml-1">
                            Finalize Security Update
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold text-center">
                            {error}
                        </div>
                    )}

                    {message && (
                        <div className="mb-6 p-4 rounded-2xl bg-[#d4af37]/10 border border-[#d4af37]/20 text-[#d4af37] text-xs font-bold text-center italic">
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-3 group">
                            <label className="flex items-center gap-2 text-xs md:text-sm font-black uppercase tracking-widest text-[#d4af37]/70 group-focus-within:text-[#d4af37] transition-colors ml-1">
                                <FiMail /> Verify Email
                            </label>
                            <input
                                type="email"
                                className="w-full bg-white/[0.03] border border-[#d4af37]/20 rounded-2xl px-6 py-4 text-white text-base placeholder:text-white/40 focus:outline-none focus:border-[#d4af37] focus:bg-white/[0.06] focus:shadow-[0_0_15px_rgba(212,175,55,0.1)] transition-all"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="Confirm your email"
                            />
                        </div>

                        <div className="space-y-3 group">
                            <label className="flex items-center gap-2 text-xs md:text-sm font-black uppercase tracking-widest text-[#d4af37]/70 group-focus-within:text-[#d4af37] transition-colors ml-1">
                                <FiShield /> Reset Code (OTP)
                            </label>
                            <input
                                type="text"
                                maxLength={6}
                                className="w-full bg-white/[0.03] border border-[#d4af37]/20 rounded-2xl px-6 py-4 text-white text-base placeholder:text-white/40 focus:outline-none focus:border-[#d4af37] focus:bg-white/[0.06] focus:shadow-[0_0_15px_rgba(212,175,55,0.1)] transition-all flex text-center font-black tracking-[0.5em]"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                                placeholder="XXXXXX"
                            />
                        </div>

                        <div className="space-y-3 group">
                            <label className="flex items-center gap-2 text-xs md:text-sm font-black uppercase tracking-widest text-[#d4af37]/70 group-focus-within:text-[#d4af37] transition-colors ml-1">
                                <FiLock /> New Credentials
                            </label>
                            <input
                                type="password"
                                className="w-full bg-white/[0.03] border border-[#d4af37]/20 rounded-2xl px-6 py-4 text-white text-base placeholder:text-white/40 focus:outline-none focus:border-[#d4af37] focus:bg-white/[0.06] focus:shadow-[0_0_15px_rgba(212,175,55,0.1)] transition-all"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                minLength={6}
                                placeholder="Enter new password"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full group relative flex items-center justify-center h-16 rounded-2xl overflow-hidden transition-all active:scale-95 disabled:opacity-50"
                        >
                            <div
                                className="absolute inset-0 transition-transform group-hover:scale-110"
                                style={{ background: goldGrad }}
                            />
                            <span className="relative flex items-center gap-3 text-black font-black uppercase tracking-widest text-lg">
                                {submitting ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                                        Resetting...
                                    </>
                                ) : (
                                    <>
                                        Update Password <FiArrowRight className="text-xl group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </span>
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-white/5 text-center">
                        <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">
                            Changed your mind?{" "}
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
