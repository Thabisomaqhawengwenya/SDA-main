import {
  collection,
  getDocs,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import type { ActivityLog } from '../admin/adminTypes';

const COLLECTION_NAME = 'activity_log';

export async function fetchActivityLogs(maxItems = 50): Promise<ActivityLog[]> {
  const q = query(collection(db, COLLECTION_NAME), orderBy('timestamp', 'desc'), limit(maxItems));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  })) as ActivityLog[];
}

export function subscribeActivityLogs(callback: (items: ActivityLog[]) => void, maxItems = 50) {
  const q = query(collection(db, COLLECTION_NAME), orderBy('timestamp', 'desc'), limit(maxItems));
  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as ActivityLog[];
    callback(items);
  }, (err) => {
    console.warn('Firestore activity log subscription error:', err);
  });
}

export async function logActivity(user: string, action: string, resource: string): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION_NAME), {
    user,
    action,
    resource,
    timestamp: new Date().toISOString(),
  });
  return docRef.id;
}
