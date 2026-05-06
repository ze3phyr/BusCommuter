// lib/data.ts
export type BusStatus = 'on_time' | 'delayed' | 'cancelled';

export type Stop = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  arrivalTime: string;
};

export type BusStatusUpdate = {
  id: string;
  routeId: string;
  status: BusStatus;
  delayMinutes: number;
  estimatedArrival: string;
  updatedBy: string;
  updatedAt: number;
  reason?: string;
};

export type RouteSubscription = {
  id: string;
  routeId: string;
  userId: string;
  stopIds: string[];
  notificationEnabled: boolean;
  createdAt: number;
};

export type AppNotification = {
  id: string;
  routeId: string;
  type: 'delay' | 'eta_update' | 'status_change';
  title: string;
  message: string;
  createdAt: number;
  read: boolean;
};

const STORAGE_KEY_STATUS = 'bus_commuter_status';
const STORAGE_KEY_SUBS = 'bus_commuter_subs';
const STORAGE_KEY_NOTIFS = 'bus_commuter_notifs';

export function loadBusStatus(routeId: string): BusStatusUpdate | null {
  const stored = localStorage.getItem(STORAGE_KEY_STATUS);
  if (!stored) return null;
  const allStatus = JSON.parse(stored) as Record<string, BusStatusUpdate>;
  return allStatus[routeId] || null;
}

export function saveBusStatus(status: BusStatusUpdate): void {
  const stored = localStorage.getItem(STORAGE_KEY_STATUS);
  const allStatus = stored ? JSON.parse(stored) : {};
  allStatus[status.routeId] = status;
  localStorage.setItem(STORAGE_KEY_STATUS, JSON.stringify(allStatus));
}

export function loadSubscriptions(userId: string): RouteSubscription[] {
  const stored = localStorage.getItem(STORAGE_KEY_SUBS);
  if (!stored) return [];
  const allSubs = JSON.parse(stored) as RouteSubscription[];
  return allSubs.filter(s => s.userId === userId);
}

export function saveSubscription(subscription: RouteSubscription): void {
  const stored = localStorage.getItem(STORAGE_KEY_SUBS);
  const allSubs: RouteSubscription[] = stored ? JSON.parse(stored) : [];
  const existingIdx = allSubs.findIndex(s => s.routeId === subscription.routeId && s.userId === subscription.userId);
  if (existingIdx >= 0) {
    allSubs[existingIdx] = subscription;
  } else {
    allSubs.push(subscription);
  }
  localStorage.setItem(STORAGE_KEY_SUBS, JSON.stringify(allSubs));
}

export function loadNotifications(): AppNotification[] {
  const stored = localStorage.getItem(STORAGE_KEY_NOTIFS);
  if (!stored) return [];
  return JSON.parse(stored) as AppNotification[];
}

export function saveNotification(notification: AppNotification): void {
  const stored = localStorage.getItem(STORAGE_KEY_NOTIFS);
  let notifs = stored ? JSON.parse(stored) as AppNotification[] : [];
  notifs.unshift(notification);
  notifs = notifs.slice(0, 50);
  localStorage.setItem(STORAGE_KEY_NOTIFS, JSON.stringify(notifs));
}

export type Route = {
  id: string;
  busNumber: string;
  routeName: string;
  from: string;
  to: string;
  color: string;
  stops: Stop[];
};

