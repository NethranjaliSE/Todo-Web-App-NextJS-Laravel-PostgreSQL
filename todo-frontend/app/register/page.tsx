"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";
import { API_BASE_URL } from "@/lib/api";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

 const handleSubmit = async (e: React.FormEvent) => {
   e.preventDefault();
   setLoading(true);
   setError("");

   try {
       const res = await fetch(`${API_BASE_URL}/api/register`, {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
         Accept: "application/json",
       },
       body: JSON.stringify(formData),
     });

     const data = await res.json();

     if (res.ok) {
       Cookies.set("auth_token", data.token, { expires: 7 });
       router.push("/dashboard");
     } else {
       // --- NEW ERROR HANDLING ---
       // If Laravel sends back specific validation errors, show the first one!
       if (data.errors) {
         const firstErrorField = Object.keys(data.errors)[0];
         setError(data.errors[firstErrorField][0]);
       } else {
         setError(data.message || "Registration failed");
       }
     }
   } catch (err) {
     setError("Network error connecting to backend.");
   } finally {
     setLoading(false);
   }
 };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
        <div className="w-full">
          <h2 className="text-3xl font-bold text-slate-800 mb-8">Sign Up</h2>
          {error && (
            <div className="mb-4 text-red-500 text-sm bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <User
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                name="first_name"
                onChange={handleChange}
                placeholder="Enter First Name"
                required
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary-500 focus:bg-white transition"
              />
            </div>

            <div className="relative">
              <User
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                name="last_name"
                onChange={handleChange}
                placeholder="Enter Last Name"
                required
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary-500 focus:bg-white transition"
              />
            </div>

            <div className="relative">
              <User
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                name="username"
                onChange={handleChange}
                placeholder="Enter Username"
                required
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary-500 focus:bg-white transition"
              />
            </div>

            <div className="relative">
              <Mail
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="email"
                name="email"
                onChange={handleChange}
                placeholder="Enter Email"
                required
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary-500 focus:bg-white transition"
              />
            </div>

            <div className="relative">
              <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                onChange={handleChange}
                placeholder="Enter Password"
                required
                className="w-full pl-12 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary-500 focus:bg-white transition"
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

            <div className="relative">
              <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type={showConfirm ? "text" : "password"}
                name="password_confirmation"
                onChange={handleChange}
                placeholder="Confirm Password"
                required
                className="w-full pl-12 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary-500 focus:bg-white transition"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="terms"
                required
                className="accent-primary-500 w-4 h-4"
              />
              <label htmlFor="terms" className="text-sm text-slate-500">
                I agree to all terms
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-md transition disabled:opacity-50"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          <p className="mt-6 text-sm text-slate-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary-500 font-bold hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
