import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface FontOptionsProps {
  onValueChange: (value: string) => void;
  value: string;
}

export default function FontOptions({
  onValueChange,
  value,
}: FontOptionsProps) {
  return (
    <RadioGroup value={value} onValueChange={onValueChange}>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="metalLord" id="r1" />
        <Label className="font-metalLord text-2xl" htmlFor="r1">
          Iron Maiden
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="samdan" id="r2" />
        <Label className="font-samdan text-2xl" htmlFor="r2">
          Danzig
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="suicidal" id="r3" />
        <Label className="font-suicidal text-2xl" htmlFor="r3">
          Suicidal Tendencies
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="slayer" id="r4" />
        <Label className="font-slayer text-2xl" htmlFor="r4">
          Slayer
        </Label>
      </div>
    </RadioGroup>
  );
}
