import {
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import {
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
    createdAt: serverTimestamp(),
  });
};

/**
 * Subscribe to posts collection (real-time)
 * Calls setPosts with an array of { id, ...data }
 * Returns an unsubscribe function.
 * Posts are sorted by score (upvotes - downvotes) in descending order.
 */
export const subscribeToPosts = (setPosts) => {
  const postsRef = collection(db, "posts");
  // Order by upvotes first, then we'll sort by score on client side
  const q = query(postsRef, orderBy("upvotes", "desc"));

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const next = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    
    // Sort by score (upvotes - downvotes) in descending order
    // This ensures highest upvoted posts appear first
    const sorted = next.sort((a, b) => {
      const scoreA = (a.upvotes || 0) - (a.downvotes || 0);
      const scoreB = (b.upvotes || 0) - (b.downvotes || 0);
      return scoreB - scoreA; // Descending order
    });
    
    setPosts(sorted);
  });

  return unsubscribe;
};

export const voteOnPost = async ({
  postId,
  userId,
  voteValue,
}) => {
  const voteId = `${userId}_${postId}`;
  const voteRef = doc(db, "votes", voteId);
  const postRef = doc(db, "posts", postId);

  const existingVoteSnap = await getDoc(voteRef);
  const existingVote = existingVoteSnap.exists() 
    ? existingVoteSnap.data().vote 
    : 0;

  // 🔄 SAME VOTE → REMOVE VOTE (toggle off)
  if (existingVote === voteValue) {
    // Remove the vote
    await updateDoc(postRef, {
      upvotes: voteValue === 1 ? increment(-1) : increment(0),
      downvotes: voteValue === -1 ? increment(-1) : increment(0),
    });

    await setDoc(voteRef, {
      userId,
      postId,
      vote: 0,
    });

    return;
  }

  // 🔁 SWITCHING VOTE OR FIRST TIME VOTING
  let upvoteChange = 0;
  let downvoteChange = 0;

  // Remove existing vote first
  if (existingVote === 1) {
    upvoteChange -= 1;
  } else if (existingVote === -1) {
    downvoteChange -= 1;
  }

  // Add new vote
  if (voteValue === 1) {
    upvoteChange += 1;
  } else if (voteValue === -1) {
    downvoteChange += 1;
  }

  // Get current post data to ensure downvotes don't go negative
  const postSnap = await getDoc(postRef);
  const currentDownvotes = postSnap.exists() 
    ? (postSnap.data().downvotes || 0) 
    : 0;

  // Ensure downvotes never go below 0
  if (currentDownvotes + downvoteChange < 0) {
    downvoteChange = -currentDownvotes;
  }

  // Apply changes
  const updates = {};
  if (upvoteChange !== 0) {
    updates.upvotes = increment(upvoteChange);
  }
  if (downvoteChange !== 0) {
    updates.downvotes = increment(downvoteChange);
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