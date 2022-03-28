import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import CreateRoom from "./pages/CreateRoom";
import JoinRoom from "./pages/JoinRoom";
import Room from "./pages/Room";
import Icon from "react-native-vector-icons/AntDesign";
import { io } from "socket.io-client";

const mode = "DEVELOPMENT";
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const socket = io("http://YOURAPIURLHERE/");

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName="CreateRoom"
          screenOptions={({ route }) => ({
            tabBarStyle: {
              backgroundColor: "rgb(20,20,20)",
              height: 90,
              borderTopColor: "transparent",
            },
            tabBarButton: ["Room"].includes(route.name)
              ? () => null
              : undefined,
          })}
        >
          <Tab.Screen
            name="CreateRoom"
            options={{
              title: "Create Room",
              headerTitleStyle: {
                color: "#fff",
              },
              headerStyle: {
                backgroundColor: "rgb(10,10,10)",
                shadowColor: "rgb(10,10,10)",
              },
              tabBarLabel: "Create Room",
              tabBarLabelStyle: {
                fontSize: 15,
                color: "rgb(0,140,255)",
              },
              tabBarIcon: () => {
                return <Icon name="edit" size={25} color="rgb(0,140,255)" />;
              },
            }}
          >
            {(props) => <CreateRoom {...props} mode={mode} socket={socket} />}
          </Tab.Screen>
          <Tab.Screen
            name="JoinRoom"
            options={{
              title: "Join Room",
              headerTitleStyle: {
                color: "#fff",
              },
              headerStyle: {
                backgroundColor: "rgb(10,10,10)",
                shadowColor: "rgb(10,10,10)",
              },
              tabBarLabel: "Join Room",
              tabBarLabelStyle: {
                fontSize: 15,
                color: "rgb(0,140,255)",
              },
              tabBarIcon: () => {
                return <Icon name="enter" size={25} color="rgb(0,140,255)" />;
              },
            }}
          >
            {(props) => <JoinRoom {...props} mode={mode} socket={socket} />}
          </Tab.Screen>
          <Tab.Screen
            name="Room"
            initialParams={{ code: null, name: null }}
            options={{
              title: "Room",
              headerTitleStyle: {
                color: "#fff",
              },
              headerStyle: {
                backgroundColor: "rgb(10,10,10)",
                shadowColor: "rgb(10,10,10)",
              },
              tabBarStyle: {
                display: "none",
              },
            }}
          >
            {(props) => <Room {...props} mode={mode} socket={socket} />}
          </Tab.Screen>
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
