import {
  AppBar,
  Box,
  Button,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import CreateTask from "../../features/creatNewTask/components/CreateTask";
import { useDispatch } from "react-redux";
import { search } from "../../features/todos/todosSlice";

function Header() {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(search(e.target.value));
  };
  return (
    <AppBar
      position="static"
      color="default"
      elevation={1}
      sx={{
        backgroundColor: "white",
        padding: "1rem",
        boxShadow: "0 0 10px 0 rgb(241, 241, 241)",
      }}>
      <Toolbar>
        <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
          Kanban Board
        </Typography>

        <Box sx={{ ml: "auto", display: "flex", alignItems: "center", gap: 1 }}>
          <TextField
            size="small"
            placeholder="Search..."
            aria-label="Search tasks"
            sx={{
              backgroundColor: "white",
              borderRadius: "20px",
              padding: "0.5rem",
            }}
            onChange={handleSearch}
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ borderRadius: "10px", fontWeight: "bold" }}
            onClick={() => setOpen(true)}>
            New Task
          </Button>
        </Box>
      </Toolbar>
      <CreateTask open={open} onClose={() => setOpen(false)} />
    </AppBar>
  );
}

export default Header;
