import { doc, collection, addDoc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export interface Note {
    id: string;
    title: string;
    content: string;
    userId: string;
    petId: string; // cada nota está associada a um pet.
    createdAt: Date;
    completedAt: Date | null;
    dueDate: Date | null;
}

export const createNote = async (
    userId: string,
    petId: string,
    title: string,
    content: string,
    dueDate: Date | null
): Promise<void> => {
    try {
        const noteData: Note = {
          id: '',
          title: title,
          content: content,
          userId: userId,
          petId: petId,
          createdAt: new Date(),
          completedAt: null,
          dueDate: dueDate
        };

        const docRef = await addDoc(collection(db, "notes"), noteData);
        noteData.id = docRef.id;

        await updateDoc(docRef, {
            id: docRef.id
            });


        console.log("Nota criada, id: ", docRef.id);
        console.log("Nota criada com sucesso");
    } catch (error) {
        console.error('Erro ao criar nota: ', error);
    }
};

export const editNote = async (noteId: string, newNote: Note): Promise<boolean> => {
  try {
    const noteRef = doc(db, "notes", noteId);
    const noteSnap = await getDoc(noteRef);

    if (noteSnap.exists()) {
      await updateDoc(noteRef, {
        title: newNote.title,
        content: newNote.content,
        completedAt: newNote.completedAt
      });
      console.log("Nota atualizada com sucesso");
      return true;
    } else {
      console.log("Nota não encontrada");
      return false;
    }
  } catch (error) {
    console.error('Erro ao editar nota: ', error);
    return false;
  }
};

export const deleteNote = async (noteId: string) => {
    try {
        const noteRef = doc(db, "notes", noteId);
        const noteSnap = await getDoc(noteRef);

        if (noteSnap.exists()){
            await deleteDoc(noteRef);
            console.log("Nota deletada com sucesso");
        }
    } catch(error){
        console.log("Erro ao deletar nota: ", error);
    }
};

export const markAsCompleted = async (noteId: string) => {
    try {
        const noteRef = doc(db, "notes", noteId);
        const noteSnap = await getDoc(noteRef);

        if (noteSnap.exists()) await updateDoc(noteRef, { completedAt: new Date() });
        console.log("Nota marcada como completada.");

    } catch(error){
        console.log("Erro ao deletar nota: ", error);
    }
}
