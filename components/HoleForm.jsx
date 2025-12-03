'use client';

import { useState } from 'react';

export default function HoleForm({ onAdd }) {
  const [holeType, setHoleType] = useState('round');
  const [diameter, setDiameter] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [thickness, setThickness] = useState('6');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (holeType === 'round') {
      const diameterValue = parseFloat(diameter);
      if (!diameterValue || diameterValue <= 0) {
        alert('Please enter a valid hole diameter');
        return;
      }
      onAdd({
        type: 'round',
        diameter: diameterValue,
        thickness: parseFloat(thickness),
      });
    } else {
      const widthValue = parseFloat(width);
      const heightValue = parseFloat(height);
      if (!widthValue || widthValue <= 0 || !heightValue || heightValue <= 0) {
        alert('Please enter valid width and height');
        return;
      }
      onAdd({
        type: 'skewed',
        width: widthValue,
        height: heightValue,
        thickness: parseFloat(thickness),
      });
    }

    // Clear form
    setDiameter('');
    setWidth('');
    setHeight('');
    setHoleType('round');
    setThickness('6');
  };

  const handleClear = () => {
    setDiameter('');
    setWidth('');
    setHeight('');
    setHoleType('round');
    setThickness('6');
  };

  return (
    <>
      <h2>Add Holes</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Hole Type</label>
          <select
            value={holeType}
            onChange={(e) => setHoleType(e.target.value)}
          >
            <option value="round">Round Hole</option>
            <option value="skewed">Skewed Hole</option>
          </select>
        </div>

        {holeType === 'round' ? (
          <div className="form-group" id="round-diameter-group">
            <label>Hole Diameter (inches)</label>
            <input
              type="number"
              value={diameter}
              onChange={(e) => setDiameter(e.target.value)}
              placeholder="Enter diameter (e.g., 4, 6, 8)"
              min="1"
              required
            />
          </div>
        ) : (
          <div className="form-row" id="skewed-dimensions-group">
            <div className="form-group">
              <label>Width (inches)</label>
              <input
                type="number"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                placeholder="Width"
                min="1"
                required
              />
            </div>
            <div className="form-group">
              <label>Height (inches)</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="Height"
                min="1"
                required
              />
            </div>
          </div>
        )}

        <div className="form-group">
          <label>Foam Thickness</label>
          <select
            value={thickness}
            onChange={(e) => setThickness(e.target.value)}
          >
            <option value="4">4 inches</option>
            <option value="5">5 inches</option>
            <option value="6">6 inches</option>
            <option value="7">7 inches</option>
            <option value="8">8 inches</option>
          </select>
        </div>

        <div className="button-group">
          <button type="submit" className="btn-primary">Add Hole(s)</button>
          <button type="button" className="btn-secondary" onClick={handleClear}>
            Clear Form
          </button>
        </div>
      </form>
    </>
  );
}

