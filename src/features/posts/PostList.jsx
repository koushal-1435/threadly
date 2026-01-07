import { Stack } from "@mui/material";
import PostCard from "./PostCard";

export default function PostList({ posts }) {
  return (
    <Stack spacing={2}>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </Stack>
  );
}
