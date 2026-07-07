import {
    Box,
    Checkbox,
    CircularProgress,
    Divider,
    List,
    ListItemButton,
    ListItemIcon,
    Paper,
    TextField,
    Typography,
} from "@mui/material";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

import { useEffect, useState } from "react";

import {
    ingestCompany,
    searchCompanies,
} from "../services/companyService";

import type {
    Company,
    SelectedCompany,
} from "../types/company";

type TickerQueryPanelProps = {
    onActiveTickerChange: (ticker: string) => void;
};

export default function TickerQueryPanel({
        onActiveTickerChange,
    }: TickerQueryPanelProps) {
    const [query, setQuery] = useState("");

    const [results, setResults] = useState<Company[]>([]);

    const [watchlist, setWatchlist] = useState<SelectedCompany[]>([]);

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        searchCompanies(query).then(setResults);
    }, [query]);

    async function handleSelect(company: Company) {
        if (watchlist.some((c) => c.ticker === company.ticker)) {
            return;
        }

        setWatchlist((prev) => [
            ...prev,
            {
                ...company,
                status: "loading",
            },
        ]);

        try {
            const success = await ingestCompany(company.ticker);

            setWatchlist((prev) =>
                prev.map((c) =>
                    c.ticker === company.ticker
                        ? {
                              ...c,
                              status: success ? "ready" : "error",
                          }
                        : c
                )
            );

            if (success) {
                onActiveTickerChange(company.ticker);
            }
        } catch (error) {
            console.error(error);

            setWatchlist((prev) =>
                prev.map((c) =>
                    c.ticker === company.ticker
                        ? {
                              ...c,
                              status: "error",
                          }
                        : c
                )
            );
        }
    }

    function renderStatus(company: SelectedCompany) {
        switch (company.status) {
            case "loading":
                return <CircularProgress size={14} />;

            case "ready":
                return (
                    <CheckCircleIcon
                        color="success"
                        fontSize="small"
                    />
                );

            case "error":
                return (
                    <ErrorIcon
                        color="error"
                        fontSize="small"
                    />
                );
        }
    }

    return (
        <Paper
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                p: 2,
            }}
        >
            <Typography
                variant="h6"
                sx={{
                    fontWeight: 700,
                }}
            >
                Companies
            </Typography>

            <TextField
                size="small"
                placeholder="Search ticker or company..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                sx={{
                    mt: 2,
                }}
            />

            <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                    mt: 2,
                    mb: 1,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                }}
            >
                Results
            </Typography>

            <List
                dense
                sx={{
                    maxHeight: 170,
                    overflowY: "auto",
                }}
            >
                {results
                    .filter(
                        (company) =>
                            !watchlist.some(
                                (saved) =>
                                    saved.ticker === company.ticker
                            )
                    )
                    .map((company) => (
                        <ListItemButton
                            dense
                            key={company.ticker}
                            onClick={() =>
                                handleSelect(company)
                            }
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 32,
                                }}
                            >
                                <Checkbox
                                    size="small"
                                />
                            </ListItemIcon>

                            <Box
                                sx={{
                                    flex: 1,
                                }}
                            >
                                <Typography
                                    variant="body2"
                                    sx={{
                                        fontWeight: 700,
                                    }}
                                >
                                    {company.ticker}
                                </Typography>

                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    {company.name}
                                </Typography>
                            </Box>
                        </ListItemButton>
                    ))}
            </List>

            <Divider
                sx={{
                    my: 2,
                }}
            />

            <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                    mb: 1,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                }}
            >
                Watchlist ({watchlist.length})
            </Typography>

            <List
                dense
                sx={{
                    flex: 1,
                    overflowY: "auto",
                }}
            >
                {watchlist.map((company) => (
                    <ListItemButton
                        dense
                        key={company.ticker}
                        disabled={company.status === "loading"}
                        onClick={() => {
                            if (company.status === "ready") {
                                onActiveTickerChange(company.ticker);
                            }
                        }}
                        sx={{
                            borderRadius: 1,
                            opacity: company.status === "loading" ? 0.7 : 1,
                        }}
                    >
                        <ListItemIcon
                            sx={{
                                minWidth: 32,
                            }}
                        >
                            <Checkbox
                                checked
                                size="small"
                            />
                        </ListItemIcon>

                        <Box sx={{ flex: 1 }}>
                            <Typography
                                variant="body2"
                                sx={{
                                    fontWeight: 700,
                                }}
                            >
                                {company.ticker}
                            </Typography>

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                {company.status === "ready"
                                    ? "Click to view dashboard"
                                    : company.status === "loading"
                                      ? "Ingesting data..."
                                      : "Failed to ingest"}
                            </Typography>
                        </Box>

                        {renderStatus(company)}
                    </ListItemButton>
                ))}
            </List>
        </Paper>
    );
}