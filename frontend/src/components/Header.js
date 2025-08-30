import { AppBar, Toolbar, Typography } from "@mui/material";

export default function Header() {
  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          AI Cover Letter Generator
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
