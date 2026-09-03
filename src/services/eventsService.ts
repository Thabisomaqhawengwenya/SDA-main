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
import type { AdminEvent } from '../admin/adminTypes';

const COLLECTION_NAME = 'events';

export async function fetchEvents(): Promise<AdminEvent[]> {
  const q = query(collection(db, COLLECTION_NAME), orderBy('date', 'asc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  })) as AdminEvent[];
}

export function subscribeEvents(callback: (events: AdminEvent[]) => void) {
  const q = query(collection(db, COLLECTION_NAME), orderBy('date', 'asc'));
  return onSnapshot(q, (snapshot) => {
    const events = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as AdminEvent[];
    callback(events);
  }, (err) => {
    console.warn('Firestore events subscription error:', err);
  });
}

export async function createEvent(event: Omit<AdminEvent, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION_NAME), {
    ...event,
    createdAt: event.createdAt || new Date().toISOString(),
  });
  return docRef.id;
}

export async function updateEvent(id: string, updates: Partial<AdminEvent>): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, updates);
}

export async function deleteEvent(id: string): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
}
