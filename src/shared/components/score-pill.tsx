import { Badge } from "@shared/components/badge";

export function ScorePill({ value, label = "Signal Score" }: { value: number; label?: string }) {
  const tone = value >= 80 ? "green" : value >= 65 ? "blue" : value >= 45 ? "orange" : "red";

  return (
    <Badge tone={tone}>
      {label}: {value}
    </Badge>
  );
}
