import {
  Paper,
  Typography,
  IconButton,
  Box,
  Button,
} from "@mui/material";
import ArrowUpwardRounded from "@mui/icons-material/ArrowUpwardRounded";
import ArrowDownwardRounded from "@mui/icons-material/ArrowDownwardRounded";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ShareIcon from "@mui/icons-material/Share";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { voteOnPost } from "./post.service";
import { useAuth } from "../../auth/useAuth";
import { loginWithGoogle } from "../../firebase/auth";
import { useState } from "react";

export default function PostCard({ post }) {
  const { user } = useAuth();
  const [userVote, setUserVote] = useState(0); // Track user's current vote

  const handleVote = async (value) => {
    if (!user) {
      loginWithGoogle();
      return;
    }

    try {
      await voteOnPost({
        postId: post.id,
        userId: user.uid,
        voteValue: value,
      });
      // Update local vote state
      if (userVote === value) {
        setUserVote(0); // Toggle off
      } else {
        setUserVote(value); // Set new vote
      }
    } catch (err) {
      console.error("Vote failed", err);
    }
  };

  const score = (post.upvotes || 0) - (post.downvotes || 0);
  const formatScore = (num) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + "k";
    return num.toString();
  };

  // Format time ago
  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return "just now";
    
    // Handle Firestore Timestamp
    const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return "just now";
    if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
    }
    if (seconds < 86400) {
      const hours = Math.floor(seconds / 3600);
      return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
    }
    if (seconds < 604800) {
      const days = Math.floor(seconds / 86400);
      return `${days} ${days === 1 ? "day" : "days"} ago`;
    }
    if (seconds < 2592000) {
      const weeks = Math.floor(seconds / 604800);
      return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
    }
    if (seconds < 31536000) {
      const months = Math.floor(seconds / 2592000);
      return `${months} ${months === 1 ? "month" : "months"} ago`;
    }
    const years = Math.floor(seconds / 31536000);
    return `${years} ${years === 1 ? "year" : "years"} ago`;
  };

  return (
    <Paper
      elevation={0}
      sx={{
        background: "rgba(30, 30, 40, 0.6)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: "16px",
        mb: 2.5,
        overflow: "hidden",
        display: "flex",
        transition: "all 0.3s ease",
        boxShadow: "0 4px 24px rgba(0, 0, 0, 0.2)",
        "&:hover": {
          borderColor: "rgba(99, 102, 241, 0.5)",
          boxShadow: "0 8px 32px rgba(99, 102, 241, 0.2)",
          transform: "translateY(-2px)",
        },
      }}
    >
      {/* Voting Section (Left) */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          background: "rgba(20, 20, 30, 0.6)",
          py: 1.5,
          px: 1,
          borderRight: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <IconButton
          onClick={() => handleVote(1)}
          sx={{
            color: userVote === 1 ? "#6366f1" : "#94a3b8",
            padding: "6px",
            transition: "all 0.2s ease",
            "&:hover": {
              background: "rgba(99, 102, 241, 0.1)",
              color: "#6366f1",
              transform: "scale(1.1)",
            },
          }}
        >
          <ArrowUpwardRounded sx={{ fontSize: 22 }} />
        </IconButton>

        <Typography
          sx={{
            color: userVote === 1 ? "#6366f1" : userVote === -1 ? "#ec4899" : "#cbd5e1",
            fontSize: "0.875rem",
            fontWeight: 700,
            py: 0.75,
            minWidth: "32px",
            textAlign: "center",
            transition: "color 0.2s ease",
          }}
        >
          {formatScore(Math.abs(score))}
        </Typography>

        <IconButton
          onClick={() => handleVote(-1)}
          sx={{
            color: userVote === -1 ? "#ec4899" : "#94a3b8",
            padding: "6px",
            transition: "all 0.2s ease",
            "&:hover": {
              background: "rgba(236, 72, 153, 0.1)",
              color: "#ec4899",
              transform: "scale(1.1)",
            },
          }}
        >
          <ArrowDownwardRounded sx={{ fontSize: 22 }} />
        </IconButton>
      </Box>

      {/* Content Section (Right) */}
      <Box sx={{ flex: 1, p: 2.5 }}>
        {/* Post Header */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5, flexWrap: "wrap" }}>
          <Typography
            sx={{
              color: "#6366f1",
              fontSize: "0.8125rem",
              fontWeight: 600,
            }}
          >
            r/threadly
          </Typography>
          <Typography
            sx={{
              color: "#64748b",
              fontSize: "0.8125rem",
            }}
          >
            •
          </Typography>
          <Typography
            sx={{
              color: "#94a3b8",
              fontSize: "0.8125rem",
            }}
          >
            Posted by u/{post.authorName || "anonymous"}
          </Typography>
          {post.createdAt && (
            <>
              <Typography
                sx={{
                  color: "#64748b",
                  fontSize: "0.8125rem",
                }}
              >
                •
              </Typography>
              <Typography
                sx={{
                  color: "#94a3b8",
                  fontSize: "0.8125rem",
                }}
              >
                {formatTimeAgo(post.createdAt)}
              </Typography>
            </>
          )}
        </Box>

        {/* Post Title */}
        <Typography
          variant="h6"
          sx={{
            color: "#f1f5f9",
            fontSize: "1.25rem",
            fontWeight: 600,
            mb: 1.5,
            lineHeight: 1.4,
            letterSpacing: "-0.01em",
          }}
        >
          {post.title}
        </Typography>

        {/* Post Content */}
        {post.content && (
          <Typography
            sx={{
              color: "#cbd5e1",
              fontSize: "0.9375rem",
              lineHeight: 1.6,
              mb: 2.5,
            }}
          >
            {post.content}
          </Typography>
        )}

        {/* Action Buttons */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Button
            startIcon={<ChatBubbleOutlineIcon sx={{ fontSize: 18 }} />}
            sx={{
              color: "#94a3b8",
              textTransform: "none",
              fontSize: "0.8125rem",
              fontWeight: 600,
              px: 2,
              py: 0.75,
              minWidth: "auto",
              borderRadius: "8px",
              transition: "all 0.2s ease",
              "&:hover": {
                background: "rgba(99, 102, 241, 0.1)",
                color: "#6366f1",
              },
            }}
          >
            Comments
          </Button>
          <Button
            startIcon={<ShareIcon sx={{ fontSize: 18 }} />}
            sx={{
              color: "#94a3b8",
              textTransform: "none",
              fontSize: "0.8125rem",
              fontWeight: 600,
              px: 2,
              py: 0.75,
              minWidth: "auto",
              borderRadius: "8px",
              transition: "all 0.2s ease",
              "&:hover": {
                background: "rgba(99, 102, 241, 0.1)",
                color: "#6366f1",
              },
            }}
          >
            Share
          </Button>
          <Button
            startIcon={<BookmarkBorderIcon sx={{ fontSize: 18 }} />}
            sx={{
              color: "#94a3b8",
              textTransform: "none",
              fontSize: "0.8125rem",
              fontWeight: 600,
              px: 2,
              py: 0.75,
              minWidth: "auto",
              borderRadius: "8px",
              transition: "all 0.2s ease",
              "&:hover": {
                background: "rgba(99, 102, 241, 0.1)",
                color: "#6366f1",
              },
            }}
          >
            Save
          </Button>
          <IconButton
            sx={{
              color: "#94a3b8",
              padding: "6px",
              borderRadius: "8px",
              transition: "all 0.2s ease",
              "&:hover": {
                background: "rgba(99, 102, 241, 0.1)",
                color: "#6366f1",
              },
            }}
          >
            <MoreHorizIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>
      </Box>
    </Paper>
  );
}
