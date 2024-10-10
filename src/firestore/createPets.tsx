import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export interface Pet {
  userId: string;
  name: string;
  type: "DOG" | "CAT";
  breed: string;
  gender: string;
  weight: number;
  birthDate: Date;
  notes?: string;
  image?: string;
}

export const createPet = async (pet: Pet): Promise<void> => {
  try {
    await addDoc(collection(db, 'pets'), {
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
    console.log('Pet criado com sucesso!');
  } catch (error) {
    console.log('Erro ao criar pet: ', error);
  }
};

