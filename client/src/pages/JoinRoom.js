import React, { useState } from "react";
import { MessageTwoTone, LockOutlined, UserOutlined } from "@ant-design/icons";
import "./Form.css";
import { Form, Input, Button, message } from "antd";
import { Link, Redirect } from "react-router-dom";

function JoinRoom() {
  document.title = "SecuroChat - Join Room";

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [codeExists, setCodeExists] = useState(false);
  const [redirect, setRedirect] = useState(false);

  return (
    <div className="container">
      <div className="header">
        <h1>
          <MessageTwoTone /> SecuroChat <MessageTwoTone />
        </h1>
      </div>
      <div className="form">
        <div className="form-header">
          <p>Join Room</p>
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
            style={{ textAlign: "left !important" }}
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
              // onClick={() => fetchAPI()}
            >
              Join Room
            </Button>
          </Form.Item>
        </Form>
        <div className="link">
          Need to create a room? Click <Link to="/">here</Link>.
        </div>
      </div>
    </div>
  );
}

export default JoinRoom;
