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
    getLatestIngests,
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

type CompanyStatusProps = {
    status: SelectedCompany["status"];
};

type CompanyItemProps = {
    company: Company;
    checked?: boolean;
    subtitle?: string;
    status?: SelectedCompany["status"];
    disabled?: boolean;
    onClick: () => void;
};

type CompanyListProps = {
    companies: Company[];
    emptyMessage: string;
    onSelect: (company: Company) => void;
    maxHeight?: number;
};

type WatchlistProps = {
    watchlist: SelectedCompany[];
    onSelect: (company: SelectedCompany) => void;
};

function CompanyStatus({
    status,
}: CompanyStatusProps) {
    switch (status) {
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

        default:
            return null;
    }
}

function CompanyItem({
    company,
    checked = false,
    subtitle,
    status,
    disabled = false,
    onClick,
}: CompanyItemProps) {
    return (
        <ListItemButton
            dense
            disabled={disabled}
            onClick={onClick}
            sx={{
                borderRadius: 1,
                opacity: disabled ? 0.7 : 1,
            }}
        >
            <ListItemIcon
                sx={{
                    minWidth: 32,
                }}
            >
                <Checkbox
                    checked={checked}
                    size="small"
                    tabIndex={-1}
                    disableRipple
                    sx={{
                        pointerEvents: "none",
                    }}
                />
            </ListItemIcon>

            <Box
                sx={{
                    flex: 1,
                    minWidth: 0,
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
                    noWrap
                    sx={{
                        display: "block",
                    }}
                >
                    {subtitle ?? company.name}
                </Typography>
            </Box>

            {status && (
                <CompanyStatus status={status} />
            )}
        </ListItemButton>
    );
}

function EmptyMessage({
    message,
}: {
    message: string;
}) {
    return (
        <Typography
            variant="caption"
            color="text.secondary"
            sx={{
                display: "block",
                px: 2,
                py: 1.5,
            }}
        >
            {message}
        </Typography>
    );
}

function CompanyList({
    companies,
    emptyMessage,
    onSelect,
    maxHeight = 170,
}: CompanyListProps) {
    return (
        <List
            dense
            sx={{
                maxHeight,
                overflowY: "auto",
            }}
        >
            {companies.map((company) => (
                <CompanyItem
                    key={company.ticker}
                    company={company}
                    onClick={() => onSelect(company)}
                />
            ))}

            {companies.length === 0 && (
                <EmptyMessage
                    message={emptyMessage}
                />
            )}
        </List>
    );
}

function Watchlist({
    watchlist,
    onSelect,
}: WatchlistProps) {
    return (
        <List
            dense
            sx={{
                flex: 1,
                overflowY: "auto",
            }}
        >
            {watchlist.map((company) => {
                const subtitle =
                    company.status === "ready"
                        ? "Click to view dashboard"
                        : company.status === "loading"
                          ? "Ingesting data..."
                          : "Failed to ingest";

                return (
                    <CompanyItem
                        key={company.ticker}
                        company={company}
                        checked
                        subtitle={subtitle}
                        status={company.status}
                        disabled={
                            company.status === "loading"
                        }
                        onClick={() =>
                            onSelect(company)
                        }
                    />
                );
            })}

            {watchlist.length === 0 && (
                <EmptyMessage
                    message="Your watchlist is empty"
                />
            )}
        </List>
    );
}

export default function TickerQueryPanel({
    onActiveTickerChange,
}: TickerQueryPanelProps) {
    const [query, setQuery] = useState("");

    const [results, setResults] = useState<Company[]>([]);

    const [latestIngests, setLatestIngests] =
        useState<Company[]>([]);

    const [isSearching, setIsSearching] =
        useState(false);

    const [watchlist, setWatchlist] =
        useState<SelectedCompany[]>(() => {
            const saved =
                localStorage.getItem("watchlist");

            if (!saved) {
                return [];
            }

            try {
                return JSON.parse(saved);
            } catch {
                return [];
            }
        });

    const trimmedQuery = query.trim();

    const isSearchMode = trimmedQuery.length > 0;

    useEffect(() => {
        localStorage.setItem(
            "watchlist",
            JSON.stringify(watchlist)
        );
    }, [watchlist]);

    useEffect(() => {
        async function loadLatestIngests() {
            try {
                const companies =
                    await getLatestIngests(10);

                setLatestIngests(companies);
            } catch (error) {
                console.error(error);
            }
        }

        loadLatestIngests();
    }, []);

    useEffect(() => {
        if (!trimmedQuery) {
            setResults([]);
            setIsSearching(false);
            return;
        }

        let cancelled = false;

        const timeoutId = window.setTimeout(async () => {
            setIsSearching(true);

            try {
                const companies =
                    await searchCompanies(trimmedQuery);

                if (!cancelled) {
                    setResults(companies);
                }
            } catch (error) {
                console.error(error);

                if (!cancelled) {
                    setResults([]);
                }
            } finally {
                if (!cancelled) {
                    setIsSearching(false);
                }
            }
        }, 300);

        return () => {
            cancelled = true;
            window.clearTimeout(timeoutId);
        };
    }, [trimmedQuery]);

    function addToWatchlist(
        company: Company,
        status: SelectedCompany["status"]
    ) {
        setWatchlist((prev) => {
            const existing = prev.find(
                (saved) =>
                    saved.ticker === company.ticker
            );

            if (existing) {
                return prev.map((saved) =>
                    saved.ticker === company.ticker
                        ? {
                              ...saved,
                              status,
                          }
                        : saved
                );
            }

            return [
                ...prev,
                {
                    ...company,
                    status,
                },
            ];
        });
    }

    function updateWatchlistStatus(
        ticker: string,
        status: SelectedCompany["status"]
    ) {
        setWatchlist((prev) =>
            prev.map((company) =>
                company.ticker === ticker
                    ? {
                          ...company,
                          status,
                      }
                    : company
            )
        );
    }

    async function handleSearchSelect(
        company: Company
    ) {
        addToWatchlist(company, "loading");

        try {
            const success = await ingestCompany(
                company.ticker
            );

            if (!success) {
                updateWatchlistStatus(
                    company.ticker,
                    "error"
                );
                return;
            }

            updateWatchlistStatus(
                company.ticker,
                "ready"
            );

            setLatestIngests((prev) => [
                company,
                ...prev.filter(
                    (item) =>
                        item.ticker !== company.ticker
                ),
            ]);

            setQuery("");

            onActiveTickerChange(company.ticker);
        } catch (error) {
            console.error(error);

            updateWatchlistStatus(
                company.ticker,
                "error"
            );
        }
    }

    function handleRecentSelect(
        company: Company
    ) {
        onActiveTickerChange(company.ticker);
    }

    function handleWatchlistSelect(
        company: SelectedCompany
    ) {
        if (company.status !== "ready") {
            return;
        }

        onActiveTickerChange(company.ticker);
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
                onChange={(e) =>
                    setQuery(e.target.value)
                }
                slotProps={{
                    input: {
                        endAdornment: isSearching
                            ? (
                                <CircularProgress
                                    size={16}
                                />
                            )
                            : undefined,
                    },
                }}
                sx={{
                    mt: 2,
                }}
            />

            {/* Search Results */}

            {isSearchMode && (
                <>
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
                        Search Results
                    </Typography>

                    <CompanyList
                        companies={results}
                        emptyMessage="No matching companies"
                        onSelect={handleSearchSelect}
                        maxHeight={150}
                    />
                </>
            )}

            {/* Recent Ingests */}

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
                Recent Ingests
            </Typography>

            <CompanyList
                companies={latestIngests}
                emptyMessage="No recent ingests"
                onSelect={handleRecentSelect}
                maxHeight={
                    isSearchMode ? 150 : 220
                }
            />

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

            <Watchlist
                watchlist={watchlist}
                onSelect={handleWatchlistSelect}
            />
        </Paper>
    );
}