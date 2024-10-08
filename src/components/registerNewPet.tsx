import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Picker } from 'react-native';
import { Pet } from '../firestore/createPets';
import { db } from '../firebaseConfig';
import { doc , setDoc } from 'firebase/firestore';

const saveNewPet = async (pet: Pet) => {
    if (!pet) return;

    try { 
        const petDocRef = doc(db, 'pets', pet.name); // todo: outras formas de salvar/ID
        await setDoc(petDocRef, pet);
        console.log('Pet salvo com sucesso:', pet);
    } catch (error) {
        console.error('Erro ao salvar o pet:', error);
    }
};

const RegisterNewPet = ({ userId }: { userId: string }) => {
    const [name, setName] = useState('');
    const [type, setType] = useState<"DOG" | "CAT">("DOG");
    const [breed, setBreed] = useState('');
    const [gender, setGender] = useState('');
    const [weight, setWeight] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [notes, setNotes] = useState('');

    const handleSubmit = async () => {
        const newPet: Pet = {
            userId,
            name,
            type,
            breed,
            gender,
            weight: Number(weight),
            birthDate: new Date(birthDate),
            notes: notes || undefined,
        };
        
        try {
            await saveNewPet(newPet);
            const userDocRef = doc(db,'users', userId);
            if (userDocRef){
                await setDoc(userDocRef, {ownsPet: true}, {merge: true});
                console.log("usuario cadastrou um pet!");
            }
        } catch(error){
            console.log(error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Cadastrar Novo Pet</Text>

            <TextInput
                style={styles.input}
                placeholder="Nome do Pet"
                value={name}
                onChangeText={setName}
            />
            <Picker
                selectedValue={type}
                onValueChange={(itemValue) => setType(itemValue)}
                style={styles.picker}
            >
                <Picker.Item label="Cachorro" value="DOG" />
                <Picker.Item label="Gato" value="CAT" />
            </Picker>
            <TextInput
                style={styles.input}
                placeholder="Raça"
                value={breed}
                onChangeText={setBreed}
            />
            <TextInput
                style={styles.input}
                placeholder="Gênero"
                value={gender}
                onChangeText={setGender}
            />
            <TextInput
                style={styles.input}
                placeholder="Peso (kg)"
                keyboardType="numeric"
                value={weight}
                onChangeText={setWeight}
            />
            <TextInput
                style={styles.input}
                placeholder="Data de Nascimento (YYYY-MM-DD)"
                value={birthDate}
                onChangeText={setBirthDate}
            />
            <TextInput
                style={styles.input}
                placeholder="Notas"
                value={notes}
                onChangeText={setNotes}
            />

            <Button title="Cadastrar Pet" onPress={handleSubmit} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        padding: 10,
    },
    picker: {
        height: 50,
        width: '100%',
        marginBottom: 10,
    },
});

export default RegisterNewPet;
