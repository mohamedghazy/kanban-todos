import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type Todo = {
  id: number;
  title: string;
  description?: string;
  column?: "backlog" | "inprogress" | "review" | "done";
};

type TodosState = {
  items: Todo[];
  searchQuery: string;
};

const initialState: TodosState = {
  items: [],
  searchQuery: "",
};

const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    search(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    addTodo(state, action: PayloadAction<Todo>) {
      state.items.push(action.payload);
    },
    setTodos(state, action: PayloadAction<Todo[]>) {
      state.items = action.payload;
    },
    updateTodo(state, action: PayloadAction<Todo>) {
      const idx = state.items.findIndex((t) => t.id === action.payload.id);
      if (idx !== -1) {
        state.items[idx] = { ...state.items[idx], ...action.payload };
      }
    },
    updateTodoColumn(
      state,
      action: PayloadAction<{
        id: number;
        column: "backlog" | "inprogress" | "review" | "done";
      }>
    ) {
      const { id, column } = action.payload;
      const idx = state.items.findIndex((t) => t.id === id);
      if (idx !== -1) {
        state.items[idx].column = column;
      }
    },
    deleteTodo(state, action: PayloadAction<number>) {
      state.items = state.items.filter((t) => t.id !== action.payload);
    },
  },
});

export const {
  addTodo,
  setTodos,
  updateTodo,
  updateTodoColumn,
  deleteTodo,
  search,
} = todosSlice.actions;
export default todosSlice.reducer;
