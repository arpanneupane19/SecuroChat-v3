import React from "react";
import {
  StyleSheet,
  ImageBackground,
  ScrollView,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  RefreshControl,
  Alert,
  StatusBar,
} from "react-native";
import SafeAreaView from "react-native-safe-area-view";

export default function Room() {
  return (
    <SafeAreaView>
      <StatusBar barStyle="dark-content" />
      <Text>Room</Text>
    </SafeAreaView>
  );
}
