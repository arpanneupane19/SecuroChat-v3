import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import CreateRoom from "./pages/CreateRoom";
import JoinRoom from "./pages/JoinRoom";
import Icon from "react-native-vector-icons/AntDesign";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName="CreateRoom"
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              backgroundColor: "rgb(20,20,20)",
              height: 100,
              borderTopColor: "transparent",
            },
          }}
        >
          <Tab.Screen
            name="CreateRoom"
            component={CreateRoom}
            options={{
              tabBarLabel: "Create Room",
              tabBarLabelStyle: {
                fontSize: 15,
                color: "rgb(0,140,255)",
              },
              tabBarIcon: () => {
                return <Icon name="edit" size={30} color="rgb(0,140,255)" />;
              },
            }}
          />
          <Tab.Screen
            name="JoinRoom"
            component={JoinRoom}
            options={{
              tabBarLabel: "Join Room",
              tabBarLabelStyle: {
                fontSize: 15,
                color: "rgb(0,140,255)",
              },
              tabBarIcon: () => {
                return <Icon name="enter" size={30} color="rgb(0,140,255)" />;
              },
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
