import CircularProgress from "@mui/material/CircularProgress";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

import type { CompanyStatusProps } from "../ticker-query.types";

export default function CompanyStatus({
    status,
}: CompanyStatusProps) {
    switch (status) {
        case "loading":
            return <CircularProgress size={14} />;

        case "ready":
            return (
                <CheckCircleIcon
                    color="success"
                    sx={{ fontSize: 17 }}
                />
            );

        case "error":
            return (
                <ErrorIcon
                    color="error"
                    sx={{ fontSize: 17 }}
                />
            );

        default:
            return null;
    }
}