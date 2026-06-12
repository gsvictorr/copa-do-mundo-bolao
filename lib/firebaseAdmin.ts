import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const serviceAccount = JSON.parse(
  process.env.FIREBASE_SERVICE_ACCOUNT as string
);

if (getApps().length === 0) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}

export const authAdmin = getAuth();

export async function verifyIdToken(token: string) {
  try {
    return await authAdmin.verifyIdToken(token);
  } catch {
    throw new Error("Token inválido.");
  }
}