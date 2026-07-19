import { Box } from "@mui/material";

import CompanyCard from "./CompanyCard";
import EmptyMessage from "./EmptyMessage";
import type { CompanyGridProps } from "../ticker-query.types";

export default function CompanyGrid({
    companies,
    emptyMessage,
    onSelect,
    maxHeight = 170,
    isChecked,
}: CompanyGridProps) {
    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns:
                    "repeat(2, minmax(0, 1fr))",
                gap: 0.75,
                maxHeight,
                overflowY: "auto",
                pr: 0.25,
                alignContent: "start",
            }}
        >
            {companies.map((company) => (
                <CompanyCard
                    key={company.ticker}
                    company={company}
                    checked={
                        isChecked?.(company) ?? false
                    }
                    onClick={() => onSelect(company)}
                />
            ))}

            {companies.length === 0 && (
                <EmptyMessage message={emptyMessage} />
            )}
        </Box>
    );
}