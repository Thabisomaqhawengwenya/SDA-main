import {
  collection,
  doc,
  getDocs,
  addDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import type { Donation } from '../admin/adminTypes';

const COLLECTION_NAME = 'donations';

export async function fetchDonations(): Promise<Donation[]> {
  const q = query(collection(db, COLLECTION_NAME), orderBy('date', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  })) as Donation[];
}

export function subscribeDonations(callback: (items: Donation[]) => void) {
  const q = query(collection(db, COLLECTION_NAME), orderBy('date', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as Donation[];
    callback(items);
  }, (err) => {
    console.warn('Firestore donations subscription error:', err);
  });
}

export async function createDonation(item: Omit<Donation, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION_NAME), {
    ...item,
    date: item.date || new Date().toISOString().split('T')[0],
  });
  return docRef.id;
}

export async function deleteDonation(id: string): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
}
