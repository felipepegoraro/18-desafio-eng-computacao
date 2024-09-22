import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export interface User {
    name: string;
    email: string;
};

export const createUser = async (userId: string, name: string, email: string): Promise<void> => {
 try {
    await setDoc(doc(db, 'users', userId), {
      name: name,
      email: email,
      ownsPet: false
    } as User);
    console.log('Usuário criado com sucesso!');
  } catch (error) {
    console.error('Erro ao criar usuário: ', error);
  }
};
