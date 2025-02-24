"use client";

import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import FontOptions from "./FontOptions";
import {
  convertCanvasToBlob,
  generateZazzleProductUrl,
  uploadToImgur,
} from "@/lib/input-helpers";

import { useState } from "react";

const formSchema = z.object({
  bandname: z
    .string()
    .min(1, {
      message: "Band name must be at least 1 character long",
    })
    .max(19, {
      message: "Band name cannot exceed 19 characters",
    }),
  font: z.string().default("default"),
});

export default function InputForm() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bandname: "",
      font: "default",
    },
  });

  async function onPreview(values: z.infer<typeof formSchema>) {
    try {
      setIsGenerating(true);
      const { dataUrl } = await convertCanvasToBlob(
        values.bandname,
        values.font
      );
      setPreviewUrl(dataUrl);
    } catch (error) {
      console.error("Error generating preview: ", error);
    } finally {
      setIsGenerating(false);
    }
  }

  async function onBuyNow() {
    if (!form.getValues().bandname || !previewUrl) return;

    try {
      setIsLoading(true);
      const { blob } = await convertCanvasToBlob(
        form.getValues().bandname,
        form.getValues().font
      );
      const imgurUrl = await uploadToImgur(blob);
      const zazzleUrl = generateZazzleProductUrl(imgurUrl);
      window.open(zazzleUrl, "_blank");
    } catch (error) {
      console.error("Error creating product: ", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onPreview)} className="space-y-8">
        <FormField
          control={form.control}
          name="bandname"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  className="text-2xl"
                  placeholder="Enter your band name"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="font"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <FontOptions
                  onValueChange={field.onChange}
                  value={field.value}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex gap-4">
          <Button type="submit" disabled={isGenerating}>
            {isGenerating ? "Generating..." : "Preview Design"}
          </Button>
          <Button
            type="button"
            onClick={onBuyNow}
            disabled={!previewUrl || isLoading}
          >
            {isLoading ? "Creating..." : "Buy Now"}
          </Button>
        </div>
      </form>
      {previewUrl && (
        <div className="mt-4">
          <p className="mb-2 text-lg font-semibold">Preview:</p>
          <img
            src={previewUrl}
            alt="Generated Preview"
            className="border rounded-md"
          />
        </div>
      )}
    </Form>
  );
}
