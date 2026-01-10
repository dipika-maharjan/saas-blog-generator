import { auth } from "@/lib/firebase";
import { User } from "firebase/auth";

/**
 * Get the current user from Firebase Auth
 */
export const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe();
      resolve(user);
    });
  });
};

/**
 * Verify user is authenticated and return their UID
 */
export const verifyAuth = (req: Request): string | null => {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return null;

  // For server-side validation, we'd typically use Firebase Admin SDK
  // For now, this is a placeholder. In production, use firebase-admin.
  // The client sends the idToken via Authorization: Bearer <idToken>
  // We'll validate it server-side with Admin SDK.
  
  const token = authHeader.replace("Bearer ", "");
  return token ? token : null;
};
