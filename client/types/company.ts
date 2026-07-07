export type CompanyStatus =
    | "loading"
    | "ready"
    | "error";

export interface Company {
    ticker: string;
    name: string;
}

export interface SelectedCompany extends Company {
    status: CompanyStatus;
}