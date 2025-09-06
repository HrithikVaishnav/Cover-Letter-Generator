// components/DownloadModal.jsx
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Card,
  Typography,
  Box,
  Stack,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { downloadPDF } from "../utils/pdfGenerator"; // adjust path if needed

const SAMPLE_PARAS = [
  "I am excited to apply for the [Position] role at [Company]. With a strong background in software engineering and a passion for building scalable applications, I am confident in my ability to contribute effectively.",
  "In my previous roles, I’ve delivered features end-to-end, collaborated closely with designers and product managers, and improved code quality with tests and thoughtful reviews.",
  "Thank you for your time and consideration.",
];

const TEMPLATES = [
  { id: "classic", name: "Classic" },
  { id: "modern", name: "Modern" },
  { id: "minimal", name: "Minimal" },
];

function MiniPage({ variant, content, userName = "John Doe" }) {
  const PAGE_W = 520;
  const PAGE_H = Math.round(PAGE_W * 1.414);
  const SCALE = 0.52;

  const pageBase = {
    position: "relative",
    width: PAGE_W,
    height: PAGE_H,
    bgcolor: "white",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  };

  const contentWrapper = {
    position: "relative",
    zIndex: 2,
    padding: "40px 40px 36px 48px",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    boxSizing: "border-box",
    color: "#111827",
    fontFamily: "Inter, Roboto, Helvetica, Arial, sans-serif",
  };

  const textToRender = content && content.trim().length > 0 ? content : SAMPLE_PARAS.join("\n\n");
  const paragraphs = textToRender.split(/\n{1,}/).filter(Boolean);

  const fontForVariant =
    variant === "classic"
      ? "'Times New Roman', Times, serif"
      : variant === "minimal"
      ? "Courier, monospace"
      : "Helvetica, Arial, sans-serif";

  return (
    <Box sx={{ width: PAGE_W * SCALE, height: PAGE_H * SCALE, overflow: "hidden" }}>
      <Box sx={{ transform: `scale(${SCALE})`, transformOrigin: "top left" }}>
        <Box sx={pageBase}>
          {variant === "modern" && (
            <Box sx={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 6, bgcolor: "#1976d2" }} />
          )}
          {variant === "minimal" && (
            <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, height: 6, bgcolor: "#1976d2" }} />
          )}

          <Box sx={{ ...contentWrapper, fontFamily: fontForVariant }}>
            <Typography sx={{ fontWeight: 700, mb: 1, fontSize: 13, color: "#111827", textAlign: "left" }}>
              {userName}
            </Typography>

            <Box sx={{ flex: 1, overflow: "hidden", maxWidth: "75%" }}>
              {paragraphs.slice(0, 8).map((p, i) => (
                <Typography
                  key={i}
                  sx={{
                    mb: 1,
                    fontSize: 12,
                    color: "#111827",
                    lineHeight: 1.5,
                    wordBreak: "break-word",
                    whiteSpace: "pre-line",
                    textAlign: "left",
                  }}
                >
                  {p}
                </Typography>
              ))}
            </Box>

            <Box sx={{ mt: "auto" }}>
              <Typography sx={{ fontSize: 12, mb: 0.5 }}>Sincerely,</Typography>
              <Typography sx={{ fontSize: 12, fontWeight: 700 }}>{userName}</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default function DownloadModal({ open, onClose, content, userName }) {
  const [selected, setSelected] = useState(TEMPLATES[0].id);

  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));

  const handleDownload = () => {
    if (!selected) return;
    try {
      downloadPDF(content || SAMPLE_PARAS.join("\n\n"), selected, userName || "");
    } catch (err) {
      console.error("PDF generation failed", err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg" fullScreen={isSm}>
      <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        Choose a Template
        <IconButton onClick={onClose} edge="end">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        <Stack
          direction={isSm ? "column" : "row"}
          spacing={3}
          sx={{ pb: 1, justifyContent: "center", alignItems: "flex-start" }}
        >
          {TEMPLATES.map((t) => (
            <Card
              key={t.id}
              onClick={() => setSelected(t.id)}
              tabIndex={0}
              role="button"
              aria-pressed={selected === t.id}
              sx={{
                cursor: "pointer",
                p: 2,
                borderRadius: 3,
                border: selected === t.id ? "2px solid #1976d2" : "1px solid rgba(0,0,0,0.12)",
                boxShadow:
                  selected === t.id
                    ? "0 8px 18px rgba(25,118,210,0.15)"
                    : "0 4px 10px rgba(0,0,0,0.08)",
                bgcolor: "transparent",
                flex: isSm ? "0 0 100%" : "0 0 320px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 420,
                outline: selected === t.id ? "none" : undefined,
                transition: "transform 120ms ease",
                "&:hover": { transform: "translateY(-4px)" },
              }}
            >
              <Box>
                <MiniPage variant={t.id} content={content} userName={userName || "John Doe"} />
                <Typography align="center" sx={{ mt: 1, fontWeight: 600 }}>
                  {t.name}
                </Typography>
              </Box>
            </Card>
          ))}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button variant="contained" disabled={!selected} onClick={handleDownload}>
          Download PDF
        </Button>
      </DialogActions>
    </Dialog>
  );
}
