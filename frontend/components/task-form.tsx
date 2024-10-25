"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTaskForm } from "@/app/contexts/TaskFormContext";

export function TaskForm({ onSubmit, onUpdate }) {
  const { isFormVisible, editingTask, closeForm } = useTaskForm();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    if (editingTask) {
      console.log("effect", editingTask);
      setTitle(editingTask.title || "");
      setDescription(editingTask.description || "");
      setStatus(editingTask.status || "pending");
      setDueDate(
        new Date(editingTask.due_date || "").toISOString().split("T")[0]
      );
    } else {
      setTitle("");
      setDescription("");
      setStatus("pending");
      setDueDate("");
    }
  }, [editingTask]);

  const handleSubmit = async (e) => {
    console.log("editingTask", editingTask);
    e.preventDefault();
    if (editingTask) {
      await onUpdate(editingTask.id, {
        title,
        description,
        status,
        due_date: dueDate,
      });
    } else {
      await onSubmit({ title, description, status, due_date: dueDate });
    }
    closeForm();
  };

  if (!isFormVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          {editingTask ? "Edit Task" : "Add Task"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <Input
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Input
            placeholder="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          />
          <Input
            type="date"
            placeholder="Due Date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
          <div className="flex justify-end space-x-2 mt-4">
            <Button onClick={closeForm} variant="secondary" type="button">
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
