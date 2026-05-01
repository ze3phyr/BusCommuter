# BusCommuter - Local Bus Information System

A web application designed to provide accurate and accessible information about local bus routes, stops, and timings for daily commuters.

## Problem Statement

Daily local bus commuters frequently face uncertainty and inconvenience due to the lack of reliable information regarding:
- Upcoming bus arrivals at their stop
- Exact routes and stops served by each bus
- Scheduled and expected arrival timings
- Whether a bus will stop at their intended destination

This information gap results in prolonged waiting times, missed buses, increased stress, and reduced confidence in public transportation.

## Features

- Search buses by origin and destination
- Display of nearest bus stops based on location
- Interactive route maps showing complete bus paths and stops
- Detailed stop-wise timings and route information
- Clean, responsive user interface optimized for both desktop and mobile

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Mapping**: Leaflet.js with React Leaflet
- **Icons**: Lucide React

## Project Structure
bus-commuter/
├── app/
│   ├── route/[id]/          # Dynamic route details pages
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx             # Homepage
├── components/
│   └── RouteMap.tsx
├── lib/
│   └── data.ts              # Mock route and stop data
└── README.md
text## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/bus-commuter.git

# Navigate to project directory
cd bus-commuter

# Install dependencies
npm install

# Run the development server
npm run dev
Open http://localhost:3000 to access the application.
Deployment
The application is deployed on Vercel and can be accessed at:
https://bus-commuter.vercel.app/
Future Enhancements

Integration with real-time bus tracking APIs
User accounts and saved favorite routes
Crowd level indicators
Offline support as a Progressive Web App (PWA)
Admin panel for route management

About the Project
This project aims to bridge the information gap in local public transportation, making daily commuting more predictable and efficient for students, office-goers, and general passengers