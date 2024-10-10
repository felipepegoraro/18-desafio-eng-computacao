// src/components/Home.js
import { useEffect, useState } from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import {
  Card,
  Text,
  FAB,
  Portal,
  Provider,
  useTheme
} from "react-native-paper";

import { db, auth } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import Register from "./Register";
import RegisterNewPet from "./registerNewPet";

const Home = ({ navigation }) => {
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
  const [username, setUsername] = useState("");
  const [ownsPet, setOwnsPet] = useState(false);

  useEffect(() => {
    const fetchUserName = async () => {
    setIsLoading(true);
      try {
        if (user) {
          console.log("Current user UID:", user.uid);
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            console.log("data:", docSnap.data());
            setUsername(docSnap.data().name);
            setOwnsPet(docSnap.data().ownsPet);
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
    <Provider>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {ownsPet ? (
            //TODO: Se tiver pets, mostrar eles como Card
            <Text>BBBBBBBBBBB</Text>
          ) : //TODO: Botar animação de loading enquanto carrega info
          user && user.uid ? (
            <RegisterNewPet/>
          ) : (
            <Text>Erro: Nenhum usuário logado</Text>
          )}
        </ScrollView>
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

export default Home;
