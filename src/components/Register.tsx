// src/components/Register.js
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, useTheme, HelperText } from 'react-native-paper';
import { auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const Register = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const theme = useTheme();

  const handleRegister = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        setEmail('');
        setPassword('');
        setErrorMessage('');
        navigation.navigate('Login');
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
        Registrar
      </Text>

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        keyboardType="email-address"
        autoCapitalize="none"
        left={<TextInput.Icon icon="email" />}
      />
      <HelperText type="error" visible={!email && errorMessage}>
        {errorMessage}
      </HelperText>

      <TextInput
        label="Senha"
        value={password}
        onChangeText={setPassword}
        mode="outlined"
        secureTextEntry
        left={<TextInput.Icon icon="lock" />}
      />
      <HelperText type="error" visible={errorMessage}>
        {errorMessage}
      </HelperText>

      <Button
        mode="contained"
        onPress={handleRegister}
        style={styles.button}
        disabled={hasErrors()}
      >
        Registrar
      </Button>

      <Text style={styles.loginText} onPress={() => navigation.navigate('Login')}>
        Já tem uma conta? <Text style={styles.loginLink}>Entrar</Text>
      </Text>
    </View>
  );
};

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
    color: '#333',
  },
  button: {
    marginTop: 10,
    paddingVertical: 8,
  },
  loginText: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
  },
  loginLink: {
    color: '#1e88e5',
    fontWeight: 'bold',
  },
});

export default Register;
