import { doc, setDoc } from 'firebase/firestore';
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
}

export const createPet = async (petId: string, pet: Pet): Promise<void> => {
  try {
    await setDoc(doc(db, 'pets', petId), {
      userId: pet.userId,
      name: pet.name,
      type: pet.type,
      breed: pet.breed,
      gender: pet.gender,
      weight: pet.weight,
      birthDate: pet.birthDate,
      notes: pet.notes,
    } as Pet);
    console.log('Pet criado com sucesso!');
  } catch (error) {
    console.error('Erro ao criar pet: ', error);
  }
};
