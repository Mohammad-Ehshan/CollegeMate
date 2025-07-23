"use client";

import { useState, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, ImagePlus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useUser } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { createDonation } from "@/utils/db/actions";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

const formSchema = z.object({
  foodItem: z.string().min(2, { message: "Food item name is required" }),
  quantity: z.string().min(1, { message: "Quantity is required" }),
  unit: z.string().min(1, { message: "Unit is required" }),
  description: z.string().optional(),
  bestBefore: z.date({ required_error: "Best before time is required" }),
  ngo: z.string({ required_error: "Please select an NGO" }),
  imageUrl: z.string().optional(),
});

const units = ["plates", "kgs", "servings", "boxes", "liters"];

const ngos = [
  { id: "1", name: "Food For All" },
  { id: "2", name: "Hunger Relief Foundation" },
  { id: "3", name: "Community Food Bank" },
  { id: "4", name: "Meals On Wheels" },
  { id: "5", name: "Hope Kitchen" },
];

export function DonationForm() {
  const { user } = useUser();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      foodItem: "",
      quantity: "",
      unit: "plates",
      description: "",
      ngo: "",
      imageUrl: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
      toast.error("Please sign in to submit a donation");
      return;
    }

    setIsSubmitting(true);

    try {
      await createDonation(
        {
          foodItem: values.foodItem,
          quantity: values.quantity,
          unit: values.unit,
          description: values.description,
          bestBefore: values.bestBefore,
          ngo: values.ngo,
          imageUrl: values.imageUrl,
        },
        user.id
      );

      form.reset();
      setImagePreview(null);
      toast.success(
        "Your food donation has been recorded and the NGO has been notified."
      );
    } catch (error) {
      console.error("Submission failed:", error);
      toast.error("Failed to submit donation. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }


  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsGenerating(true);

    try {
      // Step 1: Read the image as base64
      const reader = new FileReader();

      const base64: string = await new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      setImagePreview(base64); // Set the preview

      // Step 2: Upload to Cloudinary
      const cloudinaryFormData = new FormData();
      cloudinaryFormData.append("file", base64);
      cloudinaryFormData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
      );

      const cloudinaryRes = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
        {
          method: "POST",
          body: cloudinaryFormData,
        }
      );

      const cloudinaryData = await cloudinaryRes.json();

      if (!cloudinaryRes.ok) {
        console.error("Cloudinary upload failed:", cloudinaryData);
        toast.error("Cloudinary upload failed.");
        return;
      }

      // Step 3: Generate content with Gemini
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const base64Data = base64.split(",")[1];

      const imageParts = [
        {
          inlineData: {
            data: base64Data,
            mimeType: file.type,
          },
        },
      ];

      const prompt = `You are an expert in food identification and description. Analyze this image of food and provide:
1. The name of the food item (maximum 5 words)
2. A reasonable estimate of quantity (just the number)
3. The most appropriate unit from these options: plates, kgs, servings, boxes, liters
4. A detailed description of the food including ingredients, preparation method, and any special characteristics (3-5 sentences)

Respond *only* with a JSON object, without any additional text or formatting characters. Example format:
{
  "foodItem": "food name here",
  "quantity": "estimated quantity",
  "unit": "most appropriate unit",
  "description": "detailed description here"
}
`;

      const result = await model.generateContentStream([prompt, ...imageParts]);

      let fullResponse = "";
      for await (const chunk of result.stream) {
        fullResponse += chunk.text();
      }

      // Clean JSON
      let jsonString = fullResponse.trim();
      const match = jsonString.match(/```json\s*([\s\S]*?)```/i);
      if (match && match[1]) {
        jsonString = match[1].trim();
      } else {
        jsonString = jsonString.replace(/```/g, "").trim();
      }

      const generatedData = JSON.parse(jsonString);

      form.setValue("foodItem", generatedData.foodItem);
      form.setValue("quantity", generatedData.quantity);
      form.setValue("unit", generatedData.unit);
      form.setValue("description", generatedData.description);
      form.setValue("imageUrl", cloudinaryData.secure_url);

      toast.success("Image uploaded and food details generated");
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Image processing failed. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="mb-8 border-green-100 bg-gradient-to-b from-[#D4F9EB]/50 to-white">
      <CardHeader>
        <CardTitle>log Extra Food</CardTitle>
        <CardDescription>
          Fill in the details about the food you want to donate
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="foodItem"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Food Item Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Vegetable Curry"
                        {...field}
                        className={cn(isGenerating && "animate-pulse")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-2">
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          placeholder="10"
                          {...field}
                          className={cn(isGenerating && "animate-pulse")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="unit"
                  render={({ field }) => (
                    <FormItem className="w-1/2">
                      <FormLabel>Unit</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isGenerating}
                      >
                        <FormControl>
                          <SelectTrigger
                            className={cn(isGenerating && "animate-pulse")}
                          >
                            <SelectValue placeholder="Select unit" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {units.map((unit) => (
                            <SelectItem key={unit} value={unit}>
                              {unit}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the food item, ingredients, and any special notes..."
                      {...field}
                      className={cn(
                        "min-h-[100px]",
                        isGenerating && "animate-pulse"
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="bestBefore"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Best Before Time</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP HH:mm")
                            ) : (
                              <span>Pick a date and time</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                        <div className="p-3 border-t">
                          <Input
                            type="time"
                            onChange={(e) => {
                              const date = field.value || new Date();
                              const [hours, minutes] =
                                e.target.value.split(":");
                              date.setHours(
                                Number.parseInt(hours),
                                Number.parseInt(minutes)
                              );
                              field.onChange(date);
                            }}
                          />
                        </div>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ngo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select NGO</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an NGO" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ngos.map((ngo) => (
                          <SelectItem key={ngo.id} value={ngo.name}>
                            {ngo.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="imageUrl"
              render={() => (
                <FormItem>
                  <FormLabel>Upload Image</FormLabel>
                  <FormControl>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div
                        className={cn(
                          "flex items-center justify-center w-full h-32 border-2 border-dashed rounded-md cursor-pointer transition-colors",
                          imagePreview
                            ? "border-green-300"
                            : "border-green-200 hover:bg-green-50/50"
                        )}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                        {!imagePreview ? (
                          <div className="flex flex-col items-center justify-center">
                            {isGenerating ? (
                              <>
                                <Loader2 className="w-8 h-8 text-green-500 mb-2 animate-spin" />
                                <span className="text-sm text-muted-foreground">
                                  Processing image...
                                </span>
                              </>
                            ) : (
                              <>
                                <ImagePlus className="w-8 h-8 text-green-500 mb-2" />
                                <span className="text-sm text-muted-foreground">
                                  Click to upload
                                </span>
                              </>
                            )}
                          </div>
                        ) : (
                          <div className="relative w-full h-full">
                            <img
                              src={imagePreview}
                              alt="Food preview"
                              className="object-cover w-full h-full rounded-md"
                            />
                            {isGenerating && (
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <Loader2 className="w-8 h-8 text-white animate-spin" />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      {imagePreview && (
                        <div className="flex items-center">
                          <p className="text-sm text-muted-foreground">
                            {isGenerating
                              ? "Uploading and analyzing food image..."
                              : "Image uploaded. You can click the upload area again to change the image."}
                          </p>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormDescription>
                    Upload a clear image of the food item to auto-fill details
                    (optional)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={isSubmitting || isGenerating}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Submit Donation"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
