"use client";
import {
  LayoutDashboard,
  AlertCircle,
  CheckSquare,
  List,
  Settings,
  Calendar,
  Bell,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { fetchAPI } from "@/lib/api";

export default function Sidebar() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetchAPI('/logout', { method: 'POST' });
    } catch (err) {
      console.warn('Logout API failed', err);
    } finally {
      Cookies.remove("auth_token");
      router.push("/login");
    }
  };

  return (
    <aside className="w-64 bg-primary-800 text-slate-300 flex flex-col m-4 rounded-3xl shadow-xl overflow-hidden relative h-[calc(100vh-32px)]">
      <div className="p-6 text-center border-b border-primary-900 mt-4">
        <div className="w-20 h-20 bg-slate-200 rounded-full mx-auto mb-3 shadow-md overflow-hidden"></div>
        <h2 className="font-bold text-lg text-white">System User</h2>
        <p className="text-xs text-slate-400 mt-1">Admin Profile</p>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 p-3 bg-primary-900 text-primary-400 rounded-xl font-bold shadow-sm border-l-4 border-primary-500"
        >
          <LayoutDashboard size={20} /> Dashboard
        </Link>
        <Link
          href="/dashboard/vital"
          className="flex items-center gap-3 p-3 hover:bg-primary-900 hover:text-white rounded-xl transition"
        >
          <AlertCircle size={20} /> Vital Task
        </Link>
        <Link
          href="/dashboard/tasks"
          className="flex items-center gap-3 p-3 hover:bg-primary-900 hover:text-white rounded-xl transition"
        >
          <CheckSquare size={20} /> My Task
        </Link>
        <Link
          href="/dashboard/categories"
          className="flex items-center gap-3 p-3 hover:bg-primary-900 hover:text-white rounded-xl transition"
        >
          <List size={20} /> Task Categories
        </Link>
        <Link
          href="/dashboard/calendar"
          className="flex items-center gap-3 p-3 hover:bg-primary-900 hover:text-white rounded-xl transition"
        >
          <Calendar size={20} /> Calendar
        </Link>
        <Link
          href="/dashboard/notifications"
          className="flex items-center gap-3 p-3 hover:bg-primary-900 hover:text-white rounded-xl transition"
        >
          <Bell size={20} /> Notifications
        </Link>
        <Link
          href="/dashboard/settings"
          className="flex items-center gap-3 p-3 hover:bg-primary-900 hover:text-white rounded-xl transition"
        >
          <Settings size={20} /> Settings
        </Link>
      </nav>

      <div className="p-4 border-t border-primary-900">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 p-3 hover:bg-red-500 hover:text-white rounded-xl transition w-full"
        >
          <LogOut size={20} /> Logout
        </button>
      </div>
    </aside>
  );
}
