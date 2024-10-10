import { auth } from "../firebaseConfig"; //db
import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import {
  TextInput,
  Button,
  Text,
  RadioButton,
  Avatar,
  IconButton
} from "react-native-paper";
import type { Pet } from '../firestore/createPets';
import { createPet } from '../firestore/createPets';
import * as ImagePicker from "expo-image-picker";

const RegisterNewPet = () => {
  const user = auth.currentUser;

  const [pet, setPet] = useState<Pet>({
    name: "",
    type: "DOG",
    breed: "",
    gender: "macho",
    weight: 0.0,
    birthDate: new Date(),
    notes: "",
    image: ""
  } as Pet);

  const [data, setData] = useState("");

  const isValidDate = (dataStr: string): boolean => {
        const regex = /^\d{2}-\d{2}-\d{4}$/;
        if (!regex.test(dataStr)) return false;
        const [d, m, y] = dataStr.split('-').map(Number);
        const data = new Date(y, m-1, d);
        return data.getDate() === d && data.getMonth() === m - 1 && data.getFullYear() === y;
    }

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });

    if (!result.canceled && result.assets.length > 0)
        setPet((prev) => ({ ...prev, image: result.assets[0].uri }));
  };

  const handleSubmit = async () => {
    if (pet && user) {
    console.log(user.uid);
      const newPet = {
        ...pet,
        userId: user.uid,
        birthDate: new Date(data),
      } as Pet;

      await createPet(newPet);
      console.log("pet criado com sucesso: \n\t", newPet);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.avatarContainer}>
          <Avatar.Image
            size={100}
            source={{
              uri:
                pet.image ||
                "https://cdn-icons-png.flaticon.com/512/5094/5094257.png"
            }}
          />
          <IconButton icon="camera" size={30} onPress={pickImage} />
        </View>

        <TextInput
          label="Nome do Pet"
          mode="outlined"
          value={pet.name}
          onChangeText={(text) => setPet((prev) => ({ ...prev, name: text }))}
          style={styles.input}
        />

        <View style={styles.radioGroup}>
          <Text style={styles.radioLabel}>Espécie:</Text>
          <RadioButton.Group
            onValueChange={(value) => setPet((prev) => ({ ...prev, type: value as "DOG" | "CAT"}))}
            value={pet.type}
          >
            <View style={styles.radioRow}>
              <RadioButton value="dog" />
              <Text>Cachorro</Text>
              <RadioButton value="cat" />
              <Text>Gato</Text>
            </View>
          </RadioButton.Group>
        </View>

        <TextInput
          label="Raça"
          mode="outlined"
          value={pet.breed}
          onChangeText={(text) => setPet((prev) => ({ ...prev, breed: text }))}
          style={styles.input}
        />

        <View style={styles.radioGroup}>
          <Text style={styles.radioLabel}>Gênero:</Text>
          <RadioButton.Group
            onValueChange={(value) => setPet((prev) => ({ ...prev, gender: value }))}
            value={pet.gender}
          >
            <View style={styles.radioRow}>
              <RadioButton value="Macho" />
              <Text>Macho</Text>
              <RadioButton value="Fêmea" />
              <Text>Fêmea</Text>
            </View>
          </RadioButton.Group>
        </View>

        <TextInput
          label="Peso (kg)"
          mode="outlined"
          keyboardType="numeric"
          value={pet.weight.toString()}
          onChangeText={(w) => setPet((prev) => ({ ...prev, weight: parseInt(w) || 0 }))}
          style={styles.input}
        />

        <TextInput
          label="Data de Nascimento"
          mode="outlined"
          placeholder="DD-MM-YYYY"
          value={data}
          onChangeText={(text: string) => setData(text)}
          style={styles.input}
          onBlur={() => {
                if (!isValidDate(data)){
                    alert("data inválida");
                    setData("");
                }
          }}
        />

        <TextInput
          label="Nota"
          mode="outlined"
          multiline
          numberOfLines={4}
          value={pet.notes}
          onChangeText={(text) => setPet((prev) => ({ ...prev, notes: text }))}
          style={styles.input}
        />

        <Button
          mode="contained"
          onPress={handleSubmit}
          style={styles.submitButton}
        >
          Cadastrar Pet
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flexGrow: 1
  },
  avatarContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20
  },
  input: {
    marginBottom: 10
  },
  radioGroup: {
    marginVertical: 10
  },
  radioRow: {
    flexDirection: "row",
    alignItems: "center"
  },
  radioLabel: {
    fontWeight: "bold"
  },
  submitButton: {
    marginTop: 20,
    marginBottom: 10
  }
});

export default RegisterNewPet;
