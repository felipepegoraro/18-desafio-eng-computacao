// App.tsx
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import React, { useState, useEffect } from "react";
import { auth } from "./src/firebaseConfig";
import { onAuthStateChanged, User } from "firebase/auth";
import { PaperProvider } from "react-native-paper";

// Import das telas
import Login from "./src/components/Login";
import Register from "./src/components/Register";
import Home from "./src/components/Home";
import Agenda from "./src/components/Agenda";
import Note from "./src/components/Note";
import PetList from "./src/components/PetList";
import RegisterNewPet from "./src/components/registerNewPet";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) setUser(user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <PaperProvider>
      <NavigationContainer>
        {user ? (
          <Drawer.Navigator initialRouteName="Home">
            <Drawer.Screen name="Home" component={Home} />
            {/* TODO:
                Adicionar telas com as informações do Usuario
                Adicionar telas com as informações dos pets

          */}
            <Drawer.Screen name="Meu Perfil" component={Home} />

            {/*TODO: nome melhor pra isso*/}
            <Drawer.Screen name="Meus Pets" component={PetList} /> 

            <Drawer.Screen name="Agenda" component={Agenda} />

            {/* remover dps */}
            <Drawer.Screen name="Nota" component={Note} />
            <Stack.Screen
              name="Cadastrar Novo Pet"
              component={RegisterNewPet}
            />
          </Drawer.Navigator>
        ) : (
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen
              name="Login"
              component={Login}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="Register" component={Register} />
          </Stack.Navigator>
        )}
        <StatusBar style="auto" />
      </NavigationContainer>
    </PaperProvider>
  );
}
