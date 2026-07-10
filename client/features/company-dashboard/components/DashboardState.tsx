import { LinearProgress, Paper, Typography } from "@mui/material";

type DashboardStateProps = {
    message: string;
    loading?: boolean;
    error?: boolean;
};

export default function DashboardState({
    message,
    loading = false,
    error = false,
}: DashboardStateProps) {
    return (
        <Paper
            sx={{
                height: "100%",
                p: 2,
                display: loading ? "block" : "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Typography
                color={error ? "error.main" : "text.secondary"}
                sx={{ fontWeight: loading ? 800 : 400 }}
            >
                {message}
            </Typography>

            {loading && <LinearProgress sx={{ mt: 2 }} />}
        </Paper>
    );
}