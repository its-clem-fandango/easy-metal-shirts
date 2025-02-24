"use client";

import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import FontOptions from "./FontOptions";
import {
  convertCanvasToBlob,
  generateZazzleProductUrl,
  uploadToImgur,
} from "@/lib/input-helpers";
import Image from "next/image";

const formSchema = z.object({
  bandname: z
    .string()
    .min(1, {
      message: "Band name must be at least 1 character long",
    })
    .max(19, {
      message: "Band name cannot exceed 19 characters",
    }),
});

export default function InputForm() {
  const [bandname, setBandname] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFont, setSelectedFont] = useState("metalLord");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBandname(value);

    try {
      formSchema.parse({ bandname: value });
      setError(null);
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      }
    }
  };

  const handleFontChange = (font: string) => {
    setSelectedFont(font);
  };

  useEffect(() => {
    const updatePreview = async () => {
      if (!bandname) {
        setPreviewUrl(null);
        return;
      }

      try {
        const { dataUrl } = await convertCanvasToBlob(bandname, selectedFont);
        setPreviewUrl(dataUrl);
      } catch (error) {
        console.error("Error generating preview", error);
      }
    };

    updatePreview();
  }, [bandname, selectedFont]);

  async function onBuyNow() {
    if (!previewUrl) return;

    try {
      setIsLoading(true);
      const { blob } = await convertCanvasToBlob(bandname, selectedFont);
      const imgurUrl = await uploadToImgur(blob);
      const zazzleUrl = generateZazzleProductUrl(imgurUrl);
      window.open(zazzleUrl, "_blank");
    } catch (error) {
      console.error("Error generating product", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
      <div>
        <Input
          className="text-2xl"
          placeholder="Enter your band name"
          value={bandname}
          onChange={handleInputChange}
        />
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>

      <FontOptions onValueChange={handleFontChange} value={selectedFont} />

      <div className="flex justify-center">
        <Button
          type="button"
          onClick={onBuyNow}
          disabled={!previewUrl || isLoading}
          className="w-full max-w-md text-lg py-6"
        >
          {isLoading ? "Creating..." : "Buy Now"}
        </Button>
      </div>

      {previewUrl && (
        <div className="mt-4">
          <p className="mb-2 text-lg font-semibold">Preview:</p>
          <div className="bg-black p-4 rounded-md">
            <Image
              src={previewUrl}
              alt="Generated Preview"
              width={800}
              height={400}
              className="border rounded-md w-full h-auto"
              priority
              unoptimized
            />
          </div>
        </div>
      )}
    </form>
  );
}
