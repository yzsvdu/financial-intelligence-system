import type { ReactNode } from "react";
import { Box, Paper, Typography } from "@mui/material";

type ChartCardProps = {
    title: string;
    subtitle: string;
    children: ReactNode;
    height?: number;
};

export default function ChartCard({
    title,
    subtitle,
    children,
    height = 280,
}: ChartCardProps) {
    return (
        <Paper
            variant="outlined"
            sx={{
                p: 2,
                height,
                bgcolor: "background.default",
                borderColor: "divider",
            }}
        >
            <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                {title}
            </Typography>

            <Typography variant="caption" color="text.secondary">
                {subtitle}
            </Typography>

            <Box
                sx={{
                    height: height - 60,
                    mt: 1,
                }}
            >
                {children}
            </Box>
        </Paper>
    );
}