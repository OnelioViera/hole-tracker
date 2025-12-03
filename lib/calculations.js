// Calculation utilities for foam sheets

export const SHEET_SIZE = { width: 4, height: 8 }; // in feet
export const WASTE_FACTOR = 0.10; // 10%

export function getHoleArea(hole) {
  let area;
  
  if (hole.type === 'round') {
    // Area of circle in square inches
    const radius = hole.diameter / 2;
    area = Math.PI * radius * radius;
  } else if (hole.type === 'skewed') {
    // Area of rectangle in square inches
    area = hole.width * hole.height;
    // Skewed holes need 1.5x more foam
    area *= 1.5;
  }
  
  return area * hole.quantity;
}

export function getHoleAreaInSqFt(hole) {
  return getHoleArea(hole) / 144; // Convert sq inches to sq feet
}

export function calculateTotals(holes) {
  const sheetAreaSqFt = SHEET_SIZE.width * SHEET_SIZE.height;
  
  let totalHoleArea = 0;
  holes.forEach(hole => {
    totalHoleArea += getHoleAreaInSqFt(hole);
  });

  const wasteArea = totalHoleArea * WASTE_FACTOR;
  const totalAreaNeeded = totalHoleArea + wasteArea;
  const sheetsRequired = Math.ceil(totalAreaNeeded / sheetAreaSqFt);

  return {
    sheetAreaSqFt,
    totalHoleArea,
    wasteArea,
    totalAreaNeeded,
    sheetsRequired
  };
}

export function getBreakdownByThickness(holes) {
  const breakdown = {};
  
  holes.forEach(hole => {
    if (!breakdown[hole.thickness]) {
      breakdown[hole.thickness] = 0;
    }
    breakdown[hole.thickness] += getHoleAreaInSqFt(hole);
  });

  // Add waste factor to each thickness
  const result = {};
  Object.keys(breakdown).forEach(thickness => {
    const area = breakdown[thickness];
    const withWaste = area * (1 + WASTE_FACTOR);
    const sheetAreaSqFt = SHEET_SIZE.width * SHEET_SIZE.height;
    const sheets = Math.ceil(withWaste / sheetAreaSqFt);
    result[thickness] = { area: withWaste, sheets };
  });

  return result;
}

export function getHoleDisplaySize(hole) {
  if (hole.type === 'round') {
    return `${hole.diameter}" Ø`;
  } else {
    return `${hole.width}" × ${hole.height}"`;
  }
}

