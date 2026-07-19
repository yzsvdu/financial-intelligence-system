import {Box, IconButton, Typography} from "@mui/material";
import KeyboardArrowDownRounded from "@mui/icons-material/KeyboardArrowDownRounded";
import KeyboardArrowRightRounded from "@mui/icons-material/KeyboardArrowRightRounded";
import type {SectionHeaderProps} from "../ticker-query.types.ts";



export function SectionHeader({
    title,
    count,
    collapsible = false,
    expanded = false,
    onToggle,
}: SectionHeaderProps) {
    const content = (
        <>
            <Box
                sx={{
                    minWidth: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                }}
            >
                {collapsible && (
                    <IconButton
                        component="span"
                        size="small"
                        tabIndex={-1}
                        sx={{
                            p: 0,
                            pointerEvents: "none",
                            color: "text.secondary",
                        }}
                    >
                        {expanded ? (
                            <KeyboardArrowDownRounded
                                fontSize="small"
                            />
                        ) : (
                            <KeyboardArrowRightRounded
                                fontSize="small"
                            />
                        )}
                    </IconButton>
                )}

                <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: 1,
                    }}
                >
                    {title}
                </Typography>
            </Box>

            {typeof count === "number" && (
                <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                        flexShrink: 0,
                        fontWeight: 700,
                    }}
                >
                    {count}
                </Typography>
            )}
        </>
    );

    if (!collapsible) {
        return (
            <Box
                sx={{
                    minHeight: 32,
                    px: 0.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 1,
                    flexShrink: 0,
                }}
            >
                {content}
            </Box>
        );
    }

    return (
        <Box
            component="button"
            type="button"
            onClick={onToggle}
            aria-expanded={expanded}
            sx={{
                width: "100%",
                minHeight: 32,
                px: 0.5,
                py: 0.5,
                border: 0,
                borderRadius: 1,
                bgcolor: "transparent",
                color: "inherit",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 1,
                cursor: "pointer",
                textAlign: "left",
                flexShrink: 0,
                "&:hover": {
                    bgcolor: "action.hover",
                },
            }}
        >
            {content}
        </Box>
    );
}
