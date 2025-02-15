import React, { useState } from "react";
import { Box, Paper, IconButton, Tooltip, Stack } from "@mui/material";
import CustomChip from "./components/custom-chip";
import TextBox from "./components/text-box"; // به‌روز شده
import DeleteIcon from "@mui/icons-material/Delete";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

const SpeechToTextChat = () => {
    const [finalMessage, setFinalMessage] = useState<string[]>([]); // لیست پیام‌های نهایی
    const [isRecording, setIsRecording] = useState(false); // وضعیت ضبط

    const handleSend = (text: string) => {
        setFinalMessage((prev) => [...prev, text]);
    };

    const handleDeleteMessage = (index: number) => {
        setFinalMessage((prev) => prev.filter((_, i) => i !== index));
    };

    const handleDeleteAllMessages = () => {
        setFinalMessage([]);
    };

    const handleCopyAllMessages = () => {
        navigator.clipboard.writeText(finalMessage.join("\n"));
    };

    return (
        <Stack flexDirection="column" height="98vh" spacing={2} p={0} m={0} dir="rtl">
            {/* نمایش پیام‌های نهایی */}
            <Paper
                elevation={3}
                sx={{
                    p: 2,
                    minHeight: "100px",
                    display: "flex",
                    flexWrap: "wrap", // برای اینکه چیپ‌ها در کنار هم قرار بگیرند و در صورت نیاز به ردیف بعدی منتقل شوند
                    gap: 1,
                    position: "relative", // برای قرار دادن دکمه‌ها در موقعیت مناسب
                    flexGrow: 1,
                    justifyContent: "start", // برای چینش چیپ‌ها از بالا
                    alignItems: "start", // چینش چیپ‌ها در ابتدای هر ردیف
                    overflowY: "auto",
                    "&:hover .action-buttons": { opacity: 1 }, // وقتی هاور می‌کنیم دکمه‌ها ظاهر شوند
                }}>
                {/* دکمه‌های حذف و کپی در بالای سمت چپ */}
                <Box
                    className="action-buttons"
                    sx={{
                        position: "absolute",
                        top: 8,
                        left: 8,
                        display: "flex",
                        gap: 1,
                        opacity: 0, // دکمه‌ها پنهان هستند تا هاور نشوند
                        transition: "opacity 0.3s ease",
                    }}>
                    <Tooltip title="حذف همه پیام‌ها">
                        <IconButton onClick={handleDeleteAllMessages} color="error" sx={{ borderRadius: 2 }}>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="کپی همه پیام‌ها">
                        <IconButton onClick={handleCopyAllMessages} color="primary" sx={{ borderRadius: 2 }}>
                            <ContentCopyIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
                <Stack flexDirection="row" justifyContent="start" alignItems="center" gap={1} flexWrap="wrap">
                    {finalMessage.map((m, index) => (
                        <CustomChip key={index} text={m} onDelete={() => handleDeleteMessage(index)} />
                    ))}
                </Stack>
            </Paper>

            {/* استفاده از کامپوننت TextBox */}
            <TextBox onSend={handleSend} onRecord={setIsRecording} isRecording={isRecording} />
        </Stack>
    );
};

export default SpeechToTextChat;
