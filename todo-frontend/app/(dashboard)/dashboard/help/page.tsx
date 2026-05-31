"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function HelpPage() {
  const router = useRouter();

  return (
    <div className="animate-in fade-in duration-500 max-w-6xl mx-auto">
      <div className="bg-white rounded-[30px] p-10 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Help Center</h1>
            <p className="mt-2 text-sm text-slate-500">
              Get help and tips for using your todo app.
            </p>
          </div>
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            <ArrowLeft size={16} /> Back to dashboard
          </button>
        </div>
        <div className="rounded-3xl border border-dashed border-slate-200 p-8 text-center text-slate-500">
          <p className="text-lg font-semibold mb-2">Help content is under construction.</p>
          <p className="text-sm">
            This placeholder page is ready for your support articles and help guides.
          </p>
        </div>
      </div>
    </div>
  );
}
