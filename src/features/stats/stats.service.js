import {
    collection,
    getCountFromServer,
    getDocs,
    doc,
    setDoc,
    getDoc,
    serverTimestamp,
  } from "firebase/firestore";
  import { db } from "../../firebase/firestore";
  
  /**
   * Track user login (call this when user logs in)
   */
  export const trackUserLogin = async (userId, userData) => {
    if (!userId) return;
    
    try {
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        // New user - add to users collection
        await setDoc(userRef, {
          ...userData,
          firstLoginAt: serverTimestamp(),
          lastLoginAt: serverTimestamp(),
        });
        console.log("New user tracked:", userId);
      } else {
        // Existing user - update last login
        await setDoc(userRef, {
          ...userSnap.data(),
          lastLoginAt: serverTimestamp(),
        }, { merge: true });
        console.log("User login updated:", userId);
      }
    } catch (error) {
      console.error("Error tracking user login:", error);
      throw error;
    }
  };
  
  /**
   * Get total number of users who have logged in (with fallback)
   */
  export const getTotalUsers = async () => {
    try {
      const usersRef = collection(db, "users");
      const snapshot = await getCountFromServer(usersRef);
      return snapshot.data().count;
    } catch (error) {
      console.warn("getCountFromServer failed, trying fallback method:", error);
      // Fallback: count documents manually
      try {
        const usersRef = collection(db, "users");
        const snapshot = await getDocs(usersRef);
        return snapshot.size;
      } catch (fallbackError) {
        console.error("Error getting user count (fallback also failed):", fallbackError);
        return 0;
      }
    }
  };
  
  /**
   * Get total number of posts created (with fallback)
   */
  export const getTotalPosts = async () => {
    try {
      const postsRef = collection(db, "posts");
      const snapshot = await getCountFromServer(postsRef);
      return snapshot.data().count;
    } catch (error) {
      console.warn("getCountFromServer failed, trying fallback method:", error);
      // Fallback: count documents manually
      try {
        const postsRef = collection(db, "posts");
        const snapshot = await getDocs(postsRef);
        return snapshot.size;
      } catch (fallbackError) {
        console.error("Error getting post count (fallback also failed):", fallbackError);
        return 0;
      }
    }
  };
  
  /**
   * Subscribe to real-time stats updates
   */
  export const subscribeToStats = (setStats) => {
    const updateStats = async () => {
      try {
        const [users, posts] = await Promise.all([
          getTotalUsers(),
          getTotalPosts(),
        ]);
        setStats({ users, posts });
      } catch (error) {
        console.error("Error updating stats:", error);
      }
    };
  
    // Initial load
    updateStats();
  
    // Update every 10 seconds (or you can use Firestore listeners for real-time)
    const interval = setInterval(updateStats, 10000);
  
    return () => clearInterval(interval);
  };