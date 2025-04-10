import React from "react";
import NoteAltIcon from "@mui/icons-material/NoteAlt";

function Header() {
  return (
    <header className="header">
      <h1>
        <NoteAltIcon fontSize="large" />
        Keppr
      </h1>
    </header>
  );
}

export default Header;