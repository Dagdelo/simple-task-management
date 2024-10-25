"use client";
import { Button } from "@/components/ui/button";

import { useTaskForm } from "@/app/contexts/TaskFormContext";

export default function AddTaskButton() {
  const { openForm } = useTaskForm();
  return <Button onClick={() => openForm()}>Add Task</Button>;
}
