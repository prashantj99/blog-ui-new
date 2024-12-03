// src/components/Sidebar.jsx
import { Navigation } from "./Navigation";
import BlogFeedContext from "../context/BlogFeedContext";
import useAuth from "../hooks/useAuth";
import Box from "@mui/material/Box/Box.js";
import { useContext } from "react";

const Sidebar = () => {
  const { changeFeedType } = useContext(BlogFeedContext);
  const { auth } = useAuth();

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
        {/* Using the Navigation component */}
        <Navigation auth={auth} changeFeedType={changeFeedType} />
      </Box>
    </Box>
  );
};

export default Sidebar;
