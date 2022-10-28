import React from "react";
import { UserContext } from "./App";

export default function Dashboard({ setPage }) {
  const [user] = React.useContext(UserContext),
    [tab, setTab] = React.useState(0);
  if (!user || !user.token) {
    setPage(1);
    return <>Not logged in</>;
  }

  if (user.kind !== "admin" && !user.verified) {
    setPage(2);
    return <>Not verified by admin</>;
  }

  return (
    <>
      <div>
        <button
          onClick={() => {
            setTab(0);
          }}
        >
          Sent Files
        </button>
        <button
          onClick={() => {
            setTab(1);
          }}
        >
          Recieved Files
        </button>
        {user.kind === "admin" && (
          <button
            onClick={() => {
              setTab(2);
            }}
          >
            Approve/Remove
          </button>
        )}
      </div>
      {tab === 0 && <></>}
      {tab === 1 && <></>}
      {tab === 2 && user.kind === "admin" && <></>}
      <></>
    </>
  );
}
