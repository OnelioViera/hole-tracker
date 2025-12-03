'use client';

import { getHoleDisplaySize, getHoleArea } from '@/lib/calculations';

export default function HoleSummaryTable({ holes }) {
  return (
    <div className="card card-spacing">
      <h2>Hole Summary</h2>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th scope="col">Type</th>
              <th scope="col">Size</th>
              <th scope="col" className="text-right">
                Qty
              </th>
              <th scope="col" className="text-right">
                Area
              </th>
            </tr>
          </thead>
          <tbody>
            {holes.length === 0 ? (
              <tr>
                <td colSpan="4" className="empty-state">
                  No holes added
                </td>
              </tr>
            ) : (
              holes.map((hole) => (
                <tr key={hole.id}>
                  <td>
                    <span className={`badge badge-${hole.type}`}>
                      {hole.type.toUpperCase()}
                    </span>
                  </td>
                  <td>{getHoleDisplaySize(hole)}</td>
                  <td className="text-right">{hole.quantity}</td>
                  <td className="text-right">
                    {getHoleArea(hole).toFixed(2)} sq in
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

