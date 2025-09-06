import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from "@mui/material";
import { downloadPDF } from "../utils/pdfGenerator";

const templates = [
  { id: "classic", name: "Classic", desc: "Traditional, serif-based style" },
  { id: "modern", name: "Modern", desc: "Bold heading with clean look" },
  { id: "minimal", name: "Minimal", desc: "Light, centered design" },
];

export default function DownloadModal({ open, onClose, content }) {
  const [selected, setSelected] = useState(null);

  const handleDownload = () => {
    if (selected) {
      downloadPDF(content, selected);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Choose a Template</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          {templates.map((t) => (
            <Grid item xs={12} sm={4} key={t.id}>
              <Card
                variant="outlined"
                sx={{
                  border:
                    selected === t.id ? "2px solid #1976d2" : "1px solid #ccc",
                }}
              >
                <CardActionArea onClick={() => setSelected(t.id)}>
                  <CardContent sx={{ textAlign: "center" }}>
                    <div
                      style={{
                        height: 100,
                        backgroundColor: "#f5f5f5",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 8,
                        fontSize: 12,
                        color: "#777",
                      }}
                    >
                      {t.name} Preview
                    </div>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: "bold", mt: 1 }}
                    >
                      {t.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t.desc}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleDownload}
          variant="contained"
          disabled={!selected}
        >
          Download PDF
        </Button>
      </DialogActions>
    </Dialog>
  );
}
