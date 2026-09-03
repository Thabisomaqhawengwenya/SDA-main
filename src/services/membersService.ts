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
import type { Member } from '../admin/adminTypes';

const COLLECTION_NAME = 'members';

export async function fetchMembers(): Promise<Member[]> {
  const snapshot = await getDocs(collection(db, COLLECTION_NAME));
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  })) as Member[];
}

export function subscribeMembers(callback: (items: Member[]) => void) {
  return onSnapshot(collection(db, COLLECTION_NAME), (snapshot) => {
    const items = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as Member[];
    callback(items);
  }, (err) => {
    console.warn('Firestore members subscription error:', err);
  });
}

export async function createMember(item: Omit<Member, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION_NAME), {
    ...item,
    joinDate: item.joinDate || new Date().toISOString().split('T')[0],
  });
  return docRef.id;
}

export async function updateMember(id: string, updates: Partial<Member>): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, updates);
}

export async function deleteMember(id: string): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
}
