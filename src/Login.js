import axios from "axios";
import React, { useContext } from "react";
import "./Login.css";
import { UserContext } from "./App";

export default function LoginForm() {
  const [, setUser] = useContext(UserContext);
  const [state, setState] = React.useState({
    type: "user",
    username: "",
    password: "",
    kind: "patient",
  });

  const onChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const res = await axios.post("/login", {
      username: state.username,
      password: state.password,
    });

    if (res && res.data && res.data.user) {
      delete res.data.user.salt;
      delete res.data.user.hash;
    }

    setUser({
      token: res.data.token,
      ...res.data.user,
    });
  };

  return (
    <>
      <h2>Login</h2>
      <form id="logForm" method="POST" onSubmit={onSubmit}>
        <label htmlFor="type">Type</label>
        <select id="type" name="type" onChange={onChange} value={state.value}>
          <option value="user">User</option>
          <option value="organisation">Organisation</option>
        </select>
        {state.type && state.type === "user" ? (
          <>
            <label htmlFor="kind">Kind</label>
            <select
              id="kind"
              name="kind"
              onChange={onChange}
              value={state.value}
            >
              <option value="patient">Patient</option>
              <option value="healthCareProfessional">
                Health Care Professional
              </option>
              <option value="admin">Admin</option>
            </select>
          </>
        ) : (
          <>
            <label htmlFor="kind">Kind</label>
            <select
              id="kind"
              name="kind"
              onChange={onChange}
              value={state.value}
            >
              <option value="hospital">Hospital</option>
              <option value="pharmacy">Pharmacy</option>
              <option value="insuranceFirm">Insurance Firm</option>
            </select>
          </>
        )}
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          name="username"
          value={state.username}
          onChange={onChange}
        />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          onChange={onChange}
          value={state.password}
        />
        <input type="submit" value="submit" />
      </form>
    </>
  );
}
