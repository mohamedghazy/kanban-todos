import axios from "axios";
import type { Task } from "../types";
const apiUrl = import.meta.env.VITE_API_URL;
export async function updateTask(task: Task): Promise<Task> {
  const res = await axios.put(`${apiUrl}/Tasks/${task.id}`, task);
  return res.data as Task;
}

export async function deleteTask(id: number): Promise<{ id: number }> {
  await axios.delete(`${apiUrl}/Tasks/${id}`);
  return { id };
}
