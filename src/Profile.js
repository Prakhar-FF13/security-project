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
    const handleDownload = async (id) => {
      const res = await axios.get(`/fetch_files/${id}`, {
        headers: {
          Authorization: user.token.token,
        },
        responseType: "blob",
      });
      console.log(res);
      FileSaver.saveAs(res.data, id);
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
        {user.files.map((file) => {
          return (
            <>
              <h4>File Id:</h4>
              {file.id}
              <h4>File Type</h4>
              {file.contentType}
              {file.contentType.split("/")[0] === "image" && (
                <button
                  onClick={() => {
                    handleDownload(file.id);
                  }}
                >
                  Download
                </button>
              )}
            </>
          );
        })}
      </>
    );
  }
}