export const mockRoutes: Route[] = [
  {
    id: "r1",
    busNumber: "U-101",
    routeName: "Udupi → Manipal → Moodbidri",
    from: "Udupi Bus Stand",
    to: "Moodbidri",
    color: "#16a34a",
    stops: [
      { id: "s1", name: "Udupi Bus Stand", lat: 13.3400, lng: 74.7500, arrivalTime: "06:00" },
      { id: "s2", name: "HNB Junction", lat: 13.3420, lng: 74.7550, arrivalTime: "06:05" },
      { id: "s3", name: "Manipal Bus Stand", lat: 13.3520, lng: 74.7850, arrivalTime: "06:20" },
      { id: "s4", name: "Manipal Hospital", lat: 13.3540, lng: 74.7890, arrivalTime: "06:25" },
      { id: "s5", name: "Kadiyali", lat: 13.3600, lng: 74.8100, arrivalTime: "06:40" },
      { id: "s6", name: "Brahmavar", lat: 13.4150, lng: 74.8500, arrivalTime: "07:00" },
      { id: "s7", name: "Kaikamba", lat: 13.2800, lng: 74.9200, arrivalTime: "07:30" },
      { id: "s8", name: "Moodbidri Bus Stand", lat: 13.0680, lng: 74.9950, arrivalTime: "08:00" },
    ]
  },
  {
    id: "r2",
    busNumber: "M-205",
    routeName: "Mangalore → Surathkal → Udupi",
    from: "Mangalore City",
    to: "Udupi",
    color: "#2563eb",
    stops: [
      { id: "s10", name: "Mangalore City Bus Stand", lat: 12.8700, lng: 74.8800, arrivalTime: "05:30" },
      { id: "s11", name: "Hampankatta", lat: 12.8650, lng: 74.8750, arrivalTime: "05:40" },
      { id: "s12", name: "Kankanady", lat: 12.8900, lng: 74.8600, arrivalTime: "05:50" },
      { id: "s13", name: "Surathkal NIT", lat: 12.9800, lng: 74.8000, arrivalTime: "06:30" },
      { id: "s14", name: "Surathkal Bus Stand", lat: 12.9850, lng: 74.7950, arrivalTime: "06:35" },
      { id: "s15", name: "Mulki", lat: 13.0500, lng: 74.7800, arrivalTime: "06:50" },
      { id: "s16", name: "Padubidri", lat: 13.1200, lng: 74.7700, arrivalTime: "07:15" },
      { id: "s17", name: "Santhekatte", lat: 13.2500, lng: 74.7550, arrivalTime: "07:45" },
      { id: "s1", name: "Udupi Bus Stand", lat: 13.3400, lng: 74.7500, arrivalTime: "08:15" },
    ]
  },
  {
    id: "r3",
    busNumber: "K-303",
    routeName: "Karwar → Udupi Express",
    from: "Karwar",
    to: "Udupi",
    color: "#dc2626",
    stops: [
      { id: "s20", name: "Karwar Bus Stand", lat: 14.8100, lng: 74.1200, arrivalTime: "04:00" },
      { id: "s21", name: "Ankola", lat: 14.5400, lng: 74.3200, arrivalTime: "05:00" },
      { id: "s22", name: "Kumta", lat: 14.4300, lng: 74.4100, arrivalTime: "05:45" },
      { id: "s23", name: "Honnavar", lat: 14.2800, lng: 74.4400, arrivalTime: "06:30" },
      { id: "s24", name: "Manki", lat: 14.1500, lng: 74.5100, arrivalTime: "07:00" },
      { id: "s25", name: "Murudeshwar", lat: 14.0900, lng: 74.5300, arrivalTime: "07:30" },
      { id: "s26", name: "Bhatkal", lat: 13.9800, lng: 74.5600, arrivalTime: "08:15" },
      { id: "s27", name: "Byndoor", lat: 13.8500, lng: 74.6200, arrivalTime: "09:00" },
      { id: "s28", name: "Kundapura", lat: 13.6300, lng: 74.6900, arrivalTime: "10:00" },
      { id: "s1", name: "Udupi Bus Stand", lat: 13.3400, lng: 74.7500, arrivalTime: "11:30" },
    ]
  },
  {
    id: "r4",
    busNumber: "C-404",
    routeName: "City Circle - Udupi Local",
    from: "Udupi Circle",
    to: "Udupi Circle",
    color: "#9333ea",
    stops: [
      { id: "s30", name: "Udupi Bus Stand", lat: 13.3400, lng: 74.7500, arrivalTime: "07:00" },
      { id: "s31", name: "Clock Tower", lat: 13.3410, lng: 74.7520, arrivalTime: "07:05" },
      { id: "s32", name: "City Market", lat: 13.3390, lng: 74.7550, arrivalTime: "07:10" },
      { id: "s33", name: "District Hospital", lat: 13.3350, lng: 74.7580, arrivalTime: "07:15" },
      { id: "s34", name: "Collectorate", lat: 13.3320, lng: 74.7600, arrivalTime: "07:20" },
      { id: "s35", name: "Rajathadka", lat: 13.3380, lng: 74.7650, arrivalTime: "07:30" },
      { id: "s36", name: "Parkala", lat: 13.3450, lng: 74.7700, arrivalTime: "07:40" },
      { id: "s30", name: "Udupi Bus Stand", lat: 13.3400, lng: 74.7500, arrivalTime: "07:50" },
    ]
  },
  {
    id: "r5",
    busNumber: "S-505",
    routeName: "Shivamogga → Agumbe → Udupi",
    from: "Shivamogga",
    to: "Udupi",
    color: "#ea580c",
    stops: [
      { id: "s40", name: "Shivamogga Bus Stand", lat: 13.9300, lng: 75.5700, arrivalTime: "05:00" },
      { id: "s41", name: "Thirthahalli", lat: 13.8800, lng: 75.2100, arrivalTime: "06:30" },
      { id: "s42", name: "Agumbe Ghat", lat: 13.5100, lng: 75.0300, arrivalTime: "08:00" },
      { id: "s43", name: "Agumbe Village", lat: 13.5200, lng: 75.0100, arrivalTime: "08:30" },
      { id: "s44", name: "Someshwara", lat: 13.4500, lng: 74.9200, arrivalTime: "09:30" },
      { id: "s45", name: "Dharmasthala Road", lat: 13.3800, lng: 74.8500, arrivalTime: "10:30" },
      { id: "s1", name: "Udupi Bus Stand", lat: 13.3400, lng: 74.7500, arrivalTime: "11:00" },
    ]
  },
  {
    id: "r6",
    busNumber: "P-606",
    routeName: "Puttur → Bantwal → Mangalore",
    from: "Puttur",
    to: "Mangalore",
    color: "#0891b2",
    stops: [
      { id: "s50", name: "Puttur Bus Stand", lat: 12.7500, lng: 75.1800, arrivalTime: "06:00" },
      { id: "s51", name: "Vittal", lat: 12.6900, lng: 75.1200, arrivalTime: "06:30" },
      { id: "s52", name: "Bantwal", lat: 12.8400, lng: 75.0100, arrivalTime: "07:15" },
      { id: "s53", name: "Moodbidri Road", lat: 12.8600, lng: 74.9500, arrivalTime: "07:45" },
      { id: "s54", name: "Kulshekhar", lat: 12.8550, lng: 74.9100, arrivalTime: "08:00" },
      { id: "s10", name: "Mangalore City Bus Stand", lat: 12.8700, lng: 74.8800, arrivalTime: "08:30" },
    ]
  },
];

