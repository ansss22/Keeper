import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { Fab, Zoom } from "@mui/material";

function CreateContainer({ onAdd }) {
  const [title, setTitle] = useState("");
  const [isExpanded, setExpanded] = useState(false);

  const handleChange = (event) => {
    setTitle(event.target.value);
  };

  const submitContainer = (event) => {
    event.preventDefault();
    if (title.trim()) {
      onAdd(title);
      setTitle("");
      setExpanded(false);
    }
  };

  const expand = () => {
    setExpanded(true);
  };

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <form className="create-container-form" onSubmit={submitContainer}>
        <input
          className="create-container-input"
          name="title"
          onClick={expand}
          onChange={handleChange}
          value={title}
          placeholder="Add a new container..."
          aria-label="Container title"
        />
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Zoom in={isExpanded || title.length > 0}>
            <Fab 
              color="primary" 
              sx={{ bgcolor: '#ffb347', '&:hover': { bgcolor: '#f59e0b' } }}
              onClick={submitContainer}
              size="medium"
              type="submit"
              aria-label="Add container"
            >
              <AddIcon />
            </Fab>
          </Zoom>
        </div>
      </form>
    </div>
  );
}

export default CreateContainer;