import { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Input, Checkbox, Button } from "antd";
import PropTypes from "prop-types";
import Router from "next/router";
import { SIGN_UP_REQUEST } from "../reducers/user";

const TextInput = ({ value }) => {
  return <div>{value}</div>;
};

TextInput.protoTypes = {
  value: PropTypes.string,
};

export const useInput = (initValue = null) => {
  const [value, setter] = useState(initValue);
  const handler = (e) => {
    setter(e.target.value);
  };
  return [value, handler];
};

const Signup = () => {
  const [passwordCheck, setPasswordCheck] = useState("");

  const [term, setTerm] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [termError, setTermError] = useState(false);

  const [id, onChangeId] = useInput("");
  const [nickname, setNickname] = useInput("");
  const [password, setPassword] = useInput("");

  const dispatch = useDispatch();
  const { isSigningUp, me } = useSelector((state) => state.user);

  useEffect(() => {
    if (me) {
      alert("로그인 했으니 메인페이지로 이동합니다.");
      Router.push("/");
    }
  }, [me && me.id]);

  const onSubmit = useCallback(() => {
    console.log("onSubmit");
    if (password !== passwordCheck) {
      return setPasswordError(true);
    }
    if (!term) {
      return setTermError(true);
    }

    return dispatch({
      type: SIGN_UP_REQUEST,
      data: { userId: id, password, nickname },
    });
  }, [id, nickname, password, passwordCheck, term]);

  const onChangeNickname = (e) => {
    setNickname(e);
  };

  const onChangePassword = (e) => {
    setPassword(e);
  };

  const onChangePasswordCheck = (e) => {
    setPasswordError(e.target.value !== password);
    setPasswordCheck(e.target.value);
  };

  const onChangeTerm = (e) => {
    setTermError(false);
    setTerm(e.target.checked);
  };

  if (me) {
    return null;
  }

  return (
    <Form onFinish={onSubmit} style={{ padding: 10 }}>
      <TextInput value={123} />
      <div>
        <label htmlFor="user-id">아이디</label>
        <br />
        <Input name="user-id" value={id} required onChange={onChangeId} />
      </div>
      <div>
        <label htmlFor="user-nick">닉네임</label>
        <br />
        <Input
          name="user-nick"
          value={nickname}
          required
          onChange={onChangeNickname}
        />
      </div>
      <div>
        <label htmlFor="user-password">비밀번호</label>
        <br />
        <Input
          name="user-password"
          type="password"
          value={password}
          required
          onChange={onChangePassword}
        />
      </div>
      <div>
        <label htmlFor="user-password-check">비밀번호체크</label>
        <br />
        <Input
          name="user-password-check"
          type="password"
          value={passwordCheck}
          required
          onChange={onChangePasswordCheck}
        />
        {passwordError && (
          <div style={{ color: "red" }}>비밀번호가 일치하지 않습니다.</div>
        )}
      </div>
      <div>
        <Checkbox name="user-term" checked={term} onChange={onChangeTerm}>
          동의합니다.
        </Checkbox>
        {termError && (
          <div style={{ color: "red" }}>약관에 동의하셔야합니다.</div>
        )}
      </div>
      <div style={{ marginTop: 10 }}>
        <Button type="primary" htmlType="submit" loading={isSigningUp}>
          가입하기
        </Button>
      </div>
    </Form>
  );
};

export default Signup;
