import type { ColumnKey } from "../types";

export const COLUMN_CONFIG: {
  key: ColumnKey;
  label: string;
  color: "default" | "info" | "warning" | "success";
}[] = [
  { key: "backlog", label: "Backlog", color: "default" },
  { key: "inprogress", label: "In Progress", color: "info" },
  { key: "review", label: "Review", color: "warning" },
  { key: "done", label: "Done", color: "success" },
];
