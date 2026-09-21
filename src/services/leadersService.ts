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
import type { Leader } from '../admin/adminTypes';

const COLLECTION_NAME = 'leaders';

export async function fetchLeaders(): Promise<Leader[]> {
  const snapshot = await getDocs(collection(db, COLLECTION_NAME));
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  })) as Leader[];
}

export function subscribeLeaders(callback: (items: Leader[]) => void) {
  return onSnapshot(
    collection(db, COLLECTION_NAME),
    (snapshot) => {
      const items = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      })) as Leader[];
      callback(items);
    },
    (err) => {
      console.warn('Firestore leaders subscription error:', err);
    }
  );
}

export async function createLeader(item: Omit<Leader, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION_NAME), item);
  return docRef.id;
}

export async function updateLeader(id: string, updates: Partial<Leader>): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, updates);
}

export async function deleteLeader(id: string): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
}
