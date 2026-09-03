import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import type { Ministry } from '../admin/adminTypes';

const COLLECTION_NAME = 'ministries';

export async function fetchMinistries(): Promise<Ministry[]> {
  const snapshot = await getDocs(collection(db, COLLECTION_NAME));
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  })) as Ministry[];
}

export function subscribeMinistries(callback: (items: Ministry[]) => void) {
  return onSnapshot(collection(db, COLLECTION_NAME), (snapshot) => {
    const items = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as Ministry[];
    callback(items);
  }, (err) => {
    console.warn('Firestore ministries subscription error:', err);
  });
}

export async function createMinistry(item: Omit<Ministry, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION_NAME), item);
  return docRef.id;
}

export async function updateMinistry(id: string, updates: Partial<Ministry>): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, updates);
}

export async function deleteMinistry(id: string): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
}
