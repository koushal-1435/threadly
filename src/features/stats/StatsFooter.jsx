import { Box, Typography } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import ArticleIcon from "@mui/icons-material/Article";
import { useEffect, useState } from "react";
import { subscribeToStats } from "./stats.service";
import "./StatsFooter.css";

export default function StatsFooter() {
  const [stats, setStats] = useState({ users: 0, posts: 0 });

  useEffect(() => {
    const unsubscribe = subscribeToStats(setStats);
    return unsubscribe;
  }, []);

  return (
    <Box className="stats-footer">
      <Box className="stats-item">
        <PeopleIcon className="stats-icon" />
        <Box className="stats-content">
          <Typography className="stats-number">{stats.users}</Typography>
          <Typography className="stats-label">
            {stats.users === 1 ? "User" : "Users"} Logged In
          </Typography>
        </Box>
      </Box>
      
      <Box className="stats-divider" />
      
      <Box className="stats-item">
        <ArticleIcon className="stats-icon" />
        <Box className="stats-content">
          <Typography className="stats-number">{stats.posts}</Typography>
          <Typography className="stats-label">
            {stats.posts === 1 ? "Post" : "Posts"} Created
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}