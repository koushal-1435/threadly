import { useEffect, useState } from "react";
import AppShell from "../shared/AppShell";
import PostList from "../features/posts/PostList";
import CreatePost from "../features/posts/CreatePost";
import LoginPrompt from "../features/posts/LoginPrompt";
import StatsFooter from "../features/stats/StatsFooter";
import { subscribeToPosts } from "../features/posts/post.service";
import { useAuth } from "../auth/useAuth";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const unsubscribe = subscribeToPosts(setPosts);
    return unsubscribe;
  }, []);

  return (
    <AppShell>
      {user ? <CreatePost /> : <LoginPrompt />}
      <PostList posts={posts} />
      <StatsFooter />
    </AppShell>
  );
}