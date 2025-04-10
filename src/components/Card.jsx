import React, { useRef } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDrag, useDrop } from "react-dnd";

function Card({ id, content, onDelete, index, moveCard, containerId }) {
  const ref = useRef(null);
  
  const [{ isDragging }, drag] = useDrag({
    type: "CARD",
    item: { id, index, containerId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });
  
  const [, drop] = useDrop({
    accept: "CARD",
    hover(item, monitor) {
      if (!ref.current) return;
      
      const dragIndex = item.index;
      const hoverIndex = index;
      const sourceContainerId = item.containerId;
      
      // Don't replace items with themselves
      if (dragIndex === hoverIndex && sourceContainerId === containerId) return;
      
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current.getBoundingClientRect();
      
      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      
      // Only perform the move when the mouse has crossed half of the items height
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;
      
      // If it's in the same container, just move the card
      if (sourceContainerId === containerId) {
        moveCard(dragIndex, hoverIndex);
        
        // Update the item index for future checks
        item.index = hoverIndex;
      }
    }
  });
  
  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={`card ${isDragging ? 'dragging' : ''}`}
    >
      <div className="card-content">
        <p className="card-text">{content}</p>
        <button
          onClick={onDelete}
          className="delete-button"
          aria-label="Delete card"
        >
          <DeleteIcon fontSize="small" />
        </button>
      </div>
    </div>
  );
}

export default Card;