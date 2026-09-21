import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import type { AdminUser, UserRole } from '../admin/adminTypes';

const COLLECTION_NAME = 'users';

export async function fetchUsers(): Promise<AdminUser[]> {
  const snapshot = await getDocs(collection(db, COLLECTION_NAME));
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  })) as AdminUser[];
}

export function subscribeUsers(callback: (items: AdminUser[]) => void) {
  return onSnapshot(
    collection(db, COLLECTION_NAME),
    (snapshot) => {
      const items = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      })) as AdminUser[];
      callback(items);
    },
    (err) => {
      console.warn('Firestore users subscription error:', err);
    }
  );
}

export async function createUser(user: AdminUser): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, user.id);
  await setDoc(docRef, user);
}

export async function updateUserRole(id: string, role: UserRole): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, { role });
}

export async function updateUserStatus(id: string, status: 'active' | 'inactive'): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, { status });
}

export async function updateUserProfile(id: string, updates: Partial<AdminUser>): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, updates);
}

export async function deleteUser(id: string): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
}
