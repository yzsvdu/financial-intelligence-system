import {Box, Checkbox, Typography} from "@mui/material";
import CompanyStatus from "./CompanyStatus";
import {CompanyCardProps} from "../ticker-query.types";

export default function CompanyCard({
    company,
    checked = false,
    subtitle,
    status,
    disabled = false,
    onClick,
}: CompanyCardProps) {
    return (
        <Box
            component="button"
            type="button"
            disabled={disabled}
            onClick={onClick}
            sx={{
                width: "100%",
                minWidth: 0,
                minHeight: 58,
                p: 0.75,
                border: 1,
                borderColor: "divider",
                borderRadius: 1,
                bgcolor: "background.paper",
                color: "text.primary",
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                cursor: disabled ? "default" : "pointer",
                textAlign: "left",
                opacity: disabled ? 0.65 : 1,
                transition: (theme) =>
                    theme.transitions.create(
                        [
                            "background-color",
                            "border-color",
                        ],
                        {
                            duration:
                                theme.transitions.duration.shortest,
                        },
                    ),
                "&:hover": {
                    bgcolor: disabled
                        ? "background.paper"
                        : "action.hover",
                    borderColor: disabled
                        ? "divider"
                        : "text.disabled",
                },
                "&:focus-visible": {
                    outline: "2px solid",
                    outlineColor: "primary.main",
                    outlineOffset: 1,
                },
            }}
        >
            <Checkbox
                checked={checked}
                size="small"
                tabIndex={-1}
                disableRipple
                sx={{
                    p: 0.25,
                    pointerEvents: "none",
                    flexShrink: 0,
                }}
            />

            <Box
                sx={{
                    flex: 1,
                    minWidth: 0,
                }}
            >
                <Typography
                    variant="body2"
                    noWrap
                    sx={{
                        fontWeight: 800,
                        lineHeight: 1.2,
                    }}
                >
                    {company.ticker}
                </Typography>

                <Typography
                    variant="caption"
                    color="text.secondary"
                    noWrap
                    sx={{
                        display: "block",
                        mt: 0.25,
                        lineHeight: 1.2,
                    }}
                >
                    {subtitle ?? company.name}
                </Typography>
            </Box>

            {status && (
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        flexShrink: 0,
                    }}
                >
                    <CompanyStatus status={status} />
                </Box>
            )}
        </Box>
    );
}