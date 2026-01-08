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
      score: 0, // 🔥 STORED SCORE (upvotes - downvotes)
      createdAt: serverTimestamp(),
    });
  };
  
  /**
   * Subscribe to posts collection (real-time)
   * Posts are sorted by score DESC, then by createdAt DESC
   */
  export const subscribeToPosts = (setPosts) => {
    const postsRef = collection(db, "posts");
  
    const q = query(
      postsRef,
      orderBy("score", "desc"),
      orderBy("createdAt", "desc") // tie-breaker
    );
  
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const posts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      // ✅ No client-side sorting needed
      setPosts(posts);
    });
  
    return unsubscribe;
  };
  
  /**
   * Vote on a post (upvote / downvote / toggle)
   */
  export const voteOnPost = async ({
    postId,
    userId,
    voteValue, // 1 (upvote) or -1 (downvote)
  }) => {
    const voteId = `${userId}_${postId}`;
    const voteRef = doc(db, "votes", voteId);
    const postRef = doc(db, "posts", postId);
  
    const existingVoteSnap = await getDoc(voteRef);
    const existingVote = existingVoteSnap.exists()
      ? existingVoteSnap.data().vote
      : 0;
  
    // 🔄 SAME VOTE → REMOVE (toggle off)
    if (existingVote === voteValue) {
      const updates = {};
  
      if (voteValue === 1) {
        updates.upvotes = increment(-1);
        updates.score = increment(-1);
      } else if (voteValue === -1) {
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
  
    // 🔁 SWITCHING VOTE OR FIRST TIME
    let upvoteChange = 0;
    let downvoteChange = 0;
    let scoreChange = 0;
  
    // Remove existing vote
    if (existingVote === 1) {
      upvoteChange -= 1;
      scoreChange -= 1;
    } else if (existingVote === -1) {
      downvoteChange -= 1;
      scoreChange += 1;
    }
  
    // Apply new vote
    if (voteValue === 1) {
      upvoteChange += 1;
      scoreChange += 1;
    } else if (voteValue === -1) {
      downvoteChange += 1;
      scoreChange -= 1;
    }
  
    const updates = {};
  
    if (upvoteChange !== 0) {
      updates.upvotes = increment(upvoteChange);
    }
  
    if (downvoteChange !== 0) {
      updates.downvotes = increment(downvoteChange);
    }
  
    if (scoreChange !== 0) {
      updates.score = increment(scoreChange);
    }
  
    if (Object.keys(updates).length > 0) {
      await updateDoc(postRef, updates);
    }
  
    await setDoc(voteRef, {
      userId,
      postId,
      vote: voteValue,
    });
  };
  