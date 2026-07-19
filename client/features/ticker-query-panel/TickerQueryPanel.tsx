import {
    Box,
    CircularProgress,
    Divider,
    Paper,
    TextField,
    Typography,
} from "@mui/material";
import type {TickerQueryPanelProps} from "./ticker-query.types.ts";
import {useWatchlist} from "./hooks/useWatchlist.ts";
import {useCompanySearch} from "./hooks/useCompanySearch.ts";
import type {SelectedCompany} from "../../types/company.ts";
import CompanyGrid from "./components/CompanyGrid.tsx";
import {SectionHeader} from "./components/SectionHeader.tsx";
import WatchlistGrid from "./components/WatchListGrid.tsx";


export default function TickerQueryPanel({
    onActiveTickerChange,
}: TickerQueryPanelProps) {
    const {
        query,
        setQuery,
        results,
        isSearching,
        isSearchMode,
    } = useCompanySearch();

    const {
        watchlist,
        ingestAndAddCompany,
    } = useWatchlist();

    async function handleSearchSelect(
        company: (typeof results)[number],
    ) {
        const success =
            await ingestAndAddCompany(company);

        if (!success) {
            return;
        }

        setQuery("");
        onActiveTickerChange(company.ticker);
    }

    function handleWatchlistSelect(
        company: SelectedCompany,
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
                minHeight: 0,
                p: 1.5,
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
            }}
        >
            <Typography
                variant="h6"
                sx={{
                    fontWeight: 700,
                    flexShrink: 0,
                }}
            >
                Companies
            </Typography>

            <TextField
                fullWidth
                size="small"
                placeholder="Search ticker or company..."
                value={query}
                onChange={(event) =>
                    setQuery(event.target.value)
                }
                slotProps={{
                    input: {
                        endAdornment: isSearching ? (
                            <CircularProgress size={16} />
                        ) : undefined,
                    },
                }}
                sx={{
                    mt: 1.25,
                    flexShrink: 0,
                }}
            />

            {isSearchMode && (
                <Box
                    sx={{
                        mt: 1,
                        flexShrink: 0,
                    }}
                >
                    <SectionHeader
                        title="Search Results"
                        count={results.length}
                    />

                    <CompanyGrid
                        companies={results}
                        emptyMessage="No matching companies"
                        onSelect={handleSearchSelect}
                        maxHeight={130}
                    />
                </Box>
            )}

            <Divider
                sx={{
                    my: 1,
                    flexShrink: 0,
                }}
            />

            <SectionHeader
                title="Watchlist"
                count={watchlist.length}
            />

            <Box
                sx={{
                    flex: 1,
                    minHeight: 0,
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                }}
            >
                <WatchlistGrid
                    watchlist={watchlist}
                    onSelect={handleWatchlistSelect}
                />
            </Box>
        </Paper>
    );
}