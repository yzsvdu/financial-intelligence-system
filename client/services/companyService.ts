import type { Company } from "../types/company";
import type { DashboardData } from "../features/company-dashboard/dashboard.types";

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ??
    "http://localhost:8000/api/v1";

export async function searchCompanies(
    query: string,
): Promise<Company[]> {
    const q = query.trim();

    if (!q) {
        return [];
    }

    const response = await fetch(
        `${API_BASE_URL}/companies/search?q=${encodeURIComponent(q)}`,
    );

    if (!response.ok) {
        return [];
    }

    const data = await response.json();

    return data.results;
}

export async function ingestCompany(
    ticker: string,
): Promise<boolean> {
    const response = await fetch(
        `${API_BASE_URL}/companies/${ticker}/full-ingest`,
        {
            method: "POST",
        },
    );

    return response.ok;
}

export async function getCompanyDashboard(
    ticker: string,
    signal?: AbortSignal,
): Promise<DashboardData> {
    const response = await fetch(
        `${API_BASE_URL}/companies/${ticker}/dashboard`,
        { signal },
    );

    if (!response.ok) {
        throw new Error("Failed to load dashboard");
    }

    return response.json() as Promise<DashboardData>;
}

export async function askRagQuestion(
    query: string,
    ticker?: string | null,
    limit = 5,
) {
    const response = await fetch(
        `${API_BASE_URL}/rag/answer`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query,
                ticker,
                limit,
            }),
        },
    );

    if (!response.ok) {
        throw new Error("Failed to get AI answer");
    }

    return response.json();
}
type LatestIngestsResponse = {
    companies: Company[];
};

export async function getLatestIngests(
    limit = 10,
): Promise<Company[]> {
    const response = await fetch(
        `${API_BASE_URL}/companies/latest-ingests?limit=${limit}`,
    );

    if (!response.ok) {
        return [];
    }

    const data: LatestIngestsResponse =
        await response.json();

    return data.companies;
}