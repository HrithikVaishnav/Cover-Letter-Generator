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
} from "@mui/material";
import { downloadPDF } from "../utils/pdfGenerator"; // adjust path

const SAMPLE_PARAS = [
  "I am excited to apply for the [Position] role at [Company]. With a strong background in software engineering and a passion for building scalable applications, I am confident in my ability to contribute effectively.",
  "In my previous roles, I’ve delivered features end-to-end, collaborated closely with designers and product managers, and improved code quality with tests and thoughtful reviews.",
  "Thank you for your time and consideration.",
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
  };

  const contentWrapper = {
    position: "relative",
    zIndex: 2,
    padding: "34px 34px 28px 44px",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    boxSizing: "border-box",
    color: "#111827",
    fontFamily: "Inter, Roboto, Helvetica, Arial, sans-serif",
    fontSize: "12px",
    lineHeight: 1.45,
    whiteSpace: "pre-line",
  };

  const accentCommon = { position: "absolute", zIndex: 1 };

  // Use content directly
  const textToRender =
    content && content.trim().length > 0 ? content : SAMPLE_PARAS.join("\n\n");
  const paragraphs = textToRender.split(/\n{1,}/).filter(Boolean);

  return (
    <Box sx={{ width: PAGE_W * SCALE, height: PAGE_H * SCALE, overflow: "hidden" }}>
      <Box sx={{ transform: `scale(${SCALE})`, transformOrigin: "top left" }}>
        <Box sx={pageBase}>
          {/* Accents */}
          {variant === "modern" && (
            <Box sx={{ ...accentCommon, left: 0, top: 0, bottom: 0, width: 6, bgcolor: "#1976d2" }} />
          )}
          {variant === "minimal" && (
            <Box sx={{ ...accentCommon, top: 0, left: 0, right: 0, height: 6, bgcolor: "#1976d2" }} />
          )}

          <Box sx={contentWrapper}>
            {/* Header (user name) */}
            <Typography sx={{ fontWeight: 700, mb: 1, fontSize: "13px", color: "#111827" }}>
              {userName}
            </Typography>

            {/* salutation + body */}
            {paragraphs.slice(0, 6).map((p, i) => (
              <Typography
                key={i}
                sx={{
                  mb: 1,
                  fontSize: "11px",
                  color: "#111827",
                  lineHeight: 1.45,
                  wordBreak: "break-word",
                  whiteSpace: "pre-line",
                }}
              >
                {p}
              </Typography>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

const TEMPLATES = [
  { id: "classic", name: "Classic" },
  { id: "modern", name: "Modern" },
  { id: "minimal", name: "Minimal" },
];

export default function DownloadModal({ open, onClose, content, userName }) {
  const [selected, setSelected] = useState(null);

  const handleDownload = () => {
    if (!selected) return;
    try {
      downloadPDF(content || SAMPLE_PARAS.join("\n\n"), selected, userName || "");
    } catch (err) {
      console.error("PDF generation failed", err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>Choose a Template</DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        <Stack direction="row" spacing={3} sx={{ overflowX: "auto", pb: 1, justifyContent: "center" }}>
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
                boxShadow: selected === t.id ? "0 8px 18px rgba(25,118,210,0.15)" : "0 4px 10px rgba(0,0,0,0.08)",
                bgcolor: "transparent",
                flex: "0 0 280px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                outline: selected === t.id ? "none" : undefined,
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
