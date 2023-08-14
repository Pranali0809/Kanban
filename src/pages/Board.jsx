import React, { useState, useEffect } from "react";
import { fetchData } from "../api";
import Card from "../components/Card";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

function KanbanBoard() {
  const [data, setData] = useState(null);
  const [displayMode, setDisplayMode] = useState("status");

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("kanbanData"));
    if (storedData) {
      setData(storedData);
    } else {
      fetchData().then((fetchedData) => setData(fetchedData));
    }
  }, []);

  useEffect(() => {
    if (data) {
      localStorage.setItem("kanbanData", JSON.stringify(data));
    }
  }, [data]);

  const displayOptions = {
    status: "Status",
    users: "Users",
    priority: "Priority",
  };

  const groupByPriority = ["Urgent", "High", "Medium", "Low", "No priority"];

  const getColumnCards = (columnName) => {
    if (!data) return [];

    if (columnName === "status") {
      return ["Todo", "Inprogress", "Done"].map((status) => (
        <div className="kanban-column" key={status}>
          <h2>{status}</h2>
          {data.tickets
            .filter((ticket) => ticket.status === status)
            .map((ticket, index) => (
              <Draggable key={ticket.id} draggableId={ticket.id} index={index}>
                {(provided) => (
                  <div
                    className="card"
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <Card
                      id={ticket.id}
                      title={ticket.title}
                      tag={ticket.tag}
                    />
                  </div>
                )}
              </Draggable>
            ))}
        </div>
      ));
    }

    if (columnName === "users") {
      return data.users.map((user) => (
        <div className="kanban-column" key={user.id}>
          <h2>{user.name}</h2>
          {data.tickets
            .filter((ticket) => ticket.userId === user.id)
            .map((ticket, index) => (
              <Draggable key={ticket.id} draggableId={ticket.id} index={index}>
                {(provided) => (
                  <div
                    className="card"
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <Card
                      id={ticket.id}
                      title={ticket.title}
                      tag={ticket.tag}
                    />
                  </div>
                )}
              </Draggable>
            ))}
        </div>
      ));
    }

    if (columnName === "priority") {
      return groupByPriority.map((priority, index) => (
        <div className="kanban-column" key={priority}>
          <h2>
            {index} - {priority}
          </h2>
          {data.tickets
            .filter((ticket) => ticket.priority === index)
            .map((ticket, index) => (
              <Draggable key={ticket.id} draggableId={ticket.id} index={index}>
                {(provided) => (
                  <div
                    className="card"
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <Card
                      id={ticket.id}
                      title={ticket.title}
                      tag={ticket.tag}
                    />
                  </div>
                )}
              </Draggable>
            ))}
        </div>
      ));
    }

    return [];
  };

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const updatedData = { ...data };
    const statusMapping = {
      0: "Todo",
      1: "Inprogress",
      2: "Done",
    };
    const priorityMapping = {
      0: 0,
      1: 1,
      2: 2,
      3: 3,
      4: 4,
    };

    const draggedCardId = result.draggableId;
    const draggedCard = updatedData.tickets.find(
      (ticket) => ticket.id === draggedCardId
    );



    if (displayMode === "status") {
      draggedCard.status = statusMapping[result.destination.droppableId];
      
    } else if (displayMode === "priority") {
      draggedCard.priority = priorityMapping[result.destination.droppableId];
    
    } else if (displayMode === "users") {
 
      const newUser = data.users.find(
        (user) => user.id.toString() === result.destination.droppableId
      );
      if (newUser) {
        draggedCard.userId = newUser.id;
  
      }
    }

    const updatedTickets = updatedData.tickets.map((ticket) => {
      if (ticket.id === draggedCardId) {
        return draggedCard;
      }
      return ticket;
    });

    updatedData.tickets = updatedTickets;
    console.log(updatedData);
    setData(updatedData);
    localStorage.setItem("kanbanData", JSON.stringify(updatedData));
  };

  return (
    <div className="main">
      <div className="display-dropdown">
        <select
          className="dropdown"
          value={displayMode}
          onChange={(e) => setDisplayMode(e.target.value)}
        >
          {Object.keys(displayOptions).map((option) => (
            <option value={option} key={option}>
              {displayOptions[option]}
            </option>
          ))}
        </select>
      </div>
      <div className="kanban-board">
        <DragDropContext onDragEnd={onDragEnd}>
          {getColumnCards(displayMode).map((column, columnIndex) => (
            <Droppable
              droppableId={columnIndex.toString()}
              key={columnIndex.toString()}
            >
              {(provided) => (
                <div
                  className="kanban-column-parent"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {column}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </DragDropContext>
      </div>
    </div>
  );
}

export default KanbanBoard;