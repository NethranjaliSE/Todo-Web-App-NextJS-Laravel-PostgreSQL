"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { API_ROOT, fetchAPI } from "@/lib/api";
import {
  LayoutDashboard,
  AlertCircle,
  CheckSquare,
  List,
  Settings,
  HelpCircle,
  LogOut,
  Search,
  Bell,
  Calendar,
  Camera,
  Menu,
  X,
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Safe default state so the UI never vanishes
  const [user, setUser] = useState({
    first_name: "User",
    last_name: "",
    email: "Connecting...",
    avatar: null,
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const today = new Date();
  const dayName = today.toLocaleDateString("en-US", { weekday: "long" });
  const formattedDate = today.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  useEffect(() => {
    async function loadUser() {
      try {
        const userData = await fetchAPI("/user");
        if (userData && !userData.message) setUser(userData);
      } catch (err) {
        console.error("Failed to load user profile - showing safe defaults", err);
      }
    }
    loadUser();
  }, []);

  const handleLogout = async () => {
    try {
      await fetchAPI('/logout', { method: 'POST' });
    } catch (err) {
      // ignore errors, proceed to clear local token
      console.warn('Logout API call failed', err);
    } finally {
      Cookies.remove("auth_token");
      router.push("/login");
    }
  };

 const handleSearch = (e: React.FormEvent) => {
   e.preventDefault();
   // This updates the URL without reloading the page, which triggers the filter in page.tsx
   router.push(`/dashboard?search=${encodeURIComponent(searchQuery)}`);
 };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const data = await fetchAPI("/user/avatar", {
        method: "POST",
        body: formData,
      }).catch((e) => {
        // fetchAPI already logs; rethrow to land in outer catch
        throw e;
      });

      const rawUrl = data?.avatar_url || data?.data?.avatar_url || data?.url;
      const avatarUrl = rawUrl
        ? rawUrl.startsWith("http")
          ? rawUrl
          : `${API_ROOT}${rawUrl}`
        : null;

      if (avatarUrl) {
        setUser({ ...user, avatar: avatarUrl });
      }
    } catch (error) {
      console.error("Upload error", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FE] flex font-sans overflow-hidden">
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-[280px] bg-[#1a56db] text-white flex flex-col shadow-2xl m-4 rounded-[30px] overflow-hidden transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-[120%] lg:translate-x-0"}`}
      >
        <div className="flex flex-col items-center pt-10 pb-6 relative">
          <button
            className="absolute top-4 right-4 lg:hidden text-white/80 hover:text-white"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={24} />
          </button>

          <div
            className="relative group cursor-pointer mb-3 rounded-full"
            onClick={() => fileInputRef.current?.click()}
          >
            {user.avatar ? (
              <img
                src={user.avatar}
                alt="Avatar"
                onError={() => setUser({ ...user, avatar: null })}
                className={`w-24 h-24 rounded-full border-4 border-white/20 shadow-md object-cover ${isUploading ? "opacity-50" : ""}`}
              />
            ) : (
              <div className="w-24 h-24 rounded-full border-4 border-white/20 shadow-md bg-white text-[#1a56db] flex items-center justify-center text-3xl font-bold">
                {(user.first_name || "U").charAt(0)}
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera size={24} className="text-white" />
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
          </div>

          <h3 className="font-bold text-lg tracking-wide">
            {user.first_name} {user.last_name}
          </h3>
          <p className="text-xs text-blue-200 font-medium">{user.email}</p>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
          {[
            { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
            { name: "Vital Task", path: "/dashboard/vital", icon: AlertCircle },
            { name: "My Task", path: "/dashboard/tasks", icon: CheckSquare },
            {
              name: "Task Categories",
              path: "/dashboard/categories",
              icon: List,
            },
            { name: "Settings", path: "/dashboard/settings", icon: Settings },
            { name: "Help", path: "/dashboard/help", icon: HelpCircle },
          ].map((item) => (
            <Link
              key={item.name}
              href={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-4 px-6 py-3.5 rounded-full font-bold transition-all ${pathname === item.path ? "bg-white text-[#1a56db] shadow-md" : "text-white hover:bg-white/10"}`}
            >
              <item.icon size={20} /> {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-4 mt-auto mb-2">
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 px-6 py-3 w-full text-white hover:bg-white/10 rounded-full transition-all font-bold"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="h-24 flex items-center justify-between px-6 lg:px-8 z-10 pt-6">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 bg-white rounded-xl shadow-sm text-slate-600"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-800 tracking-tight hidden sm:block">
              Dash<span className="text-[#1a56db]">board</span>
            </h1>
          </div>

          <form
            onSubmit={handleSearch}
            className="flex-1 max-w-xl mx-4 lg:mx-12 relative"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your task here..."
              className="w-full bg-white border-none rounded-full py-3 pl-6 pr-14 text-sm text-slate-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 bg-[#1a56db] rounded-full flex items-center justify-center text-white shadow-md hover:bg-blue-700 transition"
            >
              <Search size={16} />
            </button>
          </form>

          <div className="flex items-center gap-4 lg:gap-6">
            <div className="gap-2 lg:gap-3 hidden sm:flex">
              <button
                className="w-10 h-10 bg-blue-50 text-[#1a56db] rounded-xl flex items-center justify-center shadow-sm hover:bg-blue-100 transition relative"
                onClick={() => router.push("/dashboard/notifications")}
              >
                <Bell size={18} />
                <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full"></span>
              </button>
              <button
                className="w-10 h-10 bg-blue-50 text-[#1a56db] rounded-xl flex items-center justify-center shadow-sm hover:bg-blue-100 transition"
                onClick={() => router.push("/dashboard/calendar")}
              >
                <Calendar size={18} />
              </button>
            </div>
            <div className="text-right border-l border-slate-200 pl-4 lg:pl-6 hidden md:block">
              <p className="text-sm font-bold text-slate-800">{dayName}</p>
              <p className="text-xs font-bold text-[#1a56db]">
                {formattedDate}
              </p>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto px-4 lg:px-8 pb-8 pt-4">
          {children}
        </div>
      </main>
    </div>
  );
}
