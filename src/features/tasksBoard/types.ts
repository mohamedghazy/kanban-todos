export type Task = {
  id: number;
  title: string;
  description: string;
  column: "backlog" | "inprogress" | "review" | "done";
};
export type ColumnKey = Task["column"];
