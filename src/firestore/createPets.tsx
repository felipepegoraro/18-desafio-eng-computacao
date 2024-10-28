import {
  addDoc,
  setDoc,
  updateDoc,
  collection,
  doc,
  deleteDoc
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { deletePetNotesFromUser } from "./createUsers";

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
      birthDate: pet.birthDate,
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

export const deletePet = async (pet: Pet, userId: string): Promise<number> => {
  if (pet && pet.id) {
    try {
      const petsRef = doc(db, "pets", pet.id);
      await deleteDoc(petsRef);

      deletePetNotesFromUser(userId, pet.id);

      return 0;
    } catch (error) {
      // console.log(error);
      return 1;
    }
  }

  return 1;
};

export const updatePet = async (
  petId: string,
  updatedPet: Partial<Pet>
): Promise<void> => {
  try {
    const petRef = doc(db, "pets", petId);
    await updateDoc(petRef, updatedPet);

    // console.log("Pet atualizado com sucesso!", updatedPet);
  } catch (error) {
    // console.log("Erro ao atualizar pet: ", error);
  }
};
