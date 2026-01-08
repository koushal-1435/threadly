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
    authorPhotoURL,
    imageURL,
  }) => {
    await addDoc(collection(db, "posts"), {
      title,
      content,
      authorId,
      authorName,
      authorPhotoURL: authorPhotoURL || null,
      imageURL: imageURL || null,
      upvotes: 0,
      downvotes: 0,
      score: 0,
      createdAt: serverTimestamp(),
    });
  };
  
  /**
   * Subscribe to posts (real-time)
   * Sorted by score DESC, then createdAt DESC
   */
  export const subscribeToPosts = (setPosts) => {
    const q = query(
      collection(db, "posts"),
      orderBy("score", "desc"),
      orderBy("createdAt", "desc")
    );
  
    return onSnapshot(q, (snapshot) => {
      setPosts(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    });
  };
  
  /**
   * Handle upvote / downvote logic (FIXED)
   */
  export const voteOnPost = async ({ postId, userId, voteValue }) => {
    const voteRef = doc(db, "votes", `${userId}_${postId}`);
    const postRef = doc(db, "posts", postId);
  
    const voteSnap = await getDoc(voteRef);
    const previousVote = voteSnap.exists() ? voteSnap.data().vote : 0;
  
    let upvoteDelta = 0;
    let downvoteDelta = 0;
    let scoreDelta = 0;
  
    /**
     * TOGGLE OFF
     */
    if (previousVote === voteValue) {
      if (voteValue === 1) {
        upvoteDelta = -1;
        scoreDelta = -1;
      } else {
        downvoteDelta = -1;
        scoreDelta = +1;
      }
  
      await updateDoc(postRef, {
        upvotes: increment(upvoteDelta),
        downvotes: increment(downvoteDelta),
        score: increment(scoreDelta),
      });
  
      await setDoc(voteRef, { userId, postId, vote: 0 });
      return;
    }
  
    /**
     * REMOVE OLD VOTE
     */
    if (previousVote === 1) {
      upvoteDelta -= 1;
      scoreDelta -= 1;
    }
  
    if (previousVote === -1) {
      downvoteDelta -= 1;
      scoreDelta += 1;
    }
  
    /**
     * APPLY NEW VOTE
     */
    if (voteValue === 1) {
      upvoteDelta += 1;
      scoreDelta += 1;
    }
  
    if (voteValue === -1) {
      downvoteDelta += 1;
      scoreDelta -= 1;
    }
  
    await updateDoc(postRef, {
      ...(upvoteDelta !== 0 && { upvotes: increment(upvoteDelta) }),
      ...(downvoteDelta !== 0 && { downvotes: increment(downvoteDelta) }),
      ...(scoreDelta !== 0 && { score: increment(scoreDelta) }),
    });
  
    await setDoc(voteRef, {
      userId,
      postId,
      vote: voteValue,
    });
  };
  