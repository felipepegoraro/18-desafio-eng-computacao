import { auth } from "../firebaseConfig";
import { Calendar } from 'react-native-calendars';
import { useState, useEffect } from 'react';
import type { Note } from '../firestore/modelNotes';
import { getUserNotes } from '../firestore/createUsers';
import { View, Text } from "react-native";

interface MarkedDate {
    selected: boolean;
    marked: boolean;
    selectedColor: string;
    dotColor: string;
    note: Note;
}

type MarkedDates = { [date: string]: MarkedDate };

const Agenda = () => {
    console.log("render");
    const user = auth.currentUser;
    const [markedDates, setMarkedDates] = useState<MarkedDates>({});
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);
    const [totalRed, setTotal] = useState(0);

    useEffect(() => {
        if (user) calendarNotes(user.uid);
    }, [user]);

    const formatDateCalendar = (date: Date | null): string => {
        if (!date) return "Data invalida";
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${year}-${month}-${day < 10 ? '0' : ''}${day}`;
    };

    const colorsBasedOnToday = (day: Date) => {
        const msd = 1000 * 60 * 60 * 24; // ms de um dia
        const diff = Math.ceil(Math.abs(day.getTime() - new Date().getTime()) / msd);
        const color = diff <= 5 ? "red" : diff <= 20 ? "#FFD700" : "green";
        if (color == "red") setTotal(prev => prev+1);
        return color;
    }

    const calendarNotes = async (userId: string) => {
        const daysNotes = await getUserNotes(userId);
        if (daysNotes == null) return;

        const datesMarked = daysNotes.reduce((acc: MarkedDates, note: Note) => {
            if (!note.dueDate) return acc;
            const formattedDate = formatDateCalendar(note.dueDate);

            acc[formattedDate] = {
                selected: false,
                marked: true,
                selectedColor: "blue",
                dotColor: colorsBasedOnToday(note.dueDate),
                note: note,
            } as MarkedDate;

            return acc;
        }, {});

        setMarkedDates(datesMarked);
    };

    const renderCalendar = () => (
        <Calendar
            onDayPress={(day: any) => {
                const note = markedDates[day.dateString]?.note;
                if (note) console.log("Note selected: ", note.title, note.content);
                setSelectedNote(note);
            }}
            markedDates={markedDates}
        />
    );

    return (
        <View> 
            <Text>Compromissos: {Object.keys(markedDates).length}</Text>
            <Text>Em menos de 5 dias: {totalRed}</Text>
            {renderCalendar()}
            {/*TODO: card da nota, poder editar/apagar nota*/}
            { selectedNote != null && <Text>{selectedNote.title}</Text> }
        </View>
        )
};

export default Agenda;
