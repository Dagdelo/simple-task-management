// frontend/components/task-list.tsx
"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useTaskForm } from "@/app/contexts/TaskFormContext";

export default function TaskList({ tasks, onUpdate, onDelete }) {
  const router = useRouter();
  const { openForm } = useTaskForm();

  async function handleUpdate(id, data) {
    await onUpdate(id, data);
    router.refresh();
  }

  async function handleDelete(id) {
    await onDelete(id);
    router.refresh();
  }

  return (
    <div className="flex flex-wrap gap-4 mt-4">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="w-full md:w-1/2 lg:w-1/3 p-4 bg-white shadow-md rounded-lg border border-gray-200"
        >
          <h3 className="text-lg font-semibold">{task.title}</h3>
          <p className="text-sm text-gray-500">
            {task.description || "No Description"}
          </p>
          <div className="mt-2">
            <span className="text-sm font-medium">Status: </span>
            <span className="text-sm">{task.status}</span>
          </div>
          <div>
            <span className="text-sm font-medium">Due Date: </span>
            <span className="text-sm">
              {task.due_date
                ? new Date(task.due_date).toLocaleDateString()
                : "No Due Date"}
            </span>
          </div>
          <div className="flex mt-4 space-x-2">
            <Button onClick={() => openForm(task)}>Edit</Button>
            <Button onClick={() => handleDelete(task.id)} variant="destructive">
              Delete
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
