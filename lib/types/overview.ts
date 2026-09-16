
export type TimeRange = "3h" | "24h" | "7d";

export type MetricCardProps = {
  icon: string;
  iconClassName: string;
  title: string;
  badge: string;
  badgeClassName: string;
  value: string;
  unit?: string;
  description: string;
  descriptionClassName: string;
  footer: React.ReactNode;
};

export type TrendCardProps = {
  icon: string;
  iconClassName: string;
  title: string;
  badge: string;
  badgeClassName: string;
  subtitle: string;
  current: string;
  unit: string;
  change: string;
  changeClassName: string;
  chart: React.ReactNode;
};

export type Node = {
  name: string;
  location: string;
  status: "Online" | "offline";
  pressure: string;
  temperature: string;
  humidity: string;
  color: "primary" | "secondary";
};
