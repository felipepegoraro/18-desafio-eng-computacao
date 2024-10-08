// src/components/Home.js
import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { FAB, Portal } from "react-native-paper";

import { auth } from "../firebaseConfig";

const Home = () => {
  const user = auth.currentUser;

  const [state, setState] = useState({ open: false });
  const onStateChange = ({ open }) => setState({ open });
  const { open } = state;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo à Home!</Text>
      {user ? (
        <Text style={styles.email}>Seu e-mail: {user.email}</Text>
      ) : (
        <Text style={styles.email}>Nenhum usuário logado</Text>
      )}

      {/* TODO:
            FAB abre tela de criar anotações, novo atendimento e o que precisar...
            botar a lista das telas para serem feitas:{}
      */}

      <Portal>
        <FAB.Group
          open={open}
          visible
          icon={open ? "paw-off" : "paw"}
          actions={[
            {
              icon: "omega",
              label: "WIP...",
              onPress: () => console.log("Pressed add")
            },
            {
              // Adiciona caixas de notas
              icon: "note-edit",
              label: "Notas",
              onPress: () => console.log("Pressed Notas")
            },
            {
              icon: "bell",
              //   Adicionar lembretes/alarme
              label: "Lembretes",
              onPress: () => console.log("Pressed Lembretes")
            }
          ]}
          onStateChange={onStateChange}
          onPress={() => {
            if (open) {
            }
          }}
        />
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff"
  },
  title: {
    fontSize: 24
  },
  email: {
    fontSize: 18,
    marginTop: 10
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0
  }
});

export default Home;
