import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { getTasks, updateTaskColumn } from "../api/getTasks";
import type { Task } from "../types";
import { Box, Stack, Typography } from "@mui/material";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  DragOverlay,
  type CollisionDetection,
  pointerWithin,
  closestCorners,
} from "@dnd-kit/core";
import TaskCard from "./TaskCard";
import DroppableColumn from "./DroppableColumn";
import { COLUMN_CONFIG } from "./constant";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
import { setTodos, updateTodoColumn } from "../../../features/todos/todosSlice";
import type { Todo } from "../../../features/todos/todosSlice";
import type { ColumnKey } from "../types";

export default function TasksBoard() {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const searchQuery = useSelector(
    (state: RootState) => state.todos.searchQuery
  );
  const dispatch = useDispatch<AppDispatch>();
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );
  const queryClient = useQueryClient();
  const {
    data: tasks = [],
    isLoading,
    isError,
  } = useQuery({ queryKey: ["tasks"], queryFn: getTasks });

  const mutation = useMutation({
    mutationFn: ({ id, column }: { id: number; column: ColumnKey }) =>
      updateTaskColumn(id, column),
    onMutate: async ({ id, column }) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });
      const previous = queryClient.getQueryData<Task[]>(["tasks"]);
      queryClient.setQueryData<Task[]>(["tasks"], (old) =>
        (old ?? []).map((t) => (t.id === id ? { ...t, column } : t))
      );
      return { previous };
    },
    // Do not rollback on error; avoid refetch on error (prevents snap-back)
    onError: () => {},
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const filteredTasks = tasks.filter((task) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      task.title.toLowerCase().includes(query) ||
      task.description.toLowerCase().includes(query)
    );
  });
  const grouped = useMemo(() => {
    const map: Record<ColumnKey, Task[]> = {
      backlog: [],
      inprogress: [],
      review: [],
      done: [],
    };
    for (const t of filteredTasks) map[t.column].push(t);
    return map;
  }, [filteredTasks]);
  useEffect(() => {
    const mapped: Todo[] = tasks.map((t) => ({
      id: t.id,
      title: t.title,
      description: t.description,
      column: t.column,
    }));
    dispatch(setTodos(mapped));
  }, [dispatch, tasks]);

  const onDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === Number(event.active.id));
    setActiveTask(task ?? null);
  };

  const onDragEnd = (event: DragEndEvent) => {
    const taskId = Number(event.active.id);
    const overId = event.over?.id as string | undefined;
    setActiveTask(null);
    if (!overId) return;
    const columnKeys: ColumnKey[] = ["backlog", "inprogress", "review", "done"];
    let destinationColumn: ColumnKey | undefined;
    const overData = event.over?.data?.current as
      | { type?: string; column?: ColumnKey }
      | undefined;
    if (overData?.type === "column" && overData.column) {
      destinationColumn = overData.column;
    } else if (columnKeys.includes(overId as ColumnKey)) {
      destinationColumn = overId as ColumnKey;
    } else {
      const overTaskId = Number(overId);
      const overTask = tasks.find((t) => t.id === overTaskId);
      destinationColumn = overTask?.column;
    }
    if (!destinationColumn) return;
    const task = tasks.find((t) => t.id === taskId);
    if (!task || task.column === destinationColumn) return;
    dispatch(updateTodoColumn({ id: taskId, column: destinationColumn }));
    mutation.mutate({ id: taskId, column: destinationColumn });
  };

  if (isLoading) return <Typography sx={{ p: 2 }}>Loading tasks…</Typography>;
  if (isError)
    return <Typography sx={{ p: 2 }}>Failed to load tasks.</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        collisionDetection={
          ((args) => {
            const collisions = pointerWithin(args);
            return collisions.length ? collisions : closestCorners(args);
          }) as CollisionDetection
        }>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          {COLUMN_CONFIG.map((col) => (
            <Box key={col.key} sx={{ flex: 1 }}>
              <DroppableColumn
                column={col.key}
                title={col.label}
                color={col.color}>
                {grouped[col.key].map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </DroppableColumn>
            </Box>
          ))}
        </Stack>
        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} isOverlay /> : null}
        </DragOverlay>
      </DndContext>
    </Box>
  );
}
