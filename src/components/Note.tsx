import { auth } from "../firebaseConfig"; //db
import type { Note } from "../firestore/modelNotes";
import { createNote, editNote, deleteNote, markAsCompleted } from "../firestore/modelNotes";
import { useState, useEffect } from "react";
import { Picker } from "@react-native-picker/picker";
import { getUserNotes, getUserPets } from "../firestore/createUsers";
import type { Pet } from "../firestore/createPets";

import {
  ScrollView,
  View,
  StyleSheet,
  TextInput,
} from "react-native";
import { Chip, FAB, Portal, Button, Modal } from "react-native-paper";
import React from "react";

const mock = {
  color: "#fffbe0"
};

// USUARIO POSSUI NOTA? (OK)
// SE SIM EXIBIR AS NOTAS (OK)
// SE NAO, TELA "aDICIONE NOVAS NOTAS" (OK)
  
// cada nota:
// editavel (OK)
// marcada como completada (X)
// deletavel (OK)
// (talvez: possibilidade de selecionar e (deletar | concluir)) [OK]
// botao de criar novas notas (OK)

const NoteUI = () => {
  const user = auth.currentUser;

  const [notes, setNotes] = useState<Note[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);

  const [selectedPetId, setSelectedPetId] = useState<string>("");
  const [selectedNoteIds, setSelectedNoteIds] = useState<string[]>([]);

  // overengineering???? eu nao sei!
  // const [editingNotes, setEditingNotes] = useState<{ [key: string]: { title: string, text: string } }>({});
  const [editingNotes, setEditingNotes] = useState<{ [key: string]: Note }>({});

  const [dogChecked, setDogChecked] = useState(false);
  const [catChecked, setCatChecked] = useState(false);

  const [visible, setVisible] = useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const containerStyle = {
    backgroundColor: "white",
    borderRadius: 5,
    padding: 20,
    marginLeft: 30,
    marginRight: 30
  };

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
    if (
      editingNotes["new"]?.title &&
      editingNotes["new"]?.content &&
      selectedPetId
    ) {
      await createNote(
        user!.uid,
        selectedPetId,
        editingNotes["new"].title,
        editingNotes["new"].content,
        null
      );
      hideModal();
      resetNoteFields();
      refreshUserNotes();
    } else {
      alert("Por favor, preencha todos os campos!");
    }
  };

  // export const editNote = async (noteId: string, newNote: Note): Promise<boolean>
  const handleEditNote = (
    id: string,
    field: "title" | "content",
    value: string
  ) => {
    setEditingNotes((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value
      }
    }));
  };

  const resetNoteFields = () => {
    setEditingNotes((prevState) => ({
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
      const currentEditingNote = editingNotes[note.id] || { ...note };
      const pet = pets.find(i => i.id === currentEditingNote.petId);
      console.log("pet(",index,"): ",pet);

      if (!(dogChecked && catChecked)){
          if (dogChecked && pet?.type !== "dog") return null;
          if (catChecked && pet?.type !== "cat") return null;
      }

      const isSelectedNote = selectedNoteIds.includes(note.id);
      console.log(selectedNoteIds);

      return (
        <View 
            key={note.id} 
            style={[
                styles.noteContainer,
                isSelectedNote && styles.selectedNoteContainer,
                note.completedAt != null && styles.completedCoteContainer]}
            onTouchEnd={() => setSelectedNoteIds((prev) => 
                isSelectedNote 
                ? prev.filter(id => note.id !== id)
                : [...prev, note.id]
            )}
            >

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
        onValueChange={(itemValue: string) => {
            setSelectedPetId(itemValue)
        }}
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
          value={editingNotes["new"]?.title || ""}
          onChangeText={(text) => handleEditNote("new", "title", text)}
        />
        <TextInput
          value={editingNotes["new"]?.content || ""}
          onChangeText={(text) => handleEditNote("new", "content", text)}
          multiline={true}
          style={styles.textInput}
          placeholder="Escreva sua nota aqui..."
        />
        <Button
          style={styles.submitSaveButton}
          mode="contained"
          onPress={handleCreateNote}
        >
          Salvar Nota
        </Button>
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
    const promises = notes.map((note) => {
      const editedNote: Note = {
        ...note,
        title: editingNotes[note.id]?.title || note.title,
        content: editingNotes[note.id]?.content || note.content,
      };

      return editNote(note.id, editedNote);
    });

    try {
      await Promise.all(promises);
      refreshUserNotes();
    } catch (error) {
      console.error("Erro ao salvar notas:", error);
    }
  };

  const handleDeleteNotes = async () => {
    const promises = selectedNoteIds.map(async (id: string) => {
        console.log("DELETAR ", id);
        await deleteNote(id);
    })

    try {
        await Promise.all(promises);
        setSelectedNoteIds([]);
        await refreshUserNotes();
    } catch(error){
        console.log("erro ao deletar notas selecionadas:  ", error);
    }
  }

  const handleCompletedNotes = async () => {
        const promises = selectedNoteIds.map(async (id: string) => {
            console.log("concluida: ", id);
            await markAsCompleted(id);
        })

        try {
            await Promise.all(promises);
            setSelectedNoteIds([]);
            await refreshUserNotes();
        } catch(error){
            console.log("erro ao concluir notas: ", error);
        }
  }

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        {renderPetSelection()}
        {notes.length > 0 ? renderNoteList() : renderCreateNoteSection()}
        <Button
          style={styles.submitSaveButton}
          mode="contained"
          onPress={handleSaveNotes}
        >
          Salvar Notas
        </Button>

        <Button
          style={styles.submitDeleteButton}
          mode="contained"
          onPress={handleDeleteNotes}
        >
          Apagar Notas
        </Button>

        <Button
          style={styles.submitCompletedButton}
          mode="contained"
          onPress={handleCompletedNotes}
        >
          Concluir Notas
        </Button>
      </View>

      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={containerStyle}
        >
          {renderCreateNoteSection()}
        </Modal>

        <FAB style={styles.fab} visible icon="plus" onPress={showModal} />
      </Portal>
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
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0
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
  },
  submitSaveButton: {
    marginTop: 20,
  },
  submitDeleteButton: {
    marginTop: 10,
    backgroundColor: "#f00"
  },
  submitCompletedButton: {
    marginTop: 10,
    backgroundColor: "#0f0"
  },
  // teste
  selectedNoteContainer: {
      // backgroundColor: "#d0e4ff",
      borderColor: "#007aff",
      borderWidth: 2
  },
  completedCoteContainer: {
    borderColor: "#0f0",
    borderWidth: 2
  }
});

export default NoteUI;
