import { db } from '../firebaseConfig';
import type { Note } from './modelNotes';
import type { Pet } from './createPets';
import { doc, setDoc, collection, getDocs, query, where } from 'firebase/firestore';

export interface User {
    name: string;
    email: string;
};

export const createUser = async (userId: string, name: string, email: string): Promise<void> => {
 try {
    await setDoc(doc(db, 'users', userId), {
      name: name,
      email: email,
      ownsPet: false,
    } as User);
    console.log('Usuário criado com sucesso!');
  } catch (error) {
    console.error('Erro ao criar usuário: ', error);
  }
};


export const getUserPets = async (userId: string): Promise<Pet[] | null> => {
    try {
        const petsRef = collection(db, "pets");
        const q = query(petsRef, where("userId", "==", userId));
        const querySnapshot = await getDocs(q);
        
        const pets: Pet[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            pets.push({
                id: doc.id,
                userId: data.userId,
                name: data.name,
                type: data.type,
                breed: data.breed,
                gender: data.gender,
                weight: data.weight,
                birthDate: data.birthDate.toDate(),
                notes: data.notes || "",
            } as Pet);
        });

        console.log(pets);
        return pets;
    } catch (error) {
        console.log("Erro ao buscar pets: ", error);
    }

    return null;
};


export const getUserNotes = async (userId: string): Promise<Note[] | null> => {
    try {
        const notesRef = collection(db, "notes");
        const q = query(notesRef, where("userId", "==", userId));
        const querySnapshot = await getDocs(q);
        
        const notes: Note[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            notes.push({
                id: data.id,
                title: data.title,
                content: data.content,
                petId: data.petId,
                createdAt: data.createdAt.toDate(),
                completedAt: data.completedAt ? data.completedAt.toDate() : null,
                dueDate: data.dueDate ? data.dueDate.toDate() : null,
            } as Note);
            console.log(notes);
        });

        return notes;
    } catch (error) {
        console.log("Erro ao buscar notas: ", error);
    }

    return null;
}
