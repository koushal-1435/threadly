import { Box, Paper, Typography, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Button } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import StarIcon from "@mui/icons-material/Star";
import AddIcon from "@mui/icons-material/Add";

const communities = [
  { name: "Home", icon: HomeIcon },
  { name: "Popular", icon: TrendingUpIcon },
  { name: "All", icon: StarIcon },
];

export default function LeftSidebar() {
  return (
    <Box
      sx={{
        position: "sticky",
        top: 64,
        height: "fit-content",
        maxWidth: 240,
      }}
    >
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
        <List sx={{ p: 1 }}>
          {communities.map((community, index) => (
            <ListItem key={community.name} disablePadding>
              <ListItemButton
                sx={{
                  py: 1.5,
                  px: 2,
                  borderRadius: "12px",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    background: index === 0 
                      ? "rgba(99, 102, 241, 0.2)" 
                      : "rgba(255, 255, 255, 0.05)",
                    transform: "translateX(4px)",
                  },
                  ...(index === 0 && {
                    background: "linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)",
                    borderLeft: "3px solid #6366f1",
                  }),
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: "8px",
                      background: index === 0 
                        ? "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"
                        : "rgba(255, 255, 255, 0.05)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <community.icon
                      sx={{
                        color: index === 0 ? "#ffffff" : "#94a3b8",
                        fontSize: 18,
                      }}
                    />
                  </Box>
                </ListItemIcon>
                <ListItemText
                  primary={community.name}
                  primaryTypographyProps={{
                    sx: {
                      color: index === 0 ? "#f1f5f9" : "#cbd5e1",
                      fontSize: "0.9375rem",
                      fontWeight: index === 0 ? 600 : 500,
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.1)", my: 1, mx: 1 }} />

        <Box sx={{ px: 2, pb: 2 }}>
          <Typography
            sx={{
              color: "#94a3b8",
              fontSize: "0.75rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              mb: 1.5,
            }}
          >
            Communities
          </Typography>
          <Button
            fullWidth
            startIcon={<AddIcon />}
            sx={{
              background: "rgba(99, 102, 241, 0.1)",
              color: "#cbd5e1",
              textTransform: "none",
              borderRadius: "12px",
              py: 1.25,
              border: "1px solid rgba(99, 102, 241, 0.3)",
              transition: "all 0.2s ease",
              "&:hover": {
                background: "rgba(99, 102, 241, 0.2)",
                borderColor: "#6366f1",
                transform: "translateY(-2px)",
                boxShadow: "0 4px 12px rgba(99, 102, 241, 0.2)",
              },
            }}
          >
            Create Community
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
