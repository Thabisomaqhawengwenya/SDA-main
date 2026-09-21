import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';

export interface ChurchSettings {
  churchName: string;
  tagline: string;
  email: string;
  phone: string;
  address: string;
  postalAddress: string;
  serviceTimes: {
    sabbathSchool: string;
    divineService: string;
    midweekPrayer: string;
  };
  socialLinks: {
    facebook?: string;
    youtube?: string;
    tiktok?: string;
    whatsapp?: string;
  };
  givingDetails: {
    bankName: string;
    accountName: string;
    accountNumber: string;
    branchCode: string;
    ecocashMerchant: string;
    innbucksNumber: string;
  };
  maintenanceMode?: boolean;
}

export const defaultChurchSettings: ChurchSettings = {
  churchName: 'Emganwini Main Seventh-day Adventist Church',
  tagline: 'Connecting our community to Christ — through teaching, preaching, and healing.',
  email: 'Connect@Emganwinisda.org',
  phone: '+263 77 123 4567',
  address: 'Stand 1420, Emganwini, Bulawayo, Zimbabwe',
  postalAddress: 'P.O. Box 2445, Bulawayo, Zimbabwe',
  serviceTimes: {
    sabbathSchool: 'Every Saturday, 09:00 am',
    divineService: 'Every Saturday, 11:30 am',
    midweekPrayer: 'Every Wednesday, 07:00 pm',
  },
  socialLinks: {
    facebook: 'https://facebook.com',
    youtube: 'https://youtube.com',
    whatsapp: 'https://wa.me/263771234567',
  },
  givingDetails: {
    bankName: 'Standard Chartered / CBZ Bank',
    accountName: 'Emganwini Main SDA Church',
    accountNumber: '0100234567890',
    branchCode: '6102',
    ecocashMerchant: '*151*2*2*123456#',
    innbucksNumber: '+263 77 123 4567',
  },
  maintenanceMode: false,
};

const SETTINGS_COLLECTION = 'settings';
const SETTINGS_DOC_ID = 'church_info';

export async function fetchChurchSettings(): Promise<ChurchSettings> {
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { ...defaultChurchSettings, ...snap.data() } as ChurchSettings;
    }
  } catch (err) {
    console.warn('Could not fetch settings from Firestore, returning defaults:', err);
  }
  return defaultChurchSettings;
}

export function subscribeChurchSettings(callback: (settings: ChurchSettings) => void) {
  const docRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);
  return onSnapshot(
    docRef,
    (snap) => {
      if (snap.exists()) {
        callback({ ...defaultChurchSettings, ...snap.data() } as ChurchSettings);
      } else {
        callback(defaultChurchSettings);
      }
    },
    (err) => {
      console.warn('Firestore settings subscription error:', err);
      callback(defaultChurchSettings);
    }
  );
}

export async function saveChurchSettings(settings: Partial<ChurchSettings>): Promise<void> {
  const docRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);
  await setDoc(docRef, settings, { merge: true });
}
