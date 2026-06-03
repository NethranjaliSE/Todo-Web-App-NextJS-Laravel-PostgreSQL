"use client";
import { useState } from "react";
import { X } from "lucide-react";
import { fetchAPI } from "@/lib/api";

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskAdded: () => void;
}

export default function AddTaskModal({
  isOpen,
  onClose,
  onTaskAdded,
}: AddTaskModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Moderate",
    status: "Not Started",
    category: "",
    due_date: "",
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Weekend Check Logic
    if (formData.due_date) {
      const selectedDate = new Date(formData.due_date);
      const dayOfWeek = selectedDate.getDay();

      if (dayOfWeek === 0 || dayOfWeek === 6) {
        const wantsToProceed = window.confirm(
          "Wait! You selected a weekend (Saturday/Sunday). Are you sure you want to add a task on your day off?",
        );

        if (!wantsToProceed) {
          return; // Stops the function if they click Cancel
        }
      }
    }

    // 2. API Submission Logic
    setLoading(true);
    try {
      await fetchAPI("/tasks", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      onTaskAdded();
      onClose();

      // Reset the form
      setFormData({
        title: "",
        description: "",
        priority: "Moderate",
        status: "Not Started",
        category: "",
        due_date: "",
      });
    } catch (error) {
      console.error("Failed to add task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800">Add New Task</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-rose-500 transition"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">
              Task Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
              placeholder="E.g., Finish project proposal"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition h-20 resize-none"
              placeholder="Add details here..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Category
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                placeholder="e.g. Work, Personal, Urgent"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={formData.due_date}
                onChange={(e) =>
                  setFormData({ ...formData, due_date: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Priority
              </label>
              <div className="flex flex-col gap-2">
                {["Low", "Moderate", "High", "Extreme"].map((level) => (
                  <label
                    key={level}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="priority"
                      value={level}
                      checked={formData.priority === level}
                      onChange={(e) =>
                        setFormData({ ...formData, priority: e.target.value })
                      }
                      className="accent-blue-600"
                    />
                    <span className="text-sm font-medium text-slate-600">
                      {level}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Status Selection */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Status
              </label>
              <div className="flex flex-col gap-2">
                {["Not Started", "In Progress", "Completed"].map(
                  (statusOption) => (
                    <label
                      key={statusOption}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="status"
                        value={statusOption}
                        checked={formData.status === statusOption}
                        onChange={(e) =>
                          setFormData({ ...formData, status: e.target.value })
                        }
                        className="accent-blue-600"
                      />
                      <span className="text-sm font-medium text-slate-600">
                        {statusOption}
                      </span>
                    </label>
                  ),
                )}
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl font-bold text-white bg-[#1a56db] hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
