import React, { useState } from "react";
import { MessageTwoTone, LockOutlined, UserOutlined } from "@ant-design/icons";
import "./DarkForm.css";
import { Form, Input, Button, message } from "antd";
import { Link, Redirect } from "react-router-dom";
import { useLocation } from "react-router-dom";
import axios from "axios";

function CreateRoom({ socket }) {
  const location = useLocation();

  if (location.pathname === "/") {
    document.title = "SecuroChat";
  } else if (
    location.pathname === "/create-room" ||
    location.pathname === "/create"
  ) {
    document.title = "SecuroChat - Create Room";
  } else if (location.pathname === "/home") {
    document.title = "SecuroChat - Home";
  }

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [redirect, setRedirect] = useState(false);

  const fetchAPI = () => {
    localStorage.setItem("name", name.trim());
    axios.get(`/api/${code}`).then((res) => {
      if (res.data.codeExists) {
        // Check if the room code is already taken.
        message.error(
          "Room code already exists. Please create a different one."
        );
      } else {
        // If room code is not taken, then redirect to the room.
        setRedirect(true);
      }
    });
  };

  if (redirect) {
    return <Redirect to={`/room/${code}`} />;
  }

  return (
    <div className="container">
      <div className="header">
        <h1>
          <MessageTwoTone /> SecuroChat <MessageTwoTone />
        </h1>
      </div>
      <div className="form">
        <div className="form-header">
          <p>Create Room</p>
        </div>
        <Form
          name="basic"
          initialValues={{
            remember: true,
          }}
          size="large"
        >
          <Form.Item
            placeholder="name"
            name="name"
            style={{
              textAlign: "left !important",
            }}
            rules={[
              {
                required: true,
                message: "Please input your name!",
              },
            ]}
          >
            <Input
              onChange={(e) => setName(e.target.value.trim())}
              prefix={
                <UserOutlined
                  className="site-form-item-icon"
                  style={{ marginRight: "8px" }}
                />
              }
              placeholder="Name"
            />
          </Form.Item>
          <Form.Item
            name="roomCode"
            rules={[
              {
                required: true,
                message: "Please input the room code!",
              },
            ]}
          >
            <Input
              onChange={(e) => setCode(e.target.value.trim())}
              prefix={
                <LockOutlined
                  className="site-form-item-icon"
                  style={{ marginRight: "8px" }}
                />
              }
              placeholder="Room Code"
            />
          </Form.Item>
          <Form.Item
            style={{
              width: "75%",
              marginLeft: "auto",
              marginRight: "auto",
              marginTop: "8px",
            }}
          >
            <Button
              style={{ width: "100%", borderRadius: "7.5px" }}
              type="primary"
              htmlType="submit"
              onClick={() => fetchAPI()}
            >
              Create Room
            </Button>
          </Form.Item>
        </Form>
        <div className="link">
          Need to join a room? Click <Link to="/join">here</Link>.
        </div>
      </div>
    </div>
  );
}

export default CreateRoom;