function normalizeSearchValue(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

function levenshteinDistance(source: string, target: string): number {
  if (source === target) return 0;
  if (!source.length) return target.length;
  if (!target.length) return source.length;

  const previous = Array.from({ length: target.length + 1 }, (_, index) => index);

  for (let row = 1; row <= source.length; row += 1) {
    let diagonal = previous[0];
    previous[0] = row;

    for (let col = 1; col <= target.length; col += 1) {
      const nextDiagonal = previous[col];
      const cost = source[row - 1] === target[col - 1] ? 0 : 1;

      previous[col] = Math.min(
        previous[col] + 1,
        previous[col - 1] + 1,
        diagonal + cost
      );

      diagonal = nextDiagonal;
    }
  }

  return previous[target.length];
}

function getFuzzyThreshold(query: string): number {
  if (query.length <= 4) return 1;
  if (query.length <= 8) return 2;
  return 3;
}

function getSearchableLocations(route: Route): string[] {
  return [route.from, route.to, route.routeName, ...route.stops.map((stop) => stop.name)];
}

function matchesLocation(query: string, candidate: string): boolean {
  const normalizedQuery = normalizeSearchValue(query);
  const normalizedCandidate = normalizeSearchValue(candidate);

  if (!normalizedQuery) return true;
  if (!normalizedCandidate) return false;
  if (normalizedCandidate.includes(normalizedQuery)) return true;

  const queryParts = normalizedQuery.split(" ");
  const candidateParts = normalizedCandidate.split(" ");
  const threshold = getFuzzyThreshold(normalizedQuery);

  return queryParts.every((queryPart) => {
    if (!queryPart) return true;

    if (candidateParts.some((candidatePart) => candidatePart.includes(queryPart))) {
      return true;
    }

    return candidateParts.some((candidatePart) => {
      const distance = levenshteinDistance(queryPart, candidatePart);
      const partThreshold = Math.min(threshold, getFuzzyThreshold(candidatePart));
      return distance <= partThreshold;
    });
  });
}

export function getLocationSuggestions(query: string, maxResults: number = 6): string[] {
  const uniqueLocations = Array.from(
    new Set(
      mockRoutes.flatMap((route) => [route.from, route.to, ...route.stops.map((stop) => stop.name)])
    )
  );

  const normalizedQuery = normalizeSearchValue(query);

  if (!normalizedQuery) {
    return uniqueLocations.slice(0, maxResults);
  }

  return uniqueLocations
    .map((location) => {
      const normalizedLocation = normalizeSearchValue(location);
      const locationParts = normalizedLocation.split(" ");
      const score = normalizedLocation.startsWith(normalizedQuery)
        ? 0
        : normalizedLocation.includes(normalizedQuery)
          ? 1
          : Math.min(...locationParts.map((part) => levenshteinDistance(normalizedQuery, part)));

      return { location, score };
    })
    .filter(({ location }) => matchesLocation(query, location))
    .sort((left, right) => left.score - right.score || left.location.localeCompare(right.location))
    .slice(0, maxResults)
    .map(({ location }) => location);
}

// Helper function to calculate distance between two coordinates (Haversine formula)
export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Find nearest stops based on user's location
export function findNearestStops(
  userLat: number,
  userLng: number,
  maxResults: number = 10
): Array<{ stop: Stop; route: Route; distance: number }> {
  const allStops: Array<{ stop: Stop; route: Route; distance: number }> = [];

  mockRoutes.forEach((route) => {
    route.stops.forEach((stop) => {
      const distance = calculateDistance(userLat, userLng, stop.lat, stop.lng);
      allStops.push({ stop, route, distance });
    });
  });

  return allStops.sort((a, b) => a.distance - b.distance).slice(0, maxResults);
}

// Find routes matching search query
export function findRoutes(fromQuery: string, toQuery: string): Route[] {
  return mockRoutes.filter((route) => {
    const locations = getSearchableLocations(route);
    const matchesFrom =
      !fromQuery ||
      locations.some((location) => matchesLocation(fromQuery, location));
    const matchesTo =
      !toQuery ||
      locations.some((location) => matchesLocation(toQuery, location));
    return matchesFrom && matchesTo;
  });
}

export function formatDisplayTime(time: string): string {
  if (!time) return "";
  return `${time} PM`;
}
