import { auth } from "../firebaseConfig";

import type { Note } from "../firestore/modelNotes";
import { getUserNotes } from "../firestore/createUsers";

import { Calendar } from "react-native-calendars";

import { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Modal,
  ScrollView,
  Pressable
} from "react-native";
import { Text, Button } from "react-native-paper";

interface MarkedDate {
  selected: boolean;
  marked: boolean;
  note: Array<Note>;
  dots: Array<{
    key: string;
    color: string;
    selectedDotColor: string;
  }>;
}

type MarkedDates = { [date: string]: MarkedDate };
type emBreveType = { fiveDays: number; today: Note[] } | null;

type ModalType = {
  note: Note[];
  visible: boolean;
};

const Agenda = () => {
  const user = auth.currentUser;
  const [markedDates, setMarkedDates] = useState<MarkedDates>({});
  const [emBreve, setEmBreve] = useState<emBreveType>(null);
  const [modalClickedDay, setModalClicked] = useState<ModalType>({
    note: [],
    visible: false
  });

  useEffect(() => {
    if (user) calendarNotes(user.uid);
  }, [user]);

  const formatDateCalendar = (date: Date | null): string => {
    if (!date) return "Data invalida";
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    // [formato]: YYYY/MM/DD -> DD/MM/YYYY
    return `${day < 10 ? "0" : ""}${day}-${month}-${year}`;
  };

  const colorsBasedOnToday = (note: Note) => {
    if (!note || !note.dueDate) return "#FFD700";

    const msd = 1000 * 60 * 60 * 24;
    const today = new Date();

    const todayMidnight = new Date(today.setHours(0, 0, 0, 0));
    const noteDateMidnight = new Date(note.dueDate.setHours(0, 0, 0, 0));

    const diffDays = Math.ceil(
      (noteDateMidnight.getTime() - todayMidnight.getTime()) / msd
    );

    const color = (diffDays <= 5 && diffDays>=0) ? "red" : diffDays <= 20 ? "#FFD700" : "green";

    if (color === "red") {
      setEmBreve((prev) =>
        prev
          ? {
              fiveDays: prev.fiveDays + 1,
              today: diffDays === 0 ? [...prev.today, note] : [note]
            }
          : { fiveDays: 1, today: diffDays === 0 ? [note] : [] }
      );
    }

    return color;
  };

  const calendarNotes = async (userId: string) => {
    const daysNotes = await getUserNotes(userId);
    if (!daysNotes) return;

    const datesMarked = daysNotes.reduce((acc: MarkedDates, note: Note) => {
      if (!note.dueDate) return acc;
      const formattedDate = formatDateCalendar(note.dueDate);

      const dot = {
        key: note.id,
        color: colorsBasedOnToday(note),
        selectedDotColor: "blue"
      };

      if (acc[formattedDate]) {
        acc[formattedDate].dots.push(dot);
        acc[formattedDate].note.push(note);
      } else {
        acc[formattedDate] = {
          selected: false,
          marked: true,
          dots: [dot],
          note: [note]
        } as MarkedDate;
      }

      return acc;
    }, {});

    setMarkedDates(datesMarked);
  };

  const handleDayClick = (day: any) => {
    if (markedDates[day.dateString]) {
      const notes = markedDates[day.dateString].note;
      setModalClicked({ note: notes, visible: true });
    }
  };

  const closeModal = () =>
    setModalClicked({ ...modalClickedDay, visible: false });

  const renderCalendar = () => (
    <Calendar
      onDayPress={handleDayClick}
      markedDates={markedDates}
      markingType={"multi-dot"}
      hideArrows={false}
      style={styles.calendar}
    />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Compromissos</Text>
      <View style={styles.infoBox}>
        <Text variant="headlineSmall">
          Total:{" "}
          {Object.values(markedDates).reduce(
            (acc, date) => acc + date.dots.length,
            0
          )}
        </Text>
        {emBreve && (
          <Text variant="titleSmall">
            Em menos de 5 dias:{" "}
            <Text style={styles.txtColor}>{emBreve.fiveDays}</Text>
          </Text>
        )}
      </View>
      {renderCalendar()}
      <Modal
        transparent={true}
        visible={modalClickedDay.visible}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <Pressable style={styles.overlay} onPress={closeModal}>
          <View style={styles.modalContainer}>
            <ScrollView>
              {modalClickedDay.note.map((n) => (
                <Text key={n.id} style={styles.modalText}>
                  {n.title}
                </Text>
              ))}
            </ScrollView>
            <Button
              mode="contained"
              onPress={closeModal}
              style={styles.closeButton}
            >
              Fechar
            </Button>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

export default Agenda;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 10
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10
  },
  infoBox: {
    marginBottom: 10,
    alignItems: "center"
  },
  infoText: {
    fontSize: 16
  },
  txtColor: {
    color: "red"
  },
  calendar: {
    borderRadius: 10,
    marginVertical: 10
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end"
  },
  modalContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    elevation: 5
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10
  },
  closeButton: {
    marginTop: 10
  }
});
