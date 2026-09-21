import { doc, setDoc, getDocs, collection } from 'firebase/firestore';
import { db } from '../firebase/config';
import {
  mockEvents,
  mockAnnouncements,
  mockSermons,
  mockLivestreams,
  mockMinistries,
  mockServices,
  mockPrayerRequests,
  mockMessages,
  mockMembers,
  mockDonations,
  mockLeaders,
  mockAdminUsers,
  mockActivityLog,
} from '../admin/mockData';

/**
 * Seed Firestore with initial mock data if collections are empty or upon explicit request.
 */
export async function seedFirestoreDatabase(force = false): Promise<{ success: boolean; message: string }> {
  try {
    // Check if events already exist (unless forced)
    if (!force) {
      const existingEvents = await getDocs(collection(db, 'events'));
      if (!existingEvents.empty) {
        return { success: false, message: 'Database already contains data. Use force option if you wish to overwrite.' };
      }
    }

    // 1. Events
    for (const item of mockEvents) {
      const { id, ...data } = item;
      await setDoc(doc(db, 'events', id), data);
    }

    // 2. Announcements
    for (const item of mockAnnouncements) {
      const { id, ...data } = item;
      await setDoc(doc(db, 'announcements', id), data);
    }

    // 3. Sermons
    for (const item of mockSermons) {
      const { id, ...data } = item;
      await setDoc(doc(db, 'sermons', id), data);
    }

    // 4. Livestreams
    for (const item of mockLivestreams) {
      const { id, ...data } = item;
      await setDoc(doc(db, 'livestreams', id), data);
    }

    // 5. Ministries
    for (const item of mockMinistries) {
      const { id, ...data } = item;
      await setDoc(doc(db, 'ministries', id), data);
    }

    // 6. Services
    for (const item of mockServices) {
      const { id, ...data } = item;
      await setDoc(doc(db, 'services', id), data);
    }

    // 7. Prayer Requests
    for (const item of mockPrayerRequests) {
      const { id, ...data } = item;
      await setDoc(doc(db, 'prayer_requests', id), data);
    }

    // 8. Contact Messages
    for (const item of mockMessages) {
      const { id, ...data } = item;
      await setDoc(doc(db, 'contact_messages', id), data);
    }

    // 9. Members
    for (const item of mockMembers) {
      const { id, ...data } = item;
      await setDoc(doc(db, 'members', id), data);
    }

    // 10. Donations
    for (const item of mockDonations) {
      const { id, ...data } = item;
      await setDoc(doc(db, 'donations', id), data);
    }

    // 11. Leaders
    for (const item of mockLeaders) {
      const { id, ...data } = item;
      await setDoc(doc(db, 'leaders', id), data);
    }

    // 12. Users
    for (const item of mockAdminUsers) {
      const { id, ...data } = item;
      await setDoc(doc(db, 'users', id), data);
    }

    // 13. Activity Log
    for (const item of mockActivityLog) {
      const { id, ...data } = item;
      await setDoc(doc(db, 'activity_log', id), data);
    }

    // 14. Church Settings
    await setDoc(doc(db, 'settings', 'church_info'), {
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
    }, { merge: true });

    return {
      success: true,
      message: 'Successfully seeded Firestore with initial church data across all 14 collections & settings!',
    };
  } catch (error: unknown) {
    console.error('Error seeding Firestore:', error);
    const errMessage = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, message: `Failed to seed Firestore: ${errMessage}` };
  }
}
