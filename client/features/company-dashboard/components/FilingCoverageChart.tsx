import {
    Box,
    LinearProgress,
    Paper,
    Typography,
} from "@mui/material";

import type { FilingData } from "../dashboard.types";
import { formatPercent } from "../dashboard.utils";

type FilingCoverageCardProps = {
    filings: FilingData;
};

type DetailRowProps = {
    label: string;
    value: string | number;
};

function DetailRow({ label, value }: DetailRowProps) {
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                gap: 2,
            }}
        >
            <Typography variant="body2" color="text.secondary">
                {label}
            </Typography>

            <Typography
                variant="body2"
                sx={{
                    textAlign: "right",
                    overflowWrap: "anywhere",
                }}
            >
                {value}
            </Typography>
        </Box>
    );
}

export default function FilingCoverageCard({
    filings,
}: FilingCoverageCardProps) {
    const coverage = filings.embedding_coverage_pct ?? 0;

    const rows = [
        {
            label: "Latest Filing",
            value: filings.latest_filing ?? "N/A",
        },
        {
            label: "Filing Date",
            value: filings.latest_filing_date ?? "N/A",
        },
        {
            label: "SEC Filings",
            value: filings.filing_count,
        },
        {
            label: "Document Chunks",
            value: filings.chunk_count,
        },
        {
            label: "Embedded Chunks",
            value: filings.embedded_chunk_count,
        },
    ];

    return (
        <Paper
            variant="outlined"
            sx={{
                p: 2,
                height: 280,
                bgcolor: "background.default",
                borderColor: "divider",
            }}
        >
            <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                Filing & RAG Coverage
            </Typography>

            <Typography variant="caption" color="text.secondary">
                Derived from filings and document_chunks
            </Typography>

            <Box
                sx={{
                    mt: 3,
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                }}
            >
                {rows.map((row) => (
                    <DetailRow
                        key={row.label}
                        label={row.label}
                        value={row.value}
                    />
                ))}
            </Box>

            <Box sx={{ mt: 3 }}>
                <DetailRow
                    label="Embedding Coverage"
                    value={formatPercent(coverage)}
                />

                <LinearProgress
                    variant="determinate"
                    value={Math.min(Math.max(coverage, 0), 100)}
                    sx={{
                        mt: 1,
                        height: 8,
                        borderRadius: 99,
                    }}
                />
            </Box>
        </Paper>
    );
}