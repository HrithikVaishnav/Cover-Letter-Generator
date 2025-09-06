// src/pages/HomePage.jsx
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import { motion } from "framer-motion";
import { useState, useRef } from "react";
import axios from "axios";

import ResumeUpload from "../components/ResumeUpload";
import JobDescriptionInput from "../components/JobDescriptionInput";
import CommonButton from "../components/CommonButton";
import CoverLetterOutput from "../components/CoverLetterOutput";
import CustomSnackbar from "../components/CustomSnackbar";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export default function HomePage() {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });
  const [wordLimit, setWordLimit] = useState(250); // default value

  const resultRef = useRef(null);
  const APP_BAR_HEIGHT = 64; // adjust if your header height differs

  const smoothScrollTo = (el) => {
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - APP_BAR_HEIGHT - 8;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  const handleFileChange = (e) => {
    setResumeFile(e.target.files[0]);
  };

  const handleGenerate = async () => {
    if (!resumeFile || !jobDescription) {
      setSnackbar({
        open: true,
        message: "Please upload a resume and paste the job description.",
        severity: "warning",
      });
      return;
    }

    // Frontend validation for job description length (min 20 words)
    if (jobDescription.trim().split(/\s+/).length < 20) {
      setSnackbar({
        open: true,
        message: "Job description must be at least 20 words.",
        severity: "error",
      });
      return;
    }

    try {
      setLoading(true);
      setCoverLetter(""); // hide previous result while generating
      // scroll to result area
      requestAnimationFrame(() => smoothScrollTo(resultRef.current));

      // upload resume file
      const formData = new FormData();
      formData.append("file", resumeFile);

      const resumeResp = await axios.post(
        `${API_BASE_URL}/resume/upload`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const resumeText = resumeResp.data.resume_text;

      const coverResp = await axios.post(
        `${API_BASE_URL}/cover-letter/generate`,
        {
          resume_text: resumeText,
          job_description: jobDescription,
          word_limit: wordLimit,
        }
      );

      // set generated cover letter
      setCoverLetter(coverResp.data.cover_letter);

      // set userName from backend if provided (but user can edit below)
      // fall back to empty string if backend didn't provide one
      setUserName(coverResp.data.user_name || "");

      setSnackbar({
        open: true,
        message: "Cover letter generated successfully!",
        severity: "success",
      });

      // ensure we scroll to the result now that it's visible
      requestAnimationFrame(() => smoothScrollTo(resultRef.current));
    } catch (error) {
      console.error(error);
      setSnackbar({
        open: true,
        message: "Error generating cover letter. Please check backend logs.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Grid
        container
        spacing={2}
        sx={{
          p: { xs: 1.5, md: 2 },
          maxWidth: 1400,
          mx: "auto",
        }}
      >
        {/* Input Section */}
        <Grid item xs={12} sx={{ width: "100%" }}>
          <Card sx={{ display: "flex", flexDirection: "column", borderRadius: 5 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Input
              </Typography>

              <ResumeUpload resumeFile={resumeFile} onFileChange={handleFileChange} />

              <Box sx={{ mt: 2 }}>
                <JobDescriptionInput
                  jobDescription={jobDescription}
                  setJobDescription={setJobDescription}
                />
              </Box>

              {/* Word limit dropdown */}
              <Box sx={{ mt: 2 }}>
                <FormControl fullWidth>
                  <InputLabel id="word-limit-label">Word Limit</InputLabel>
                  <Select
                    labelId="word-limit-label"
                    value={wordLimit}
                    onChange={(e) => setWordLimit(e.target.value)}
                  >
                    {[100, 150, 200, 250, 300].map((val) => (
                      <MenuItem key={val} value={val}>
                        ~{val} words
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <Box sx={{ mt: 2 }}>
                <CommonButton
                  onClick={handleGenerate}
                  disabled={!resumeFile || !jobDescription}
                  loading={loading}
                  label="Generate"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Result Section */}
        <Grid item xs={12} ref={resultRef} sx={{ width: "100%" }}>
          {loading && (
            <Card aria-live="polite" sx={{ borderRadius: 5 }}>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    py: 3,
                    justifyContent: "center",
                  }}
                >
                  <CircularProgress />
                  <Typography>Generating your cover letter…</Typography>
                </Box>
              </CardContent>
            </Card>
          )}

          {!loading && coverLetter && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <Card sx={{ borderRadius: 5 }}>
                <CardContent>
                  {/* Show an editable name input so the user can correct backend-detected name */}
                  <Box sx={{ ml: 2, mb: 2, display: "flex", gap: 4, alignItems: "center", flexWrap: "wrap" }}>
                    <TextField
                      label="Name (edit if incorrect)"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      size="small"
                      sx={{ minWidth: 220, flex: "0 1 320px" }}
                      placeholder="e.g. John Doe"
                    />
                  </Box>

                  {/* Cover letter output component (passes userName through) */}
                  <CoverLetterOutput coverLetter={coverLetter} userName={userName} />
                </CardContent>
              </Card>
            </motion.div>
          )}
        </Grid>
      </Grid>

      {/* Snackbar */}
      <CustomSnackbar
        open={snackbar.open}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        severity={snackbar.severity}
        message={snackbar.message}
      />
    </>
  );
}
