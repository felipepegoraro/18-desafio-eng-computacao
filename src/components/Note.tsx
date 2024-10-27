import { auth } from "../firebaseConfig"; //db

import type { Note } from "../firestore/modelNotes";
import {
  createNote,
  editNote,
  deleteNote,
  markAsCompleted
} from "../firestore/modelNotes";

import { getUserNotes, getUserPets } from "../firestore/createUsers";
import type { Pet } from "../firestore/createPets";

import { useState, useEffect } from "react";
import { ScrollView, View, StyleSheet, TextInput } from "react-native";
import {
  Chip,
  FAB,
  Portal,
  Button,
  Modal,
  Menu,
  Icon,
  IconButton
} from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker, {
  DateTimePickerEvent
} from "@react-native-community/datetimepicker";

const formatDate = (date: Date | null): string => {
  if (!date) return "Selecione a data";
  //console.log(date);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const mock = {
  color: "#f2f2f2"
};

type NoteFilters = {
  dog: boolean;
  cat: boolean;
  completed: boolean;
};

const NoteUI = () => {
  //console.log("NOTEUI: renderizado de novo");
  const user = auth.currentUser;

  const [notes, setNotes] = useState<Note[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);

  const [selectedPetId, setSelectedPetId] = useState<string>("");

  const [editingNotes, setEditingNotes] = useState<{ [key: string]: Note }>({});
  const [showDataPicker, setShowDataPicker] = useState<{
    [key: string]: boolean;
  }>({});

  const [selectedFilters, setSelectedFilters] = useState<NoteFilters>({
    dog: false,
    cat: false,
    completed: false
  });

  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const containerStyle = {
    backgroundColor: "white",
    borderRadius: 5,
    padding: 20,
    marginLeft: 30,
    marginRight: 30
  };

  const fetchUserData = async () => {
    if (user) {
      const userNotes = await getUserNotes(user.uid);
      const userPets = await getUserPets(user.uid);
      if (userNotes) setNotes(userNotes);
      if (userPets) setPets(userPets);
    }
  };

  useEffect(() => {
    fetchUserData();
    refreshUserNotes();
  }, [user]);

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
      setModalVisible(false);
      resetNoteFields();
      refreshUserNotes();
    } else {
      alert("Por favor, preencha todos os campos!");
    }
  };

  const handleEditNote = (
    id: string,
    field: "title" | "content" | "dueDate",
    value: string | Date
  ) => {
    //console.log(value);
    setEditingNotes((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value
      }
    }));
    handleSaveNotes();
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

  const renderNoteEditor = (note: Note, _: number) => {
    const currentEditingNote = {
      ...note,
      ...(editingNotes[note.id] || {})
    };

    const pet = pets.find((i) => i.id === currentEditingNote.petId);

    if (
      !(selectedFilters.dog && selectedFilters.cat && selectedFilters.completed)
    ) {
      if (selectedFilters.dog && pet?.type !== "dog") return null;
      if (selectedFilters.cat && pet?.type !== "cat") return null;
      if (selectedFilters.completed && note.completedAt === null) return null;
    }

    const getCompletionStatus = (date: Date | null): number => {
      if (!date) return -1;

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const comparison = date.setHours(0, 0, 0, 0) - today.getTime();

      if (comparison < 0) {
        console.warn("Data passada");
        return 0;
      } else if (comparison === 0) {
        console.warn("Hoje");
        return 1;
      } else {
        console.warn("Data futura");
        return 2;
      }
    };

    const renderStatusIcon = (note: {
      completedAt: Date | null;
      dueDate: Date | null;
    }) => {
      if (note.completedAt)
        return <Icon source="check-bold" color="green" size={20} />;

      const status = getCompletionStatus(note.dueDate);

      const iconProps = {
        source: "clock-time-ten-outline",
        size: 20
      };

      switch (status) {
        case 0:
          return <Icon {...iconProps} color="red" />;
        case 1:
          return <Icon {...iconProps} color="gray" />;
        case 2:
          return <Icon {...iconProps} color="green" />;
        default:
          return null;
      }
    };

    return (
      <View
        key={note.id}
        style={[
          styles.noteContainer,
          note.completedAt != null && styles.completedNoteContainer
        ]}
      >
        <TextInput
          style={styles.title}
          editable={true}
          value={currentEditingNote.title}
          onChangeText={(text) => handleEditNote(note.id, "title", text)}
          onEndEditing={handleSaveNotes}
        />
        <TextInput
          value={currentEditingNote.content}
          onChangeText={(text) => handleEditNote(note.id, "content", text)}
          onEndEditing={handleSaveNotes}
          multiline={true}
          style={styles.textInput}
          placeholder="Escreva sua nota aqui..."
        />
        <View
          style={{
            display: "flex",
            position: "absolute",
            left: 295,
            top: 0
          }}
        >
          <Menu
            visible={visibleMenu === note.id}
            onDismiss={closeMenu}
            anchor={
              <IconButton
                icon="paw"
                iconColor="#6750a4"
                size={24}
                style={styles.menuButton}
                onPress={() => openMenu(note.id)}
              />
            }
          >
            <Menu.Item
              onPress={() => handleDeleteNote(note.id)}
              title="Excluir"
              leadingIcon="delete"
            />
            <Menu.Item
              onPress={() => handleCompleteNote(note.id)}
              title="Concluir"
              leadingIcon="check"
            />
          </Menu>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Button
            onPress={() => {
              setShowDataPicker((prev) => ({ ...prev, [note.id]: true }));
              //console.log("OK: "+ showDataPicker)
            }}
          >
            {currentEditingNote.dueDate
              ? formatDate(currentEditingNote.dueDate)
              : "Selecione a data"}
          </Button>

          {renderStatusIcon(currentEditingNote)}

          {showDataPicker[note.id] && (
            <DateTimePicker
              value={currentEditingNote.dueDate || new Date()}
              mode="date"
              display="default"
              onChange={(_: DateTimePickerEvent, selectedDate?: Date) => {
                setShowDataPicker((prev) => ({ ...prev, [note.id]: false }));
                if (selectedDate)
                  handleEditNote(note.id, "dueDate", selectedDate);
              }}
            />
          )}
        </View>
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
          setSelectedPetId(itemValue);
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
          Criar Nota
        </Button>
      </View>
    </>
  );

  const renderPetSelection = () => (
    <View style={styles.selectContainer}>
      <Chip
        icon="cat"
        style={[styles.chip, selectedFilters.cat ? styles.selectedChip : {}]}
        textStyle={selectedFilters.cat ? {} : styles.unselectedText}
        onPress={() =>
          setSelectedFilters((prev) => ({ ...prev, cat: !prev.cat }))
        }
      >
        Gato
      </Chip>
      <Chip
        icon="dog"
        style={[styles.chip, selectedFilters.dog ? styles.selectedChip : {}]}
        textStyle={selectedFilters.dog ? {} : styles.unselectedText}
        onPress={() =>
          setSelectedFilters((prev) => ({ ...prev, dog: !prev.dog }))
        }
      >
        Cachorro
      </Chip>

      {/*alterar o icone*/}
      <Chip
        icon="dog"
        style={[
          styles.chip,
          selectedFilters.completed ? styles.selectedChip : {}
        ]}
        textStyle={selectedFilters.completed ? {} : styles.unselectedText}
        onPress={() =>
          setSelectedFilters((prev) => ({
            ...prev,
            completed: !prev.completed
          }))
        }
      >
        Completado
      </Chip>
    </View>
  );

  const handleSaveNotes = async () => {
    const promises = Object.keys(editingNotes).map((id) => {
      const editedNote = {
        ...notes.find((note) => note.id === id),
        ...editingNotes[id],
        dueDate: editingNotes[id].dueDate
      };
      //console.log("EDITED: ", editedNote);
      return editNote(id, editedNote);
    });

    try {
      await Promise.all(promises);
      await refreshUserNotes();
      //console.log("Notas atualizadas com sucesso.");
    } catch (error) {
      console.error("Erro ao salvar notas:", error);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      console.warn("DELETAR ", noteId);
      await deleteNote(noteId);
      await refreshUserNotes();
    } catch (error) {
      //console.log("erro ao deletar a nota: ", error);
    }
  };

  const [visibleMenu, setVisibleMenu] = useState<string | null>(null);

  const openMenu = (noteId: string) => setVisibleMenu(noteId);
  const closeMenu = () => setVisibleMenu(null);

  const handleCompleteNote = async (noteId: string) => {
    try {
      //console.log("Nota concluída: ", noteId);
      await markAsCompleted(noteId);
      await refreshUserNotes();
    } catch (error) {
      //console.log("Erro ao concluir a nota: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        {renderPetSelection()}
        {notes.length > 0 ? renderNoteList() : renderCreateNoteSection()}
      </View>

      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={containerStyle}
        >
          {renderCreateNoteSection()}
        </Modal>

        <FAB
          style={styles.fab}
          visible
          icon="plus"
          onPress={() => setModalVisible(true)}
        />
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
  menuButton: {},
  noteContainer: {
    backgroundColor: mock.color,
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
    backgroundColor: mock.color,
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
    marginTop: 20
  },
  submitDeleteButton: {
    marginTop: 10,
    backgroundColor: "#ff9898"
  },
  submitCompletedButton: {
    marginTop: 10,
    backgroundColor: "#acffac"
  },
  selectedNoteContainer: {
    borderColor: "#007aff",
    borderWidth: 2
  },
  completedNoteContainer: {
    borderColor: "#acffac",
    borderWidth: 2
  }
});

export default NoteUI;
