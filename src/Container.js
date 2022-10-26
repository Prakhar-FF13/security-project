import React from "react";
import RegisterForm from "./Register";
import { UserContext } from "./App";
import Navbar from "./Navbar";

export default function Container() {
  const user = React.useContext(UserContext);
  console.log(user);
  return (
    <>
      <Navbar />
      <RegisterForm />
    </>
  );
}
