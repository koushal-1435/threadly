import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { firebaseApp } from './firebase.config';

export const storage = getStorage(firebaseApp);

export const uploadImage = async (file, userId) => {
  const timestamp = Date.now();
  const fileName = `${userId}_${timestamp}_${file.name}`;
  const storageRef = ref(storage, `posts/${fileName}`);
  
  await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(storageRef);
  
  return downloadURL;
};