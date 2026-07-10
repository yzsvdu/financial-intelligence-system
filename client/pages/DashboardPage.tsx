import { useState } from "react";
import { Box } from "@mui/material";

import AskAIPanel from "../features/AskAIPanel";
import CompanyDashboardPanel from "../features/CompanyDashboardPanel";
import TickerQueryPanel from "../features/TickerQueryPanel";

export default function DashboardPage() {
    const [activeTicker, setActiveTicker] = useState<string | null>(null);

    return (
        <Box
            sx={{
                width: "100vw",
                height: "100vh",
                bgcolor: "background.default",
                p: 2,
                boxSizing: "border-box",
                overflow: "hidden",
                display: "grid",
                gridTemplateColumns: {
                    xs: "1fr",
                    md: "minmax(260px, 3fr) minmax(0, 9fr)",
                },
                gridTemplateRows: {
                    xs: "auto auto minmax(280px, 1fr)",
                    md: "minmax(0, 7fr) minmax(240px, 3fr)",
                },
                gap: 2,
            }}
        >
            <Box sx={{ minHeight: 0, overflow: "hidden" }}>
                <TickerQueryPanel onActiveTickerChange={setActiveTicker} />
            </Box>

            <Box sx={{ minHeight: 0, overflow: "hidden" }}>
                <CompanyDashboardPanel ticker={activeTicker} />
            </Box>

            <Box
                sx={{
                    gridColumn: {
                        xs: "1",
                        md: "1 / -1",
                    },
                    minHeight: 0,
                    overflow: "hidden",
                }}
            >
                <AskAIPanel ticker={activeTicker} />
            </Box>
        </Box>
    );
}