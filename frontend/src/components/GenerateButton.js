import { Button } from "@mui/material";

export default function GenerateButton({ onClick, loading, disabled }) {
  return (
    <Button
      variant="contained"
      color="primary"
      size="large"
      onClick={onClick}
      disabled={loading || disabled}
      sx={{
        px: 4,
        py: 1.5,
        fontWeight: "bold",
        borderRadius: "12px",
        textTransform: "none",
        transition: "all 0.3s ease-in-out",
      }}
    >
      {loading ? "Generating..." : "Generate"}
    </Button>
  );
}
