// components/CoverLetterOutput.jsx
import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, Box, Button, Stack, TextField } from "@mui/material";
import CustomSnackbar from "./CustomSnackbar";
import DownloadModal from "./DownloadModal";

/**
 * If you have a logged-in user's name, pass it as userName prop:
 * <CoverLetterOutput coverLetter={text} userName={currentUser?.fullName} />
 */
export default function CoverLetterOutput({ coverLetter, userName }) {
  const [editableText, setEditableText] = useState(coverLetter || "");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    setEditableText(coverLetter || "");
  }, [coverLetter]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(editableText);
      setSnackbar({ open: true, message: "Copied to clipboard!", severity: "success" });
    } catch (err) {
      console.error("Failed to copy:", err);
      setSnackbar({ open: true, message: "Copy failed", severity: "error" });
    }
  };

  return (
    <Box>
      <Card sx={{ height: "100%" }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Generated Cover Letter
          </Typography>

          <TextField
            multiline
            fullWidth
            rows={18}
            variant="outlined"
            value={editableText}
            onChange={(e) => setEditableText(e.target.value)}
            sx={{
              backgroundColor: "background.paper",
              borderRadius: "8px",
              "& .MuiOutlinedInput-root": { alignItems: "flex-start" },
            }}
          />

          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Button variant="contained" color="secondary" onClick={handleCopy}>
              Copy
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={() => setModalOpen(true)}
              disabled={!editableText || editableText.trim().length === 0}
            >
              Download
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <CustomSnackbar
        open={snackbar.open}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        severity={snackbar.severity}
        message={snackbar.message}
      />

      {/* pass userName prop if available, otherwise modal will fallback to John Doe */}
      <DownloadModal open={modalOpen} onClose={() => setModalOpen(false)} content={editableText} userName={userName} />
    </Box>
  );
}
