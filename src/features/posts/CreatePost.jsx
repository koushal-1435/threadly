import { Paper, TextField, Button, Box, Avatar, Divider, IconButton } from "@mui/material";
import { useState, useRef } from "react";
import { createPost } from "./post.service";
import { useAuth } from "../../auth/useAuth";
import { uploadImage } from "../../firebase/storage";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import CloseIcon from "@mui/icons-material/Close";
import "./CreatePost.css";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handlePost = async () => {
    if (!title.trim() || !content.trim()) return;
    if (!user) {
      return;
    }

    try {
      setLoading(true);

      let imageURL = null;
      if (image) {
        imageURL = await uploadImage(image, user.uid);
      }

      await createPost({
        title,
        content,
        authorId: user.uid,
        authorName: user.displayName || "Anonymous",
        authorPhotoURL: user.photoURL || null,
        imageURL,
      });

      setTitle("");
      setContent("");
      setImage(null);
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error("Failed to create post", err);
      alert("Failed to create post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      elevation={0}
      className="create-post-container"
    >
      <Box className="create-post-content">
        <Box className="avatar-section">
          {user ? (
            <Avatar
              src={user.photoURL}
              className="user-avatar"
              sx={{ width: 40, height: 40 }}
            />
          ) : (
            <Avatar
              className="anonymous-avatar"
              sx={{ width: 40, height: 40 }}
            >
              ?
            </Avatar>
          )}
          <Box sx={{ flex: 1 }}>
            <TextField
              placeholder="Create Posts"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&": {
                    background: "rgba(20, 20, 30, 0.6)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "12px",
                    color: "#f1f5f9",
                    transition: "all 0.2s ease",
                  },
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

        {imagePreview && (
          <Box className="image-preview-container">
            <img
              src={imagePreview}
              alt="Preview"
              className="image-preview"
            />
            <IconButton
              onClick={handleRemoveImage}
              className="remove-image-button"
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                background: "rgba(0, 0, 0, 0.7)",
                color: "white",
                "&:hover": {
                  background: "rgba(0, 0, 0, 0.9)",
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        )}

        <Divider className="divider" sx={{ borderColor: "rgba(255, 255, 255, 0.1)", mb: 2 }} />

        <Box className="actions-row">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageSelect}
            className="file-input"
            id="image-upload"
          />
          <label htmlFor="image-upload">
            <Button
              component="span"
              startIcon={<PhotoCameraIcon />}
              className="upload-button"
            >
              {image ? "Change Photo" : "Add Photo"}
            </Button>
          </label>
          <Button
            variant="contained"
            onClick={handlePost}
            disabled={loading || !title.trim() || !content.trim()}
            className="post-button"
          >
            {loading ? "Posting..." : "Post"}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}