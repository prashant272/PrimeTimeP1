import { useState, useEffect } from "react";
import AdminPreviousEditions from "../components/AdminPreviousEditions.jsx";
import { Lock } from "lucide-react";
import { getBaseUrl } from "../services/api.js";

export default function DeveloperAuth() {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [devToken, setDevToken] = useState(null);

    // Initial load: check if dev token is already in memory/storage
    useEffect(() => {
        const storedToken = localStorage.getItem("primeDeveloperToken");
        if (storedToken) {
            setDevToken(storedToken);
        }
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch(`${getBaseUrl()}/api/developer/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password })
            }); 
            //hello

            const data = await res.json();

            if (data.success && data.token) {
                localStorage.setItem("primeDeveloperToken", data.token);
                setDevToken(data.token);
            } else {
                setError(data.message || "Invalid Developer Password");
            }
        } catch (err) {
            setError("Server connection failed. Is the backend running?");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("primeDeveloperToken");
        setDevToken(null);
        setPassword("");
    };

    // If authenticated, show the dev panel (wrapping the previous editions component)
    if (devToken) {
        return (
            <div className="min-h-screen bg-[#0f0a07] text-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto space-y-6">
                    <div className="flex justify-between items-center bg-[#1a160a] p-4 rounded-xl border border-[#d4af37]/30 shadow-lg">
                        <div>
                            <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#ffd966] to-[#b2872d]">
                                Prime Developer Panel
                            </h1>
                            <p className="text-[#c7ba7e] text-xs">Manage editions bypassing the main admin panel.</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="text-sm px-4 py-2 border border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/10 transition"
                        >
                            Logout
                        </button>
                    </div>

                    <div className="bg-[#1a160a] p-6 rounded-xl border border-[#d4af37]/30 shadow-2xl">
                        <AdminPreviousEditions customToken={devToken} />
                    </div>
                </div>
            </div>
        );
    }

    // Otherwise show login
    return (
        <div className="min-h-screen bg-[#0f0a07] text-white flex items-center justify-center p-6 relative overflow-hidden pt-24">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#d4af37]/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#ffd966]/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="w-full max-w-md bg-[#1a160a] border border-[#d4af37]/30 p-8 rounded-[2rem] shadow-2xl relative z-10 backdrop-blur-xl">
                <div className="flex justify-center mb-6 text-[#d4af37]">
                    <div className="w-16 h-16 rounded-full bg-[#d4af37]/10 flex items-center justify-center border border-[#d4af37]/30">
                        <Lock size={28} />
                    </div>
                </div>

                <div className="text-center mb-8">
                    <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#ffd966] to-[#b2872d]">
                        Developer Access
                    </h2>
                    <p className="text-sm text-[#ffeab080] mt-1">Please enter your developer password to continue</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm px-4 py-3 rounded-xl mb-6 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Developer Password"
                            className="w-full bg-[#272316] border border-[#edd14850] px-4 py-3 rounded-xl text-white placeholder:text-[#c7ba7e80] focus:outline-none focus:ring-2 focus:ring-[#d4af37] transition text-center tracking-widest"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-[#ecd26c] to-[#d49d28] text-black font-bold py-3 px-4 rounded-xl hover:brightness-110 transition shadow-lg shadow-[#d4af37]/20 flex items-center justify-center gap-2"
                    >
                        {loading ? "Authenticating..." : "Unlock Panel"}
                    </button>
                </form>
            </div>
        </div>
    );
}
