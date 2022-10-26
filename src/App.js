import React from "react";
import Container from "./Container";

const Context = React.createContext({});

export default function App() {
  return (
    <>
      <Context.Provider value={{}}>
        <Container />
      </Context.Provider>
    </>
  );
}

export const UserContext = Context;
