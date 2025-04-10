import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";

function Note(props) {
  function handleClick() {
    props.onDelete(props.id);
  }

  return (
    <div className="note">
      <h1>{props.title}</h1>
      <p>{props.content}</p>
      <button 
        onClick={handleClick}
        className="delete-button"
        aria-label="Delete note"
      >
        <DeleteIcon />
      </button>
    </div>
  );
}

export default Note;