import {
    Box,
    Button,
    CircularProgress,
    Divider,
    Paper,
    TextField,
    Typography,
} from "@mui/material";

import SmartToyIcon from "@mui/icons-material/SmartToy";
import { useState } from "react";
import { askRagQuestion } from "../services/companyService";

type AskAIPanelProps = {
    ticker: string | null;
};

type Source = {
    chunk_id: number;
    filing_id: number;
    chunk_index: number;
    text_preview: string;
};

type ChatMessage = {
    role: "user" | "assistant";
    content: string;
    sources?: Source[];
};

export default function AskAIPanel({ ticker }: AskAIPanelProps) {
    const [question, setQuestion] = useState("");
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState(false);

    async function handleAsk() {
        const trimmedQuestion = question.trim();

        if (!trimmedQuestion || loading) return;

        setQuestion("");
        setLoading(true);

        setMessages((prev) => [
            ...prev,
            {
                role: "user",
                content: trimmedQuestion,
            },
        ]);

        try {
            const data = await askRagQuestion(trimmedQuestion, ticker);

            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: data.answer ?? "No answer returned.",
                    sources: data.sources ?? [],
                },
            ]);
        } catch (error) {
            console.error(error);

            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: "Failed to generate an answer.",
                },
            ]);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Paper
            sx={{
                height: "100%",
                minHeight: 0,
                p: 1.25,
                display: "flex",
                flexDirection: "column",
                borderRadius: 1,
                border: "1px solid #1f2937",
                overflow: "hidden",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 0.75,
                }}
            >
                <SmartToyIcon fontSize="small" />

                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                        Ask AI
                    </Typography>

                    <Typography variant="caption" color="text.secondary">
                        SEC filing answers {ticker ? `for ${ticker}` : ""}
                    </Typography>
                </Box>
            </Box>

            <Box
                sx={{
                    flex: 1,
                    minHeight: 0,
                    overflowY: "auto",
                    bgcolor: "background.default",
                    border: "1px solid #1f2937",
                    borderRadius: 1,
                    p: 0.9,
                    display: "flex",
                    flexDirection: "column",
                    gap: 0.75,
                }}
            >
                {messages.length === 0 && !loading && (
                    <Typography variant="body2" color="text.secondary">
                        Ask about risks, employees, revenue, margins, cash flow, MD&amp;A, or SEC filings.
                    </Typography>
                )}

                {messages.map((message, index) => (
                    <Box
                        key={index}
                        sx={{
                            alignSelf:
                                message.role === "user"
                                    ? "flex-end"
                                    : "flex-start",
                            maxWidth: message.role === "user" ? "78%" : "94%",
                            px: 1.15,
                            py: 0.8,
                            borderRadius: 2,
                            bgcolor:
                                message.role === "user"
                                    ? "primary.main"
                                    : "#111827",
                            border:
                                message.role === "assistant"
                                    ? "1px solid #1f2937"
                                    : "none",
                        }}
                    >
                        <Typography
                            variant="body2"
                            sx={{
                                whiteSpace: "pre-wrap",
                                lineHeight: 1.4,
                            }}
                        >
                            {message.content}
                        </Typography>

                        {message.role === "assistant" &&
                            message.sources &&
                            message.sources.length > 0 && (
                                <Box sx={{ mt: 0.75 }}>
                                    <Divider sx={{ mb: 0.5 }} />

                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        sx={{
                                            display: "block",
                                            mb: 0.4,
                                            fontWeight: 700,
                                        }}
                                    >
                                        Sources
                                    </Typography>

                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: "row",
                                            gap: 0.5,
                                            overflowX: "auto",
                                            pb: 0.25,
                                        }}
                                    >
                                        {message.sources.map((source, i) => (
                                            <Box
                                                key={source.chunk_id}
                                                sx={{
                                                    minWidth: 220,
                                                    maxWidth: 260,
                                                    p: 0.65,
                                                    borderRadius: 1,
                                                    bgcolor: "rgba(255,255,255,0.03)",
                                                    border: "1px solid #1f2937",
                                                    flexShrink: 0,
                                                }}
                                            >
                                                <Typography
                                                    variant="caption"
                                                    sx={{
                                                        display: "block",
                                                        fontWeight: 700,
                                                        mb: 0.25,
                                                    }}
                                                >
                                                    Source {i + 1} · Filing{" "}
                                                    {source.filing_id} · Chunk{" "}
                                                    {source.chunk_index}
                                                </Typography>

                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                    sx={{
                                                        display: "-webkit-box",
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: "vertical",
                                                        overflow: "hidden",
                                                        lineHeight: 1.3,
                                                    }}
                                                >
                                                    {source.text_preview}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Box>
                                </Box>
                            )}
                    </Box>
                ))}

                {loading && (
                    <Box
                        sx={{
                            alignSelf: "flex-start",
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            px: 1.15,
                            py: 0.75,
                            borderRadius: 2,
                            bgcolor: "#111827",
                            border: "1px solid #1f2937",
                        }}
                    >
                        <CircularProgress size={14} />
                        <Typography variant="caption" color="text.secondary">
                            Searching filings...
                        </Typography>
                    </Box>
                )}
            </Box>

            <Box
                sx={{
                    display: "flex",
                    gap: 1,
                    mt: 0.75,
                }}
            >
                <TextField
                    fullWidth
                    size="small"
                    placeholder={
                        ticker
                            ? `Ask about ${ticker}...`
                            : "Select a company first..."
                    }
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleAsk();
                        }
                    }}
                />

                <Button
                    variant="contained"
                    onClick={handleAsk}
                    disabled={loading || !question.trim()}
                    sx={{
                        minWidth: 64,
                    }}
                >
                    {loading ? <CircularProgress size={16} /> : "Ask"}
                </Button>
            </Box>
        </Paper>
    );
}