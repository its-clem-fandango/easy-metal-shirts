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
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bandname: "Enter band name",
    },
  });

  //TODO: another submit handler for submitting font to API?
  function onSubmit(values: z.infer<typeof formSchema>) {
    //generates a preview of the font
    console.log(values);
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
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FontOptions />
        <Button type="submit">Generate to Shirt</Button>
      </form>
    </Form>
  );
}
