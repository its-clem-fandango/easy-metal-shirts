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
        className="min-h-16 py-4"
      >
        <span className="font-metalLord text-xl sm:text-2xl">Iron Maiden</span>
      </Button>
      <Button
        variant={value === "samdan" ? "default" : "secondary"}
        onClick={() => onValueChange("samdan")}
        className="min-h-16 py-4"
      >
        <span className="font-samdan text-xl sm:text-2xl">Danzig</span>
      </Button>
      <Button
        variant={value === "suicidal" ? "default" : "secondary"}
        onClick={() => onValueChange("suicidal")}
        className="min-h-16 py-4"
      >
        <span className="font-suicidal text-sm sm:text-lg md:text-xl lg:text-2xl break-words">
          Suicidal Tendencies
        </span>
      </Button>
      <Button
        variant={value === "slayer" ? "default" : "secondary"}
        onClick={() => onValueChange("slayer")}
        className="min-h-16 py-4"
      >
        <span className="font-slayer text-xl sm:text-2xl">Slayer</span>
      </Button>
    </div>
  );
}
