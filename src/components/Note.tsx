import React, { useState } from "react";

import { ScrollView, View, StyleSheet, TextInput } from "react-native";
import { Text, RadioButton } from "react-native-paper";

const Note = () => {
  const [value, setValue] = useState("first");
  const [text, setText] = useState("");
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  const mock = {
    title: "AAAAAAAAAAAAAA",
    content: "BBBBBBBBBBBBBB",

    color: "#32CD32",
    /*cor aleatoria?*/

    pet: {
      gato: "Gato01",
      cachorro: "Cachorro01"
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text>{mock.title}</Text>
        <Text>{mock.content}</Text>
        <RadioButton.Group
          onValueChange={(value) => setValue(value)}
          value={value}
        >
          <RadioButton.Item label={mock.pet.gato} value="first" />
          <RadioButton.Item label={mock.pet.cachorro} value="second" />
        </RadioButton.Group>

        <TextInput
          placeholder="Anotação sobre seu pet"
          value={text}
          onChangeText={(text) => setText(text)}
          style={styles.cardContent}
        />
      </ScrollView>
    </View>
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
  cardContent: {
    backgroundColor: "#d8d8d8",
    // minHeight: "30%", isso aqui tem q pegar a tela que sobrar
    margin: 0,
    padding: 5
  }
});
export default Note;
