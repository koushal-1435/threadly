import { Box, Paper, Typography, List, ListItem, ListItemText, Divider, IconButton } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const trendingTopics = [
  { title: "Welcome to Threadly", subreddit: "r/threadly", upvotes: "2.1k" },
  { title: "Getting Started Guide", subreddit: "r/help", upvotes: "1.8k" },
  { title: "New Features Released", subreddit: "r/announcements", upvotes: "1.5k" },
];

export default function RightSidebar() {
  return (
    <Box
      sx={{
        position: "sticky",
        top: 64,
        height: "fit-content",
        maxWidth: 312,
      }}
    >
      {/* About Card */}
      <Paper
        elevation={0}
        sx={{
          background: "rgba(30, 30, 40, 0.6)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "16px",
          mb: 2,
          overflow: "hidden",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
        }}
      >
        <Box
          sx={{
            background: "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)",
            p: 2.5,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <InfoOutlinedIcon sx={{ color: "#ffffff", fontSize: 22 }} />
          <Typography
            sx={{
              color: "#ffffff",
              fontSize: "0.9375rem",
              fontWeight: 700,
            }}
          >
            About Threadly
          </Typography>
        </Box>
        <Box sx={{ p: 2.5 }}>
          <Typography
            sx={{
              color: "#cbd5e1",
              fontSize: "0.875rem",
              lineHeight: 1.6,
            }}
          >
            A modern discussion platform. Share your thoughts, upvote
            content you like, and engage with the community.
          </Typography>
        </Box>
      </Paper>

      {/* Trending Topics */}
      <Paper
        elevation={0}
        sx={{
          background: "rgba(30, 30, 40, 0.6)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
        }}
      >
        <Box
          sx={{
            background: "rgba(99, 102, 241, 0.1)",
            p: 2.5,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: "8px",
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TrendingUpIcon sx={{ color: "#ffffff", fontSize: 18 }} />
          </Box>
          <Typography
            sx={{
              color: "#f1f5f9",
              fontSize: "0.9375rem",
              fontWeight: 700,
            }}
          >
            Trending Today
          </Typography>
        </Box>
        <List sx={{ p: 1 }}>
          {trendingTopics.map((topic, index) => (
            <Box key={index}>
              <ListItem
                sx={{
                  py: 1.5,
                  px: 2,
                  borderRadius: "12px",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    background: "rgba(255, 255, 255, 0.05)",
                    transform: "translateX(4px)",
                  },
                  cursor: "pointer",
                }}
              >
                <ListItemText
                  primary={
                    <Typography
                      sx={{
                        color: "#f1f5f9",
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        mb: 0.5,
                      }}
                    >
                      {topic.title}
                    </Typography>
                  }
                  secondary={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography
                        sx={{
                          color: "#94a3b8",
                          fontSize: "0.75rem",
                        }}
                      >
                        {topic.subreddit}
                      </Typography>
                      <Typography
                        sx={{
                          color: "#94a3b8",
                          fontSize: "0.75rem",
                        }}
                      >
                        • {topic.upvotes} upvotes
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
              {index < trendingTopics.length - 1 && (
                <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.1)", mx: 2 }} />
              )}
            </Box>
          ))}
        </List>
      </Paper>
    </Box>
  );
}
