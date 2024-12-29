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
    </RadioGroup>
  );
}
