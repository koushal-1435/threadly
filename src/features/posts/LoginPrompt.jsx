import { Paper, Typography, Button, Box } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import { loginWithGoogle } from "../../firebase/auth";
import "./LoginPrompt.css";

export default function LoginPrompt() {
  return (
    <Paper elevation={0} className="login-prompt-container">
      <LockIcon className="login-prompt-icon" />
      <Typography variant="h5" className="login-prompt-title">
        Join the Conversation
      </Typography>
      <Typography className="login-prompt-message">
        Want to create a post? Please log in to continue and share your thoughts with the community!
      </Typography>
      <Button
        variant="contained"
        onClick={loginWithGoogle}
        className="login-button"
      >
        Login to Continue
      </Button>
    </Paper>
  );
}