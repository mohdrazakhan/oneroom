import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// TODO: Replace with your Firebase project configuration
// Get this from Firebase Console > Project Settings > General > Your apps > SDK setup and configuration
const firebaseConfig = {
    apiKey: "AIzaSyDX_oQEsguw4m9-bc6TwyH0dX4uh3rZo1I",
    authDomain: "one-room-2c1a6.firebaseapp.com",
    projectId: "one-room-2c1a6",
    storageBucket: "one-room-2c1a6.firebasestorage.app",
    messagingSenderId: "30053537626",
    appId: "1:30053537626:web:a5ee8d4ae9fbb309a30563",
    measurementId: "G-QGHF6562QH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth (if needed)
export const auth = getAuth(app);

export default app;
