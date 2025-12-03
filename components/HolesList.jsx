'use client';

import { getHoleDisplaySize } from '@/lib/calculations';

export default function HolesList({ holes, onUpdateQuantity, onRemove }) {
  if (holes.length === 0) {
    return (
      <>
        <h2>Added Holes</h2>
        <div className="holes-list">
          <div className="empty-state">
            No holes added yet. Use the form above to add holes.
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <h2>Added Holes</h2>
      <div className="holes-list">
        {holes.map((hole) => (
          <div key={hole.id} className="hole-item">
            <div className="hole-item-left">
              <div className="hole-name">
                <span className={`badge badge-${hole.type}`}>
                  {hole.type.toUpperCase()}
                </span>{' '}
                {getHoleDisplaySize(hole)}
              </div>
              <div className="hole-details">{hole.thickness}" Foam Thickness</div>
            </div>
            <div className="hole-item-right">
              <div className="quantity-control">
                <button onClick={() => onUpdateQuantity(hole.id, -1)}>−</button>
                <div className="quantity-value">{hole.quantity}</div>
                <button onClick={() => onUpdateQuantity(hole.id, 1)}>+</button>
              </div>
              <button
                className="btn-small btn-danger"
                onClick={() => onRemove(hole.id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

