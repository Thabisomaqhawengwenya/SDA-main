import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
} from 'firebase/auth';
import type { User } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, googleProvider, db } from '../firebase/config';
import type { UserRole, AdminUser } from '../admin/adminTypes';

interface AuthContextType {
  user: User | null;
  adminProfile: AdminUser | null;
  role: UserRole;
  loading: boolean;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [adminProfile, setAdminProfile] = useState<AdminUser | null>(null);
  const [role, setRole] = useState<UserRole>('super_admin');
  const [loading, setLoading] = useState(true);

  // Sync or create user profile in Firestore
  async function syncUserProfile(firebaseUser: User) {
    try {
      const userRef = doc(db, 'users', firebaseUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data() as AdminUser;
        setAdminProfile(data);
        if (data.role) setRole(data.role);
        // update last active
        await setDoc(userRef, { lastActive: new Date().toISOString() }, { merge: true });
      } else {
        // Create initial profile
        const newProfile: AdminUser = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Admin User',
          email: firebaseUser.email || '',
          role: 'super_admin', // Default initial role
          avatar: firebaseUser.photoURL || undefined,
          lastActive: new Date().toISOString(),
          status: 'active',
        };
        await setDoc(userRef, { ...newProfile, createdAt: serverTimestamp() });
        setAdminProfile(newProfile);
        setRole('super_admin');
      }
    } catch (err) {
      console.warn('Error syncing user profile with Firestore:', err);
      // Fallback local admin profile so user can proceed without being blocked
      const fallbackProfile: AdminUser = {
        id: firebaseUser.uid,
        name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Admin User',
        email: firebaseUser.email || '',
        role: 'super_admin',
        lastActive: new Date().toISOString(),
        status: 'active',
      };
      setAdminProfile(fallbackProfile);
      setRole('super_admin');
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await syncUserProfile(currentUser);
      } else {
        setAdminProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithEmail = async (email: string, pass: string) => {
    const res = await signInWithEmailAndPassword(auth, email.trim(), pass);
    sessionStorage.setItem('sda_admin_auth', 'true');
    await syncUserProfile(res.user);
  };

  const signUpWithEmail = async (email: string, pass: string, name: string) => {
    const res = await createUserWithEmailAndPassword(auth, email.trim(), pass);
    try {
      if (name.trim()) {
        await updateProfile(res.user, { displayName: name.trim() });
      }
    } catch (nameErr) {
      console.warn('Profile name update error:', nameErr);
    }
    sessionStorage.setItem('sda_admin_auth', 'true');
    await syncUserProfile(res.user);
  };

  const signInWithGoogle = async () => {
    const res = await signInWithPopup(auth, googleProvider);
    sessionStorage.setItem('sda_admin_auth', 'true');
    await syncUserProfile(res.user);
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setAdminProfile(null);
    sessionStorage.removeItem('sda_admin_auth');
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email.trim());
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        adminProfile,
        role,
        loading,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        logout,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
