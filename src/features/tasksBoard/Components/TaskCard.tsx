import { useDraggable } from "@dnd-kit/core";
import {
  Card,
  CardContent,
  Typography,
  type CSSProperties,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  CardActions,
} from "@mui/material";
// Assuming Task type is the same as Todo from the slice

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../store/store";
import { deleteTodo, updateTodo } from "../../../features/todos/todosSlice";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTask, updateTask } from "../api/updateTask";
type Task = {
  id: number;
  title: string;
  description: string;
  column: "backlog" | "inprogress" | "review" | "done";
  // Add other properties if needed
};

export default function TaskCard({
  task,
  isOverlay = false,
}: {
  task: Task;
  isOverlay?: boolean;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const [editOpen, setEditOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [form, setForm] = useState<Task>(task);
  const queryClient = useQueryClient();
  const deleteTaskMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      dispatch(deleteTodo(task.id));
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
  const updateTaskMutation = useMutation({
    mutationFn: updateTask,
    onSuccess: (form) => {
      dispatch(updateTodo(form));
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const handleUpdate = () => {
    dispatch(updateTodo(form));
    updateTaskMutation.mutate({ ...task, ...form });
    setEditOpen(false);
  };

  // Function to handle the delete action (now only Redux dispatch)
  const handleDelete = () => {
    dispatch(deleteTodo(task.id));
    deleteTaskMutation.mutate(task.id);
    setConfirmOpen(false);
  };

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: String(task.id) });

  const style: CSSProperties = isOverlay
    ? {}
    : {
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
        opacity: isDragging ? 0.6 : 1,
        cursor: "grab",
      };

  return (
    <Card
      ref={isOverlay ? undefined : setNodeRef}
      variant="outlined"
      style={style}
      {...(isOverlay ? {} : listeners)}
      {...(isOverlay ? {} : attributes)}>
      <CardContent>
        {!isOverlay && (
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <IconButton
              size="small"
              onClick={() => {
                // Initialize form state directly from the current task prop
                // (which is the current state in Redux)
                setForm(task);
                setEditOpen(true);
              }}>
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              color="error"
              onClick={() => setConfirmOpen(true)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </div>
        )}
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          {task.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {task.description}
        </Typography>
      </CardContent>
      <CardActions>
        {/* Edit Dialog */}
        {!isOverlay && (
          <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogContent>
              <TextField
                margin="dense"
                label="Title"
                fullWidth
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
              <TextField
                margin="dense"
                label="Description"
                fullWidth
                multiline
                minRows={3}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
              <TextField
                select
                fullWidth
                label="Column"
                margin="dense"
                value={form.column}
                onChange={(e) =>
                  setForm({ ...form, column: e.target.value as Task["column"] })
                }>
                <MenuItem value="backlog">Backlog</MenuItem>
                <MenuItem value="inprogress">In Progress</MenuItem>
                <MenuItem value="review">Review</MenuItem>
                <MenuItem value="done">Done</MenuItem>
              </TextField>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setEditOpen(false)}>Cancel</Button>
              <Button
                variant="contained"
                onClick={handleUpdate} // Call the Redux-only handler
              >
                Save
              </Button>
            </DialogActions>
          </Dialog>
        )}

        {/* Delete Confirm */}
        {!isOverlay && (
          <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
            <DialogTitle>Delete Task</DialogTitle>
            <DialogContent>
              <Typography>
                Are you sure you want to delete this task?
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
              <Button color="error" variant="contained" onClick={handleDelete}>
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </CardActions>
    </Card>
  );
}
