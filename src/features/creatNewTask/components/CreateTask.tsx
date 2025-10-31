import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { addTodo, type Todo } from "../../todos/todosSlice";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTask } from "../api/createTask";

type Props = {
  open: boolean;
  onClose: () => void;
};

function CreateTask({ open, onClose }: Props) {
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [column, setColumn] = useState<NonNullable<Todo["column"]>>("backlog");
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  async function handleCreate() {
    if (!title.trim()) return;
    const newTask: Todo = {
      id: Date.now(),
      title: title.trim(),
      description: description.trim(),
      column,
    };

    dispatch(addTodo(newTask));
    await mutateAsync({
      id: newTask.id,
      title: newTask.title,
      description: newTask.description ?? "",
      column: newTask.column ?? "backlog",
    });
    onClose();
    setTitle("");
    setDescription("");
    setColumn("backlog");
  }

  function handleCancel() {
    onClose();
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      sx={{
        borderRadius: "20px",
        padding: "1rem",
        overflow: "hidden",
      }}>
      <DialogTitle>Create Task</DialogTitle>
      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          mt: 1,
        }}
        style={{ padding: "1rem" }}>
        <TextField
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="The task title"
        />
        <TextField
          label="Task Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          multiline
          minRows={3}
          placeholder="Describe the task"
        />
        <FormControl>
          <InputLabel id="column-label">Column Name</InputLabel>
          <Select
            labelId="column-label"
            label="Column Name"
            value={column}
            onChange={(e) => setColumn(e.target.value as typeof column)}>
            <MenuItem value="backlog">Backlog</MenuItem>
            <MenuItem value="inprogress">In Progress</MenuItem>
            <MenuItem value="review">Review</MenuItem>
            <MenuItem value="done">Done</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleCreate} variant="contained" disabled={isPending}>
          Create Task
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CreateTask;
