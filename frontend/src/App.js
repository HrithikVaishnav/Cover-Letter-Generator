import "./App.css";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import CursorBubbles from "./components/CursorBubbles";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: { default: "transparent", paper: "#2b2b3c" },
    primary: { main: "#64b5f6" },
    secondary: { main: "#ffb74d" },
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <CursorBubbles />
      <div className="main-content" style={{ position: "relative", zIndex: 1 }}>
        <Header />
        <HomePage />
      </div>
    </ThemeProvider>

  );
}

export default App;
