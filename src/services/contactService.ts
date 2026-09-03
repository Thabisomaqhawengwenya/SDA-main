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
import type { ContactMessage, MessageStatus } from '../admin/adminTypes';

const COLLECTION_NAME = 'contact_messages';

export async function fetchContactMessages(): Promise<ContactMessage[]> {
  const q = query(collection(db, COLLECTION_NAME), orderBy('receivedAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  })) as ContactMessage[];
}

export function subscribeContactMessages(callback: (items: ContactMessage[]) => void) {
  const q = query(collection(db, COLLECTION_NAME), orderBy('receivedAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as ContactMessage[];
    callback(items);
  }, (err) => {
    console.warn('Firestore contact messages subscription error:', err);
  });
}

export async function createContactMessage(item: Omit<ContactMessage, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION_NAME), {
    ...item,
    receivedAt: item.receivedAt || new Date().toISOString(),
    status: item.status || 'new',
    isImportant: item.isImportant ?? false,
  });
  return docRef.id;
}

export async function updateMessageStatus(id: string, status: MessageStatus): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, { status });
}

export async function toggleMessageImportant(id: string, isImportant: boolean): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, { isImportant });
}

export async function deleteContactMessage(id: string): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
}
