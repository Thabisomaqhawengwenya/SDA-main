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
import type { PrayerRequest, PrayerStatus } from '../admin/adminTypes';

const COLLECTION_NAME = 'prayer_requests';

export async function fetchPrayerRequests(): Promise<PrayerRequest[]> {
  const q = query(collection(db, COLLECTION_NAME), orderBy('submittedAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  })) as PrayerRequest[];
}

export function subscribePrayerRequests(callback: (items: PrayerRequest[]) => void) {
  const q = query(collection(db, COLLECTION_NAME), orderBy('submittedAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as PrayerRequest[];
    callback(items);
  }, (err) => {
    console.warn('Firestore prayer requests subscription error:', err);
  });
}

export async function createPrayerRequest(item: Omit<PrayerRequest, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION_NAME), {
    ...item,
    submittedAt: item.submittedAt || new Date().toISOString(),
    status: item.status || 'new',
  });
  return docRef.id;
}

export async function updatePrayerStatus(id: string, status: PrayerStatus): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, { status });
}

export async function updatePrayerRequest(id: string, updates: Partial<PrayerRequest>): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, updates);
}

export async function deletePrayerRequest(id: string): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
}
