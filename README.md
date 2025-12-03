# Foam Sheet Tracker

A Next.js application for tracking and calculating foam sheets needed for holes in construction projects.

## Features

- Add round or skewed holes with custom dimensions
- Calculate total foam sheets needed based on hole areas
- Breakdown by foam thickness
- Save projects to MongoDB
- Export to PDF
- Real-time calculations with waste factor (10%)

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB (local or MongoDB Atlas)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Create a `.env.local` file in the root directory:
```
MONGODB_URI=mongodb://localhost:27017/foam-tracker
```

For MongoDB Atlas, use:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/foam-tracker
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
hole-tracker/
├── app/
│   ├── api/
│   │   └── projects/        # API routes for projects
│   ├── globals.css          # Global styles
│   ├── layout.js            # Root layout
│   └── page.js              # Main page
├── components/               # React components
├── lib/
│   ├── calculations.js      # Calculation utilities
│   └── mongodb.js           # MongoDB connection
├── models/
│   └── Project.js           # Project model
└── public/                  # Static assets
```

## Usage

1. **Enter Project Information**: Fill in customer name, job number, and job name
2. **Add Holes**: 
   - Select hole type (Round or Skewed)
   - Enter dimensions
   - Select foam thickness
   - Click "Add Hole(s)"
3. **Adjust Quantities**: Use +/- buttons to adjust hole quantities
4. **View Calculations**: See total sheets needed, breakdown by thickness, and hole summary
5. **Save Project**: Click "Save Project" to store in MongoDB
6. **Export PDF**: Click "Download PDF" to generate a printable report

## Calculations

- **Round Holes**: Area = π × (diameter/2)²
- **Skewed Holes**: Area = width × height × 1.5 (requires more foam)
- **Waste Factor**: 10% added to total area
- **Sheet Size**: 4' × 8' (32 sq ft)

## Technologies Used

- Next.js 16
- React 19
- MongoDB
- CSS3

## License

ISC

