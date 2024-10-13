import { auth } from "../firebaseConfig";
import { Calendar } from 'react-native-calendars';
import { useState, useEffect } from 'react';
import type { Note } from '../firestore/modelNotes';
import { getUserNotes } from '../firestore/createUsers';
import { View, Text } from "react-native";

interface MarkedDate {
    selected: boolean;
    marked: boolean;
    note: Array<Note>;
    dots: Array<{
        key: string,
        color: string,
        selectedDotColor: string
    }>
}

type MarkedDates = { [date: string]: MarkedDate };
type emBreveType = {fiveDays: number, today: Note[]} | null;

const Agenda = () => {
    console.log("render");
    const user = auth.currentUser;
    const [markedDates, setMarkedDates] = useState<MarkedDates>({});
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);
    const [emBreve, setEmBreve] = useState<emBreveType>(null);

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

    const colorsBasedOnToday = (note: Note) => {
        if (note == null || note.dueDate == null) return "#FFD700";

        const msd = 1000 * 60 * 60 * 24; // ms de um dia
        const today = new Date();
        
        const todayMidnight = new Date(today.setHours(0, 0, 0, 0));
        const noteDateMidnight = new Date(note.dueDate.setHours(0, 0, 0, 0));

        const diffDays = Math.ceil((noteDateMidnight.getTime() - todayMidnight.getTime()) / msd);
        const color = diffDays <= 5 ? "red" : diffDays <= 20 ? "#FFD700" : "green";

        if (color === "red"){
            setEmBreve((prev: emBreveType) => {
                return (prev != null)
                ? { fiveDays: prev.fiveDays+1, today: (diffDays === 0)
                    ? [...prev.today, note] : [note]
                } : {fiveDays: 1, today: diffDays === 0 ? [note] : []}
            })
        }

        return color;
    }
 
    const calendarNotes = async (userId: string) => {
        const daysNotes = await getUserNotes(userId);
        if (daysNotes == null) return;

        const datesMarked = daysNotes.reduce((acc: MarkedDates, note: Note) => {
            if (!note.dueDate) return acc;
            const formattedDate = formatDateCalendar(note.dueDate);

            const dot = {
                key: note.id,
                color: colorsBasedOnToday(note),
                selectedDotColor: 'blue',
            };

            if (acc[formattedDate]) {
                if (Array.isArray(acc[formattedDate].dots)) {
                    acc[formattedDate].dots.push(dot);
                    acc[formattedDate].note.push(note);
                } else {
                    acc[formattedDate].dots = [dot];
                }
            } else {
                acc[formattedDate] = {
                    selected: false,
                    marked: true,
                    dots: [dot],
                    note: [note],
                } as MarkedDate;
            }

            return acc;
        }, {});

        setMarkedDates(datesMarked);
    };

    const renderCalendar = () => (
        <Calendar
            onDayPress={(day: any) => {
                const note = markedDates[day.dateString]?.note;
                if (note) note.map(i => console.log("nota pra hoje: ", i.title))
                setSelectedNote(note[1]);
            }}
            markedDates={markedDates}
            markingType={'multi-dot'}
        />
    );

    return (
        <View> 
            <Text>Compromissos: {
                Object.values(markedDates).reduce((acc, markedDate) => {
                    return acc + markedDate.dots.length;
                }, 0)
            }</Text>
            {emBreve && <Text>Em menos de 5 dias: {emBreve.fiveDays}</Text>}
            {emBreve && <Text>Para hoje: {emBreve.today ? emBreve.today.map(i => i.title).join(', ') : "nenhum compromisso"}</Text>}
            {renderCalendar()}
            {/*TODO: card da nota, poder editar/apagar nota*/}
            { selectedNote != null && <Text>{selectedNote.title}</Text> }
        </View>
        )
};

export default Agenda;
