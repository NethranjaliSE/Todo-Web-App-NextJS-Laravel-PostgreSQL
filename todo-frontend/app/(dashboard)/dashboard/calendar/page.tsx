"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { fetchAPI } from "@/lib/api";

interface Task {
  id: number;
  title: string;
  priority: string;
  status: string;
  category: string | null;
  due_date: string | null;
}

const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const buildCalendarDays = (year: number, month: number) => {
  const firstDay = new Date(year, month, 1);
  const startIndex = (firstDay.getDay() + 6) % 7; // Monday first
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  return Array.from({ length: startIndex + daysInMonth }, (_, index) => {
    const dayNumber = index - startIndex + 1;
    return {
      dayNumber: dayNumber > 0 ? dayNumber : null,
      date: dayNumber > 0 ? new Date(year, month, dayNumber) : null,
    };
  });
};

const formatDateLabel = (date: Date) =>
  date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const isSameDate = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

export default function CalendarPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(() => new Date());

  useEffect(() => {
    async function loadTasks() {
      setLoading(true);
      try {
        const response = await fetchAPI("/tasks").catch(() => []);
        const data = Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : [];
        setTasks(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load tasks", error);
      } finally {
        setLoading(false);
      }
    }

    loadTasks();
  }, []);

  const calendarDays = useMemo(
    () => buildCalendarDays(currentMonth.getFullYear(), currentMonth.getMonth()),
    [currentMonth],
  );

  const tasksByDate = useMemo(() => {
    const map = new Map<string, Task[]>();
    tasks.forEach((task) => {
      if (!task.due_date) return;
      const dateKey = new Date(task.due_date).toISOString().slice(0, 10);
      if (!map.has(dateKey)) map.set(dateKey, []);
      map.get(dateKey)?.push(task);
    });
    return map;
  }, [tasks]);

  const selectedKey = selectedDate.toISOString().slice(0, 10);
  const tasksForSelectedDate = tasksByDate.get(selectedKey) ?? [];

  const handlePreviousMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-6xl mx-auto">
      <div className="bg-white rounded-[30px] p-10 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Calendar</h1>
            <p className="mt-2 text-sm text-slate-500">
              Review scheduled tasks by date and plan your week.
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
            Loading calendar...
          </div>
        ) : (
          <div className="grid gap-8 xl:grid-cols-[1.2fr,0.8fr]">
            <div className="rounded-[30px] border border-slate-200 bg-slate-50 p-6 shadow-sm">
              <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-slate-500 font-semibold">
                    Selected Date
                  </p>
                  <h2 className="text-2xl font-bold text-slate-900">
                    {formatDateLabel(selectedDate)}
                  </h2>
                </div>
                <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-2">
                  <button
                    type="button"
                    onClick={handlePreviousMonth}
                    className="rounded-2xl p-2 text-slate-600 hover:bg-slate-100 transition"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <span className="text-sm font-semibold text-slate-700">
                    {currentMonth.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
                  </span>
                  <button
                    type="button"
                    onClick={handleNextMonth}
                    className="rounded-2xl p-2 text-slate-600 hover:bg-slate-100 transition"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-2 text-center text-xs uppercase tracking-[0.24em] text-slate-500 mb-3">
                {dayNames.map((name) => (
                  <div key={name} className="py-2">
                    {name}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((cell, index) => {
                  const dateKey = cell.date ? cell.date.toISOString().slice(0, 10) : null;
                  const hasTasks = dateKey ? tasksByDate.has(dateKey) : false;
                  const isSelected = cell.date ? isSameDate(cell.date, selectedDate) : false;

                  return (
                    <button
                      key={index}
                      type="button"
                      disabled={!cell.dayNumber}
                      onClick={() => cell.date && setSelectedDate(cell.date)}
                      className={`min-h-[72px] rounded-3xl border px-2 py-2 text-left transition ${
                        isSelected
                          ? "border-blue-600 bg-blue-600 text-white"
                          : "border-transparent bg-white hover:border-slate-200 hover:bg-slate-100"
                      } ${hasTasks && !isSelected ? "relative" : ""}`}
                    >
                      {cell.dayNumber ? (
                        <div className="flex items-start justify-between">
                          <span className="text-sm font-semibold">{cell.dayNumber}</span>
                          {hasTasks ? (
                            <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-blue-600" />
                          ) : null}
                        </div>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-3 mb-6">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500 font-semibold">
                    Scheduled Tasks
                  </p>
                  <h2 className="text-xl font-bold text-slate-900">
                    {tasksForSelectedDate.length} tasks
                  </h2>
                </div>
                <div className="inline-flex items-center gap-2 rounded-2xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700">
                  <span>{selectedDate.toLocaleDateString("en-GB", { weekday: "short" })}</span>
                  <span>{selectedDate.getDate()}</span>
                </div>
              </div>

              {tasksForSelectedDate.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-slate-200 p-8 text-center text-slate-500">
                  <p className="text-sm font-semibold mb-2">No tasks scheduled.</p>
                  <p className="text-sm">Select a date with a dot to view due tasks.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {tasksForSelectedDate.map((task) => (
                    <div key={task.id} className="rounded-3xl border border-slate-200 p-4 bg-slate-50">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="text-base font-bold text-slate-900">{task.title}</h3>
                        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                          {task.priority}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-slate-600">
                        {task.category || "No category"}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
                        <span className="rounded-full bg-white px-3 py-1 border border-slate-200">
                          {task.status}
                        </span>
                        <span className="rounded-full bg-white px-3 py-1 border border-slate-200">
                          Due {task.due_date}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
