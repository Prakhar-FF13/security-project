import React from "react";
import "./Login.css";

export default function LoginForm() {
  const [state, setState] = React.useState({
    type: "user",
    username: "",
    password: "",
    kind: "patient",
  });

  const onChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  return (
    <>
      <h2>Login</h2>
      <form id="logForm" method="POST">
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
        <label htmlFor="username">Username</label>
        <input
          type="text"
          name="username"
          value={state.username}
          onChange={onChange}
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          value={state.password}
          onChage={onChange}
        />
      </form>
    </>
  );
}
