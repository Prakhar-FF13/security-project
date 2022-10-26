import React, { useContext } from "react";
import { UserContext } from "./App";

export default function Profile({ setPage }) {
  const [user] = useContext(UserContext);
  if (!user || !user.token) {
    setPage(1);
    return <></>;
  } else {
    return (
      <>
        <div>
          <h4>Username:</h4>
          {user.username}
        </div>
        <div>
          <h4>Type:</h4>
          {user.type}
        </div>
        <div>
          <h4>Kind:</h4>
          {user.kind}
        </div>
      </>
    );
  }
}
