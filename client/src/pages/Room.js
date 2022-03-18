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
    axios.get(`/api/${code}`).then((res) => {
      /* 
      If someone goes to this route without having joined a room or creating one, fetch the API and check if that room code exists.
      If the code exists, but they're not in the users array returned from the backend, then redirect them to the home page. 
      If the code does not exist, then redirect  them to the home page.
      */
      if (res.data.codeExists) {
        let name = localStorage.getItem("name");
        if (!res.data.users.includes(name)) {
          setRedirect(true);
        }
      } else {
        setRedirect(true);
      }
    });
    socket.on("createdRoomSuccessfully", ({ name }) => {
      alert.success(`Hello ${name}! You've successfully created room ${code}.`);
    });
    socket.on("botChat", (botMessage) => {
      setMessages([...messages, botMessage]);
    });
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
