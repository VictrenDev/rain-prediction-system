import { SensorNode } from "./types/nodes";
import { Node } from "./types/overview";

export const pressureUnit = "hPa"
export const temperatureUnit = "°C"


export const NODES: Node[] = [
  {
    name: "Master Hub",
    location: "Roof Station",
    status: "Online",
    pressure: "1,008.4 hPa",
    temperature: "21.4°C",
    humidity: "84%",
    color: "primary",
  },
  {
    name: "Node 1",
    location: "North Garden",
    status: "Online",
    pressure: "1,008.2 hPa",
    temperature: "20.6°C",
    humidity: "85%",
    color: "secondary",
  },
  {
    name: "Node 2",
    location: "South Valley",
    status: "Online",
    pressure: "1,008.9 hPa",
    temperature: "19.8°C",
    humidity: "88%",
    color: "secondary",
  },
];


export const SENSOR_NODES_LIST: SensorNode[] = [
  {
    id: "node-00",
    name: "Master Hub",
    location: "Roof Station",
    topic: "sensors/hydro/hub-00",
    status: "offline",
    tempC: 60.4,
    humidity: 84.0,
    pressureHpa: 1008.4,
    power: { type: "AC Mains", level: 100 },
    alerts: { count: 0, label: "Normal", level: "normal" },
  },
  {
    id: "node-01",
    name: "Node 1",
    location: "North Garden",
    topic: "sensors/hydro/node-01",
    status: "online",
    tempC: 20.6,
    humidity: 85.1,
    pressureHpa: 1008.2,
    power: { type: "LiPo", level: 82 },
    alerts: { count: 2, label: "2 Warnings Triggered", level: "warning" },
  },
  {
    id: "node-02",
    name: "Node 2",
    location: "South Valley",
    topic: "sensors/hydro/node-02",
    status: "online",
    tempC: 19.8,
    humidity: 88.0,
    pressureHpa: 1008.9,
    power: { type: "LiPo", level: 48 },
    alerts: { count: 1, label: "1 Alert (Humidity)", level: "warning" },
  },
];
