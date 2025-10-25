import admin from 'firebase-admin';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Firebase Admin
let firebaseApp;

try {
  // Option 1: Load from service account JSON file (recommended)
  const serviceAccountPath = join(__dirname, '../../serviceaccount.json');

  try {
    const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));

    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET || `${serviceAccount.project_id}.appspot.com`,
      databaseURL: process.env.FIREBASE_DATABASE_URL,
    });

    console.log('✅ Firebase initialized successfully from serviceaccount.json');
  } catch (fileError) {
    // Option 2: Try environment variables as fallback
    if (process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_PRIVATE_KEY &&
      process.env.FIREBASE_CLIENT_EMAIL) {

      const serviceAccount = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      };

      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        databaseURL: process.env.FIREBASE_DATABASE_URL,
      });

      console.log('✅ Firebase initialized successfully from environment variables');
    } else {
      console.warn('⚠️  Firebase: serviceaccount.json not found and credentials incomplete.');
      console.warn('⚠️  Using in-memory mode.');
    }
  }
} catch (error) {
  console.warn('⚠️  Firebase initialization error:', error.message);
  console.warn('⚠️  Continuing with in-memory storage mode.');
}

export const db = null;
export const bucket = firebaseApp ? admin.storage().bucket() : null;

export default admin;
