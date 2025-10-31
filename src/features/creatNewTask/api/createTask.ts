import axios from "axios";

export type CreateTaskBody = {
  id: number;
  title: string;
  description: string;
  column: "backlog" | "inprogress" | "review" | "done";
};

export async function createTask(body: CreateTaskBody) {
  const res = await axios.post("http://localhost:4000/Tasks", body);
  return res.data as CreateTaskBody;
}
