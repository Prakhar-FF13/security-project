import axios from "axios";
import FileSaver from "file-saver";
import React, { useContext, useState } from "react";
import { UserContext } from "./App";

export default function Profile({ setPage }) {
  const [user, setUser] = useContext(UserContext);
  const [state, setState] = useState("");
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
      });
      FileSaver.saveAs(res.data, file.filename);
    };

    const handleUpload = async (e) => {
      e.preventDefault();
      const formData = new FormData();
      if (state.file) {
        for (let i = 0; i < state.file.length; i++) {
          formData.append("file", state.file[i]);
        }
      }

      if (state.file) {
        const { data } = await axios.post("/upload_files", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: user.token.token,
          },
        });

        setUser({ ...user, files: data.files });
      }
    };

    const onShare = async (obj) => {
      obj.sendTo = state.share;
      await axios.post("/share", obj, {
        headers: {
          Authorization: user.token.token,
        },
      });
    };

    const onChange = (e) => {
      if (e.target.name !== "file")
        setState({ ...state, [e.target.name]: e.target.value });
      else setState({ ...state, [e.target.name]: e.target.files });
    };

    return (
      <>
        <div>
          <h4>Email:</h4>
          {user.email}
        </div>
        <div>
          <h4>Type:</h4>
          {user.type}
        </div>
        <div>
          <h4>Kind:</h4>
          {user.kind}
        </div>
        <div>
          <h4>Verified:</h4>
          {user.verified === true
            ? "Verified"
            : "Pending verification from admin"}
        </div>
        <hr />
        <label htmlFor="share">Share with:</label>
        <input
          type="text"
          name="share"
          onChange={onChange}
          value={state.share}
        />
        {user.files.map((obj) => {
          const file = obj.payload;
          return (
            <>
              <h4>File Id:</h4>
              {file.id}
              <button
                onClick={() => {
                  handleDownload(file);
                }}
              >
                Download
              </button>
              <button
                onClick={() => {
                  onShare(obj);
                }}
              >
                Share
              </button>
            </>
          );
        })}
        <form
          onSubmit={(e) => {
            handleUpload(e);
          }}
          method="POST"
          action="upload_files"
          encType="multipart/form-data"
          id="regForm"
        >
          <label htmlFor="file">Files: </label>
          <input
            type="file"
            id="file"
            name="file"
            multiple
            onChange={onChange}
          />
          <input type="submit" value="submit" />
        </form>
      </>
    );
  }
}
