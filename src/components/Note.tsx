import React, { useState } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView
} from "react-native";
import { Chip } from "react-native-paper";

const mock = {
  color: "#fffbe0"
};

const Note = () => {
  const [text, setText] = useState(
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
  );
  const [title, setTitle] = useState("Homework");

  const [dogChecked, setDogChecked] = useState(false);
  const [catChecked, setCatChecked] = useState(false);

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior="padding" style={styles.contentContainer}>
        <View style={styles.selectContainer}>
          <Chip
            icon="cat"
            style={[styles.chip, catChecked ? styles.selectedChip : {}]}
            textStyle={catChecked ? {} : styles.unselectedText}
            onPress={() => setCatChecked(!catChecked)}
          >
            Gato
          </Chip>
          <Chip
            icon="dog"
            style={[styles.chip, dogChecked ? styles.selectedChip : {}]}
            textStyle={dogChecked ? {} : styles.unselectedText}
            onPress={() => setDogChecked(!dogChecked)}
          >
            Cachorro
          </Chip>
        </View>

        {/* Seção de Nota */}
        <ScrollView>
          <View style={styles.noteContainer}>
            <TextInput
              style={styles.title}
              editable={true}
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              value={text}
              onChangeText={setText}
              multiline={true}
              style={styles.textInput}
              placeholder="Escreva sua nota aqui..."
              autoFocus={false}
              editable={true}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20
  },

  noteContainer: {
    // backgroundColor: "#fffbe0", // OU SETA TUDO DESSA COR AQUI MESMO E JA ERA
    backgroundColor: mock.color, // Cor de fundo MESMA DA COR NA HOME
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 1
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10
  },
  textInput: {
    // backgroundColor: "#fffbe0", // OU SETA TUDO DESSA COR AQUI MESMO E JA ERA
    backgroundColor: mock.color, // Cor de fundo MESMA DA COR NA HOME
    fontSize: 16,
    color: "#333",
    textAlignVertical: "top",
    minHeight: 200,
    borderWidth: 0
  },

  selectContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20
  },
  chip: {
    marginHorizontal: 10,
    borderRadius: 20,
    backgroundColor: "#f0f0f0"
  },
  selectedChip: {
    backgroundColor: "#ebdefa"
  },
  unselectedText: {
    color: "#999999"
  }
});

export default Note;
