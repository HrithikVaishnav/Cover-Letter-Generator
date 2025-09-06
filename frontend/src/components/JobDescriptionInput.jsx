import { TextField } from "@mui/material";

export default function JobDescriptionInput({ jobDescription, setJobDescription }) {
  return (
    <TextField
      label="Job Description"
      multiline
      rows={10}
      fullWidth
      variant="outlined"
      value={jobDescription}
      onChange={(e) => setJobDescription(e.target.value)}
      sx={{ mb: 2 }}
    />
  );
}
