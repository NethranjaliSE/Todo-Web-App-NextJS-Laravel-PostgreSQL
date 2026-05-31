"use client";
import { Search, Bell, Calendar as CalendarIcon } from "lucide-react";

export default function Topbar() {
  // Format the date to match the UI design
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return (
    <header className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-6">
      {/* Logo/Title Area */}
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
          Dash<span className="text-primary-500">board</span>
        </h1>
      </div>

      {/* Search Bar */}
      <div className="flex-1 max-w-xl mx-8 relative">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          size={18}
        />
        <input
          type="text"
          placeholder="Search your task here..."
          className="w-full bg-slate-50 text-sm text-slate-700 rounded-full py-3 pl-12 pr-4 border border-transparent focus:outline-none focus:border-primary-200 focus:bg-white focus:ring-4 focus:ring-primary-50 transition"
        />
      </div>

      {/* Right Side Icons & Date */}
      <div className="flex items-center gap-6">
        <div className="flex gap-3">
          <button className="w-10 h-10 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center hover:bg-primary-100 transition shadow-sm">
            <Bell size={18} />
          </button>
          <button className="w-10 h-10 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center hover:bg-primary-100 transition shadow-sm">
            <CalendarIcon size={18} />
          </button>
        </div>

        <div className="text-right leading-tight">
          <p className="text-xs text-slate-500 font-medium">Today</p>
          <p className="text-sm font-bold text-primary-600">{today}</p>
        </div>
      </div>
    </header>
  );
}
