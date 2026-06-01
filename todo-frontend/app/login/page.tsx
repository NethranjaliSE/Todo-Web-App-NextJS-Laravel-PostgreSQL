"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";
import { API_BASE_URL } from "@/lib/api";
import { User, Lock, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (res.ok) {
        Cookies.set("auth_token", data.token, { expires: 7 });
        router.push("/dashboard");
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (err) {
      setError("Network error connecting to backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-slate-100 flex items-center justify-center p-4"
      style={{
        backgroundImage: "radial-gradient(#e2e8f0 1px, transparent 1px)",
        backgroundSize: "20px 20px",
      }}
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl border border-slate-100 p-8 md:p-12">
        <div className="w-full flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-slate-800 mb-8">Sign In</h2>
          {error && (
            <div className="mb-4 text-red-500 text-sm bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="relative">
              <User
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter Username"
                required
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-600 focus:bg-white transition"
              />
            </div>

            <div className="relative">
              <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
                required
                className="w-full pl-12 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-600 focus:bg-white transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                className="accent-blue-600 w-4 h-4"
              />
              <label htmlFor="remember" className="text-sm text-slate-500">
                Remember Me
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-10 rounded-xl shadow-md transition disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Social Logins */}
          <div className="mt-8 flex items-center gap-3">
            <span className="text-sm text-slate-500">Or, Login with</span>
            <div className="flex gap-2">
              <button className="w-8 h-8 rounded bg-blue-600 text-white flex items-center justify-center font-bold text-xs hover:bg-blue-700 transition">
                f
              </button>
              <button className="w-8 h-8 rounded bg-red-500 text-white flex items-center justify-center font-bold text-xs hover:bg-red-600 transition">
                G
              </button>
              <button className="w-8 h-8 rounded bg-black text-white flex items-center justify-center font-bold text-xs hover:bg-slate-800 transition">
                𝕏
              </button>
            </div>
          </div>

          <p className="mt-4 text-sm text-slate-500">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="text-blue-600 font-bold hover:underline"
            >
              Create One
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
