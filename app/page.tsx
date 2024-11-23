import { Button } from "@/components/ui/button";
import InputForm from "./components/InputForm";
export default function Home() {
  return (
    <>
      <h1 className="flex justify-center text-4xl font-bold mb-2">
        Death Metal T-Shirt Generator
      </h1>
      <InputForm />
      <Button>Buy your design</Button>
    </>
  );
}
