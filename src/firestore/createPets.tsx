import { addDoc, setDoc, collection } from "firebase/firestore";
import { db } from "../firebaseConfig";

export interface Pet {
  id: string;
  userId: string;
  name: string;
  type: "dog" | "cat"; // minusculo pq firebase deixou assim
  breed: string;
  gender: string;
  weight: number;
  birthDate: Date;
  notes?: string;
  image?: string;
}

export const createPet = async (pet: Pet): Promise<void> => {
  try {
    const docRef = await addDoc(collection(db, "pets"), {
      userId: pet.userId,
      name: pet.name,
      type: pet.type,
      breed: pet.breed,
      gender: pet.gender,
      weight: pet.weight,
      birthDate: pet.birthDate, // converter para o formato timestamp que o firebase usa
      notes: pet.notes || null,
      image: pet.image || ""
    });

    const petWithId: Pet = { ...pet, id: docRef.id };
    await setDoc(docRef, petWithId);

    //console.log('Pet criado com sucesso!', petWithId);
  } catch (error) {
    //console.log('Erro ao criar pet: ', error);
  }
};
