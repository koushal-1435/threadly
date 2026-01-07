import {
  AppBar,
  Toolbar,
  Box,
  InputBase,
  Avatar,
  IconButton,
  Button,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import HomeIcon from "@mui/icons-material/Home";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import PersonIcon from "@mui/icons-material/Person";
import { useState } from "react";
import { useAuth } from "../auth/useAuth";
import { logout, loginWithGoogle } from "../firebase/auth";

export default function TopBar() {
  const { user, loading } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: "linear-gradient(135deg, rgba(30, 30, 40, 0.95) 0%, rgba(20, 20, 30, 0.95) 100%)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        boxShadow: "0 4px 24px rgba(0, 0, 0, 0.3)",
      }}
    >
      <Toolbar
        sx={{
          maxWidth: "1248px",
          width: "100%",
          mx: "auto",
          px: 2,
          justifyContent: "space-between",
        }}
      >
        {/* Left: Logo + Search */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, flex: 1 }}>
          {/* Logo */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              cursor: "pointer",
              transition: "all 0.2s ease",
              "&:hover": { 
                transform: "scale(1.05)",
                opacity: 0.9,
              },
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "12px",
                background: "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(99, 102, 241, 0.4)",
              }}
            >
              <HomeIcon sx={{ color: "#ffffff", fontSize: 24 }} />
            </Box>
            <Box
              component="span"
              sx={{
                background: "linear-gradient(135deg, #f1f5f9 0%, #cbd5e1 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: 800,
                fontSize: "1.5rem",
                letterSpacing: "-0.03em",
              }}
            >
              threadly
            </Box>
          </Box>

          {/* Search Bar */}
          <Box
            sx={{
              position: "relative",
              background: "rgba(30, 30, 40, 0.6)",
              backdropFilter: "blur(10px)",
              borderRadius: "12px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              width: "100%",
              maxWidth: "600px",
              display: "flex",
              alignItems: "center",
              transition: "all 0.3s ease",
              "&:hover": {
                borderColor: "rgba(99, 102, 241, 0.5)",
                background: "rgba(30, 30, 40, 0.8)",
              },
              "&:focus-within": {
                borderColor: "#6366f1",
                background: "rgba(255, 255, 255, 0.05)",
                boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.1)",
                "& .MuiInputBase-input": {
                  color: "#f1f5f9",
                },
                "& .MuiSvgIcon-root": {
                  color: "#6366f1",
                },
              },
            }}
          >
            <Box
              sx={{
                padding: "0 16px",
                height: "100%",
                display: "flex",
                alignItems: "center",
                pointerEvents: "none",
              }}
            >
              <SearchIcon sx={{ color: "#94a3b8", fontSize: 20 }} />
            </Box>
            <InputBase
              placeholder="Search Threadly"
              sx={{
                color: "#f1f5f9",
                width: "100%",
                fontSize: "0.9375rem",
                "& .MuiInputBase-input": {
                  padding: "10px 8px 10px 0",
                  "&::placeholder": {
                    color: "#64748b",
                    opacity: 1,
                  },
                },
              }}
            />
          </Box>
        </Box>

        {/* Right: User Menu */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, ml: 2 }}>
          {user ? (
            <>
              <IconButton
                onClick={handleClick}
                sx={{
                  padding: "2px",
                  transition: "all 0.2s ease",
                  "&:hover": { 
                    transform: "scale(1.1)",
                    backgroundColor: "rgba(99, 102, 241, 0.1)",
                  },
                }}
              >
                <Avatar
                  src={user.photoURL}
                  sx={{
                    width: 36,
                    height: 36,
                    border: "2px solid #6366f1",
                    boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)",
                  }}
                />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{
                  sx: {
                    background: "rgba(30, 30, 40, 0.95)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "16px",
                    mt: 1.5,
                    minWidth: 220,
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
                  },
                }}
              >
                <MenuItem
                  onClick={handleClose}
                  sx={{
                    color: "#f1f5f9",
                    borderRadius: "8px",
                    mx: 1,
                    mt: 1,
                    "&:hover": { 
                      background: "rgba(99, 102, 241, 0.1)",
                    },
                  }}
                >
                  <PersonIcon sx={{ mr: 1.5, fontSize: 20 }} />
                  Profile
                </MenuItem>
                <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.1)", my: 0.5 }} />
                <MenuItem
                  onClick={() => {
                    handleClose();
                    logout();
                  }}
                  sx={{
                    color: "#f1f5f9",
                    borderRadius: "8px",
                    mx: 1,
                    mb: 1,
                    "&:hover": { 
                      background: "rgba(236, 72, 153, 0.1)",
                    },
                  }}
                >
                  <LogoutRoundedIcon sx={{ mr: 1.5, fontSize: 20 }} />
                  Log Out
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button
              variant="contained"
              onClick={loginWithGoogle}
              disabled={loading}
              sx={{
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                color: "#ffffff",
                textTransform: "none",
                fontWeight: 600,
                px: 3,
                py: 1,
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(99, 102, 241, 0.4)",
                "&:hover": {
                  background: "linear-gradient(135deg, #818cf8 0%, #a78bfa 100%)",
                  boxShadow: "0 6px 20px rgba(99, 102, 241, 0.5)",
                },
                "&:disabled": {
                  background: "rgba(99, 102, 241, 0.3)",
                },
              }}
            >
              {loading ? "Loading..." : "Log In"}
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}