import {
    Paper,
    Typography,
    IconButton,
    Box,
    Button,
    Avatar,
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
  import "./PostCard.css";
  
  export default function PostCard({ post }) {
    const { user } = useAuth();
    const [userVote, setUserVote] = useState(0);
  
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
        if (userVote === value) {
          setUserVote(0);
        } else {
          setUserVote(value);
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
  
    const formatTimeAgo = (timestamp) => {
      if (!timestamp) return "just now";
      
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
        className="post-card"
      >
        <Box className="voting-section">
          <IconButton
            onClick={() => handleVote(1)}
            className={`vote-button ${userVote === 1 ? "upvoted" : ""}`}
          >
            <ArrowUpwardRounded sx={{ fontSize: 22 }} />
          </IconButton>
  
          <Typography
            className={`score ${userVote === 1 ? "upvoted" : userVote === -1 ? "downvoted" : ""}`}
          >
            {formatScore(Math.abs(score))}
          </Typography>
  
          <IconButton
            onClick={() => handleVote(-1)}
            className={`vote-button ${userVote === -1 ? "downvoted" : ""}`}
          >
            <ArrowDownwardRounded sx={{ fontSize: 22 }} />
          </IconButton>
        </Box>
  
        <Box className="content-section">
          <Box className="post-header">
            {post.authorPhotoURL && (
              <Avatar
                src={post.authorPhotoURL}
                className="author-avatar"
                sx={{ width: 32, height: 32 }}
              />
            )}
            <Typography className="post-header-text">
              r/threadly
            </Typography>
            <Typography className="post-header-divider">•</Typography>
            <Typography className="post-author">
              Posted by u/{post.authorName || "anonymous"}
            </Typography>
            {post.createdAt && (
              <>
                <Typography className="post-header-divider">•</Typography>
                <Typography className="post-time">
                  {formatTimeAgo(post.createdAt)}
                </Typography>
              </>
            )}
          </Box>
  
          <Typography variant="h6" className="post-title">
            {post.title}
          </Typography>
  
          {post.content && (
            <Typography className="post-content">
              {post.content}
            </Typography>
          )}
  
          {post.imageURL && (
            <img
              src={post.imageURL}
              alt="Post"
              className="post-image"
            />
          )}
  
          <Box className="action-buttons">
            <Button
              startIcon={<ChatBubbleOutlineIcon sx={{ fontSize: 18 }} />}
              className="action-button"
            >
              Comments
            </Button>
            <Button
              startIcon={<ShareIcon sx={{ fontSize: 18 }} />}
              className="action-button"
            >
              Share
            </Button>
            <Button
              startIcon={<BookmarkBorderIcon sx={{ fontSize: 18 }} />}
              className="action-button"
            >
              Save
            </Button>
            <IconButton className="action-button">
              <MoreHorizIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>
        </Box>
      </Paper>
    );
  }