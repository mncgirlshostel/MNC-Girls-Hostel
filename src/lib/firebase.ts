import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getAuth, type Auth } from 'firebase/auth';

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;

export async function getFirebase() {
  if (app) return { app, db: db!, auth: auth! };

  try {
    // Try to load the config. Since the setup tool failed, we guard this.
    // In a real scenario, this file would be created by the tool.
    const configModule = await import('../../firebase-applet-config.json').catch(() => null);
    
    if (!configModule || !configModule.default) {
      throw new Error('Firebase configuration is missing. Please run the setup tool again.');
    }

    const firebaseConfig = configModule.default;
    
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApps()[0];
    }

    db = getFirestore(app);
    auth = getAuth(app);

    return { app, db, auth };
  } catch (error) {
    console.error('Failed to initialize Firebase:', error);
    throw error;
  }
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: 'create' | 'update' | 'delete' | 'list' | 'get' | 'write';
  path: string | null;
  authInfo: any;
}

export function handleFirestoreError(error: any, operationType: FirestoreErrorInfo['operationType'], path: string | null): never {
  const auth = getAuth();
  const user = auth.currentUser;
  
  const errorInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    operationType,
    path,
    authInfo: user ? {
      userId: user.uid,
      email: user.email,
      emailVerified: user.emailVerified,
      isAnonymous: user.isAnonymous,
      providerInfo: user.providerData
    } : null
  };

  throw new Error(JSON.stringify(errorInfo));
}
