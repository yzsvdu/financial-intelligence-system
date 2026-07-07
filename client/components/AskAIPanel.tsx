import { Button, Paper, TextField, Typography } from "@mui/material";

export default function AskAIPanel() {
  return (
    <Paper sx={{ height: "100%", p: 3, borderRadius: 4, border: "1px solid #1f2937" }}>
      <Typography variant="h6" fontWeight={800}>
        Ask AI
      </Typography>

      <Typography color="text.secondary" mt={1}>
        Ask questions grounded in SEC filings and financial data.
      </Typography>

      <TextField
        fullWidth
        multiline
        minRows={4}
        label="Question"
        placeholder="What are Apple's main business risks?"
        sx={{ mt: 3 }}
      />

      <Button variant="contained" sx={{ mt: 2 }}>
        Ask
      </Button>
    </Paper>
  );
}