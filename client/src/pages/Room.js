import React, { useState, useEffect } from "react";
import {
  MessageTwoTone,
  ArrowRightOutlined,
  SendOutlined,
  MessageOutlined,
  UserOutlined,
} from "@ant-design/icons";
import "antd/dist/antd.css";
import { useParams } from "react-router-dom";
import { Redirect } from "react-router-dom";
import ScrollToBottom from "react-scroll-to-bottom";
import { Form, Input, Button, message as alert } from "antd";
import styled from "styled-components";
import axios from "axios";
import "./Room.css";

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
  const [redirect, setRedirect] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    let name = localStorage.getItem("name");

    socket.emit("connectUser", { name, code });

    socket.on("botChat", (botMessage) => {
      setMessages([...messages, botMessage]);
    });

    socket.on("joined", (name) => alert.info(`${name} has joined the chat.`));

    socket.on("rejoined", () => alert.success("You have rejoined the room."));
  }, [socket]);

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
