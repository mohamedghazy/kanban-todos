import axios from "axios";
import type { Task } from "../types";

export async function updateTask(task: Task): Promise<Task> {
  const res = await axios.put(`http://localhost:4000/Tasks/${task.id}`, task);
  return res.data as Task;
}

export async function deleteTask(id: number): Promise<{ id: number }> {
  await axios.delete(`http://localhost:4000/Tasks/${id}`);
  return { id };
}
