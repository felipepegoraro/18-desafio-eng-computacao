// src/components/Register.js
import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import {
  TextInput,
  Button,
  Text,
  // useTheme,
  HelperText
} from "react-native-paper";
import { auth } from "../firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "firebase/auth";
import { createUser } from "../firestore/createUsers";

const Register = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  // const theme = useTheme();

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const userId = userCredential.user.uid;
      await createUser(userId, name, email);

      signInWithEmailAndPassword(auth, email, password).then(() => {
        navigation.navigate("Home");
      });
    } catch (error: unknown) {
      if (error instanceof Error) setErrorMessage(error.message);
      else setErrorMessage("Ocorreu um erro desconhecido");
    }
  };

  const hasErrors = () => {
    return email === "" || password === "";
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineLarge" style={styles.title}>
        Registrar
      </Text>

      <TextInput
        label="Nome"
        value={name}
        onChangeText={setName}
        mode="outlined"
        style={styles.input}
        left={<TextInput.Icon icon="account" />}
      />

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
        left={<TextInput.Icon icon="email" />}
      />
      <HelperText type="error" visible={email == "" || errorMessage != ""}>
        {errorMessage}
      </HelperText>

      <TextInput
        label="Senha"
        value={password}
        onChangeText={setPassword}
        mode="outlined"
        secureTextEntry
        style={styles.input}
        left={<TextInput.Icon icon="lock" />}
      />
      <HelperText type="error" visible={errorMessage != ""}>
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
    color: "#333",
    fontSize: 24
  },
  input: {
    marginBottom: 10
  },
  button: {
    marginTop: 10,
    paddingVertical: 8,
    borderRadius: 25
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
