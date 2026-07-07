import type { Company } from "../types/company";

const API_BASE_URL = "http://localhost:8000/api/v1";

const KNOWN_COMPANIES: Company[] = [
    { ticker: "AAPL", name: "Apple Inc." },
    { ticker: "MSFT", name: "Microsoft" },
    { ticker: "NVDA", name: "NVIDIA" },
    { ticker: "AMZN", name: "Amazon" },
    { ticker: "META", name: "Meta Platforms" },
    { ticker: "GOOGL", name: "Alphabet" },
];

export async function searchCompanies(query: string): Promise<Company[]> {
    const q = query.trim().toLowerCase();

    if (!q) return [];

    return KNOWN_COMPANIES.filter(
        (company) =>
            company.ticker.toLowerCase().includes(q) ||
            company.name.toLowerCase().includes(q)
    );
}

export async function ingestCompany(ticker: string): Promise<boolean> {
    const response = await fetch(
        `http://localhost:8000/api/v1/companies/${ticker}/full-ingest`,
        {
            method: "POST",
        }
    );

    if (!response.ok) {
        return false;
    }

    return true;
}


export async function getCompanyDashboard(ticker: string) {
    const response = await fetch(`${API_BASE_URL}/companies/${ticker}/dashboard`);

    if (!response.ok) {
        throw new Error("Failed to load dashboard");
    }

    return response.json();
}