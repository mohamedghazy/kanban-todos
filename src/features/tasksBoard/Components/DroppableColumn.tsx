import { useDroppable } from "@dnd-kit/core";
import { Box, Chip, Stack, Typography } from "@mui/material";

export default function DroppableColumn(props: {
  column: "backlog" | "inprogress" | "review" | "done";
  title: string;
  color: "default" | "info" | "warning" | "success";
  children: React.ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: props.column,
    data: { type: "column", column: props.column },
  });
  return (
    <Box
      ref={setNodeRef}
      sx={{
        p: 2,
        borderRadius: 2,
        bgcolor: isOver ? "action.hover" : "background.default",
        minHeight: 400,
        border: "1px solid",
        borderColor: "divider",
      }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
        <Typography variant="h6">{props.title}</Typography>
        <Chip
          size="small"
          color={props.color}
          label={props.column}
          variant="outlined"
        />
      </Stack>
      <Stack spacing={1.5}>{props.children}</Stack>
    </Box>
  );
}
