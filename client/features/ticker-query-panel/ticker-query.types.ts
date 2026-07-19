import type {
    Company,
    SelectedCompany,
} from "../../types/company";

export type TickerQueryPanelProps = {
    onActiveTickerChange: (ticker: string) => void;
};

export type CompanyStatusProps = {
    status: SelectedCompany["status"];
};

export type CompanyCardProps = {
    company: Company;
    checked?: boolean;
    subtitle?: string;
    status?: SelectedCompany["status"];
    disabled?: boolean;
    onClick: () => void;
};

export type CompanyGridProps = {
    companies: Company[];
    emptyMessage: string;
    onSelect: (company: Company) => void;
    maxHeight?: number | string;
    isChecked?: (company: Company) => boolean;
};

export type WatchlistGridProps = {
    watchlist: SelectedCompany[];
    onSelect: (company: SelectedCompany) => void;
};

export type SectionHeaderProps = {
    title: string;
    count?: number;
    collapsible?: boolean;
    expanded?: boolean;
    onToggle?: () => void;
};