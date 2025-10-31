import axios from "axios";
import type { Task } from "../types";
export async function getTasks(): Promise<Task[]> {
  const res = await axios.get("http://localhost:4000/Tasks");
  return res.data as Task[];
}

export async function updateTaskColumn(
  id: number,
  column: Task["column"]
): Promise<Task> {
  const res = await axios.patch(`http://localhost:4000/Tasks/${id}`, {
    column,
  });
  return res.data as Task;
}
