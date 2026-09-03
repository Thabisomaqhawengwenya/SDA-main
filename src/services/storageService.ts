import { ref, uploadBytes, getDownloadURL, uploadString } from 'firebase/storage';
import { storage } from '../firebase/config';

/**
 * Upload a File, Blob, or base64 Data URL to Firebase Cloud Storage and return download URL.
 */
export async function uploadMedia(
  folder: string,
  fileOrBase64: File | Blob | string,
  filename?: string
): Promise<string> {
  const name = filename || `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const storageRef = ref(storage, `${folder}/${name}`);

  if (typeof fileOrBase64 === 'string') {
    if (fileOrBase64.startsWith('data:')) {
      // Base64 Data URL
      const snapshot = await uploadString(storageRef, fileOrBase64, 'data_url');
      return await getDownloadURL(snapshot.ref);
    } else {
      // Already an external URL, return as is
      return fileOrBase64;
    }
  } else {
    // File / Blob
    const snapshot = await uploadBytes(storageRef, fileOrBase64);
    return await getDownloadURL(snapshot.ref);
  }
}
