import * as admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
    : null;

if (serviceAccount) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
} else {
    console.warn('Firebase Service Account not found. FCM notifications will be disabled.');
}

export default admin;
