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
import type { Livestream } from '../admin/adminTypes';

const COLLECTION_NAME = 'livestreams';

export async function fetchLivestreams(): Promise<Livestream[]> {
  const q = query(collection(db, COLLECTION_NAME), orderBy('date', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  })) as Livestream[];
}

export function subscribeLivestreams(callback: (items: Livestream[]) => void) {
  const q = query(collection(db, COLLECTION_NAME), orderBy('date', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as Livestream[];
    callback(items);
  }, (err) => {
    console.warn('Firestore livestreams subscription error:', err);
  });
}

export async function createLivestream(item: Omit<Livestream, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION_NAME), item);
  return docRef.id;
}

export async function updateLivestream(id: string, updates: Partial<Livestream>): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, updates);
}

export async function deleteLivestream(id: string): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
}
