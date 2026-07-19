import { useEffect, useState } from "react";

import { ingestCompany } from "../../../services/companyService";
import type {
    Company,
    SelectedCompany,
} from "../../../types/company";

const WATCHLIST_STORAGE_KEY = "watchlist";

export function useWatchlist() {
    const [watchlist, setWatchlist] =
        useState<SelectedCompany[]>(() => {
            const saved = localStorage.getItem(
                WATCHLIST_STORAGE_KEY,
            );

            if (!saved) {
                return [];
            }

            try {
                return JSON.parse(saved) as SelectedCompany[];
            } catch {
                return [];
            }
        });

    useEffect(() => {
        localStorage.setItem(
            WATCHLIST_STORAGE_KEY,
            JSON.stringify(watchlist),
        );
    }, [watchlist]);

    function addToWatchlist(
        company: Company,
        status: SelectedCompany["status"],
    ) {
        setWatchlist((previous) => {
            const existing = previous.some(
                (saved) =>
                    saved.ticker === company.ticker,
            );

            if (existing) {
                return previous.map((saved) =>
                    saved.ticker === company.ticker
                        ? {
                              ...saved,
                              ...company,
                              status,
                          }
                        : saved,
                );
            }

            return [
                {
                    ...company,
                    status,
                },
                ...previous,
            ];
        });
    }

    function updateWatchlistStatus(
        ticker: string,
        status: SelectedCompany["status"],
    ) {
        setWatchlist((previous) =>
            previous.map((company) =>
                company.ticker === ticker
                    ? {
                          ...company,
                          status,
                      }
                    : company,
            ),
        );
    }

    async function ingestAndAddCompany(
        company: Company,
    ) {
        addToWatchlist(company, "loading");

        try {
            const success = await ingestCompany(
                company.ticker,
            );

            if (!success) {
                updateWatchlistStatus(
                    company.ticker,
                    "error",
                );

                return false;
            }

            updateWatchlistStatus(
                company.ticker,
                "ready",
            );

            return true;
        } catch (error) {
            console.error(error);

            updateWatchlistStatus(
                company.ticker,
                "error",
            );

            return false;
        }
    }

    return {
        watchlist,
        ingestAndAddCompany,
    };
}