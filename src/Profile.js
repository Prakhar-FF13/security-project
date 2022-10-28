import axios from "axios";
import FileSaver from "file-saver";
import React, { useContext } from "react";
import { useState } from "react";
import { UserContext } from "./App";

export default function Profile({ setPage }) {
  const [user] = useContext(UserContext);
  const [state, setState] = useState({
    type: user.type,
    username: user.username,
    password: user.password,
    kind: user.kind,
  });

  if (!user || !user.token) {
    setPage(1);
    return <></>;
  } else {  
    const handleDownload = async (file) => {
      console.log(file);
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

    const onChange = (e) => {
      if (e.target.name == "file")
        setState({ ...state, [e.target.name]: e.target.files });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const formData = new FormData();
        if (state.file)
          for (let i = 0; i < state.file.length; i++) {
            formData.append("file", state.file[i]);
          }
  
        //-----------update_user instead of register---------------------
        const res = await axios.post("/register", {
          ...state,
        });
  
        if (state.file)
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

        <div>

        <form
          onSubmit={(e) => {
            handleSubmit(e);
          }}
          method="POST"
          action="upload_files"
          encType="multipart/form-data"
          id="profileForm"
        >
        <h4>Upload files:</h4>
        <input
          type="file"
          id="file"
          name="file"
          multiple
          onChange={onChange}
        />
        <input type="submit" value="Upload" />
      </form>

        </div>
      </>
    );
  }
}
