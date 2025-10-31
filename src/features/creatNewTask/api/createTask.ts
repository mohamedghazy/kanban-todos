import axios from "axios";

export type CreateTaskBody = {
  id: number;
  title: string;
  description: string;
  column: "backlog" | "inprogress" | "review" | "done";
};
const apiUrl = import.meta.env.VITE_API_URL;

export async function createTask(body: CreateTaskBody) {
  const res = await axios.post(`${apiUrl}/Tasks`, body);
  return res.data as CreateTaskBody;
}
