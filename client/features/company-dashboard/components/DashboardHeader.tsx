import {
    Box,
    Chip,
    LinearProgress,
    Paper,
    Stack,
    Typography,
} from "@mui/material";

import type {
    CompanyData,
    FilingData,
} from "../dashboard.types";
import { formatPercent } from "../dashboard.utils";

type DashboardHeaderProps = {
    company: CompanyData;
    filings: FilingData;
};

type SummaryMetricProps = {
    label: string;
    value: string | number;
};

function SummaryMetric({
    label,
    value,
}: SummaryMetricProps) {
    return (
        <Box>
            <Typography
                variant="caption"
                color="text.secondary"
            >
                {label}
            </Typography>

            <Typography
                variant="body2"
                sx={{
                    mt: 0.25,
                    fontWeight: 700,
                }}
            >
                {value}
            </Typography>
        </Box>
    );
}

export default function DashboardHeader({
    company,
    filings,
}: DashboardHeaderProps) {
    const embeddingCoverage =
        filings.embedding_coverage_pct ?? 0;

    const normalizedCoverage = Math.min(
        Math.max(embeddingCoverage, 0),
        100,
    );

    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: {
                    xs: "1fr",
                    lg: "minmax(0, 1fr) 420px",
                },
                gap: 2,
                alignItems: "stretch",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2,
                    minWidth: 0,
                }}
            >
                <Box sx={{ minWidth: 0 }}>
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
                            }}
                        >
                            {company.ticker}
                        </Typography>

                        <Chip
                            label="Data Ready"
                            color="success"
                            size="small"
                        />
                    </Box>

                    <Typography
                        color="text.secondary"
                        sx={{
                            mt: 0.5,
                            fontWeight: 600,
                        }}
                    >
                        {company.name ?? "Unknown company"}
                    </Typography>

                    <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                            display: "block",
                            mt: 0.5,
                        }}
                    >
                        {company.sector ?? "Unknown sector"} •{" "}
                        {company.industry ?? "Unknown industry"} • CIK{" "}
                        {company.cik ?? "N/A"}
                    </Typography>
                </Box>
            </Box>

            <Paper
                variant="outlined"
                sx={{
                    p: 1.75,
                    bgcolor: "background.default",
                    borderColor: "divider",
                    borderRadius: 2,
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: 2,
                    }}
                >
                    <Box>
                        <Typography
                            variant="subtitle2"
                            sx={{
                                fontWeight: 800,
                            }}
                        >
                            SEC Filing & RAG Coverage
                        </Typography>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Filing ingestion, chunking, and embeddings
                        </Typography>
                    </Box>

                    <Chip
                        label={
                            normalizedCoverage >= 100
                                ? "Fully Indexed"
                                : "Indexing"
                        }
                        color={
                            normalizedCoverage >= 100
                                ? "success"
                                : "warning"
                        }
                        size="small"
                        variant="outlined"
                    />
                </Box>

                <Stack
                    direction="row"
                    spacing={3}
                    sx={{
                        mt: 1.75,
                        flexWrap: "wrap",
                        rowGap: 1.5,
                    }}
                >
                    <SummaryMetric
                        label="Latest Filing"
                        value={filings.latest_filing ?? "N/A"}
                    />

                    <SummaryMetric
                        label="Filing Date"
                        value={
                            filings.latest_filing_date ?? "N/A"
                        }
                    />

                    <SummaryMetric
                        label="Filings"
                        value={filings.filing_count}
                    />

                    <SummaryMetric
                        label="Chunks"
                        value={filings.chunk_count}
                    />

                    <SummaryMetric
                        label="Embedded"
                        value={filings.embedded_chunk_count}
                    />
                </Stack>

                <Box sx={{ mt: 1.75 }}>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 0.75,
                        }}
                    >
                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Embedding Coverage
                        </Typography>

                        <Typography
                            variant="caption"
                            sx={{
                                fontWeight: 800,
                            }}
                        >
                            {formatPercent(normalizedCoverage)}
                        </Typography>
                    </Box>

                    <LinearProgress
                        variant="determinate"
                        value={normalizedCoverage}
                        sx={{
                            height: 7,
                            borderRadius: 99,
                        }}
                    />
                </Box>
            </Paper>
        </Box>
    );
}