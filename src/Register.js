import React, { useState } from "react";
import axios from "axios";

const RegisterForm = () => {
  const [state, setState] = useState({
    type: "user",
    username: "",
    password: "",
  });

  const onChange = (e) => {
    if (e.target.name !== "file")
      setState({ ...state, [e.target.name]: e.target.value });
    else setState({ ...state, [e.target.name]: e.target.files });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      for (let i = 0; i < state.file.length; i++) {
        formData.append("file", state.file[i]);
      }

      const res = await axios.post("/register", {
        ...state,
      });

      await axios.post("/upload_files", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: res.data.token,
        },
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        handleSubmit(e);
      }}
      method="POST"
      action="upload_files"
      encType="multipart/form-data"
    >
      <label htmlFor="type">Type</label>
      <select id="type" name="type" onChange={onChange} value={state.value}>
        <option value="user">User</option>
        <option value="organisation">Organisation</option>
      </select>
      <label htmlFor="username">Username:</label>
      <input
        type="text"
        id="username"
        name="username"
        onChange={onChange}
        value={state.username}
      />
      <label htmlFor="password">Password:</label>
      <input
        type="password"
        id="password"
        name="password"
        onChange={onChange}
        value={state.password}
      />
      {state && state.type === "organisation" ? (
        <>
          <label htmlFor="file">Files: </label>
          <input
            type="file"
            id="file"
            name="file"
            multiple
            onChange={onChange}
          />
        </>
      ) : null}
      <input type="submit" value="submit" />
    </form>
  );
};

export default RegisterForm;
