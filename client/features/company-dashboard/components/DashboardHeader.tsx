import {
    Box,
    Chip,
    LinearProgress,
    Paper,
    Typography,
} from "@mui/material";
import {
    CheckCircleRounded,
    DescriptionOutlined,
} from "@mui/icons-material";

import type {
    CompanyData,
    DashboardData,
    FilingData,
    FinancialStatement,
} from "../dashboard.types";
import { formatPercent } from "../dashboard.utils";
import KPIGrid from "./KPIGrid";

type DashboardHeaderProps = {
    company: CompanyData;
    filings: FilingData;
    data: DashboardData;
    latestFinancial: FinancialStatement | null;
};

export default function DashboardHeader({
    company,
    filings,
    data,
    latestFinancial,
}: DashboardHeaderProps) {
    const embeddingCoverage =
        filings.embedding_coverage_pct ?? 0;

    const normalizedCoverage = Math.min(
        Math.max(embeddingCoverage, 0),
        100,
    );

    const isFullyIndexed = normalizedCoverage >= 100;

    return (
        <Paper
            variant="outlined"
            sx={{
                borderRadius: 1.5,
                overflow: "hidden",
                boxShadow: "none",
            }}
        >
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        lg: "minmax(0, 1.35fr) minmax(360px, 0.65fr)",
                    },
                    alignItems: "stretch",
                }}
            >
                <Box
                    sx={{
                        p: 2,
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "flex-start",
                        gap: 1.5,
                        minWidth: 0,
                        alignSelf: "stretch",
                    }}
                >
                    <Box
                        sx={{
                            width: 44,
                            height: 44,
                            flexShrink: 0,
                            display: "grid",
                            placeItems: "center",
                            bgcolor: "primary.main",
                            color: "primary.contrastText",
                            borderRadius: 1,
                        }}
                    >
                        <Typography
                            variant="body2"
                            sx={{
                                fontWeight: 900,
                                letterSpacing: "0.02em",
                            }}
                        >
                            {company.ticker.slice(0, 4)}
                        </Typography>
                    </Box>

                    <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                flexWrap: "wrap",
                            }}
                        >
                            <Typography
                                variant="h5"
                                sx={{
                                    fontWeight: 900,
                                    letterSpacing: "-0.03em",
                                }}
                            >
                                {company.ticker}
                            </Typography>

                            <Chip
                                icon={<CheckCircleRounded />}
                                label="Data Ready"
                                color="success"
                                size="small"
                                variant="outlined"
                                sx={{
                                    height: 24,
                                    borderRadius: 1,
                                    fontWeight: 700,
                                }}
                            />
                        </Box>

                        <Typography
                            variant="body1"
                            noWrap
                            sx={{
                                mt: 0.25,
                                fontWeight: 700,
                            }}
                        >
                            {company.name ?? "Unknown company"}
                        </Typography>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                            noWrap
                            sx={{
                                display: "block",
                                mt: 0.25,
                            }}
                        >
                            {company.sector ?? "Unknown sector"}
                            {" · "}
                            {company.industry ?? "Unknown industry"}
                            {" · "}
                            CIK {company.cik ?? "N/A"}
                        </Typography>
                    </Box>
                </Box>

                <Box
                    sx={{
                        p: 2,
                        minWidth: 0,
                        borderLeft: {
                            xs: 0,
                            lg: 1,
                        },
                        borderTop: {
                            xs: 1,
                            lg: 0,
                        },
                        borderColor: "divider",
                        bgcolor: "background.default",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            justifyContent: "space-between",
                            gap: 1.5,
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                minWidth: 0,
                            }}
                        >
                            <DescriptionOutlined
                                color="primary"
                                fontSize="small"
                            />

                            <Box sx={{ minWidth: 0 }}>
                                <Typography
                                    variant="body2"
                                    sx={{ fontWeight: 800 }}
                                >
                                    SEC Intelligence
                                </Typography>

                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    noWrap
                                    sx={{ display: "block" }}
                                >
                                    {filings.latest_filing ?? "No filing"}
                                    {" · "}
                                    {filings.latest_filing_date ?? "No date"}
                                </Typography>
                            </Box>
                        </Box>

                        <Chip
                            label={
                                isFullyIndexed
                                    ? "Fully Indexed"
                                    : "Indexing"
                            }
                            color={
                                isFullyIndexed
                                    ? "success"
                                    : "warning"
                            }
                            size="small"
                            variant="outlined"
                            sx={{
                                height: 24,
                                borderRadius: 1,
                                flexShrink: 0,
                                fontWeight: 700,
                            }}
                        />
                    </Box>

                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(3, minmax(0, 1fr))",
                            gap: 1.5,
                            mt: 1.25,
                        }}
                    >
                        <Box>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Filings
                            </Typography>

                            <Typography
                                variant="body2"
                                sx={{ fontWeight: 800 }}
                            >
                                {filings.filing_count}
                            </Typography>
                        </Box>

                        <Box>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Chunks
                            </Typography>

                            <Typography
                                variant="body2"
                                sx={{ fontWeight: 800 }}
                            >
                                {filings.chunk_count}
                            </Typography>
                        </Box>

                        <Box>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Embedded
                            </Typography>

                            <Typography
                                variant="body2"
                                sx={{ fontWeight: 800 }}
                            >
                                {filings.embedded_chunk_count}
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ mt: 1.25 }}>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                mb: 0.5,
                            }}
                        >
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Embedding coverage
                            </Typography>

                            <Typography
                                variant="caption"
                                sx={{ fontWeight: 800 }}
                            >
                                {formatPercent(normalizedCoverage)}
                            </Typography>
                        </Box>

                        <LinearProgress
                            variant="determinate"
                            value={normalizedCoverage}
                            sx={{
                                height: 5,
                                borderRadius: 1,
                                "& .MuiLinearProgress-bar": {
                                    borderRadius: 1,
                                },
                            }}
                        />
                    </Box>
                </Box>
            </Box>

            <Box
                sx={{
                    borderTop: 1,
                    borderColor: "divider",
                    p: 1.5,
                }}
            >
                <KPIGrid
                    data={data}
                    latestFinancial={latestFinancial}
                />
            </Box>
        </Paper>
    );
}