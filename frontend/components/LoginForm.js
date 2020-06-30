import React, { useState, useCallback } from "react";
import Link from "next/link";
import { Input, Button, Form } from "antd";

import { useInput } from "../pages/signup";
import { useDispatch, useSelector } from "react-redux";
import { LOG_IN_REQUEST } from "../reducers/user";

const LoginForm = () => {
  const [userId, onChangeId] = useInput("");
  const [password, onChangePassword] = useInput("");
  const { isLoggingIn } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const onSubmitForm = useCallback(() => {
    dispatch({
      type: LOG_IN_REQUEST,
      data: {
        userId,
        password,
      },
    });
  }, [userId, password]);

  return (
    <Form onFinish={onSubmitForm} style={{ padding: "10px" }}>
      <div>
        <label htmlFor={"user-id"}>아이디</label>
        <br />
        <input name="user-id" value={userId} onChange={onChangeId} required />
      </div>
      <div>
        <label htmlFor="user-password">비밀번호</label>
        <br />
        <Input
          name="user-password"
          type="password"
          value={password}
          onChange={onChangePassword}
          required
        />
      </div>
      <div style={{ marginTop: "10px" }}>
        <Button type="primary" htmlType="submit" loading={isLoggingIn}>
          로그인
        </Button>
        <Link href="/signup">
          <a>
            <Button>회원가입</Button>
          </a>
        </Link>
      </div>
    </Form>
  );
};

export default LoginForm;
