import { ReactNode } from "react";

export type NodeStatus = "online" | "offline";
export type AlertLevel = "normal" | "warning";

export type SensorNode = {
  id: string;
  name: string;
  location: string;
  topic: string;
  status: NodeStatus;
  tempC: number;
  humidity: number;
  pressureHpa: number;
  power: { type: "AC Mains" | "LiPo"; level: number };
  alerts: { count: number; label: string; level: AlertLevel };
};

export type StatCardProps = {
  icon: string;
  iconClassName?: string;
  title: string;
  badge: ReactNode;
  value: ReactNode;
  description: ReactNode;
  footer: ReactNode;
  hoverClassName?: string;
};
