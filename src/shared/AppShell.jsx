import { Box, Container } from "@mui/material";
import TopBar from "./TopBar";
import LeftSidebar from "./LeftSidebar";
import RightSidebar from "./RightSidebar";

export default function AppShell({ children }) {
  return (
    <>
      <TopBar />

      <Box
        sx={{
          minHeight: "calc(100vh - 64px)",
          background: "linear-gradient(180deg, #0a0a0f 0%, #1a1a2e 100%)",
          py: 3,
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(236, 72, 153, 0.1) 0%, transparent 50%)",
            pointerEvents: "none",
          },
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            display: "flex",
            gap: 2,
            px: { xs: 1, sm: 2 },
          }}
        >
          {/* Left Sidebar */}
          <Box
            sx={{
              display: { xs: "none", md: "block" },
              flexShrink: 0,
            }}
          >
            <LeftSidebar />
          </Box>

          {/* Main Content */}
          <Box
            sx={{
              flex: 1,
              minWidth: 0,
              maxWidth: { md: "640px" },
            }}
          >
            {children}
          </Box>

          {/* Right Sidebar */}
          <Box
            sx={{
              display: { xs: "none", lg: "block" },
              flexShrink: 0,
            }}
          >
            <RightSidebar />
          </Box>
        </Container>
      </Box>
    </>
  );
}
