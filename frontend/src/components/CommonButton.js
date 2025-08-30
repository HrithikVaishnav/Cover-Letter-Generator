import { Button, CircularProgress, Box } from "@mui/material";
import { motion, useAnimation } from "framer-motion";
import { useState } from "react";

export default function CommonButton({ onClick, disabled, loading, label }) {
  const [hover, setHover] = useState(false);

  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      onHoverStart={() => setHover(true)}
      onHoverEnd={() => setHover(false)}
      style={{ display: "inline-block" }}
    >
      <Button
        onClick={onClick}
        disabled={disabled || loading}
        sx={{
          position: "relative",
          overflow: "hidden",
          px: 4,
          py: 1.5,
          borderRadius: "12px",
          fontWeight: "bold",
          textTransform: "none",
          backgroundColor: "#1976d2",
          color: "#fff",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
        }}
      >
        {/* Hover overlay */}
        <motion.div
          animate={{ width: hover ? "100%" : "0%" }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            backgroundColor: "#64b5f6",
            zIndex: 0,
          }}
        />
        {/* Button label */}
        <Box
          sx={{
            position: "relative",
            zIndex: 1,
            color: hover ? "#1976d2" : "#fff",
            transition: "color 0.4s ease-in-out",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : label}
        </Box>
      </Button>
    </motion.div>
  );
}
