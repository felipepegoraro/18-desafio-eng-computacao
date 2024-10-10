import { View, StyleSheet } from "react-native";
import { Card, Text, Avatar, Button } from "react-native-paper";

export default function PetCard({
  PesoPet,
  EspeciePet,
  NomePet,
  DadoExtraPet,
  ImgPet
}) {
  return (
    <Card style={styles.cardPet}>
      <View style={styles.imageContainer}>
        <Avatar.Image
          size={120}
          source={{ uri: ImgPet }}
          style={styles.avatarPet}
        />
      </View>

      <Card.Content style={styles.cardContent}>
        <Text style={styles.petName}>{NomePet}</Text>
        <Text style={styles.petInfo}>{DadoExtraPet}</Text>
        <Text style={styles.petInfo}>Peso: {PesoPet}</Text>
        <Text style={styles.petInfo}>Espécie: {EspeciePet}</Text>
      </Card.Content>

      <Card.Actions style={styles.cardActions}>
        <Button
          mode="contained"
          onPress={() => console.log("Editar")}
          style={styles.actionButton}
        >
          Editar
        </Button>
        <Button
          mode="outlined"
          onPress={() => console.log("Remover")}
          style={styles.actionButton}
        >
          Remover
        </Button>
      </Card.Actions>
    </Card>
  );
}

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
  }
});
