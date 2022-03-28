import React, { useState, useEffect } from "react";
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
  KeyboardAvoidingView,
  NavigatorIOS,
} from "react-native";
import SafeAreaView from "react-native-safe-area-view";
import Icon from "react-native-vector-icons/AntDesign";
import * as Haptics from "expo-haptics";
import moment from "moment";

export default function Room({ navigation, mode, route, socket }) {
  let code = route.params.code;
  let name = route.params.name;

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [usersArr, setUsersArr] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);

  const sendMessage = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    if (message.trim() !== "") {
      socket.emit("message", {
        sender: name,
        message: message.trim(),
        time: moment().format("h:mm a"),
        room: code,
      });
    }
    setMessage("");
  };

  useEffect(() => {
    socket.emit("connectUser", { name, code });

    socket.on("botMessage", (botMessage) => {
      setMessages((messages) => [...messages, botMessage]);
    });

    socket.on("message", (message) => {
      setMessages((messages) => [...messages, message]);
    });

    socket.on("updateActiveUsers", (users) => {
      setUsersArr(users);
      setTotalUsers(users.length);
    });
  }, []);

  const leaveChat = () => {
    socket.disconnect();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    (code = null), (name = null);
    navigation.navigate("CreateRoom");
  };
  return (
    <SafeAreaView style={styles.main}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.headerText}>
          <Icon name="message1" color={"rgb(0,140,255)"} size={30} /> SecuroChat{" "}
          <Icon name="message1" color={"rgb(0,140,255)"} size={30} />
        </Text>
      </View>
      <View style={styles.messageBox}>
        <View style={styles.messagesHeader}>
          <Text style={styles.messagesHeaderText}>
            Messages <Icon name="message1" color="rgb(255,255,255)" size={17} />
          </Text>
          <TouchableOpacity>
            <Text style={styles.messagesHeaderText}>
              <Icon name="user" color="rgb(255,255,255)" size={17} />{" "}
              {totalUsers}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => leaveChat()}>
            <Text style={styles.messagesHeaderText}>
              Leave <Icon name="logout" color="rgb(255,255,255)" size={17} />
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.messages}>
          {messages.map((msg) => (
            <View key={msg.id} style={styles.message}>
              <Text style={styles.messageText}>{msg.time}</Text>
              <Text style={styles.messageText}>
                {msg.sender}: {msg.message}
              </Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.messageInput}>
          <TextInput
            placeholder="Message"
            name="message"
            style={styles.inputForm}
            onChangeText={(text) => setMessage(text)}
            value={message}
            onSubmitEditing={sendMessage}
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Icon
              style={styles.sendIcon}
              name="arrowup"
              color="rgb(255,255,255)"
            />
            <Text style={styles.sendText}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: "rgb(10,10,10)",
    height: "100%",
  },
  header: {
    marginTop: 40,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },

  headerText: {
    color: "rgb(255,255,255)",
    fontSize: 30,
  },
  messageBox: {
    padding: 25,
    width: "95%",
    backgroundColor: "rgb(40,40,40)",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 35,
    borderRadius: 6,
    display: "flex",
    flexDirection: "column",
  },
  messagesHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  messagesHeaderText: {
    fontSize: 15,
    color: "#fff",
    textAlign: "left",
  },
  messages: {
    padding: 8,
    marginTop: 22,
    marginBottom: 22,
    width: "100%",
    height: "70%",
    borderRadius: 4,
    overflow: "scroll",
  },
  message: {
    backgroundColor: "rgb(0,140,255)",
    padding: 8,
    width: "100%",
    borderRadius: 4,
    marginBottom: 6,
  },
  messageText: {
    color: "#fff",
  },
  messageInput: {
    display: "flex",
    flexDirection: "row",
  },
  inputForm: {
    height: 40,
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 4,
    padding: 8,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: "rgb(0,140,255)",
    width: "15%",
    borderRadius: 4,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },

  sendIcon: {
    textAlign: "center",
    color: "#fff",
  },
  sendText: {
    textAlign: "center",
    color: "#fff",
  },
});
