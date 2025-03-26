
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Default configuration to prevent runtime errors
// Replace this with your Firebase configuration in production
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY || "demo-api-key",
  authDomain: import.meta.env.VITE_AUTH_DOMAIN || "demo-project.firebaseapp.com",
  projectId: import.meta.env.VITE_PROJECT_ID || "demo-project",
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET || "demo-project.appspot.com",
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID || "123456789012",
  appId: import.meta.env.VITE_APP_ID || "1:123456789012:web:abc123def456",
};

// Initialize Firebase in a way that prevents errors in development mode
let app;
let db;
let auth;
let storage;

try {
  // Initialize Firebase
  app = initializeApp(firebaseConfig);
  
  // Initialize services
  db = getFirestore(app);
  auth = getAuth(app);
  storage = getStorage(app);
} catch (error) {
  console.error("Firebase initialization error:", error);
  
  // Create mock implementations for development
  db = {
    collection: () => ({
      doc: () => ({
        get: async () => ({ exists: () => false, data: () => ({}) }),
        set: async () => {},
      }),
    }),
  };
  
  auth = {
    onAuthStateChanged: () => {},
    signInWithEmailAndPassword: async () => ({ user: null }),
    createUserWithEmailAndPassword: async () => ({ user: null }),
    signOut: async () => {},
  };
  
  storage = {
    ref: () => ({
      put: async () => {},
      getDownloadURL: async () => "",
    }),
  };
}

// Export services
export { db, auth, storage };
export default app;
