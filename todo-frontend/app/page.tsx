import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, ArrowRight, Star } from "lucide-react";

export default async function LandingPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token");

  if (token) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 overflow-x-hidden flex flex-col">
      {/* Navigation Bar */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition"
          >
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-md">
              <CheckCircle2 className="text-white" size={22} />
            </div>
            <span className="text-2xl font-extrabold tracking-tight">
              Task<span className="text-blue-600">Flow</span>
            </span>
          </Link>

          <div className="flex items-center gap-3 sm:gap-6">
            <Link
              href="/login"
              className="text-sm font-bold text-slate-600 hover:text-blue-600 transition"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2.5 px-6 rounded-lg shadow-lg shadow-blue-600/30 transition transform hover:-translate-y-0.5"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 w-full">
        <main className="pt-32 pb-20 md:pt-40 md:pb-32 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="max-w-2xl flex flex-col justify-center text-center lg:text-left">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
              Focus, <br className="hidden lg:block" /> finally.
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 mt-6 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Join professionals who simplify work and life with the world's
              most intuitive to-do list and task manager.
            </p>

            <div className="flex items-center gap-3 mt-8 bg-white w-fit px-5 py-2.5 rounded-full shadow-sm border border-slate-200 mx-auto lg:mx-0">
              <div className="flex text-yellow-400">
                <Star size={18} fill="currentColor" />
                <Star size={18} fill="currentColor" />
                <Star size={18} fill="currentColor" />
                <Star size={18} fill="currentColor" />
                <Star size={18} fill="currentColor" />
              </div>
              <span className="text-sm font-bold text-slate-700">
                374K+ reviews
              </span>
            </div>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold py-4 px-10 rounded-2xl shadow-xl shadow-blue-600/30 transition transform hover:-translate-y-1 flex items-center justify-center gap-3"
              >
                Start for free <ArrowRight size={22} />
              </Link>
            </div>
          </div>

          {/* Right Content - Fixed Image Component */}
          <div className="relative w-full mt-10 lg:mt-0">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-100 rounded-full blur-3xl -z-10 opacity-70"></div>

            <div className="w-full aspect-square sm:aspect-[4/3] bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex items-center justify-center p-2 relative z-10">
              {/* 
                  Next.js Optimized Image 
                  It automatically pulls the image from your public folder.
                */}
              <Image
                src="/hero-image.png"
                alt="TaskFlow Dashboard Preview"
                width={800}
                height={600}
                priority
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
          </div>
        </main>

        {/* Scrollable Features Section */}
        <section className="bg-white py-20 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-12">
              Organize your work and life.
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 hover:shadow-lg transition cursor-pointer">
                <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6 mx-auto">
                  <CheckCircle2 size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">
                  Clear your mind
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Reach that mental clarity you’ve been longing for. Your tasks
                  are organized and prioritized.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 hover:shadow-lg transition cursor-pointer">
                <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-6 mx-auto">
                  <ArrowRight size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">
                  Focus on what’s important
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Know exactly what you need to do next. Say goodbye to
                  scattered sticky notes.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 hover:shadow-lg transition cursor-pointer sm:col-span-2 lg:col-span-1">
                <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-6 mx-auto">
                  <Star size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">
                  Organize everything
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  From business projects to grocery lists, keep everything in
                  one centralized dashboard.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Simple Footer */}
      <footer className="bg-slate-50 py-8 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-center items-center gap-4 text-sm text-slate-500">
          <div className="flex flex-wrap justify-center items-center gap-3">
            <Link href="#" className="hover:text-slate-800 transition">
              Security
            </Link>
            <span className="hidden sm:inline">|</span>
            <Link href="#" className="hover:text-slate-800 transition">
              Privacy
            </Link>
            <span className="hidden sm:inline">|</span>
            <Link href="#" className="hover:text-slate-800 transition">
              Terms
            </Link>
            <span className="hidden sm:inline">|</span>
            <Link href="#" className="hover:text-slate-800 transition">
              Cookie preferences
            </Link>
          </div>
          <div className="md:ml-auto font-medium text-center">
            © {new Date().getFullYear()} TaskFlow Inc.
          </div>
        </div>
      </footer>
    </div>
  );
}
