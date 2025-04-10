import React, { useState, useCallback } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Header from "./Header";
import Footer from "./Footer";
import Container from "./Container";
import CreateContainer from "./CreateContainer";
import "./styles.css"; // Import the CSS file

function App() {
  const [containers, setContainers] = useState([]);
  const [nextContainerId, setNextContainerId] = useState(1);
  const [nextCardId, setNextCardId] = useState(1);

  // Add a new container
  const addContainer = useCallback((title) => {
    const newContainer = {
      id: nextContainerId,
      title,
      cards: []
    };
    setContainers(prevContainers => [...prevContainers, newContainer]);
    setNextContainerId(prevId => prevId + 1);
  }, [nextContainerId]);

  // Delete a container
  const deleteContainer = useCallback((containerId) => {
    setContainers(prevContainers => 
      prevContainers.filter(container => container.id !== containerId)
    );
  }, []);

  // Add a card to a container
  const addCard = useCallback((containerId, content) => {
    setContainers(prevContainers => 
      prevContainers.map(container => 
        container.id === containerId 
          ? {
              ...container,
              cards: [
                ...container.cards, 
                { id: nextCardId, content }
              ]
            }
          : container
      )
    );
    setNextCardId(prevId => prevId + 1);
  }, [nextCardId]);

  // Delete a card
  const deleteCard = useCallback((containerId, cardId) => {
    setContainers(prevContainers => 
      prevContainers.map(container => 
        container.id === containerId 
          ? {
              ...container,
              cards: container.cards.filter(card => card.id !== cardId)
            }
          : container
      )
    );
  }, []);

  // Move a card within the same container
  const moveCard = useCallback((dragIndex, hoverIndex, containerId) => {
    setContainers(prevContainers => 
      prevContainers.map(container => {
        if (container.id !== containerId) return container;
        
        const cards = [...container.cards];
        const dragCard = cards[dragIndex];
        
        // Remove the dragged card
        cards.splice(dragIndex, 1);
        // Insert the card at the hover position
        cards.splice(hoverIndex, 0, dragCard);
        
        return {
          ...container,
          cards
        };
      })
    );
  }, []);

  // Move a card between containers
  const moveCardBetweenContainers = useCallback((
    sourceContainerId, 
    targetContainerId, 
    sourceIndex, 
    targetIndex, 
    cardId
  ) => {
    setContainers(prevContainers => {
      // Find source and target containers
      const sourceContainer = prevContainers.find(c => c.id === sourceContainerId);
      
      // Get the card being moved
      const cardToMove = sourceContainer.cards.find(c => c.id === cardId);
      
      return prevContainers.map(container => {
        // Remove card from source container
        if (container.id === sourceContainerId) {
          return {
            ...container,
            cards: container.cards.filter(card => card.id !== cardId)
          };
        }
        
        // Add card to target container
        if (container.id === targetContainerId) {
          const newCards = [...container.cards];
          newCards.splice(targetIndex, 0, cardToMove);
          return {
            ...container,
            cards: newCards
          };
        }
        
        return container;
      });
    });
  }, []);

  // Move containers
  const moveContainer = useCallback((dragIndex, hoverIndex) => {
    setContainers(prevContainers => {
      const newContainers = [...prevContainers];
      const draggedContainer = newContainers[dragIndex];
      
      // Remove the dragged container
      newContainers.splice(dragIndex, 1);
      // Insert the container at the hover position
      newContainers.splice(hoverIndex, 0, draggedContainer);
      
      return newContainers;
    });
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="app-container">
        <Header />
        <div style={{ padding: "32px 24px", flex: 1 }}>
          <CreateContainer onAdd={addContainer} />
          <div className="containers-grid">
            {containers.map((container, index) => (
              <Container
                key={container.id}
                index={index}
                id={container.id}
                title={container.title}
                cards={container.cards}
                onDelete={deleteContainer}
                onAddCard={addCard}
                onDeleteCard={deleteCard}
                moveCard={moveCard}
                moveCardBetweenContainers={moveCardBetweenContainers}
                moveContainer={moveContainer}
              />
            ))}
          </div>
        </div>
        <Footer />
      </div>
    </DndProvider>
  );
}

export default App;