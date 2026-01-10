import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const firebaseAdminConfig = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY
    ? process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, "\n")
    : undefined,
  clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
};

// Prevent re-initialization during hot reload
let adminApp;
let adminAuth;
let adminDb;

try {
  if (getApps().length === 0) {
    adminApp = initializeApp({
      credential: cert(firebaseAdminConfig as any),
    });
  } else {
    adminApp = getApps()[0];
  }

  adminAuth = getAuth(adminApp);
  adminDb = getFirestore(adminApp);
} catch (error: any) {
  console.error("Firebase Admin initialization error:", error?.message);
  console.warn("Firebase Admin SDK not configured. Please set FIREBASE_ADMIN_PRIVATE_KEY and FIREBASE_ADMIN_CLIENT_EMAIL in .env.local");
}

export { adminAuth, adminDb };
export default adminApp;
