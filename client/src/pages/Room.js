import React, { useState, useEffect } from "react";
import "antd/dist/antd.css";
import { useParams } from "react-router-dom";
import { Redirect } from "react-router-dom";
import ScrollToBottom from "react-scroll-to-bottom";
import { Form, Input, Button, message as alert, Modal } from "antd";
import {
  MessageTwoTone,
  ArrowRightOutlined,
  SendOutlined,
  MessageOutlined,
  UserOutlined,
} from "@ant-design/icons";
import styled from "styled-components";
import "./DarkRoom.css";
import moment from "moment";

const Message = styled.div`
  background-color: rgb(0, 140, 255);
  padding: 8px;
  color: #fff;
  border-radius: 4px;
  margin-bottom: 6px;
`;

const Time = styled.div``;

const MessageBody = styled.div``;

function Room({ socket }) {
  const { code } = useParams();
  document.title = `SecuroChat - ${code}`;

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [usersArr, setUsersArr] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [visible, setVisible] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [form] = Form.useForm();

  const sendMessage = () => {
    if (message.trim() !== "") {
      socket.emit("message", {
        sender: localStorage.getItem("name"),
        message: message.trim(),
        time: moment().format("h:mm a"),
        room: code,
      });
    }
    setMessage("");
    form.setFieldsValue({ message: "" });
  };

  useEffect(() => {
    let name = localStorage.getItem("name");
    if (name === null || name.trim() === "") {
      setRedirect(true);
    } else {
      socket.emit("connectUser", { name, code });

      socket.on("botMessage", (botMessage) => {
        setMessages((messages) => [...messages, botMessage]);
      });

      socket.on("message", (message) => {
        setMessages((messages) => [...messages, message]);
      });

      socket.on("joinLeaveEvent", (message) => alert.info(message));

      socket.on("rejoined", (message) => {
        alert.info(message);
      });

      socket.on("updateActiveUsers", (users) => {
        setUsersArr(users);
        setTotalUsers(users.length);
      });
    }
  }, []);

  if (redirect) {
    return <Redirect to="/" />;
  }

  return (
    <div className="container">
      <div className="header">
        <h1>
          <MessageTwoTone /> SecuroChat <MessageTwoTone />
        </h1>
      </div>

      <div className="message-box">
        <div className="messages-header">
          <p>
            Messages <MessageOutlined />
          </p>
          <p style={{ cursor: "pointer" }} onClick={() => setVisible(true)}>
            <UserOutlined /> {totalUsers}
          </p>
          <Modal
            title="Users In Room"
            visible={visible}
            onOk={() => setVisible(false)}
            onCancel={() => setVisible(false)}
            footer={[
              <Button
                type="primary"
                key="back"
                onClick={() => setVisible(false)}
              >
                Close
              </Button>,
            ]}
          >
            <UserOutlined /> {totalUsers}
            <br></br>
            <br></br>
            {usersArr.map((user) => (
              <div key={user.id}>
                <p>{user}</p>
              </div>
            ))}
          </Modal>
          <a href="/">
            <p title="Leave Room">
              Leave <ArrowRightOutlined />
            </p>
          </a>
        </div>

        <ScrollToBottom className="messages">
          {messages.map((msg) => (
            <Message key={msg.id}>
              <Time>{msg.time}</Time>
              <MessageBody>
                {msg.sender}: {msg.message}
              </MessageBody>
            </Message>
          ))}
        </ScrollToBottom>
        <div className="message-form">
          <Form
            form={form}
            style={{ marginTop: "20px", display: "flex" }}
            name="basic"
            initialValues={{
              remember: true,
            }}
            size="large"
          >
            <Form.Item
              placeholder="Message"
              name="message"
              style={{ textAlign: "left !important", marginRight: "8px" }}
              rules={[
                {
                  required: true,
                  message: "Please input the message!",
                },
              ]}
            >
              <Input
                onChange={(e) => setMessage(e.target.value.trim())}
                style={{ borderRadius: "4px" }}
                prefix={
                  <MessageTwoTone
                    className="site-form-item-icon"
                    style={{ marginRight: "8px" }}
                  />
                }
                placeholder="Message"
              />
            </Form.Item>
            <Form.Item>
              <Button
                title="Send Message"
                style={{ width: "100%", borderRadius: "4px" }}
                type="primary"
                htmlType="submit"
                onClick={() => {
                  sendMessage();
                }}
              >
                Send <SendOutlined />
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Room;
