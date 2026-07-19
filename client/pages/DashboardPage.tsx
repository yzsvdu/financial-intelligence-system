import { useState } from "react";
import {Box, Typography} from "@mui/material";

import AskAIPanel from "../features/ask-ai/AskAIPanel.tsx";
import CompanyDashboardPanel from "../features/company-dashboard/CompanyDashboardPanel.tsx";
import RecentIngestsBar from "../features/recent-ingests-bar/RecentIngestsBar.tsx";
import TickerQueryPanel from "../features/ticker-query-panel/TickerQueryPanel.tsx";

export default function DashboardPage() {
    const [activeTicker, setActiveTicker] =
        useState<string | null>(null);

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
                gridTemplateRows: {
                    xs: "auto minmax(0, 1fr)",
                    md: "64px minmax(0, 1fr)",
                },
                gap: 2,
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    minWidth: 0,
                }}
            >
                <Box
                    component="img"
                    src="/icons.svg"
                    alt="FIS"
                    sx={{
                        width: 44,
                        height: 44,
                        flexShrink: 0,
                    }}
                />

                <Box
                    sx={{
                        flexShrink: 0,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        minWidth: 220,
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 800,
                            lineHeight: 1,
                            letterSpacing: "-0.03em",
                        }}
                    >
                        Financial Intelligence
                    </Typography>

                    <Typography
                        variant="subtitle2"
                        sx={{
                            fontWeight: 700,
                            color: "#72c790",
                            letterSpacing: "0.18em",
                            textTransform: "uppercase",
                            mt: 0.25,
                        }}
                    >
                        System
                    </Typography>
                </Box>

                <Box
                    sx={{
                        flex: 1,
                        minWidth: 0,
                    }}
                >
                    <RecentIngestsBar
                        activeTicker={activeTicker}
                        onTickerSelect={setActiveTicker}
                    />
                </Box>
            </Box>

            <Box
                sx={{
                    minWidth: 0,
                    minHeight: 0,
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        md: "minmax(280px, 3fr) minmax(0, 9fr)",
                    },
                    gridTemplateRows: {
                        xs: "minmax(300px, auto) minmax(300px, auto) minmax(500px, 1fr)",
                        md: "minmax(0, 1fr)",
                    },
                    gap: 2,
                    overflow: {
                        xs: "auto",
                        md: "hidden",
                    },
                }}
            >
                {/* Left column */}
                <Box
                    sx={{
                        minWidth: 0,
                        minHeight: 0,
                        display: "grid",
                        gridTemplateRows: {
                            xs: "minmax(300px, auto) minmax(300px, auto)",
                            md: "minmax(280px, 1fr) minmax(300px, 1fr)",
                        },
                        gap: 2,
                        overflow: {
                            xs: "visible",
                            md: "hidden",
                        },
                    }}
                >
                    <Box
                        sx={{
                            minWidth: 0,
                            minHeight: 0,
                            overflow: "hidden",
                        }}
                    >
                        <TickerQueryPanel
                            onActiveTickerChange={
                                setActiveTicker
                            }
                        />
                    </Box>

                    <Box
                        sx={{
                            minWidth: 0,
                            minHeight: 0,
                            overflow: "hidden",
                        }}
                    >
                        <AskAIPanel ticker={activeTicker} />
                    </Box>
                </Box>

                {/* Main dashboard */}
                <Box
                    sx={{
                        minWidth: 0,
                        minHeight: 0,
                        overflow: "hidden",
                        gridRow: {
                            xs: "3",
                            md: "1",
                        },
                        gridColumn: {
                            xs: "1",
                            md: "2",
                        },
                    }}
                >
                    <CompanyDashboardPanel
                        ticker={activeTicker}
                    />
                </Box>
            </Box>
        </Box>
    );
}