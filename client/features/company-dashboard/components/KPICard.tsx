import { Paper, Typography } from "@mui/material";

type KpiCardProps = {
    label: string;
    value: string;
    helper?: string;
};

export default function KPICard({
    label,
    value,
    helper,
}: KpiCardProps) {
    return (
        <Paper
            variant="outlined"
            sx={{
                p: 1.5,
                height: "100%",
                bgcolor: "background.default",
                borderColor: "divider",
            }}
        >
            <Typography variant="caption" color="text.secondary">
                {label}
            </Typography>

            <Typography
                variant="h6"
                sx={{
                    mt: 0.5,
                    fontWeight: 800,
                }}
            >
                {value}
            </Typography>

            {helper && (
                <Typography variant="caption" color="text.secondary">
                    {helper}
                </Typography>
            )}
        </Paper>
    );
}