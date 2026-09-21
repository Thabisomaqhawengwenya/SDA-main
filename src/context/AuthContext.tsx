import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
} from 'firebase/auth';
import type { User } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import type { UserRole, AdminUser } from '../admin/adminTypes';

const SUPER_ADMIN_EMAIL = 'thabisomaqhawengwenya@gmail.com';
const SUPER_ADMIN_PASS = 'maqhawe06';

interface AuthContextType {
  user: User | null;
  adminProfile: AdminUser | null;
  role: UserRole;
  loading: boolean;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name: string, role?: UserRole) => Promise<void>;
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
  async function syncUserProfile(firebaseUser: User, explicitRole?: UserRole) {
    try {
      const userRef = doc(db, 'users', firebaseUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data() as AdminUser;
        setAdminProfile(data);
        if (data.role) setRole(data.role);
        // update last active
        await setDoc(userRef, { lastActive: new Date().toISOString() }, { merge: true });
        sessionStorage.setItem('sda_admin_user', JSON.stringify(data));
      } else {
        const userEmail = (firebaseUser.email || '').toLowerCase();
        const isMasterAdmin = userEmail === SUPER_ADMIN_EMAIL.toLowerCase();
        const assignedRole: UserRole = explicitRole || (isMasterAdmin ? 'super_admin' : 'editor');

        const newProfile: AdminUser = {
          id: firebaseUser.uid,
          name: isMasterAdmin
            ? 'Thabiso Maqhawe Ngwenya'
            : firebaseUser.displayName || userEmail.split('@')[0] || 'Admin User',
          email: firebaseUser.email || '',
          role: assignedRole,
          avatar: firebaseUser.photoURL || undefined,
          lastActive: new Date().toISOString(),
          status: 'active',
        };
        await setDoc(userRef, { ...newProfile, createdAt: serverTimestamp() });
        setAdminProfile(newProfile);
        setRole(assignedRole);
        sessionStorage.setItem('sda_admin_user', JSON.stringify(newProfile));
      }
    } catch (err) {
      console.warn('Error syncing user profile with Firestore:', err);
      // Fallback local admin profile so user can proceed without being blocked
      const userEmail = (firebaseUser.email || '').toLowerCase();
      const isMaster = userEmail === SUPER_ADMIN_EMAIL.toLowerCase();
      const fallbackProfile: AdminUser = {
        id: firebaseUser.uid,
        name: isMaster ? 'Thabiso Maqhawe Ngwenya' : firebaseUser.displayName || 'Admin User',
        email: firebaseUser.email || '',
        role: explicitRole || (isMaster ? 'super_admin' : 'editor'),
        lastActive: new Date().toISOString(),
        status: 'active',
      };
      setAdminProfile(fallbackProfile);
      setRole(fallbackProfile.role);
      sessionStorage.setItem('sda_admin_user', JSON.stringify(fallbackProfile));
    }
  }

  useEffect(() => {
    // Check local session storage first
    const savedAuth = sessionStorage.getItem('sda_admin_auth');
    const savedUserJson = sessionStorage.getItem('sda_admin_user');
    if (savedAuth === 'true' && savedUserJson) {
      try {
        const parsed = JSON.parse(savedUserJson) as AdminUser;
        setAdminProfile(parsed);
        if (parsed.role) setRole(parsed.role);
      } catch (e) {
        console.warn('Could not parse cached admin user', e);
      }
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await syncUserProfile(currentUser);
      } else if (savedAuth !== 'true') {
        setAdminProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithEmail = async (email: string, pass: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const isMasterCredentials =
      cleanEmail === SUPER_ADMIN_EMAIL.toLowerCase() && pass === SUPER_ADMIN_PASS;

    try {
      // 1. Attempt standard Firebase Auth sign-in
      const res = await signInWithEmailAndPassword(auth, cleanEmail, pass);
      sessionStorage.setItem('sda_admin_auth', 'true');
      await syncUserProfile(res.user);
    } catch (err: any) {
      // 2. If it's the master admin account and not registered yet in Firebase Auth
      if (isMasterCredentials) {
        try {
          const createRes = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
          await updateProfile(createRes.user, { displayName: 'Thabiso Maqhawe Ngwenya' });
          sessionStorage.setItem('sda_admin_auth', 'true');
          await syncUserProfile(createRes.user, 'super_admin');
          return;
        } catch (createErr) {
          console.warn('Master admin auto-provisioning fallback triggered:', createErr);
        }

        // Direct Super Admin local authentication
        const masterProfile: AdminUser = {
          id: 'super_admin_thabiso',
          name: 'Thabiso Maqhawe Ngwenya',
          email: SUPER_ADMIN_EMAIL,
          role: 'super_admin',
          status: 'active',
          lastActive: new Date().toISOString(),
        };
        setAdminProfile(masterProfile);
        setRole('super_admin');
        sessionStorage.setItem('sda_admin_auth', 'true');
        sessionStorage.setItem('sda_admin_user', JSON.stringify(masterProfile));
        return;
      }

      // If regular sign-in failed, propagate the error
      throw err;
    }
  };

  const signUpWithEmail = async (email: string, pass: string, name: string, userRole: UserRole = 'editor') => {
    const res = await createUserWithEmailAndPassword(auth, email.trim(), pass);
    try {
      if (name.trim()) {
        await updateProfile(res.user, { displayName: name.trim() });
      }
    } catch (nameErr) {
      console.warn('Profile name update error:', nameErr);
    }
    await syncUserProfile(res.user, userRole);
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.warn('Sign out warning:', err);
    }
    setUser(null);
    setAdminProfile(null);
    sessionStorage.removeItem('sda_admin_auth');
    sessionStorage.removeItem('sda_admin_user');
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
