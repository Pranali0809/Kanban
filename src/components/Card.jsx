import React from 'react';

function Card({ id, title, tag }) {
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-id">{id}</div>
        <div className="card-title">{title}</div>
      </div>
      <div className="card-tags">
        {tag.map((t) => (
          <span className="tag" key={t}>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

export default Card;
