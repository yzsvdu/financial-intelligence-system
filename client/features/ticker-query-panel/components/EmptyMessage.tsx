import { Box, Typography } from "@mui/material";

type EmptyMessageProps = {
    message: string;
};

export default function EmptyMessage({
    message,
}: EmptyMessageProps) {
    return (
        <Box
            sx={{
                gridColumn: "1 / -1",
                px: 1,
                py: 1.5,
            }}
        >
            <Typography
                variant="caption"
                color="text.secondary"
            >
                {message}
            </Typography>
        </Box>
    );
}