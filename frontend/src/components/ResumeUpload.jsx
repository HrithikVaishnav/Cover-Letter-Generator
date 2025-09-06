import { Button, Typography } from "@mui/material";

export default function ResumeUpload({ resumeFile, onFileChange }) {
  return (
    <>
      <Button
        variant="contained"
        component="label"
        sx={{ mb: 1 }}
      >
        Upload Resume (PDF/DOCX)
        <input
          type="file"
          hidden
          accept=".pdf,.docx"
          onChange={onFileChange}
        />
      </Button>

      {resumeFile && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          📄 {resumeFile.name}
        </Typography>
      )}
    </>
  );
}
