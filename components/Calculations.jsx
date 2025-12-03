'use client';

import { calculateTotals, SHEET_SIZE } from '@/lib/calculations';

export default function Calculations({ holes }) {
  const totals = calculateTotals(holes);

  return (
    <div className="card">
      <h2>Foam Calculations</h2>
      <div className="calculation-row" id="calc-sheet-size">
        <span className="label">Sheet Size:</span>
        <span className="value">
          {SHEET_SIZE.width}' × {SHEET_SIZE.height}' ({totals.sheetAreaSqFt} sq ft)
        </span>
      </div>
      <div className="calculation-row" id="calc-hole-area">
        <span className="label">Total Hole Area:</span>
        <span className="value">{totals.totalHoleArea.toFixed(2)} sq ft</span>
      </div>
      <div className="calculation-row" id="calc-waste">
        <span className="label">Waste Factor (10%):</span>
        <span className="value">{totals.wasteArea.toFixed(2)} sq ft</span>
      </div>
      <div className="calculation-row total" id="calc-total">
        <span className="label">Total Area Needed:</span>
        <span className="value">{totals.totalAreaNeeded.toFixed(2)} sq ft</span>
      </div>
      <div className="calculation-row highlight" id="calc-sheets">
        <span className="label">
          <strong>Sheets Required:</strong>
        </span>
        <span className="value">
          <strong>{totals.sheetsRequired}</strong>
        </span>
      </div>
    </div>
  );
}

