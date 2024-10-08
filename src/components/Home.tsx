// src/components/Home.js
import React, { useState } from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import {
  Card,
  Text,
  FAB,
  Portal,
  Provider,
  useTheme
} from "react-native-paper";

import { auth } from "../firebaseConfig";

const Home = () => {
  const theme = useTheme();

  // MOCKUP NOTAS
  const notes = [
    {
      id: 1,
      title: "Nota 1",
      content: "Descrição da nota 1...",
      color: "#FFD700"
    },
    {
      id: 2,
      title: "Nota 2",
      content: "Descrição da nota 2...",
      color: "#1E90FF"
    },
    {
      id: 3,
      title: "Nota 3",
      content: "Descrição da nota 3...",
      color: "#32CD32"
    },
    {
      id: 4,
      title: "Nota 4",
      content: "Descrição da nota 4...",
      color: "#FF6347"
    }
  ];

  const user = auth.currentUser;

  const [state, setState] = useState({ open: false });
  const onStateChange = ({ open }) => setState({ open });
  const { open } = state;

  return (
    <Provider>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {notes.map((note) => (
            <Card
              onLongPress={() =>
                console.log("SEGURAR DA OPÇÃO DE DELETAR...popup?/modal?")
              }
              onPress={() => console.log("CLICAR ENTRA NA NOTA")}
              key={note.id}
              style={[styles.card, { backgroundColor: note.color }]}
            >
              <Card.Content>
                <Text variant="titleLarge" style={styles.cardTitle}>
                  {note.title}
                </Text>
                <Text style={styles.cardContent}>{note.content}</Text>
              </Card.Content>
            </Card>
          ))}
        </ScrollView>

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
                icon: "bell",
                //   Adicionar lembretes/alarme
                label: "Lembretes",
                onPress: () => console.log("Pressed Lembretes")
              },
              {
                // Adiciona caixas de notas
                icon: "note-edit",
                label: "Notas",
                onPress: () => console.log("Pressed Notas")
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
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  scrollContainer: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    justifyContent: "center"
  },
  card: {
    // minHeight: 150,
    marginBottom: 15,
    borderRadius: 15
  },
  cardTitle: {
    fontWeight: "bold",
    color: "#fff"
  },
  cardContent: {
    color: "#fff",
    minHeight: 100,
    marginTop: 5
  },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 16,
    backgroundColor: "#1E88E5"
  }
});

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#fff"
//   },
//   title: {
//     fontSize: 24
//   },
//   email: {
//     fontSize: 18,
//     marginTop: 10
//   },
//   fab: {
//     position: "absolute",
//     margin: 16,
//     right: 0,
//     bottom: 0
//   }
// });
// <View style={styles.container}>
//   <Text style={styles.title}>Bem-vindo à Home!</Text>
//   {user ? (
//     <Text style={styles.email}>Seu e-mail: {user.email}</Text>
//   ) : (
//     <Text style={styles.email}>Nenhum usuário logado</Text>
//   )}
export default Home;
