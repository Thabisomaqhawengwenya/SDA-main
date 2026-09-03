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
import type { ChurchService } from '../admin/adminTypes';

const COLLECTION_NAME = 'services';

export async function fetchServices(): Promise<ChurchService[]> {
  const snapshot = await getDocs(collection(db, COLLECTION_NAME));
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  })) as ChurchService[];
}

export function subscribeServices(callback: (items: ChurchService[]) => void) {
  return onSnapshot(collection(db, COLLECTION_NAME), (snapshot) => {
    const items = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as ChurchService[];
    callback(items);
  }, (err) => {
    console.warn('Firestore services subscription error:', err);
  });
}

export async function createService(item: Omit<ChurchService, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION_NAME), item);
  return docRef.id;
}

export async function updateService(id: string, updates: Partial<ChurchService>): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, updates);
}

export async function deleteService(id: string): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
}
