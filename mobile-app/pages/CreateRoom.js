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

export default function CreateRoom() {
  return (
    <SafeAreaView style={styles.main}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}></View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: "rgb(10,10,10)",
    height: "100%",
  },
});
