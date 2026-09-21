import { ref, uploadBytes, getDownloadURL, uploadString } from 'firebase/storage';
import { storage } from '../firebase/config';

/**
 * Compresses an image File or Blob to JPEG under specified max dimensions & quality.
 * Keeps output small (~60KB - 150KB) so it saves and loads instantly anywhere.
 */
export async function compressImage(
  file: File | Blob,
  maxWidth = 1200,
  maxHeight = 800,
  quality = 0.78
): Promise<{ blob: Blob; dataUrl: string }> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxWidth || height > maxHeight) {
          if (width / maxWidth > height / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve({ blob: file, dataUrl: (e.target?.result as string) || '' });
          return;
        }

        // Draw and compress to JPEG
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        canvas.toBlob(
          (blob) => {
            resolve({ blob: blob || file, dataUrl });
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = () => {
        resolve({ blob: file, dataUrl: (e.target?.result as string) || '' });
      };
      img.src = (e.target?.result as string) || '';
    };
    reader.onerror = () => {
      resolve({ blob: file, dataUrl: '' });
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Upload a File, Blob, or base64 Data URL to Firebase Cloud Storage and return download URL.
 * Automatically compresses images client-side before uploading.
 * If Cloud Storage fails, gracefully falls back to the compressed Data URL (< 150KB).
 */
export async function uploadMedia(
  folder: string,
  fileOrBase64: File | Blob | string,
  filename?: string
): Promise<string> {
  const cleanName = (filename || `${Date.now()}_${Math.random().toString(36).substring(2, 8)}`)
    .replace(/[^a-zA-Z0-9._-]/g, '_');

  // Case 1: External URL string (e.g. https://images.unsplash.com/...)
  if (typeof fileOrBase64 === 'string' && !fileOrBase64.startsWith('data:')) {
    return fileOrBase64;
  }

  // Case 2: File or Blob -> Compress first
  let uploadBlob: Blob;
  let fallbackDataUrl: string = '';

  if (typeof fileOrBase64 !== 'string') {
    try {
      const compressed = await compressImage(fileOrBase64);
      uploadBlob = compressed.blob;
      fallbackDataUrl = compressed.dataUrl;
    } catch {
      uploadBlob = fileOrBase64;
    }
  } else {
    fallbackDataUrl = fileOrBase64;
    uploadBlob = new Blob([fileOrBase64]);
  }

  // Attempt Firebase Cloud Storage upload
  try {
    const storageRef = ref(storage, `${folder}/${cleanName}.jpg`);
    if (typeof fileOrBase64 === 'string' && fileOrBase64.startsWith('data:')) {
      const snapshot = await uploadString(storageRef, fileOrBase64, 'data_url');
      return await getDownloadURL(snapshot.ref);
    } else {
      const snapshot = await uploadBytes(storageRef, uploadBlob, {
        contentType: 'image/jpeg',
      });
      return await getDownloadURL(snapshot.ref);
    }
  } catch (storageErr) {
    console.warn('Firebase Cloud Storage upload fallback to optimized inline data URL:', storageErr);
    if (fallbackDataUrl) {
      return fallbackDataUrl;
    }
    throw storageErr;
  }
}
