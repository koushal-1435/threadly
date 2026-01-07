import { useEffect, useState } from "react";
import AppShell from "../shared/AppShell";
import PostList from "../features/posts/PostList";
import CreatePost from "../features/posts/CreatePost";
import { subscribeToPosts } from "../features/posts/post.service";

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const unsubscribe = subscribeToPosts(setPosts);
    return unsubscribe;
  }, []);

  return (
    <AppShell>
      <CreatePost />
      <PostList posts={posts} />
    </AppShell>
  );
}
