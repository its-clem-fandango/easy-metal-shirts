"use client";

/* ZAZZLE TEMPLATE ID:

https://www.zazzle.com/api/create/at-238052026395297176?rf=238052026395297176&pd=256346466156199953&ed=true&ax=Linkover&t_image1_iid=1366fc79-b353-4951-90e9-c173a9038297

TODO: I need to generate an image url so that I can pass it to zazzle
*/
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
import { convertCanvasToBlob, uploadToFileIO } from "@/lib/input-helpers";

import { useState } from "react";

const formSchema = z.object({
  bandname: z
    .string()
    .min(1, {
      message: "Band name must be at least 1 character long",
    })
    .max(50, {
      message: "Band name cannot exceed 50 characters",
    }),
});

export default function InputForm() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bandname: "",
    },
  });

  //TODO: another submit handler for submitting font to API?
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { dataUrl, blob } = await convertCanvasToBlob(values.bandname);
    setPreviewUrl(dataUrl);

    const fileIoUrl = await uploadToFileIO(blob);
    console.log("File.io URL: ", fileIoUrl);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
        <FontOptions />
        <Button type="submit">Generate to Shirt</Button>
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
