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
import type { Sermon } from '../admin/adminTypes';

const COLLECTION_NAME = 'sermons';

export async function fetchSermons(): Promise<Sermon[]> {
  const q = query(collection(db, COLLECTION_NAME), orderBy('date', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  })) as Sermon[];
}

export function subscribeSermons(callback: (items: Sermon[]) => void) {
  const q = query(collection(db, COLLECTION_NAME), orderBy('date', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as Sermon[];
    callback(items);
  }, (err) => {
    console.warn('Firestore sermons subscription error:', err);
  });
}

export async function createSermon(item: Omit<Sermon, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION_NAME), {
    ...item,
    views: item.views || 0,
  });
  return docRef.id;
}

export async function updateSermon(id: string, updates: Partial<Sermon>): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, updates);
}

export async function deleteSermon(id: string): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
}
