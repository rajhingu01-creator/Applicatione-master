import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCZvIl8nz2VExEkaYSOUs-6e2P2qgR3N10",
  authDomain: "appoten-7a086.firebaseapp.com",
  projectId: "appoten-7a086",
  storageBucket: "appoten-7a086.firebasestorage.app",
  messagingSenderId: "1046035508369",
  appId: "1:1046035508369:android:08872f9bc6d105add7a330"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
