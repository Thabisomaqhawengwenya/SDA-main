import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyAJDntqCtYq6lRPAdXTFhpMQ8kbyZhObeM',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'emg-main-sda.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'emg-main-sda',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'emg-main-sda.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '479154887262',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:479154887262:web:2b5280e781a039270132cf',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-Z9C2XHKJL2',
};

// Initialize Firebase App (avoid re-initialization)
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Authentication Providers
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Analytics (conditionally loaded if supported in browser environment)
export let analytics: ReturnType<typeof getAnalytics> | null = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {
    // Ignore analytics init failure in non-browser environments
  });
}
