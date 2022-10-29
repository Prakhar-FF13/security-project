import React from "react";
import { UserContext } from "./App";
import axios from "axios";

export default function Dashboard({ setPage }) {
  const [user, setUser] = React.useContext(UserContext),
    [tab, setTab] = React.useState(0);
  if (!user || !user.token) {
    setPage(1);
    return <>Not logged in</>;
  }

  // if (user.kind !== "admin" && !user.verified) {
  //   setPage(2);
  //   return <>Not verified by admin</>;
  // }

  const sentFiles = () => {
    return (
      <>
        {user.sendTo &&
          user.sendTo.map((obj) => {
            return (
              <>
                <p>File Id: {obj.id}</p>
                <p>Email of person: {obj.sendTo}</p>
              </>
            );
          })}
      </>
    );
  };

  const receivedFiles = () => {
    return (
      <>
        {user.receivedFrom &&
          user.receivedFrom.map((obj) => {
            return (
              <>
                <p>File Id: {obj.payload.id}</p>
                <p>Email of owner: {obj.payload.email}</p>
              </>
            );
          })}
      </>
    );
  };

  return (
    <>
      <div>
        <button
          onClick={async () => {
            setTab(0);
            const { data } = await axios.get("/fetch_shared_files", {
              headers: {
                Authorization: user.token.token,
              },
            });

            setUser({ ...user, sendTo: data });
          }}
        >
          Sent Files
        </button>
        <button
          onClick={async () => {
            setTab(1);

            const { data } = await axios.get("/fetch_received_files", {
              headers: {
                Authorization: user.token.token,
              },
            });

            setUser({ ...user, receivedFrom: data });
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
      {tab === 0 && <>{sentFiles()}</>}
      {tab === 1 && <>{receivedFiles()}</>}
      {tab === 2 && user.kind === "admin" && <></>}
      <></>
    </>
  );
}
