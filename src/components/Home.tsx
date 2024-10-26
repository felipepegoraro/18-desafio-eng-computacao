import { useEffect, useState, useCallback } from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { Text, Provider, ActivityIndicator } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";

import { db, auth } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

import RegisterNewPet from "./registerNewPet";
import PetList from "./PetList";

const Home = ({ navigation }) => {
  const user = auth.currentUser;
  const [loading, setLoading] = useState(true);
  const [ownsPet, setOwnsPet] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const fetchUserData = async () => {
        setLoading(true);
        try {
          if (user) {
            console.log("Current user UID:", user.uid);
            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              console.log("data:", docSnap.data());
              setOwnsPet(docSnap.data().ownsPet);
            } else {
              console.log("Sem doc!");
            }
          } else {
            console.log("Nenhum usuario logado");
          }
        } catch (error) {
          console.error("erro fetching o nome", error);
        } finally {
          setLoading(false);
        }
      };

      fetchUserData();
    }, [user])
  );

  return (
    <Provider>
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={
            loading ? styles.loadingContainer : styles.scrollContainer
          }
          scrollEnabled={!loading}
        >
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator animating={true} size={"large"} />
            </View>
          ) : !ownsPet ? (
            <View>
              <Text>Ei! Parece que você não tem nenhum pet.</Text>
              <RegisterNewPet />
            </View>
          ) : (
            <PetList />
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
  loadingContainer: {
    display: "flex",
    minHeight: 680,
    justifyContent: "space-around",
    alignItems: "center"
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
    marginHorizontal: 10,
    width: "40%"
  }
});

export default Home;
