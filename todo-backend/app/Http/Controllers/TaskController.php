<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TaskController extends Controller
{
    public function index()
    {
        // Only get tasks for the logged-in user
        $tasks = Task::where('user_id', Auth::id())->orderBy('created_at', 'desc')->get();
        return response()->json($tasks);
    }

    // Notice there is only ONE store method now
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'priority' => 'nullable|string|in:Low,Moderate,High,Extreme',
            'status' => 'nullable|string',
            'category' => 'nullable|string|max:255',
            'due_date' => 'nullable|date',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            // Save the uploaded image to the public storage folder
            $imagePath = $request->file('image')->store('task_images', 'public');
        }

        $task = Task::create([
            'user_id' => Auth::id(),
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'priority' => $validated['priority'] ?? 'Moderate',
            'status' => $validated['status'] ?? 'Not Started',
            'category' => $validated['category'] ?? null,
            'due_date' => $validated['due_date'] ?? null,
            'image_path' => $imagePath
        ]);

        return response()->json($task, 201);
    }

    public function update(Request $request, Task $task)
    {
        // Ensure user owns the task
        if ($task->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'priority' => 'nullable|string|in:Low,Moderate,High,Extreme',
            'status' => 'nullable|string',
            'category' => 'nullable|string|max:255',
            'due_date' => 'nullable|date',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        if ($request->hasFile('image')) {
            $validated['image_path'] = $request->file('image')->store('task_images', 'public');
        }

        $task->update($validated);
        return response()->json($task);
    }

    public function destroy(Task $task)
    {
        if ($task->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $task->delete();
        return response()->json(['message' => 'Task deleted']);
    }

    // Endpoint for Dashboard Charts
    public function getDashboardStats()
    {
        $userId = Auth::id();

        $total = Task::where('user_id', $userId)->count();
        $completed = Task::where('user_id', $userId)->where('status', 'Completed')->count();
        $inProgress = Task::where('user_id', $userId)->where('status', 'In Progress')->count();
        $notStarted = Task::where('user_id', $userId)->where('status', 'Not Started')->count();

        return response()->json([
            'total' => $total,
            'completed' => $completed,
            'in_progress' => $inProgress,
            'not_started' => $notStarted,
        ]);
    }
}
