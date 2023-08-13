import React, { useState, useEffect } from 'react';
import { fetchData } from '../api';
import Card from '../components/Card';

function KanbanBoard() {
  const [data, setData] = useState(null);
  const [displayMode, setDisplayMode] = useState('status');

  useEffect(() => {
    fetchData().then((fetchedData) => setData(fetchedData));
  }, []);

  const displayOptions = {
    status: 'Status',
    users: 'Users',
    priority: 'Priority',
  };

  const groupByPriority = ['Urgent', 'High', 'Medium', 'Low', 'No priority'];

  const getColumnCards = (columnName) => {
    if (!data) return [];

    if (columnName === 'status') {
      return ['Todo', 'Inprogress', 'Done'].map((status) => (
        <div className="kanban-column" key={status}>
          <h2>{status}</h2>
          {data.tickets
            .filter((ticket) => ticket.status === status)
            .map((ticket) => (
              <Card key={ticket.id} id={ticket.id} title={ticket.title} tag={ticket.tag} />
            ))}
        </div>
      ));
    }

    if (columnName === 'users') {
      return data.users.map((user) => (
        <div className="kanban-column" key={user.id}>
          <h2>{user.name}</h2>
          {data.tickets
            .filter((ticket) => ticket.userId === user.id)
            .map((ticket) => (
              <Card key={ticket.id} id={ticket.id} title={ticket.title} tag={ticket.tag} />
            ))}
        </div>
      ));
    }

    if (columnName === 'priority') {
      return groupByPriority.map((priority, index) => (
        <div className="kanban-column" key={priority}>
          <h2>{index} - {priority}</h2>
          {data.tickets
            .filter((ticket) => ticket.priority === index)
            .map((ticket) => (
              <Card key={ticket.id} id={ticket.id} title={ticket.title} tag={ticket.tag} />
            ))}
        </div>
      ));
    }

    return [];
  };

  return (
    <div className="kanban-board">
      <div className="display-dropdown">
        <select value={displayMode} onChange={(e) => setDisplayMode(e.target.value)}>
          {Object.keys(displayOptions).map((option) => (
            <option value={option} key={option}>
              {displayOptions[option]}
            </option>
          ))}
        </select>
      </div>
      {getColumnCards(displayMode)}
    </div>
  );
}

export default KanbanBoard;
