import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import type { Announcement } from '../admin/adminTypes';

const COLLECTION_NAME = 'announcements';

export async function fetchAnnouncements(): Promise<Announcement[]> {
  const q = query(collection(db, COLLECTION_NAME), orderBy('publishDate', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  })) as Announcement[];
}

export function subscribeAnnouncements(callback: (items: Announcement[]) => void) {
  const q = query(collection(db, COLLECTION_NAME), orderBy('publishDate', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as Announcement[];
    callback(items);
  }, (err) => {
    console.warn('Firestore announcements subscription error:', err);
  });
}

export async function createAnnouncement(item: Omit<Announcement, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION_NAME), {
    ...item,
    createdAt: item.createdAt || new Date().toISOString(),
  });
  return docRef.id;
}

export async function updateAnnouncement(id: string, updates: Partial<Announcement>): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, updates);
}

export async function deleteAnnouncement(id: string): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
}
