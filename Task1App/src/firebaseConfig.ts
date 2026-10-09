
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
   apiKey: "AIzaSyBuLA9EbYjYSGLgpV_5ZYo5jxotur2UOVc",
  authDomain: "task1app-e6d70.firebaseapp.com",
  projectId: "task1app-e6d70",
  storageBucket: "task1app-e6d70.firebasestorage.app",
  messagingSenderId: "442583965603",
  appId: "1:442583965603:web:b777b609de4085c639c416",
  measurementId: "G-ZY3L5J2LGV"
};

const app =
  getApps().length === 0
    ? initializeApp(firebaseConfig)
    : getApps()[0];

export const db = getFirestore(app);