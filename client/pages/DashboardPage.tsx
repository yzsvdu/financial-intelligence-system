import { useState } from "react";
import { Box, Grid } from "@mui/material";

import AskAIPanel from "../components/AskAIPanel";
import CompanyDashboardPanel from "../components/CompanyDashboardPanel";
import TickerQueryPanel from "../components/TickerQueryPanel";

export default function DashboardPage() {
    const [activeTicker, setActiveTicker] = useState<string | null>(null);

    return (
        <Box
            sx={{
                width: "100vw",
                height: "100vh",
                bgcolor: "background.default",
                p: 2,
            }}
        >
            <Grid container spacing={2} sx={{ height: "100%" }}>
                <Grid size={{ xs: 12, md: 3 }} sx={{ height: "70%" }}>
                    <TickerQueryPanel onActiveTickerChange={setActiveTicker} />
                </Grid>

                <Grid size={{ xs: 12, md: 9 }} sx={{ height: "70%" }}>
                    <CompanyDashboardPanel ticker={activeTicker} />
                </Grid>

                <Grid size={12} sx={{ height: "30%" }}>
                    <AskAIPanel />
                </Grid>
            </Grid>
        </Box>
    );
}