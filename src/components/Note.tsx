import { auth } from "../firebaseConfig";//db
import type { Note } from "../firestore/modelNotes";
import { createNote, editNote } from "../firestore/modelNotes";
import { useState, useEffect } from "react";
import { Picker } from '@react-native-picker/picker';
import { getUserNotes, getUserPets } from '../firestore/createUsers';
import type { Pet } from '../firestore/createPets';

// temporario: 
import registerNewPet from '../components/registerNewPet';

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

// usuario possui nota? (OK)
    // se sim exibir as notas (OK)
    // se nao, tela "Adicione novas notas" (+- né)
// cada nota: 
    // editavel (OK)
    // marcada como completada (X)
    // deletavel (X)
// (talvez: possibilidade de selecionar e (deletar | concluir))
// botao de criar novas notas (X)


const NoteUI = () => {
    const user = auth.currentUser;
    const [notes, setNotes] = useState<Note[]>([]);
    const [pets, setPets] = useState<Pet[]>([]);
    const [selectedPetId, setSelectedPetId] = useState<string>("");

    // overengineering???? eu nao sei!
    // const [editingNotes, setEditingNotes] = useState<{ [key: string]: { title: string, text: string } }>({});
    const [editingNotes, setEditingNotes] = useState<{ [key: string]: Note }>({});

    const [dogChecked, setDogChecked] = useState(false);
    const [catChecked, setCatChecked] = useState(false);

    useEffect(() => {
        fetchUserData();
    }, [user]);

    const fetchUserData = async () => {
        if (user) {
            const userNotes = await getUserNotes(user.uid);
            const userPets = await getUserPets(user.uid);
            if (userNotes) setNotes(userNotes);
            if (userPets) setPets(userPets);
        }
    };

    const handleCreateNote = async () => {
        if (editingNotes['new']?.title && editingNotes['new']?.content && selectedPetId) {
            await createNote(user!.uid, selectedPetId, editingNotes['new'].title, editingNotes['new'].content, null);
            resetNoteFields();
            refreshUserNotes();
        } else {
            alert("Por favor, preencha todos os campos!");
        }
    };

    // export const editNote = async (noteId: string, newNote: Note): Promise<boolean>
    const handleEditNote = (id: string, field: "title" | "content", value: string) => {
        setEditingNotes((prev) => ({
            ...prev,
            [id]: {
                ...prev[id],
                [field]: value
            }
        }));
    };

    const resetNoteFields = () => {
        setEditingNotes(prevState => ({
            ...prevState,
            new: {} as Note
        }));
        setSelectedPetId("");
    };

    const refreshUserNotes = async () => {
        const userNotes = await getUserNotes(user!.uid);
        if (userNotes) setNotes(userNotes);
    };

    const renderNoteEditor = (note: Note, index: number) => {
        console.log("renderizando:", note.id);
        const associatedPet = pets.find((pet) => pet.name === note.petId);

        if (!(catChecked && dogChecked)) {
            if (catChecked && associatedPet?.type !== "CAT") return null;
            if (dogChecked && associatedPet?.type !== "DOG") return null;
        }

        const currentEditingNote = editingNotes[note.id] || { ...note };

        return (
            <View key={index} style={styles.noteContainer}>
                <TextInput
                    style={styles.title}
                    editable={true}
                    value={currentEditingNote.title}
                    onChangeText={(text) => handleEditNote(note.id, "title", text)}
                />
                <TextInput
                    value={currentEditingNote.content}
                    onChangeText={(text) => handleEditNote(note.id, "content", text)}
                    multiline={true}
                    style={styles.textInput}
                    placeholder="Escreva sua nota aqui..."
                    autoFocus={false}
                    editable={true}
                />
            </View>
        );
    };

    const renderNoteList = () => (
        <ScrollView>
            {notes.map((note, index) => renderNoteEditor(note, index))}
        </ScrollView>
    );

    const renderCreateNoteSection = () => (
        <>
            <Picker
                selectedValue={selectedPetId}
                onValueChange={(itemValue: string) => setSelectedPetId(itemValue)}
            >
                <Picker.Item label="Selecione um pet" value={""} />
                {pets.map((pet) => (
                    <Picker.Item key={pet.name} label={pet.name} value={pet.name} />
                ))}
            </Picker>

            <View>
                <TextInput
                    style={styles.title}
                    placeholder="Título da nota"
                    value={editingNotes['new']?.title || ""}
                    onChangeText={(text) => handleEditNote('new', "title", text)}
                />
                <TextInput
                    value={editingNotes['new']?.content || ""}
                    onChangeText={(text) => handleEditNote('new', "content", text)}
                    multiline={true}
                    style={styles.textInput}
                    placeholder="Escreva sua nota aqui..."
                />
                <Button title="Criar Nota" onPress={handleCreateNote} />
            </View>
        </>
    );

    const renderPetSelection = () => (
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
    );

    const handleSaveNotes = async () => {
        const promises = notes.map(note => {
            const editedNote: Note = {
                ...note,
                title: editingNotes[note.id]?.title || note.title,
                content: editingNotes[note.id]?.content || note.content
            };

            console.log("editado: ", editedNote);
            return editNote(note.id, editedNote);
        });

        try {
            await Promise.all(promises);
            refreshUserNotes();
        } catch (error) {
            console.error("Erro ao salvar notas:", error);
        }
    };

    return (
        <View style={styles.container}>
            <View  style={styles.contentContainer}> {/*antes: <KeyboardAvoidingView behavior="padding"> */}
                {renderPetSelection()}
                {notes.length > 0 ? renderNoteList() : renderCreateNoteSection()}

                <Button onPress={handleSaveNotes} title="Salvar Notas"/>
                {renderCreateNoteSection()}
                {/*testando reegisterNewPet(...)*/}
            </View>
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
