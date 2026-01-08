import {
    addDoc,
    collection,
    serverTimestamp,
    onSnapshot,
    query,
    orderBy,
    doc,
    getDoc,
    setDoc,
    updateDoc,
    increment,
  } from "firebase/firestore";
  import { db } from "../../firebase/firestore";
  
  /**
   * Create a new post
   */
  export const createPost = async ({
    title,
    content,
    authorId,
    authorName,
  }) => {
    await addDoc(collection(db, "posts"), {
      title,
      content,
      authorId,
      authorName,
      upvotes: 0,
      downvotes: 0,
      score: 0, // ✅ REQUIRED FOR SORTING
      createdAt: serverTimestamp(),
    });
  };
  
  /**
   * Subscribe to posts (real-time)
   * Sorted by score DESC, then createdAt DESC
   */
  export const subscribeToPosts = (setPosts) => {
    const postsRef = collection(db, "posts");
  
    const q = query(
      postsRef,
      orderBy("score", "desc"),
      orderBy("createdAt", "desc")
    );
  
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const posts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      setPosts(posts);
    });
  
    return unsubscribe;
  };
  
  /**
   * Handle upvote / downvote logic
   */
  export const voteOnPost = async ({
    postId,
    userId,
    voteValue, // 1 (upvote) | -1 (downvote)
  }) => {
    const voteId = `${userId}_${postId}`;
    const voteRef = doc(db, "votes", voteId);
    const postRef = doc(db, "posts", postId);
  
    const existingVoteSnap = await getDoc(voteRef);
    const existingVote = existingVoteSnap.exists()
      ? existingVoteSnap.data().vote
      : 0;
  
    /**
     * SAME VOTE → TOGGLE OFF
     */
    if (existingVote === voteValue) {
      const updates = {};
  
      if (voteValue === 1) {
        updates.upvotes = increment(-1);
        updates.score = increment(-1);
      }
  
      if (voteValue === -1) {
        updates.downvotes = increment(-1);
        updates.score = increment(1);
      }
  
      await updateDoc(postRef, updates);
  
      await setDoc(voteRef, {
        userId,
        postId,
        vote: 0,
      });
  
      return;
    }
  
    /**
     * SWITCHING VOTE OR FIRST TIME
     */
    let updates = {};
  
    // Remove old vote
    if (existingVote === 1) {
      updates.upvotes = increment(-1);
      updates.score = increment(-1);
    }
  
    if (existingVote === -1) {
      updates.downvotes = increment(-1);
      updates.score = increment(1);
    }
  
    // Apply new vote
    if (voteValue === 1) {
      updates.upvotes = increment(1);
      updates.score = increment(1);
    }
  
    if (voteValue === -1) {
      updates.downvotes = increment(1);
      updates.score = increment(-1);
    }
  
    await updateDoc(postRef, updates);
  
    await setDoc(voteRef, {
      userId,
      postId,
      vote: voteValue,
    });
  };
  