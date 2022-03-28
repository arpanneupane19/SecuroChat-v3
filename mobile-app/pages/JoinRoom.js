import React, { useEffect, useState } from "react";
import {
  StyleSheet,
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
import Icon from "react-native-vector-icons/AntDesign";
import axios from "axios";
import * as Haptics from "expo-haptics";

export default function JoinRoom({ navigation, mode, socket }) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setName("");
    setCode("");
  };

  const apiURL = "API URL HERE";

  const submitInput = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    if (name === "" && code === "") {
      Alert.alert(
        "Error When Joining Room",
        "Please enter a name and room code."
      );
    } else if (name !== "" && code === "") {
      Alert.alert("Error When Joining Room", "Please enter a room code.");
    } else if (name === "" && code !== "") {
      Alert.alert("Error When Joining Room", "Please enter a name.");
    }
    if (name !== "" && code !== "") {
      axios.get(`${apiURL}/api/${code}`).then((res) => {
        if (res.data.codeExists) {
          // Get usernames of users in that specific room to make sure there are no duplicates.
          socket.connect();
          socket.emit("requestUsers", code);
          socket.on("usersFromRequest", (users) => {
            if (users.includes(name)) {
              Alert.alert(
                "Error When Joining Room",
                "There is another user with this username. Please choose a different one."
              );
              setName("");
            } else {
              let username = name;
              let roomCode = code;
              setName("");
              setCode("");
              navigation.navigate("Room", { code: roomCode, name: username });
            }
          });
        } else {
          Alert.alert("Error When Joining Room", "Room code does not exist.");
          setCode("");
        }
      });
    }
  };

  const goToCreate = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.main}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refresh={refreshing}
            onRefresh={onRefresh}
            tintColor="rgb(255,255,255)"
          />
        }
      >
        <StatusBar barStyle="light-content" />
        <View style={styles.header}>
          <Text style={styles.headerText}>
            <Icon name="message1" color={"rgb(0,140,255)"} size={30} />{" "}
            SecuroChat{" "}
            <Icon name="message1" color={"rgb(0,140,255)"} size={30} />
          </Text>
        </View>
        <View style={styles.form}>
          <View style={styles.formHeader}>
            <Text style={styles.formHeaderText}>Join Room</Text>
          </View>
          <View style={styles.formBody}>
            <TextInput
              autoCorrect={true}
              style={styles.formInput}
              placeholder="Name"
              onChangeText={(e) => setName(e.trim())}
              value={name}
            />
            <TextInput
              autoCorrect={true}
              style={styles.formInput}
              placeholder="Room Code"
              onChangeText={(e) => setCode(e.trim())}
              value={code}
            />
            <TouchableOpacity
              style={styles.formButton}
              onPress={() => submitInput()}
            >
              <Text style={styles.formButtonText}>Create Room</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: "rgb(10,10,10)",
    height: "100%",
  },

  header: {
    marginTop: 50,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },

  headerText: {
    color: "rgb(255,255,255)",
    fontSize: 30,
  },

  form: {
    width: "90%",
    backgroundColor: "rgb(40,40,40)",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 35,
    padding: 30,
    borderRadius: 4,
    shadowColor: "rgba(255,255,255,0.25)",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,
    elevation: 11,
  },
  formHeader: {
    display: "flex",
    justifyContent: "center",
  },
  formHeaderText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 20,
  },
  formBody: {
    marginTop: 20,
  },
  formInput: {
    textAlign: "left",
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 6,
    marginBottom: 10,
    fontSize: 15,
  },
  formButton: {
    width: "75%",
    padding: 12,
    backgroundColor: "rgb(0,140,255)",
    borderRadius: 8,
    marginTop: 4,
    marginRight: "auto",
    marginLeft: "auto",
    marginBottom: 12,
  },
  formButtonText: {
    fontSize: 15,
    color: "#fff",
    textAlign: "center",
    fontWeight: "500",
  },
});
