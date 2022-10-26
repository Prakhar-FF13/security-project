import React from "react";

export default function Navbar({ setPage }) {
  return (
    <div>
      <button onClick={() => setPage(0)}>Register</button>
      <button onClick={() => setPage(1)}>Login</button>
    </div>
  );
}
