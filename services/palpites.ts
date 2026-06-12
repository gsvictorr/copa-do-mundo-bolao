import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, addDoc, doc, getDoc } from "firebase/firestore";

export const getPalpitesByUser = async (userId: string) => {
  try {
    const q = query(collection(db, 'palpites'), where("criadoPorId", "==", userId));
    const querySnapshot = await getDocs(q);

    const palpites = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return palpites;
  } catch (error) {
    console.error("Erro ao buscar palpites:", error);
    throw new Error("Erro ao buscar palpites.");
  }
};


export const getPalpitesByPartida = async (idPartida: string) => {
  try {
    const q = query(collection(db, 'palpites'), where("idPartida", "==", idPartida));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Erro ao buscar palpites da partida:", error);
    throw new Error("Erro ao buscar palpites da partida.");
  }
};