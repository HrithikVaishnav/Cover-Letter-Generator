import { Card, CardContent, Typography, Box, Button, Stack, TextField } from "@mui/material";
import React, { useState } from "react";
import CustomSnackbar from "./CustomSnackbar";

export default function CoverLetterOutput({ coverLetter }) {
  const [editableText, setEditableText] = useState(coverLetter || "");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

  // Sync prop updates into editable state
  React.useEffect(() => {
    setEditableText(coverLetter || "");
  }, [coverLetter]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(editableText);
      setSnackbar({ open: true, message: "Copied to clipboard!", severity: "success" });
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([editableText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "cover_letter.txt";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <Box>
      <Card sx={{ height: "100%" }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Generated Cover Letter
          </Typography>

          {/* Editable Cover Letter */}
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
              "& .MuiOutlinedInput-root": {
                alignItems: "flex-start",
              },
            }}
          />

          {/* Action Buttons */}
          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Button variant="contained" color="secondary" onClick={handleCopy}>
              Copy
            </Button>
            <Button variant="contained" color="success" onClick={handleDownload}>
              Download
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Snackbar */}
      <CustomSnackbar
        open={snackbar.open}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        severity={snackbar.severity}
        message={snackbar.message}
      />
    </Box>
  );
}
