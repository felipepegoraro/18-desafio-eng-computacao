import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Card, Text, Avatar, Button, Modal, TextInput, Portal } from "react-native-paper";
import type { Pet } from "../firestore/createPets";
import { deletePet, updatePet } from '../firestore/createPets'

const birthString = (date: Date): string => {
  if (!date) return "";

  const today = new Date();
  const diffTime = today.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  //ctz q vai ficar até o final
  if (diffDays < 0) return "viajante do tempo"; // remover dps

  const years = Math.floor(diffDays / 365);
  const months = Math.floor((diffDays % 365) / 30);
  const days = diffDays % 30;

  let ret = "";

  if (years > 0) ret += `${years} ano${years > 1 ? "s" : ""}`;
  if (months == 0 && ret !== "") return ret;
  if (months > 0)
    ret += `${ret ? ", " : ""}${months} m${months > 1 ? "eses" : "ês"}`;
  if (years == 0 && days > 0)
    ret += `${ret ? ", " : ""}${days} dia${days !== 1 ? "s" : ""}`;

  return ret;
};

type PetCardProps = {
  pet: Pet;
  index: number;
  userId: string;
};

const PetCard = (props: PetCardProps) => {
  const {pet, index, userId} = props;
  const defaultImage =
    "https://cdn-icons-png.flaticon.com/512/5094/5094257.png";

  const [visible, setVisible] = useState(false);
  const [editedPet, setEditedPet] = useState({ ...pet });


  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
    
  const handleEdit = async () => {
    await updatePet(pet.id, editedPet); 
    console.log("Pet editado:", editedPet);
    hideModal();
  };

  return (
        <>
        <Card style={styles.cardPet}>
          <View style={styles.imageContainer}>
            <Avatar.Image
              size={120}
              source={{ uri: pet.image || defaultImage }}
              style={styles.avatarPet}
            />
          </View>

          <Card.Content style={styles.cardContent} key={index}>
            <Text style={styles.petName}>{pet.name}</Text>
            {pet.breed && <Text style={styles.petInfo}>{pet.notes}</Text>}
            <Text style={styles.petInfo}>Idade: {birthString(pet.birthDate)}</Text>
            <Text style={styles.petInfo}>Peso: {pet.weight}</Text>
            <Text style={styles.petInfo}>Espécie: {pet.breed}</Text>
          </Card.Content>

          <Card.Actions style={styles.cardActions}>
            <Button
              mode="contained"
              onPress={showModal}
              style={styles.actionButton}
            >
              Editar
            </Button>
            <Button
              mode="outlined"
              onPress={() => deletePet(pet,userId)}
              style={styles.actionButton}
            >
              Remover
            </Button>
          </Card.Actions>
        </Card>
          <Portal>
        <Modal visible={visible} onDismiss={hideModal}>
          <View style={styles.modalContent}>
            <TextInput
              label="Nome"
              value={editedPet.name}
              onChangeText={(text) => setEditedPet({ ...editedPet, name: text })}
              style={styles.input}
            />
            <TextInput
              label="Espécie"
              value={editedPet.breed}
              onChangeText={(text) => setEditedPet({ ...editedPet, breed: text })}
              style={styles.input}
            />
            <TextInput
              label="Peso"
              value={editedPet.weight.toString()}
              onChangeText={(text) => setEditedPet({ ...editedPet, weight: Number(text) })}
              style={styles.input}
              keyboardType="numeric"
            />
            <Button mode="contained" onPress={handleEdit} style={styles.editButton}>
              Salvar
            </Button>
          </View>
        </Modal>
      </Portal>

    </>
  );
}

export default PetCard;

const styles = StyleSheet.create({
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
  },
  modalContent: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 5,
  },
  input: {
    marginBottom: 15,
  },
  editButton: {
    marginTop: 15,
  }
});
