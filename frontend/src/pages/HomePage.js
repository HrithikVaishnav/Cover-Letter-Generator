import {
    Grid,
    Card,
    CardContent,
    Typography,
    Box,
    CircularProgress,
  } from "@mui/material";
  import { motion } from "framer-motion";
  import { useState, useRef } from "react";
  import axios from "axios";
  
  import ResumeUpload from "../components/ResumeUpload";
  import JobDescriptionInput from "../components/JobDescriptionInput";
  import CommonButton from "../components/CommonButton";
  import CoverLetterOutput from "../components/CoverLetterOutput";
  
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  export default function HomePage() {
    const [resumeFile, setResumeFile] = useState(null);
    const [jobDescription, setJobDescription] = useState("");
    const [coverLetter, setCoverLetter] = useState("");
    const [loading, setLoading] = useState(false);
  
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
        alert("Please upload a resume and paste the job description.");
        return;
      }
  
      try {
        setLoading(true);
        setCoverLetter(""); // hide previous result
        // scroll to loader section right away
        requestAnimationFrame(() => smoothScrollTo(resultRef.current));
  
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
          }
        );
  
        setCoverLetter(coverResp.data.cover_letter);
        // after result arrives, ensure we scroll to it
        requestAnimationFrame(() => smoothScrollTo(resultRef.current));
      } catch (error) {
        console.error(error);
        alert("Error generating cover letter. Please check backend logs.");
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <Grid
        container
        spacing={2}
        sx={{
          p: { xs: 1.5, md: 2 },
          maxWidth: 1400,
          mx: "auto",
          // height: { xs: "auto", md: "calc(100vh - 64px)" }, // optional
        }}
      >
        {/* Input Section (always visible) */}
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
  
        {/* Result Section (loader first, then result) */}
        <Grid item xs={12} ref={resultRef} sx={{width: "100%" }}>
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
                  <CoverLetterOutput coverLetter={coverLetter} />
                </CardContent>
              </Card>
            </motion.div>
          )}
        </Grid>
      </Grid>
    );
  }
  