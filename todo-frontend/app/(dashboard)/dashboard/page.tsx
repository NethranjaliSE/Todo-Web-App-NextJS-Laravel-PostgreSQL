"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { fetchAPI } from "@/lib/api";
import {
  Plus,
  ClipboardList,
  PieChart,
  CheckSquare,
  Image as ImageIcon,
  Trash2,
  Edit2,
  SearchX,
} from "lucide-react";
import AddTaskModal from "@/components/AddTaskModal";
import EditTaskModal from "@/components/EditTaskModal";

interface Task {
  id: number;
  title: string;
  description: string | null;
  priority: string;
  status: string;
  category: string | null;
  created_at: string;
  image_path: string | null;
}

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const searchQuery = searchParams.get("search")?.toLowerCase() || "";
  const selectedCategory = searchParams.get("category")?.toLowerCase() || "";
  const selectedPriority = searchParams.get("priority")?.toLowerCase() || "";

  const [tasks, setTasks] = useState<Task[]>([]);
  const [user, setUser] = useState({ first_name: "", last_name: "" });
  const [loading, setLoading] = useState(true);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [tasksData, userData] = await Promise.all([
          fetchAPI("/tasks").catch(() => []),
          fetchAPI("/user").catch(() => ({ first_name: "User" })),
        ]);
        const parsedTasks = tasksData?.data || tasksData;
        setTasks(Array.isArray(parsedTasks) ? parsedTasks : []);
        setUser(userData || { first_name: "User" });
      } catch (error) {
        console.error("Dashboard error");
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, [refreshKey]);

  //  Interactive Logic 
  const triggerRefresh = () => setRefreshKey((old) => old + 1);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      await fetchAPI(`/tasks/${id}`, { method: "DELETE" });
      triggerRefresh();
    } catch (e) {
      console.error("Failed to delete", e);
    }
  };

  const handleToggleStatus = async (task: Task) => {
    const statusCycle = {
      "Not Started": "In Progress",
      "In Progress": "Completed",
      Completed: "Not Started",
    } as const;

    const newStatus = statusCycle[task.status as keyof typeof statusCycle] || "In Progress";

    try {
      setTasks(
        tasks.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t)),
      );

      await fetchAPI(`/tasks/${task.id}`, {
        method: "PUT",
        body: JSON.stringify({ status: newStatus }),
      });
      triggerRefresh();
    } catch (e) {
      console.error("Failed to update status", e);
      triggerRefresh();
    }
  };

  // --- Search + Category + Priority Filtering Logic ---
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery) ||
      (task.description &&
        task.description.toLowerCase().includes(searchQuery));

    const matchesCategory = selectedCategory
      ? task.category?.toLowerCase() === selectedCategory
      : true;

    const matchesPriority = selectedPriority
      ? task.priority.toLowerCase() === selectedPriority
      : true;

    return matchesSearch && matchesCategory && matchesPriority;
  });

  const availableCategories = Array.from(
    new Set(
      tasks
        .map((task) => task.category?.trim())
        .filter((category): category is string => !!category),
    ),
  );

  const availablePriorities = ["Low", "Moderate", "High", "Extreme"];

  const buildFilterPath = (category?: string, priority?: string) => {
    const params = new URLSearchParams();

    const finalCategory = category ?? selectedCategory;
    const finalPriority = priority ?? selectedPriority;

    if (finalCategory) params.set("category", finalCategory);
    if (finalPriority) params.set("priority", finalPriority);

    return `/dashboard${params.toString() ? `?${params.toString()}` : ""}`;
  };

  // Calculations 
  const totalTasks = filteredTasks.length;
  const completedTasksList = filteredTasks.filter(
    (t) => t.status === "Completed",
  );
  const activeTasksList = filteredTasks.filter((t) => t.status !== "Completed");

  const compPct = totalTasks
    ? Math.round((completedTasksList.length / totalTasks) * 100)
    : 0;
  const progPct = totalTasks
    ? Math.round(
        (filteredTasks.filter((t) => t.status === "In Progress").length /
          totalTasks) *
          100,
      )
    : 0;
  const notPct = totalTasks
    ? Math.round(
        (filteredTasks.filter((t) => t.status === "Not Started").length /
          totalTasks) *
          100,
      )
    : 0;

  const today = new Date();
  const dateDisplay = today.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
  });

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getStatusColor = (status: string) =>
    status === "Completed"
      ? "text-emerald-500"
      : status === "In Progress"
        ? "text-blue-500"
        : "text-rose-500";
  const getStatusBorder = (status: string) =>
    status === "Completed"
      ? "border-emerald-500 bg-emerald-50"
      : status === "In Progress"
        ? "border-blue-500 bg-blue-50"
        : "border-rose-500 bg-rose-50";
  const getPriorityColor = (priority: string) =>
    priority === "High" || priority === "Extreme"
      ? "text-rose-500"
      : priority === "Low"
        ? "text-emerald-500"
        : "text-blue-500";

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 w-full">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 max-w-[1400px] mx-auto">
      <div className="flex justify-between items-end mb-8 pl-2">
        <h2 className="text-[32px] font-extrabold text-slate-800 flex items-center gap-3">
          Welcome back, {user.first_name || "User"}{" "}
          <span className="text-3xl animate-bounce origin-bottom-right">
            👋
          </span>
        </h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 border-2 border-[#1a56db] text-[#1a56db] font-bold px-5 py-2 rounded-xl hover:bg-blue-50 transition shadow-sm"
        >
          <Plus size={18} strokeWidth={3} /> Add Task
        </button>
      </div>

      {(searchQuery || selectedCategory || selectedPriority) && (
        <div className="mb-6 p-4 bg-blue-50 text-[#1a56db] rounded-2xl font-medium border border-blue-100 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {searchQuery ? (
              <span>
                Showing search results for: <strong>"{searchQuery}"</strong>
              </span>
            ) : null}
            {searchQuery && selectedCategory ? <span className="mx-2">•</span> : null}
            {selectedCategory ? (
              <span>
                Category: <strong>{selectedCategory}</strong>
              </span>
            ) : null}
            {(selectedCategory || selectedPriority) && selectedPriority ? (
              <span className="mx-2">•</span>
            ) : null}
            {selectedPriority ? (
              <span>
                Priority: <strong>{selectedPriority}</strong>
              </span>
            ) : null}
          </div>
          <button
            onClick={() => window.history.pushState({}, "", "/dashboard")}
            className="text-blue-500 hover:text-blue-700 underline text-sm"
          >
            Clear Filters
          </button>
        </div>
      )}

      <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-2">
              Filter by category and priority
            </p>
            <div className="flex flex-wrap gap-2">
              {availableCategories.length > 0 ? (
                availableCategories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => router.push(buildFilterPath(category, undefined))}
                    className={`rounded-full border px-4 py-2 text-sm transition ${
                      selectedCategory === category.toLowerCase()
                        ? "bg-[#1a56db] text-white border-[#1a56db]"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {category}
                  </button>
                ))
              ) : (
                <span className="text-slate-400">No categories available</span>
              )}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-700 mb-2">
              Filter by priority
            </p>
            <div className="flex flex-wrap gap-2">
              {availablePriorities.map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => router.push(buildFilterPath(undefined, level.toLowerCase()))}
                  className={`rounded-full border px-4 py-2 text-sm transition ${
                    selectedPriority === level.toLowerCase()
                      ? "bg-[#1a56db] text-white border-[#1a56db]"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* LEFT COLUMN: Active Tasks */}
        <div className="xl:col-span-7 bg-white rounded-[30px] p-8 shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3">
              <ClipboardList className="text-[#1a56db]" size={24} /> To-Do
            </h3>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="text-[#1a56db] font-bold text-sm flex items-center gap-1 hover:underline"
            >
              <Plus size={16} strokeWidth={3} /> Add task
            </button>
          </div>
          <p className="text-sm text-slate-400 font-bold mb-6 pl-1">
            {dateDisplay} <span className="text-slate-300 mx-2">•</span> Today
          </p>

          <div className="space-y-5">
            {activeTasksList.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center">
                {searchQuery ? (
                  <SearchX className="text-slate-300 mb-2" size={32} />
                ) : null}
                <p className="text-slate-500 font-medium">
                  {searchQuery
                    ? "No active tasks match your search."
                    : "No active tasks right now. You're all caught up!"}
                </p>
              </div>
            ) : (
              activeTasksList.map((task) => (
                <div
                  key={task.id}
                  className="border border-slate-100 rounded-3xl p-5 flex gap-5 hover:shadow-lg transition-all bg-white group"
                >
                  {/* Clickable Status Toggle */}
                  <div
                    onClick={() => handleToggleStatus(task)}
                    title="Click to mark complete"
                    className={`w-6 h-6 rounded-full border-[3px] ${getStatusBorder(task.status)} flex-shrink-0 mt-1 cursor-pointer hover:scale-110 transition`}
                  ></div>

                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-extrabold text-slate-800 text-lg">
                        {task.title}
                      </h4>

                      {/* Edit & Delete Action Buttons */}
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setTaskToEdit(task)}
                          className="text-slate-400 hover:text-blue-600 transition bg-slate-50 p-1.5 rounded-lg"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(task.id)}
                          className="text-slate-400 hover:text-rose-600 transition bg-slate-50 p-1.5 rounded-lg"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-slate-500 mt-2 pr-4 leading-relaxed line-clamp-2">
                      {task.description || "No description provided."}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2 items-center">
                      <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
                        {task.category ? task.category : "Uncategorized"}
                      </span>
                    </div>
                    <div className="mt-4 flex flex-col gap-3">
                      {task.status !== "Completed" ? (
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(task)}
                          className="self-start rounded-2xl bg-[#1a56db] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition"
                        >
                          {task.status === "Not Started"
                            ? "In Progress"
                            : "Mark Completed"}
                        </button>
                      ) : null}
                      <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wide">
                        <div className="flex gap-5">
                          <span className="text-slate-400">
                            Priority:{" "}
                            <span
                              className={`${getPriorityColor(task.priority)} ml-1`}
                            >
                              {task.priority || "Moderate"}
                            </span>
                          </span>
                          <span className="text-slate-400">
                            Status:{" "}
                            <span
                              className={`${getStatusColor(task.status)} ml-1`}
                            >
                              {task.status}
                            </span>
                          </span>
                        </div>
                        <span className="text-slate-300 font-medium normal-case">
                          Created: {formatDate(task.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                  {task.image_path && (
                    <img
                      src={task.image_path}
                      className="w-28 h-28 rounded-2xl object-cover shadow-sm"
                      alt="Task"
                    />
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="xl:col-span-5 flex flex-col gap-8">
          {/* Charts */}
          <div className="bg-white rounded-[30px] p-8 shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3 mb-8">
              <PieChart className="text-[#1a56db]" size={24} /> Task Status
            </h3>
            <div className="flex justify-around items-center pt-2 pb-4">
              {[
                {
                  label: "Completed",
                  pct: compPct,
                  color: "text-emerald-500",
                  bg: "bg-emerald-500",
                },
                {
                  label: "In Progress",
                  pct: progPct,
                  color: "text-[#1a56db]",
                  bg: "bg-[#1a56db]",
                },
                {
                  label: "Not Started",
                  pct: notPct,
                  color: "text-rose-500",
                  bg: "bg-rose-500",
                },
              ].map((stat, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div className="relative w-[88px] h-[88px] flex items-center justify-center mb-4">
                    <svg className="w-full h-full transform -rotate-90 absolute drop-shadow-sm">
                      <circle
                        cx="44"
                        cy="44"
                        r="36"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-slate-100"
                      />
                      <circle
                        cx="44"
                        cy="44"
                        r="36"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray="226"
                        strokeDashoffset={226 - (226 * stat.pct) / 100}
                        className={`${stat.color} drop-shadow-md`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="font-extrabold text-slate-800 text-lg">
                      {stat.pct}%
                    </span>
                  </div>
                  <span className="text-xs font-bold text-slate-600 flex items-center gap-2">
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${stat.bg} shadow-sm`}
                    ></div>{" "}
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Completed Task List */}
          <div className="bg-white rounded-[30px] p-8 shadow-sm border border-slate-100 flex-1">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3 mb-6">
              <CheckSquare size={24} className="text-emerald-500" /> Completed
              Task
            </h3>
            <div className="space-y-4">
              {completedTasksList.length === 0 ? (
                <p className="text-slate-400 text-sm text-center py-4">
                  No completed tasks yet.
                </p>
              ) : (
                completedTasksList.map((task) => (
                  <div
                    key={task.id}
                    className="border border-slate-100 rounded-3xl p-4 flex gap-4 hover:border-emerald-200 transition-all group"
                  >
                    {/* Clickable Status Toggle */}
                    <div
                      onClick={() => handleToggleStatus(task)}
                      title="Click to mark incomplete"
                      className="w-5 h-5 rounded-full border-[3px] border-emerald-500 bg-emerald-50 flex-shrink-0 mt-1 cursor-pointer hover:scale-110 transition"
                    ></div>

                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-extrabold text-slate-800 line-through decoration-emerald-500/30">
                          {task.title}
                        </h4>

                        {/* Edit & Delete Action Buttons */}
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setTaskToEdit(task)}
                            className="text-slate-400 hover:text-blue-600 transition bg-slate-50 p-1.5 rounded-lg"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(task.id)}
                            className="text-slate-400 hover:text-rose-600 transition bg-slate-50 p-1.5 rounded-lg"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-1">
                        {task.description || "No description."}
                      </p>
                      <div className="mt-4 text-[10px] font-bold uppercase tracking-wide">
                        <span className="text-slate-400">
                          Status:{" "}
                          <span className="text-emerald-500 ml-1">
                            Completed
                          </span>
                        </span>
                      </div>
                    </div>
                    {task.image_path && (
                      <img
                        src={task.image_path}
                        className="w-20 h-20 rounded-2xl object-cover shadow-sm"
                        alt="Task"
                      />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <AddTaskModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onTaskAdded={triggerRefresh}
      />
      <EditTaskModal
        isOpen={!!taskToEdit}
        task={taskToEdit}
        onClose={() => setTaskToEdit(null)}
        onTaskUpdated={triggerRefresh}
      />
    </div>
  );
}
