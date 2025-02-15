import React, { useState } from "react";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

interface CustomChipProps {
    text: string;
    onDelete: () => void;
}

const CustomChip: React.FC<CustomChipProps> = ({ text, onDelete }) => {
    const [hovered, setHovered] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
    };

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#f5f5f5",
                borderRadius: "12px",
                px: 2,
                py: 1,
                maxWidth: "fit-content",
                fontSize: "0.85rem",
                position: "relative", // به کانتینر position relative می‌دهیم
                transition: "all 0.2s ease",
                "&:hover": { backgroundColor: "#e0e0e0" },
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}>
            {hovered && (
                <Stack
                    color="white"
                    sx={{
                        ml: 1,
                        // backgroundColor: "white", // بک‌گراند سفید
                        position: "absolute", // دکمه کپی به صورت absolute قرار می‌گیرد
                        left: "0", // فاصله از لبه راست
                    }}
                    flexDirection="row"
                    gap={1}>
                    <IconButton
                        color="info"
                        size="small"
                        onClick={handleCopy}
                        sx={{
                            backgroundColor: "lightgray", // پس‌زمینه خاکی برای دکمه کپی
                            borderRadius: "8px", // گوشه‌های گرد برای دکمه
                            "&:hover": { backgroundColor: "skyblue" }, // تغییر رنگ در هاور
                        }}>
                        <ContentCopyIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                        color="error"
                        size="small"
                        onClick={onDelete}
                        sx={{
                            backgroundColor: "lightgray", // پس‌زمینه خاکی برای دکمه کپی
                            //backgroundColor: "lightcoral", // پس‌زمینه قرمز برای دکمه حذف
                            borderRadius: "8px", // گوشه‌های گرد برای دکمه
                            "&:hover": { backgroundColor: "#f08080" }, // تغییر رنگ در هاور
                        }}>
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Stack>
            )}

            {/* متن پیام */}
            <Typography variant="body2" sx={{ flexGrow: 1, whiteSpace: "nowrap", px: 1 }}>
                {text}
            </Typography>

            {/* دکمه کپی (فقط در زمان هاور) */}
        </Box>
    );
};

export default CustomChip;
