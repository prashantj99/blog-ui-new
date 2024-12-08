// src/components/Sidebar.jsx
import { Navigation } from "./Navigation";
import Box from "@mui/material/Box/Box.js";

const Sidebar = () => {
  return (
    <Box
      flex={1}
      p={2}
      sx={{
        display: { xs: "none", sm: "block" },
        position: "sticky",
        top: 0,
        height: "100vh",
        backgroundColor: "white",
        boxShadow: 2,
        borderRadius: "8px",
        overflowY: "auto",
      }}
    >
      <Box position="fixed">
        <Navigation />
      </Box>
    </Box>
  );
};

export default Sidebar;
