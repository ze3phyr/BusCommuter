// lib/data.ts
export type Stop = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  arrivalTime: string;
};

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
    routeName: "Udupi to Moodbidri",
    from: "Udupi Bus Stand",
    to: "Moodbidri",
    color: "#15803d",
    stops: [
      { id: "s1", name: "Udupi Bus Stand", lat: 13.3400, lng: 74.7500, arrivalTime: "08:00" },
      { id: "s2", name: "Manipal", lat: 13.3520, lng: 74.7850, arrivalTime: "08:25" },
      { id: "s3", name: "Kadiyali", lat: 13.3600, lng: 74.8100, arrivalTime: "08:40" },
      { id: "s4", name: "Brahmavar", lat: 13.4150, lng: 74.8500, arrivalTime: "09:05" },
      { id: "s5", name: "Moodbidri Bus Stand", lat: 13.0680, lng: 74.9950, arrivalTime: "10:00" },
    ]
  },
  {
    id: "r2",
    busNumber: "M-205",
    routeName: "Mangalore to Udupi",
    from: "Mangalore Bus Stand",
    to: "Udupi",
    color: "#1e40af",
    stops: [
      { id: "s6", name: "Mangalore Bus Stand", lat: 12.8700, lng: 74.8800, arrivalTime: "07:30" },
      { id: "s7", name: "Surathkal", lat: 12.9800, lng: 74.8000, arrivalTime: "08:10" },
      { id: "s8", name: "Mulki", lat: 13.0500, lng: 74.7800, arrivalTime: "08:35" },
      { id: "s1", name: "Udupi Bus Stand", lat: 13.3400, lng: 74.7500, arrivalTime: "09:30" },
    ]
  },
];
