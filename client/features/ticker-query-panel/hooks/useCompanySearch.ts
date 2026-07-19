import { useEffect, useState } from "react";

import { searchCompanies } from "../../../services/companyService";
import type { Company } from "../../../types/company";

export function useCompanySearch() {
    const [query, setQuery] = useState("");
    const [results, setResults] =
        useState<Company[]>([]);
    const [isSearching, setIsSearching] =
        useState(false);

    const trimmedQuery = query.trim();
    const isSearchMode = trimmedQuery.length > 0;

    useEffect(() => {
        if (!trimmedQuery) {
            setResults([]);
            setIsSearching(false);
            return;
        }

        let cancelled = false;

        const timeoutId = window.setTimeout(
            async () => {
                setIsSearching(true);

                try {
                    const companies =
                        await searchCompanies(
                            trimmedQuery,
                        );

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
            },
            300,
        );

        return () => {
            cancelled = true;
            window.clearTimeout(timeoutId);
        };
    }, [trimmedQuery]);

    return {
        query,
        setQuery,
        results,
        isSearching,
        isSearchMode,
    };
}