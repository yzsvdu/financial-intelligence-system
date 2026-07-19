import { useEffect, useState } from "react";
import {
    Box,
    Button,
    CircularProgress,
    Paper,
    Typography,
} from "@mui/material";

import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";

import { getLatestIngests } from "../../services/companyService";
import type { Company } from "../../types/company";

type RecentIngestsBarProps = {
    activeTicker: string | null;
    onTickerSelect: (ticker: string) => void;
};

export default function RecentIngestsBar({
    activeTicker,
    onTickerSelect,
}: RecentIngestsBarProps) {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        async function loadLatestIngests() {
            setIsLoading(true);

            try {
                const latestCompanies =
                    await getLatestIngests(10);

                if (!cancelled) {
                    setCompanies(latestCompanies);
                }
            } catch (error) {
                console.error(
                    "Failed to load recent ingests:",
                    error,
                );

                if (!cancelled) {
                    setCompanies([]);
                }
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        }

        loadLatestIngests();

        return () => {
            cancelled = true;
        };
    }, [activeTicker]);

    return (
        <Paper
            component="nav"
            aria-label="Recent company ingests"
            sx={{
                minWidth: 0,
                minHeight: 0,
                px: 1.5,
                py: 1,
                boxSizing: "border-box",
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                overflow: "hidden",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.75,
                    flexShrink: 0,
                }}
            >
                <HistoryRoundedIcon
                    sx={{
                        fontSize: 19,
                        color: "text.secondary",
                    }}
                />

                <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: 1,
                        whiteSpace: "nowrap",
                    }}
                >
                    Recent Ingests
                </Typography>
            </Box>

            <Box
                sx={{
                    flex: 1,
                    minWidth: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: 0.75,
                    overflowX: "auto",
                    overflowY: "hidden",
                    scrollbarWidth: "thin",
                    pb: 0.25,
                }}
            >
                {isLoading && companies.length === 0 && (
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            px: 1,
                        }}
                    >
                        <CircularProgress size={16} />

                        <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ whiteSpace: "nowrap" }}
                        >
                            Loading recent companies...
                        </Typography>
                    </Box>
                )}

                {!isLoading && companies.length === 0 && (
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                            px: 1,
                            whiteSpace: "nowrap",
                        }}
                    >
                        No recent ingests
                    </Typography>
                )}

                {companies.map((company) => {
                    const isActive =
                        company.ticker === activeTicker;

                    return (
                        <Button
                            key={company.ticker}
                            type="button"
                            size="small"
                            variant={
                                isActive
                                    ? "contained"
                                    : "outlined"
                            }
                            onClick={() =>
                                onTickerSelect(
                                    company.ticker,
                                )
                            }
                            aria-pressed={isActive}
                            sx={{
                                minWidth: "fit-content",
                                flexShrink: 0,
                                px: 1.25,
                                py: 0.5,
                                borderRadius: 1.5,
                                textTransform: "none",
                                whiteSpace: "nowrap",
                            }}
                        >
                            <Box
                                component="span"
                                sx={{
                                    fontWeight: 800,
                                }}
                            >
                                {company.ticker}
                            </Box>

                            <Box
                                component="span"
                                sx={{
                                    display: {
                                        xs: "none",
                                        lg: "inline",
                                    },
                                    maxWidth: 120,
                                    ml: 0.75,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    fontWeight: 400,
                                }}
                            >
                                {company.name}
                            </Box>
                        </Button>
                    );
                })}
            </Box>
        </Paper>
    );
}