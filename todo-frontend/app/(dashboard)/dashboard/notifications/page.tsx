"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { fetchAPI } from "@/lib/api";

interface Task {
  id: number;
  title: string;
  description: string | null;
  priority: string;
  status: string;
  category: string | null;
  created_at: string;
  due_date: string | null;
}

const priorityClasses: Record<string, string> = {
  Extreme: "text-rose-600",
  High: "text-rose-500",
  Moderate: "text-blue-600",
  Low: "text-emerald-600",
};

const formatRelativeDate = (task: Task) => {
  if (!task.due_date) {
    const created = new Date(task.created_at);
    const diffHours = Math.max(
      1,
      Math.round((Date.now() - created.getTime()) / (1000 * 60 * 60)),
    );
    return `${diffHours}h ago`;
  }

  const due = new Date(task.due_date);
  const now = new Date();
  const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return `Overdue ${Math.abs(diffDays)}d`;
  }
  if (diffDays === 0) {
    return "Due today";
  }
  return `Due in ${diffDays}d`;
};

const sortNotifications = (tasks: Task[]) => {
  return [...tasks].sort((a, b) => {
    const priorityWeight = (priority: string) => {
      if (priority === "Extreme") return 1;
      if (priority === "High") return 2;
      if (priority === "Moderate") return 3;
      return 4;
    };

    const aDue = a.due_date ? new Date(a.due_date).getTime() : Infinity;
    const bDue = b.due_date ? new Date(b.due_date).getTime() : Infinity;

    if (aDue !== bDue) return aDue - bDue;
    return priorityWeight(a.priority) - priorityWeight(b.priority);
  });
};

export default function NotificationsPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNotifications() {
      setLoading(true);
      try {
        const response = await fetchAPI("/tasks").catch(() => []);
        const data = Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : [];
        setTasks(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load notifications", error);
      } finally {
        setLoading(false);
      }
    }

    loadNotifications();
  }, []);

  const notifications = sortNotifications(tasks).slice(0, 6);

  return (
    <div className="animate-in fade-in duration-500 max-w-6xl mx-auto">
      <div className="bg-white rounded-[30px] p-10 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Notifications</h1>
            <p className="mt-2 text-sm text-slate-500">
              Your most important task alerts are shown below.
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

        {loading ? (
          <div className="rounded-3xl border border-dashed border-slate-200 p-12 text-center text-slate-500">
            Loading notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-200 p-12 text-center text-slate-500">
            <p className="text-lg font-semibold mb-2">No notifications yet.</p>
            <p className="text-sm">Create tasks with due dates or high priority to see alerts here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-[30px] border border-slate-200 bg-slate-50 p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.32em] text-slate-500 font-semibold">
                    Notifications
                  </p>
                  <h2 className="text-xl font-bold text-slate-900">Today</h2>
                </div>
                <span className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-slate-700 border border-slate-200">
                  {notifications.length} alerts
                </span>
              </div>
            </div>

            {notifications.map((task) => (
              <div
                key={task.id}
                className="rounded-3xl border border-slate-200 p-5 flex items-start gap-4 bg-white shadow-sm"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-100 text-slate-700 font-bold text-sm">
                  {task.title.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-base font-bold text-slate-900">{task.title}</h3>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${priorityClasses[task.priority] ?? "text-slate-600"}`}>
                      {task.priority}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 mt-2 line-clamp-2">
                    {task.description || "No additional details."}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                    <span>{formatRelativeDate(task)}</span>
                    {task.category ? <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-600">{task.category}</span> : null}
                    <span className={task.status === "Completed" ? "text-emerald-600" : "text-slate-500"}>
                      {task.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
