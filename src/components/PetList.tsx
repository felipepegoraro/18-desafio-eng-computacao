import PetCard from "./PetCard";
import type { Pet } from "../firestore/createPets";
import { getUserPets } from "../firestore/createUsers";
import { auth } from "../firebaseConfig";
import { useState, useEffect } from "react";
import { ScrollView } from "react-native";

const PetList = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const user = auth.currentUser;

  const fetchUserData = async () => {
    if (user) {
      const pets = await getUserPets(user.uid);
      setPets(pets ?? []);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [user]);

  return (
    <ScrollView>
      {pets.map((pet: Pet, index: number) => PetCard(pet, index))}
    </ScrollView>
  );
};

export default PetList;
