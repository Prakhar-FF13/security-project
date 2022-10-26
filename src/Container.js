import React from "react";
import RegisterForm from "./Register";
import { UserContext } from "./App";
import Navbar from "./Navbar";
import LoginForm from "./Login";
import Profile from "./Profile";

export default function Container() {
  const user = React.useContext(UserContext);
  const [page, setPage] = React.useState(0);
  return (
    <>
      <Navbar setPage={setPage} />
      {page === 0 && <RegisterForm />}
      {page === 1 && <LoginForm />}
      {page === 2 && <Profile setPage={setPage} />}
    </>
  );
}
