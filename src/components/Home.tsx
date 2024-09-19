// src/components/Home.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { auth } from '../firebaseConfig';

const Home = () => {
    const user = auth.currentUser;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Bem-vindo à Home!</Text>
            {user ? (
                <Text style={styles.email}>Seu e-mail: {user.email}</Text>
            ) : (
                <Text style={styles.email}>Nenhum usuário logado</Text>
            )}
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
});

export default Home;

