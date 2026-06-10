# BusGeleya - Local Bus Information System

BusGeleya is a local bus information app for finding routes, stops, timings, and route maps for daily commuters.

## Features

- Search buses by origin and destination
- View route cards with stop count, timings, distance, and status cues
- Open detailed route pages with stop-wise timings and map paths
- Find nearby bus stops using location-based suggestions
- Save favorite routes locally
- Add custom bus routes from the sidebar
- Store custom routes locally in the browser
- Add stop timings for custom routes
- Optionally add stop coordinates in one field, for example: `13.342642, 74.747224`
- Use fallback generated coordinates when custom stop coordinates are not provided
- Responsive desktop and mobile interface

## Custom Routes

Open `Add Route` from the left sidebar to create a local route.

Required fields:
- Bus name
- At least two stops
- Timing for each stop

Optional fields:
- Route name
- Coordinates for each stop

Custom routes are saved in browser `localStorage`, so they stay on the same device/browser without needing a backend. If coordinates are entered, the route detail map can use them for better stop placement. If coordinates are left blank, the app still saves the route and uses fallback coordinates.

## Included Route Data

The app includes mock route data in [lib/data.ts](lib/data.ts), including the `HMT` route from Karkala Bus Stand to Udupi Bus Stand.

## Tech Stack

- **Framework**: Next.js 16 App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Mapping**: Leaflet.js with React Leaflet
- **Icons**: Lucide React

## Project Structure

```text
bus-commuter/
├── app/
│   ├── route/[id]/          # Dynamic route detail pages
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx             # Main app screen
├── components/
│   ├── CustomRouteForm.tsx  # Local custom route builder
│   ├── RouteCard.tsx
│   ├── RouteMap.tsx
│   ├── SearchHeader.tsx
│   └── Sidebar.tsx
├── lib/
│   └── data.ts              # Route data and local route helpers
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm

### Installation

```bash
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

## Build

```bash
npm run lint
npm run build
```

## Future Enhancements

- Real-time bus tracking API integration
- Cloud sync for saved routes and custom routes
- Admin route management
- Crowd level indicators
- Offline support as a Progressive Web App
