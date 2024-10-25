import { auth } from "@/auth";
import AddTaskButton from "@/components/add-task-button";
import TaskList from "@/components/task-list";
import { revalidatePath } from "next/cache";
import { TaskFormProvider } from "@/app/contexts/TaskFormContext";
import { TaskForm } from "@/components/task-form";

const API_SERVER = process.env.API_SERVER;

async function callItemsService(
  url: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body?: any
) {
  const session = await auth();
  const token = session?.accessToken;
  const res = await fetch(`${API_SERVER}${url}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`Failed to ${method} ${url}`);
  return await res.json();
}

export default async function TasksPage() {
  const session = await auth();

  // Fetch all items only if authenticated
  const tasks = session?.user?.id
    ? await callItemsService("/api/v1/items/")
    : [];

  // Server action for adding a new task
  async function addTaskAction({
    title,
    description,
    status,
    due_date,
  }: {
    title: string;
    description?: string;
    status: string;
    due_date?: string;
  }) {
    "use server";
    const session = await auth();
    if (!session?.user?.id) throw new Error("User not authenticated");

    await callItemsService("/api/v1/items/", "POST", {
      title,
      description,
      status,
      due_date,
    });

    revalidatePath("/tasks");
  }

  // Server action for updating a task
  async function updateTaskAction(
    id: string,
    {
      title,
      description,
      status,
      due_date,
    }: {
      title?: string;
      description?: string;
      status?: string;
      due_date?: string;
    }
  ) {
    "use server";
    const session = await auth();
    if (!session?.user?.id) throw new Error("User not authenticated");

    await callItemsService(`/api/v1/items/${id}`, "PUT", {
      title,
      description,
      status,
      due_date,
    });

    revalidatePath("/tasks");
  }

  // Server action for deleting a task
  async function deleteTaskAction(id: string) {
    "use server";
    const session = await auth();
    if (!session?.user?.id) throw new Error("User not authenticated");

    await callItemsService(`/api/v1/items/${id}`, "DELETE");

    revalidatePath("/tasks");
  }

  return (
    <TaskFormProvider>
      <main>
        {session?.user && (
          <>
            <AddTaskButton />
            <TaskList tasks={tasks.data} onDelete={deleteTaskAction} />
            <TaskForm onSubmit={addTaskAction} onUpdate={updateTaskAction} />
          </>
        )}
      </main>
    </TaskFormProvider>
  );
}
