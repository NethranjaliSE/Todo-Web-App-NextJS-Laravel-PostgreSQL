"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, AlertTriangle, ListChecks } from "lucide-react";
import { fetchAPI } from "@/lib/api";

interface Task {
  id: number;
  title: string;
  description: string | null;
  priority: string;
  status: string;
  created_at: string;
  image_path: string | null;
}

export default function VitalPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadVitalTasks() {
      try {
        const response = await fetchAPI("/tasks").catch(() => []);
        const allTasks = Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response)
          ? response
          : [];

        setTasks(
          allTasks.filter(
            (task: Task) =>
              task.priority === "High" || task.priority === "Extreme",
          ),
        );
      } catch (error) {
        console.error("Failed to load vital tasks", error);
      } finally {
        setLoading(false);
      }
    }

    loadVitalTasks();
  }, []);

  return (
    <div className="animate-in fade-in duration-500 max-w-6xl mx-auto">
      <div className="bg-white rounded-[30px] p-10 shadow-sm border border-slate-100">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Vital Tasks</h1>
            <p className="mt-2 text-sm text-slate-500">
              A quick view of the tasks that matter most. Only High and Extreme priorities
              are shown here.
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

        <div className="mb-8 flex flex-wrap items-center gap-4">
          <div className="inline-flex items-center gap-2 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
            <AlertTriangle size={18} /> Vital threshold
          </div>
          <div className="inline-flex items-center gap-2 rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-700">
            Showing {loading ? "..." : tasks.length} task{tasks.length === 1 ? "" : "s"}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-200 p-12 text-center text-slate-500">
            <p className="text-lg font-semibold mb-3">No vital tasks yet.</p>
            <p className="text-sm">
              Create tasks with priority High or Extreme in the dashboard to see them here.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">
                      <ListChecks size={14} /> {task.priority}
                    </div>
                    <h2 className="mt-4 text-2xl font-bold text-slate-900">{task.title}</h2>
                  </div>
                  <div className="text-right text-sm text-slate-500">
                    <p>Status: {task.status}</p>
                    <p className="mt-1">
                      Created: {new Date(task.created_at).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                {task.description ? (
                  <p className="mt-4 text-sm leading-6 text-slate-600">{task.description}</p>
                ) : (
                  <p className="mt-4 text-sm leading-6 text-slate-500">No description provided.</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
