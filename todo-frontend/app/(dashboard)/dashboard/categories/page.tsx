"use client";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Tag } from "lucide-react";
import { fetchAPI } from "@/lib/api";

interface Task {
  id: number;
  category: string | null;
}

interface Category {
  id: number;
  name: string;
}

const TASK_STATUSES = ["Completed", "In Progress", "Not Started"];
const TASK_PRIORITIES = ["Extreme", "Moderate", "Low"];

export default function CategoriesPage() {
  const router = useRouter();
  const [taskCategories, setTaskCategories] = useState<Record<string, number>>({});
  const [savedCategories, setSavedCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      setLoading(true);

      try {
        const [categoriesResponse, tasksResponse] = await Promise.all([
          fetchAPI("/categories").catch(() => []),
          fetchAPI("/tasks").catch(() => []),
        ]);

        const categories = Array.isArray(categoriesResponse?.data)
          ? categoriesResponse.data
          : Array.isArray(categoriesResponse)
          ? categoriesResponse
          : [];

        const tasks = Array.isArray(tasksResponse?.data)
          ? tasksResponse.data
          : Array.isArray(tasksResponse)
          ? tasksResponse
          : [];

        const counts: Record<string, number> = {};
        tasks.forEach((task: Task) => {
          const name = task.category?.trim() || "Uncategorized";
          counts[name] = (counts[name] || 0) + 1;
        });

        setSavedCategories(categories);
        setTaskCategories(counts);
      } catch (loadError) {
        console.error("Failed to load categories", loadError);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const allCategoryNames = Array.from(
    new Set([
      ...savedCategories.map((category) => category.name),
      ...Object.keys(taskCategories),
    ]),
  );

  const handleCreateCategory = async (event: FormEvent) => {
    event.preventDefault();
    const trimmedValue = newCategory.trim();

    if (!trimmedValue) {
      setError("Category name cannot be empty.");
      return;
    }

    if (allCategoryNames.includes(trimmedValue)) {
      setError("This category already exists.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const response = await fetchAPI("/categories", {
        method: "POST",
        body: JSON.stringify({ name: trimmedValue }),
      });

      if (response && typeof response === "object") {
        setSavedCategories((current) => [...current, response as Category]);
        setNewCategory("");
        setShowForm(false);
      }
    } catch (createError) {
      console.error("Failed to create category", createError);
      setError("Could not save category. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const categoryEntries = allCategoryNames.map((name) => ({
    name,
    count: taskCategories[name] || 0,
  }));

  return (
    <div className="animate-in fade-in duration-500 max-w-6xl mx-auto">
      <div className="bg-white rounded-[30px] p-10 shadow-sm border border-slate-100">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Task Categories</h1>
            <p className="mt-2 text-sm text-slate-500">
              Create categories, manage task statuses, and review priority labels.
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

        <div className="mb-8 rounded-[30px] border border-slate-200 bg-slate-50 p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Create Categories</h2>
              <p className="mt-1 text-sm text-slate-500">
                Add a category so your tasks can be grouped more easily.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setShowForm((current) => !current);
                setError("");
              }}
              className="rounded-xl bg-[#ff652f] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#ff7b50] transition"
            >
              {showForm ? "Cancel" : "Add Category"}
            </button>
          </div>

          {showForm ? (
            <form onSubmit={handleCreateCategory} className="mt-6 grid gap-4 md:grid-cols-[1fr_auto] items-end">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Category Name
                </label>
                <input
                  type="text"
                  value={newCategory}
                  onChange={(event) => setNewCategory(event.target.value)}
                  placeholder="e.g. Work, Health, Law"
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[#1a56db] focus:ring-2 focus:ring-[#1a56db]/20"
                />
                {error ? (
                  <p className="mt-2 text-sm text-rose-600">{error}</p>
                ) : null}
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-2xl bg-[#ff652f] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#ff7b50] transition disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {saving ? "Saving..." : "Create"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setNewCategory("");
                    setError("");
                  }}
                  className="rounded-2xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : null}
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Task Status</h2>
                <p className="text-sm text-slate-500">The workflow stages for your tasks.</p>
              </div>
              <button
                type="button"
                className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition"
              >
                + Add Task Status
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="py-3">SN</th>
                    <th className="py-3">Task Status</th>
                    <th className="py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {TASK_STATUSES.map((status, index) => (
                    <tr key={status} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-4">{index + 1}</td>
                      <td className="py-4">{status}</td>
                      <td className="py-4 space-x-2">
                        <button className="rounded-xl bg-orange-500 px-3 py-2 text-xs font-semibold text-white hover:bg-orange-600 transition">
                          Edit
                        </button>
                        <button className="rounded-xl bg-rose-500 px-3 py-2 text-xs font-semibold text-white hover:bg-rose-600 transition">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Task Priority</h2>
                <p className="text-sm text-slate-500">Priority labels that help rank your tasks.</p>
              </div>
              <button
                type="button"
                className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition"
              >
                + Add New Priority
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="py-3">SN</th>
                    <th className="py-3">Task Priority</th>
                    <th className="py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {TASK_PRIORITIES.map((priority, index) => (
                    <tr key={priority} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-4">{index + 1}</td>
                      <td className="py-4">{priority}</td>
                      <td className="py-4 space-x-2">
                        <button className="rounded-xl bg-orange-500 px-3 py-2 text-xs font-semibold text-white hover:bg-orange-600 transition">
                          Edit
                        </button>
                        <button className="rounded-xl bg-rose-500 px-3 py-2 text-xs font-semibold text-white hover:bg-rose-600 transition">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-[30px] border border-slate-200 bg-slate-50 p-6 shadow-sm">
          <div className="flex items-center gap-3 text-slate-700 mb-4">
            <Tag size={20} />
            <h2 className="text-xl font-bold">Saved Categories</h2>
          </div>

          {loading ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
              Loading categories…
            </div>
          ) : categoryEntries.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
              No categories available. Add a category to get started.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {categoryEntries.map(({ name, count }) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => router.push(`/dashboard?category=${encodeURIComponent(name)}`)}
                  className="group rounded-3xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:border-[#1a56db] hover:bg-[#f0f7ff]"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e3f2ff] text-[#1a56db]">
                      <Tag size={18} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{name}</h3>
                      <p className="text-sm text-slate-500">Tasks in this category</p>
                    </div>
                  </div>
                  <div className="mt-6 inline-flex items-center justify-between rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700">
                    <span>Count</span>
                    <span>{count}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
