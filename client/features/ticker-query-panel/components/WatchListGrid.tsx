import { Box } from "@mui/material";

import CompanyCard from "./CompanyCard";
import EmptyMessage from "./EmptyMessage";
import type { WatchlistGridProps } from "../ticker-query.types";

export default function WatchlistGrid({
    watchlist,
    onSelect,
}: WatchlistGridProps) {
    return (
        <Box
            sx={{
                flex: 1,
                minHeight: 0,
                display: "grid",
                gridTemplateColumns:
                    "repeat(2, minmax(0, 1fr))",
                gridAutoRows: "min-content",
                gap: 0.75,
                alignContent: "start",
                overflowY: "auto",
                pr: 0.25,
            }}
        >
            {watchlist.map((company) => {
                const subtitle =
                    company.status === "ready"
                        ? company.name ||
                          "Click to view dashboard"
                        : company.status === "loading"
                          ? "Ingesting data..."
                          : "Failed to ingest";

                return (
                    <CompanyCard
                        key={company.ticker}
                        company={company}
                        checked
                        subtitle={subtitle}
                        status={company.status}
                        disabled={
                            company.status === "loading"
                        }
                        onClick={() => onSelect(company)}
                    />
                );
            })}

            {watchlist.length === 0 && (
                <EmptyMessage message="Your watchlist is empty" />
            )}
        </Box>
    );
}