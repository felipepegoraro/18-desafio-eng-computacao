import React, { useState } from "react";
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
import * as ImagePicker from "expo-image-picker";

const RegisterNewPet = ({ userId }) => {
  const [name, setName] = useState("");
  const [breed, setBreed] = useState("");
  const [gender, setGender] = useState("");
  const [weight, setWeight] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [notes, setNotes] = useState("");
  const [type, setType] = useState("DOG");
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });

    if (!result.canceled) {
      setImage(result.uri);
    }
  };

  const handleSubmit = async () => {
    const newPet = {
      userId,
      name,
      type,
      breed,
      gender,
      weight: Number(weight),
      birthDate: new Date(birthDate),
      notes: notes || undefined
    };
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
                image ||
                "https://cdn-icons-png.flaticon.com/512/5094/5094257.png"
            }}
          />
          <IconButton icon="camera" size={30} onPress={pickImage} />
        </View>

        <TextInput
          label="Nome do Pet"
          mode="outlined"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />

        <View style={styles.radioGroup}>
          <Text style={styles.radioLabel}>Espécie:</Text>
          <RadioButton.Group
            onValueChange={(value) => setType(value)}
            value={type}
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
          value={breed}
          onChangeText={setBreed}
          style={styles.input}
        />

        <View style={styles.radioGroup}>
          <Text style={styles.radioLabel}>Gênero:</Text>
          <RadioButton.Group
            onValueChange={(value) => setGender(value)}
            value={gender}
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
          value={weight}
          onChangeText={setWeight}
          style={styles.input}
        />

        <TextInput
          label="Data de Nascimento"
          mode="outlined"
          placeholder="DD-MM-YYYY"
          value={birthDate}
          onChangeText={setBirthDate}
          style={styles.input}
        />

        <TextInput
          label="Nota"
          mode="outlined"
          multiline
          numberOfLines={4}
          value={notes}
          onChangeText={setNotes}
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
