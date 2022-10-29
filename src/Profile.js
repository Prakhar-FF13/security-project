import axios from "axios";
import FileSaver from "file-saver";
import React, { useContext, useState } from "react";
import { UserContext } from "./App";

export default function Profile({ setPage }) {
  const [user] = useContext(UserContext);
  const [file, setFile] = useState("");
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

    const handleUpload = async (e) => {
      e.preventDefault();
      const formData = new FormData();
      if (file.file) {
        for (let i = 0; i < file.file.length; i++) {
          formData.append("file", file.file[i]);
        }
      }

      if (file.file)
        await axios.post("/upload_files", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: user.token.token,
          },
        });
    };

    const onChange = (e) => {
      setFile({ ...file, [e.target.name]: e.target.files });
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
