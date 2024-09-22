// src/components/Home.js
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { db, auth } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import RegisterNewPet from './registerNewPet';

const Home = () => {
    const user = auth.currentUser;
    const [username, setUsername] = useState('');
    const [ownsPet, setOwnsPet] = useState(false);

    useEffect(() => {
        const fetchUserName = async () => {
            try {
                if (user) {
                    console.log("Current user UID:", user.uid);
                    const docRef = doc(db, 'users', user.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        console.log(docSnap.data());
                        setUsername(docSnap.data().name);
                        setOwnsPet(docSnap.data().ownsPet);
                        console.log("has pet? ", docSnap.data().ownsPet);
                    } else {
                        console.log("Sem doc!");
                    }
                } else {
                    console.log("Nenhum usuario logado");
                }
            } catch (error) {
                console.error("erro fetching o nome", error);
            }
        };
        fetchUserName();
    }, [user]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Bem-vindo à Home!</Text>
            {user ? (
                <Text style={styles.email}>{`Olá, ${username}`}</Text>
            ) : (
                <Text style={styles.email}>Nenhum usuário logado</Text>
            )}


            {ownsPet ? null : <RegisterNewPet userId={user!.uid}/>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
    },
    email: {
        fontSize: 18,
        marginTop: 10,
    },
    message: {
        fontSize: 16,
        color: 'red',
        marginTop: 20,
    },
});

export default Home;

