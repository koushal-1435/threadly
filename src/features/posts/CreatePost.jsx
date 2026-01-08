import { Paper, TextField, Button, Box, Avatar, Divider } from "@mui/material";
import { useState } from "react";
import { createPost } from "./post.service";
import { useAuth } from "../../auth/useAuth";
import { loginWithGoogle } from "../../firebase/auth";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handlePost = async () => {
    if (!title.trim() || !content.trim()) return;
    if (!user) {
      loginWithGoogle();
      return;
    }

    try {
      setLoading(true);

      await createPost({
        title,
        content,
        authorId: user.uid,
        authorName: user.displayName || "Anonymous",
      });

      setTitle("");
      setContent("");
    } catch (err) {
      console.error("Failed to create post", err);
    } finally {
      setLoading(false);
    }
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
        boxShadow: "0 4px 24px rgba(0, 0, 0, 0.2)",
        transition: "all 0.3s ease",
        "&:hover": {
          borderColor: "rgba(99, 102, 241, 0.3)",
          boxShadow: "0 8px 32px rgba(99, 102, 241, 0.15)",
        },
      }}
    >
      <Box sx={{ p: 2.5 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
          {user ? (
            <Avatar
              src={user.photoURL}
              sx={{
                width: 40,
                height: 40,
                border: "2px solid #6366f1",
                boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)",
              }}
            />
          ) : (
            <Avatar
              sx={{
                width: 40,
                height: 40,
                background: "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)",
                boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)",
              }}
            >
              ?
            </Avatar>
          )}
          <Box sx={{ flex: 1 }}>
            <TextField
              placeholder="Create Postsss"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  background: "rgba(20, 20, 30, 0.6)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "12px",
                  color: "#f1f5f9",
                  transition: "all 0.2s ease",
                  "& fieldset": {
                    border: "none",
                  },
                  "&:hover": {
                    borderColor: "rgba(99, 102, 241, 0.5)",
                    background: "rgba(20, 20, 30, 0.8)",
                  },
                  "&.Mui-focused": {
                    borderColor: "#6366f1",
                    boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.1)",
                  },
                },
                "& .MuiInputBase-input": {
                  color: "#f1f5f9",
                  fontSize: "0.9375rem",
                  py: 1.25,
                  px: 1.5,
                  "&::placeholder": {
                    color: "#64748b",
                    opacity: 1,
                  },
                },
              }}
            />
          </Box>
        </Box>

        <TextField
          placeholder="What's on your mind?"
          fullWidth
          multiline
          minRows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": {
              background: "rgba(20, 20, 30, 0.6)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "12px",
              color: "#f1f5f9",
              transition: "all 0.2s ease",
              "& fieldset": {
                border: "none",
              },
              "&:hover": {
                borderColor: "rgba(99, 102, 241, 0.5)",
                background: "rgba(20, 20, 30, 0.8)",
              },
              "&.Mui-focused": {
                borderColor: "#6366f1",
                boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.1)",
              },
            },
            "& .MuiInputBase-input": {
              color: "#f1f5f9",
              fontSize: "0.9375rem",
              py: 1.25,
              px: 1.5,
              "&::placeholder": {
                color: "#64748b",
                opacity: 1,
              },
            },
          }}
        />

        <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.1)", mb: 2 }} />

        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            onClick={handlePost}
            disabled={loading || !title.trim() || !content.trim()}
            sx={{
              background: loading || !title.trim() || !content.trim()
                ? "rgba(99, 102, 241, 0.2)"
                : "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              color: "#ffffff",
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              py: 1,
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(99, 102, 241, 0.4)",
              transition: "all 0.2s ease",
              "&:hover": {
                background: "linear-gradient(135deg, #818cf8 0%, #a78bfa 100%)",
                boxShadow: "0 6px 20px rgba(99, 102, 241, 0.5)",
                transform: "translateY(-1px)",
              },
              "&:disabled": {
                background: "rgba(99, 102, 241, 0.2)",
                color: "#94a3b8",
                boxShadow: "none",
              },
            }}
          >
            {loading ? "Posting..." : "Post"}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}
  