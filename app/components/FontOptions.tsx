import { Button } from "@/components/ui/button";

interface FontOptionsProps {
  onValueChange: (value: string) => void;
  value: string;
}

export default function FontOptions({
  onValueChange,
  value,
}: FontOptionsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Button
        variant={value === "metalLord" ? "default" : "secondary"}
        onClick={() => onValueChange("metalLord")}
        className="h-16"
      >
        <span className="font-metalLord text-2xl">Iron Maiden</span>
      </Button>
      <Button
        variant={value === "samdan" ? "default" : "secondary"}
        onClick={() => onValueChange("samdan")}
        className="h-16"
      >
        <span className="font-samdan text-2xl">Danzig</span>
      </Button>
      <Button
        variant={value === "suicidal" ? "default" : "secondary"}
        onClick={() => onValueChange("suicidal")}
        className="h-16"
      >
        <span className="font-suicidal text-2xl">Suicidal Tendencies</span>
      </Button>
      <Button
        variant={value === "slayer" ? "default" : "secondary"}
        onClick={() => onValueChange("slayer")}
        className="h-16"
      >
        <span className="font-slayer text-2xl">Slayer</span>
      </Button>
    </div>
  );
}
