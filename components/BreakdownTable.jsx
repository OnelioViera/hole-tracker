'use client';

import { getBreakdownByThickness } from '@/lib/calculations';

export default function BreakdownTable({ holes }) {
  const breakdown = getBreakdownByThickness(holes);
  const thicknesses = Object.keys(breakdown).sort((a, b) => a - b);

  return (
    <div className="card card-spacing">
      <h2>Breakdown by Thickness</h2>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th scope="col">Thickness</th>
              <th scope="col" className="text-right">
                Area (sq ft)
              </th>
              <th scope="col" className="text-right">Sheets</th>
            </tr>
          </thead>
          <tbody>
            {thicknesses.length === 0 ? (
              <tr>
                <td colSpan="3" className="empty-state">
                  No data
                </td>
              </tr>
            ) : (
              thicknesses.map((thickness) => (
                <tr key={thickness}>
                  <td>{thickness}"</td>
                  <td className="text-right">
                    {breakdown[thickness].area.toFixed(2)}
                  </td>
                  <td className="text-right">{breakdown[thickness].sheets}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

