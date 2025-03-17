
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Você precisará substituir esta configuração com suas credenciais do Firebase
const firebaseConfig = {
  apiKey: "SUBSTITUA_PELA_SUA_API_KEY",
  authDomain: "SUBSTITUA.firebaseapp.com",
  projectId: "SUBSTITUA",
  storageBucket: "SUBSTITUA.appspot.com",
  messagingSenderId: "SUBSTITUA",
  appId: "SUBSTITUA"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Inicializa os serviços
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;
