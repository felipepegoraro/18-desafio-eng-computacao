import { useState } from "react";
import { View, StyleSheet } from "react-native";
import {
  Card,
  Text,
  Avatar,
  Button,
  Modal,
  TextInput,
  Portal
} from "react-native-paper";
import type { Pet } from "../firestore/createPets";
import { deletePet, updatePet } from "../firestore/createPets";

type PetCardProps = {
  pet: Pet;
  index: number;
  userId: string;
  refreshData: () => void; // Novo parâmetro
};

const PetCard = (props: PetCardProps) => {
  const { pet, index, userId, refreshData } = props;
  const defaultImage =
    "https://cdn-icons-png.flaticon.com/512/5094/5094257.png";

  const [visible, setVisible] = useState(false);
  const [editedPet, setEditedPet] = useState({ ...pet });

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const handleEdit = async () => {
    await updatePet(pet.id, editedPet);
    refreshData(); // Atualiza a tela após editar
    hideModal();
  };

  const handleDelete = async () => {
    await deletePet(pet, userId);
    refreshData(); // Atualiza a tela após deletar
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
          <Text style={styles.petInfo}>Espécie: {pet.breed}</Text>
          <Text style={styles.petInfo}>Peso: {pet.weight}</Text>
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
            onPress={handleDelete}
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
              onChangeText={(text) =>
                setEditedPet({ ...editedPet, name: text })
              }
              style={styles.input}
            />
            <Button
              mode="contained"
              onPress={handleEdit}
              style={styles.editButton}
            >
              Salvar
            </Button>
          </View>
        </Modal>
      </Portal>
    </>
  );
};

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
    elevation: 5
  },
  input: {
    marginBottom: 15
  },
  editButton: {
    marginTop: 15
  }
});
