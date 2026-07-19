import { useEffect, useState } from "react";
import { Box, Divider, Paper } from "@mui/material";

import { getCompanyDashboard } from "../../services/companyService";

import DashboardState from "./components/DashboardState";
import DashboardHeader from "./components/DashboardHeader";
import CompanyDashboardContent from "./CompanyDashboardContent";

import {
    buildDashboardAnalytics,
} from "./dashboard.utils";

import type {
    CompanyDashboardPanelProps,
    DashboardData,
} from "./dashboard.types";

type DashboardRequestState = {
    data: DashboardData | null;
    ticker: string | null;
    error: string | null;
};

export default function CompanyDashboardPanel({
    ticker,
}: CompanyDashboardPanelProps) {
    const [requestState, setRequestState] =
        useState<DashboardRequestState>({
            data: null,
            ticker: null,
            error: null,
        });

    useEffect(() => {
        if (!ticker) {
            return;
        }

        const currentTicker = ticker;
        const controller = new AbortController();

        async function loadDashboard() {
            try {
                const dashboard = await getCompanyDashboard(
                    currentTicker,
                    controller.signal,
                );

                setRequestState({
                    data: dashboard,
                    ticker: currentTicker,
                    error: null,
                });
            } catch (error) {
                if (controller.signal.aborted) {
                    return;
                }

                console.error(error);

                setRequestState({
                    data: null,
                    ticker: currentTicker,
                    error: "Failed to load dashboard.",
                });
            }
        }

        void loadDashboard();

        return () => {
            controller.abort();
        };
    }, [ticker]);

    if (!ticker) {
        return (
            <DashboardState message="Select a company from the watchlist to load analytics." />
        );
    }

    const isCurrentTickerLoaded =
        requestState.ticker === ticker;

    if (!isCurrentTickerLoaded) {
        return (
            <DashboardState
                message={`Loading ${ticker} dashboard...`}
                loading
            />
        );
    }

    if (requestState.error || !requestState.data) {
        return (
            <DashboardState
                message={
                    requestState.error ??
                    "No dashboard data available."
                }
                error
            />
        );
    }

    const data = requestState.data;
    const analytics = buildDashboardAnalytics(data);

    return (
        <Paper
            sx={{
                height: "100%",
                p: 2,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
            }}
        >
            <DashboardHeader
                company={data.company}
                filings={data.filings}
                data={data}
                latestFinancial={analytics.latestFinancial}
            />

            <Divider sx={{ my: 1.5 }} />

            <Box
                sx={{
                    flex: 1,
                    minHeight: 0,
                    overflowY: "auto",
                    pr: 1,
                }}
            >
                <CompanyDashboardContent data={data} />
            </Box>
        </Paper>
    );
}