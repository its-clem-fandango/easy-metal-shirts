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
        <RadioGroupItem value="default" id="r1" />
        <Label htmlFor="r1">Default</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="samdan" id="r2" />
        <Label className="font-samdan" htmlFor="r2">
          Danzig
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="metalLord" id="r3" />
        <Label className="font-metalLord" htmlFor="r3">
          Iron Maiden
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="suicidal" id="r4" />
        <Label className="font-suicidal" htmlFor="r4">
          Suicidal Tendencies
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="slayer" id="r5" />
        <Label className="font-slayer" htmlFor="r5">
          Slayer
        </Label>
      </div>
    </RadioGroup>
  );
}
