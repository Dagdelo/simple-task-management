"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface TaskData {
  id?: string;
  title: string;
  description?: string;
  status: string;
  due_date?: string;
}

interface TaskFormContextProps {
  isFormVisible: boolean;
  editingTask: TaskData | null;
  openForm: (task?: TaskData) => void;
  closeForm: () => void;
}

const TaskFormContext = createContext<TaskFormContextProps | undefined>(
  undefined
);

const TaskFormProvider = ({ children }: { children: ReactNode }) => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskData | null>(null);

  const openForm = (task?: TaskData) => {
    setEditingTask(task!);
    setIsFormVisible(true);
  };

  const closeForm = () => {
    setIsFormVisible(false);
    setEditingTask(null);
  };

  return (
    <TaskFormContext.Provider
      value={{ isFormVisible, editingTask, openForm, closeForm }}
    >
      {children}
    </TaskFormContext.Provider>
  );
};

const useTaskForm = () => {
  const context = useContext(TaskFormContext);
  if (!context)
    throw new Error("useTaskForm must be used within a TaskFormProvider");
  return context;
};

export { TaskFormProvider, useTaskForm };
