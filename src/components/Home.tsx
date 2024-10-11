import { useEffect, useState } from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import {
  Card,
  Text,
  Provider,
  Avatar,
  Button,
  useTheme
} from "react-native-paper";

import { db, auth } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

import PetCard from "./PetCard";
import RegisterNewPet from "./registerNewPet";

const Home = ({ navigation }) => {
  const user = auth.currentUser;
  const theme = useTheme();

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

  // Dados do pet do usuario
  const mockPet = {
    PesoPet: "8kg",
    EspeciePet: "Cachorro",
    NomePet: "Max",
    DadoExtraPet: "Golden Retriever",
    ImgPet:
      "https://t3.ftcdn.net/jpg/08/08/50/08/360_F_808500839_PbOxOfC4bdGG8ttFazqi7fiziFlqlaSk.jpg"
  };

  return (
    <Provider>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {ownsPet ? (
            <RegisterNewPet />
          ) : //TODO: Botar animação de loading enquanto carrega info
          user && user.uid ? (
            <PetCard
              PesoPet={mockPet.PesoPet}
              EspeciePet={mockPet.EspeciePet}
              NomePet={mockPet.NomePet}
              DadoExtraPet={mockPet.DadoExtraPet}
              ImgPet={mockPet.ImgPet}
            />
          ) : (
            // <RegisterNewPet />
            <Text>Você ainda não cadastrou nenhum pet!</Text>
          )}
        </ScrollView>
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5"
  },
  scrollContainer: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    justifyContent: "center"
  },
  cardPet: {
    marginBottom: 15,
    borderRadius: 20,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5
  },
  imageContainer: {
    alignItems: "center",
    marginTop: 15
  },
  avatarPet: {
    borderColor: "#ccc",
    borderRadius: 60
  },
  cardContent: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: "center"
  },
  petName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5
  },
  petInfo: {
    fontSize: 16,
    color: "#666",
    marginBottom: 3
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "center",
    paddingBottom: 15,
    marginRight: "5%"
  },
  actionButton: {
    marginHorizontal: 10, // Adiciona espaçamento entre os botões
    width: "40%" // Mantém o tamanho dos botões
  }
});

export default Home;
