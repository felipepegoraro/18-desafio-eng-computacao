import { auth } from "../firebaseConfig";//db
import type { Note } from "../firestore/modelNotes";
import { createNote } from "../firestore/modelNotes";
import { useState, useEffect } from "react";
import { Picker } from '@react-native-picker/picker';
import { getUserNotes, getUserPets } from '../firestore/createUsers';
import type { Pet } from '../firestore/createPets';

import {
  ScrollView,
  View,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Button
} from "react-native";
import { Chip } from "react-native-paper";

const mock = {
  color: "#fffbe0"
};

// usuario possui nota?
    // se sim exibir as notas
    // se nao, tela "Adicione novas notas"
// cada nota: 
    // editavel
    // marcada como completada
    // deletavel
// (talvez: possibilidade de selecionar e (deletar | concluir))
// botao de criar novas notas




const NoteUI = () => {
    const user = auth.currentUser;
    const [notes, setNotes] = useState<Note[]>([]);
    const [pets, setPets] = useState<Pet[]>([]);
    const [selectedPetId, setSelectedPetId] = useState<string>("");
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");

    const [dogChecked, setDogChecked] = useState(false);
    const [catChecked, setCatChecked] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            if (user) {
                const userNotes = await getUserNotes(user.uid);
                const userPets = await getUserPets(user.uid);
                console.log(userPets)
                if (userNotes) setNotes(userNotes);
                if (userPets) setPets(userPets);
                console.log(userNotes);
            }
        };

        fetchUserData();
    }, [user]);

    const handleCreateNote = async () => {
        if (title && text && selectedPetId) {
            await createNote(user!.uid, selectedPetId, title, text, null);
            setTitle("");
            setText("");
            setSelectedPetId("");

            const userNotes = await getUserNotes(user!.uid);
            if (userNotes) setNotes(userNotes);
        } else {
            alert("Por favor, preencha todos os campos!");
        }
    };

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
            {notes.length > 0 ? (
                <ScrollView>
                    {notes.map((note, index) => (
                        <View key={index} style={styles.noteContainer}>
                            <TextInput
                                style={styles.title}
                                editable={true}
                                value={note.title}
                                onChangeText={(text) => {}}
                            />
                            <TextInput
                                value={note.content}
                                onChangeText={(text) => {}}
                                multiline={true}
                                style={styles.textInput}
                                placeholder="Escreva sua nota aqui..."
                                autoFocus={false}
                                editable={true}
                            />
                        </View>
                    ))}
                </ScrollView>
            ) : ( <>
                {/*adicionar texto: "CRIE SUA PRIMEIRA NOTA" ou algo do tipo, antes disso tudo: */}
                <Picker
                    selectedValue={selectedPetId}
                    onValueChange={(itemValue: string) => setSelectedPetId(itemValue)}
                >
                    <Picker.Item label="Selecione um pet" value={""} />
                    {pets.map((pet) => (
                        <Picker.Item key={pet.id} label={pet.name} value={pet.id} />
                    ))}
                </Picker> 

                <View>
                    <TextInput
                        style={styles.title}
                        placeholder="Título da nota"
                        value={title}
                        onChangeText={setTitle}
                    />
                    <TextInput
                        value={text}
                        onChangeText={setText}
                        multiline={true}
                        style={styles.textInput}
                        placeholder="Escreva sua nota aqui..."
                    />
                    <Button title="Criar Nota" onPress={handleCreateNote} />
                </View>
            </>)}
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

export default NoteUI;
