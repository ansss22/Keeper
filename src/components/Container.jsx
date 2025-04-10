import React, { useState, useRef } from "react";
import Card from "./Card";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useDrag, useDrop } from "react-dnd";

const CONTAINER_TYPE = "CONTAINER";

function Container({ 
  id, 
  title, 
  cards, 
  onDelete, 
  onAddCard, 
  onDeleteCard, 
  moveCard, 
  moveCardBetweenContainers,
  moveContainer,
  index
}) {
  const [newCardContent, setNewCardContent] = useState("");
  const [isAddingCard, setIsAddingCard] = useState(false);
  
  const ref = useRef(null);
  
  // Container drag
  const [{ isDragging }, drag] = useDrag({
    type: CONTAINER_TYPE,
    item: { id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  
  // Container drop
  const [, drop] = useDrop({
    accept: CONTAINER_TYPE,
    hover(item, monitor) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) return;

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current.getBoundingClientRect();
      
      // Get horizontal middle
      const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
      
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      
      // Get pixels to the left
      const hoverClientX = clientOffset.x - hoverBoundingRect.left;
      
      // Only perform the move when the mouse has crossed half of the items height
      // Dragging to the right
      if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) return;
      
      // Dragging to the left
      if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) return;
      
      // Perform the move
      moveContainer(dragIndex, hoverIndex);
      
      // Update the item's index for future checks
      item.index = hoverIndex;
    },
  });
  
  // Cards drop
  const [, dropCard] = useDrop({
    accept: "CARD",
    drop(item) {
      if (item.containerId !== id) {
        moveCardBetweenContainers(
          item.containerId,
          id,
          item.index,
          cards.length,
          item.id
        );
      }
      return { containerId: id };
    },
  });
  
  drag(drop(dropCard(ref)));

  const handleDeleteContainer = () => {
    onDelete(id);
  };

  const handleAddCard = (e) => {
    e.preventDefault();
    if (newCardContent.trim()) {
      onAddCard(id, newCardContent);
      setNewCardContent("");
      setIsAddingCard(false);
    }
  };

  const handleNewCardChange = (e) => {
    setNewCardContent(e.target.value);
  };

  return (
    <div 
      ref={ref}
      className={`container ${isDragging ? 'dragging' : ''}`}
      aria-label={`Container: ${title}`}
    >
      <div className="container-header">
        <h2 className="container-title">{title}</h2>
        <button 
          onClick={handleDeleteContainer}
          className="delete-button"
          aria-label={`Delete container ${title}`}
        >
          <DeleteIcon />
        </button>
      </div>
      
      <div className="container-content">
        {cards.map((card, cardIndex) => (
          <Card
            key={card.id}
            id={card.id}
            index={cardIndex}
            containerId={id}
            content={card.content}
            onDelete={() => onDeleteCard(id, card.id)}
            moveCard={(dragIndex, hoverIndex) => moveCard(dragIndex, hoverIndex, id)}
          />
        ))}

        {isAddingCard ? (
          <form onSubmit={handleAddCard} className="add-card-form">
            <textarea
              className="card-textarea"
              rows="3"
              value={newCardContent}
              onChange={handleNewCardChange}
              placeholder="Enter card content..."
              autoFocus
              aria-label="New card content"
            />
            <div className="form-buttons">
              <button
                type="button"
                onClick={() => setIsAddingCard(false)}
                className="cancel-btn"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="add-btn"
              >
                Add
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setIsAddingCard(true)}
            className="add-card-btn"
            aria-label="Add a new card"
          >
            <AddIcon fontSize="small" style={{ marginRight: "4px" }} />
            Add a card
          </button>
        )}
      </div>
    </div>
  );
}

export default Container;