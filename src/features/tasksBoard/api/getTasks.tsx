import axios from "axios";
import type { Task } from "../types";
const apiUrl = import.meta.env.VITE_API_URL;

export async function getTasks(): Promise<Task[]> {
  const res = await axios.get(`${apiUrl}/Tasks`);
  return res.data as Task[];
}

export async function updateTaskColumn(
  id: number,
  column: Task["column"]
): Promise<Task> {
  const res = await axios.patch(`${apiUrl}/Tasks/${id}`, {
    column,
  });
  return res.data as Task;
}
