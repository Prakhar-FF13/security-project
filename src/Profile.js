import axios from "axios";
import FileSaver from "file-saver";
import React, { useContext } from "react";
import { UserContext } from "./App";

export default function Profile({ setPage }) {
  const [user] = useContext(UserContext);
  if (!user || !user.token) {
    setPage(1);
    return <></>;
  } else {
    const handleDownload = async (file) => {
      const res = await axios.get(`/fetch_files/${file.id}`, {
        headers: {
          Authorization: user.token.token,
        },
        responseType: "blob",
        params: {
          type: file.mimetype,
        },
      });
      FileSaver.saveAs(res.data, file.filename);
    };

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
        {user.files.map((obj) => {
          const file = obj.payload;
          return (
            <>
              <h4>File Id:</h4>
              {file.id}
              <h4>File Type</h4>
              {file.mimetype}
              <button
                onClick={() => {
                  handleDownload(file);
                }}
              >
                Download
              </button>
            </>
          );
        })}
      </>
    );
  }
}
