// src/components/Login.js
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, useTheme, HelperText } from 'react-native-paper';
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';


const Login = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const theme = useTheme();

    const handleLogin = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                setEmail('');
                setPassword('');
                setErrorMessage('');
                navigation.navigate('Home');
            })
            .catch((error) => {
                setErrorMessage(error.message);
            });
    };

    const hasErrors = () => {
        return email === '' || password === '';
    };

    return (
        <View style={styles.container}>
            <Text variant="headlineLarge" style={styles.title}>
                Entrar
            </Text>

            <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                mode="outlined"
                keyboardType="email-address"
                autoCapitalize="none"
                left={<TextInput.Icon icon="email"/>}
            />
            <HelperText type="error" visible={!email && errorMessage}>
                {errorMessage}
            </HelperText>

            <TextInput
                label="Senha"
                value={password}
                onChangeText={setPassword}
                style={styles.input}
                mode="outlined"
                secureTextEntry
                left={<TextInput.Icon icon="lock" />}
            />
            <HelperText type="error" visible={errorMessage}>
                {errorMessage}
            </HelperText>

            <Button
                mode="contained"
                onPress={handleLogin}
                style={styles.button}
                disabled={hasErrors()}
            >
                Entrar
            </Button>

            <Text style={styles.registerText} onPress={() => navigation.navigate('Register')}>
                Não tem uma conta? <Text style={styles.registerLink}>Registre-se</Text>
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        marginBottom: 30,
        textAlign: 'center',
        color: '#333'
    },
    button: {
        marginTop: 10,
        paddingVertical: 8,
    },
    registerText: {
        marginTop: 20,
        textAlign: 'center',
        fontSize: 16,
        color: '#666',
    },
    registerLink: {
        color: '#1e88e5',
        fontWeight: 'bold',
    },
});

export default Login;
