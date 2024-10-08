// src/components/Register.js
import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import {
  TextInput,
  Button,
  Text,
  useTheme,
  HelperText
} from "react-native-paper";
import { auth } from "../firebaseConfig";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "firebase/auth";
import { createUser } from "../firestore/createUsers";

const Register = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const theme = useTheme();

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const userId = userCredential.user.uid;
      await createUser(userId, name, email);

<<<<<<< HEAD
  const hasErrors = () => {
    return email === '' || password === '';
  };

  return (
=======
            signInWithEmailAndPassword(auth, email, password)
                .then(() => navigation.navigate('Home'));
        } catch (error: unknown) {
            if (error instanceof Error) setErrorMessage(error.message);
            else setErrorMessage('Ocorreu um erro desconhecido');
        }
    };

    return (
>>>>>>> ba7842dc29ff54d7d2bc8661fc09d3741e792a08
    <View style={styles.container}>
      <Text style={styles.title}>Registro</Text>
      <TextInput
<<<<<<< HEAD
        label="Email"
=======
        style={styles.input}
        placeholder="Nome"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
>>>>>>> ba7842dc29ff54d7d2bc8661fc09d3741e792a08
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

      <Text
        style={styles.loginText}
        onPress={() => navigation.navigate("Login")}
      >
        Já tem uma conta? <Text style={styles.loginLink}>Entrar</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff"
  },
  title: {
    marginBottom: 30,
    textAlign: "center",
    color: "#333"
  },
  button: {
    marginTop: 10,
    paddingVertical: 8
  },
  loginText: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 16,
    color: "#666"
  },
  loginLink: {
    color: "#1e88e5",
    fontWeight: "bold"
  }
});

export default Register;
