// "use client"

// import type React from "react"

// import { useState } from "react"
// import { useForm } from "react-hook-form"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { z } from "zod"
// import { format } from "date-fns"
// import { CalendarIcon, ImagePlus, Loader2 } from "lucide-react"
// // import { useToast } from "@/hooks/use-toast"

// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
// import { Input } from "@/components/ui/input"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// import { Calendar } from "@/components/ui/calendar"
// import { cn } from "@/lib/utils"
// import { toast } from "sonner"

// const formSchema = z.object({
//   foodItem: z.string().min(2, { message: "Food item name is required" }),
//   quantity: z.string().min(1, { message: "Quantity is required" }),
//   unit: z.string().min(1, { message: "Unit is required" }),
//   bestBefore: z.date({ required_error: "Best before time is required" }),
//   ngo: z.string({ required_error: "Please select an NGO" }),
//   image: z.any().optional(),
// })

// const units = ["plates", "kgs", "servings", "boxes", "liters"]

// const ngos = [
//   { id: "1", name: "Food For All" },
//   { id: "2", name: "Hunger Relief Foundation" },
//   { id: "3", name: "Community Food Bank" },
//   { id: "4", name: "Meals On Wheels" },
//   { id: "5", name: "Hope Kitchen" },
// ]

// export function DonationForm() {
//   // const { toast } = useToast()
//   const [imagePreview, setImagePreview] = useState<string | null>(null)
//   const [isSubmitting, setIsSubmitting] = useState(false)

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       foodItem: "",
//       quantity: "",
//       unit: "plates",
//       ngo: "",
//     },
//   })

//   function onSubmit(values: z.infer<typeof formSchema>) {
//     setIsSubmitting(true)

//     // Simulate API call
//     setTimeout(() => {
//       console.log(values)
//       setIsSubmitting(false)
//       form.reset()
//       setImagePreview(null)

//       // toast({
//       //   title: "Donation logged successfully!",
//       //   description: "Your food donation has been recorded and the NGO has been notified.",
//       // })
//       toast.success("Your food donation has been recorded and the NGO has been notified.")
//     }, 1500)
//   }

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0]
//     if (file) {
//       const reader = new FileReader()
//       reader.onloadend = () => {
//         setImagePreview(reader.result as string)
//       }
//       reader.readAsDataURL(file)
//       form.setValue("image", file)
//     }
//   }

//   return (
//     <Card className="mb-8 border-green-100 bg-gradient-to-b from-[#D4F9EB]/50 to-white">
//       <CardHeader>
//         <CardTitle>Log Extra Food</CardTitle>
//         <CardDescription>Fill in the details about the food you want to donate</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//             <div className="grid gap-4 md:grid-cols-2">
//               <FormField
//                 control={form.control}
//                 name="foodItem"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Food Item Name</FormLabel>
//                     <FormControl>
//                       <Input placeholder="e.g. Vegetable Curry" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <div className="flex gap-2">
//                 <FormField
//                   control={form.control}
//                   name="quantity"
//                   render={({ field }) => (
//                     <FormItem className="flex-1">
//                       <FormLabel>Quantity</FormLabel>
//                       <FormControl>
//                         <Input type="number" min="1" placeholder="10" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="unit"
//                   render={({ field }) => (
//                     <FormItem className="w-1/2">
//                       <FormLabel>Unit</FormLabel>
//                       <Select onValueChange={field.onChange} defaultValue={field.value}>
//                         <FormControl>
//                           <SelectTrigger>
//                             <SelectValue placeholder="Select unit" />
//                           </SelectTrigger>
//                         </FormControl>
//                         <SelectContent>
//                           {units.map((unit) => (
//                             <SelectItem key={unit} value={unit}>
//                               {unit}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>
//             </div>

//             <div className="grid gap-4 md:grid-cols-2">
//               <FormField
//                 control={form.control}
//                 name="bestBefore"
//                 render={({ field }) => (
//                   <FormItem className="flex flex-col">
//                     <FormLabel>Best Before Time</FormLabel>
//                     <Popover>
//                       <PopoverTrigger asChild>
//                         <FormControl>
//                           <Button
//                             variant={"outline"}
//                             className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
//                           >
//                             {field.value ? format(field.value, "PPP HH:mm") : <span>Pick a date and time</span>}
//                             <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
//                           </Button>
//                         </FormControl>
//                       </PopoverTrigger>
//                       <PopoverContent className="w-auto p-0" align="start">
//                         <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
//                         <div className="p-3 border-t">
//                           <Input
//                             type="time"
//                             onChange={(e) => {
//                               const date = field.value || new Date()
//                               const [hours, minutes] = e.target.value.split(":")
//                               date.setHours(Number.parseInt(hours), Number.parseInt(minutes))
//                               field.onChange(date)
//                             }}
//                           />
//                         </div>
//                       </PopoverContent>
//                     </Popover>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="ngo"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Select NGO</FormLabel>
//                     <Select onValueChange={field.onChange} defaultValue={field.value}>
//                       <FormControl>
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select an NGO" />
//                         </SelectTrigger>
//                       </FormControl>
//                       <SelectContent>
//                         {ngos.map((ngo) => (
//                           <SelectItem key={ngo.id} value={ngo.id}>
//                             {ngo.name}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>

//             <FormField
//               control={form.control}
//               name="image"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Upload Image</FormLabel>
//                   <FormControl>
//                     <div className="grid gap-4 md:grid-cols-2">
//                       <div className="flex items-center justify-center w-full h-32 border-2 border-dashed rounded-md border-green-200 cursor-pointer hover:bg-green-50/50 transition-colors">
//                         <Input
//                           type="file"
//                           accept="image/*"
//                           className="hidden"
//                           id="food-image"
//                           onChange={handleImageChange}
//                         />
//                         <label
//                           htmlFor="food-image"
//                           className="flex flex-col items-center justify-center w-full h-full cursor-pointer"
//                         >
//                           {!imagePreview ? (
//                             <>
//                               <ImagePlus className="w-8 h-8 text-green-500 mb-2" />
//                               <span className="text-sm text-muted-foreground">Click to upload</span>
//                             </>
//                           ) : (
//                             <div className="relative w-full h-full">
//                               <img
//                                 src={imagePreview || "/placeholder.svg"}
//                                 alt="Food preview"
//                                 className="object-cover w-full h-full rounded-md"
//                               />
//                             </div>
//                           )}
//                         </label>
//                       </div>
//                       {imagePreview && (
//                         <div className="flex items-center">
//                           <p className="text-sm text-muted-foreground">
//                             Image uploaded successfully. You can click the upload area again to change the image.
//                           </p>
//                         </div>
//                       )}
//                     </div>
//                   </FormControl>
//                   <FormDescription>Upload a clear image of the food item (optional)</FormDescription>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isSubmitting}>
//               {isSubmitting ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Processing...
//                 </>
//               ) : (
//                 "Submit Donation"
//               )}
//             </Button>
//           </form>
//         </Form>
//       </CardContent>
//     </Card>
//   )
// }








"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { format } from "date-fns"
import { CalendarIcon, ImagePlus, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { useForm } from "react-hook-form"

const formSchema = z.object({
  foodItem: z.string().min(2, { message: "Food item name is required" }),
  quantity: z.string().min(1, { message: "Quantity is required" }),
  unit: z.string().min(1, { message: "Unit is required" }),
  bestBefore: z.date({ required_error: "Best before time is required" }),
  ngo: z.string({ required_error: "Please select an NGO" }),
  image: z.any().optional(),
})

const units = ["plates", "kgs", "servings", "boxes", "liters"]

const ngos = [
  { id: "1", name: "Food For All" },
  { id: "2", name: "Hunger Relief Foundation" },
  { id: "3", name: "Community Food Bank" },
  { id: "4", name: "Meals On Wheels" },
  { id: "5", name: "Hope Kitchen" },
]

export interface Donation {
  id: string;
  date: string;
  item: string;
  quantity: string;
  ngo: string;
  status: string;
}

interface DonationFormProps {
  onDonationSubmit: (newDonation: Donation) => void;
}

export function DonationForm({ onDonationSubmit }: DonationFormProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      foodItem: "",
      quantity: "",
      unit: "plates",
      ngo: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    setTimeout(() => {
      const selectedNgo = ngos.find(ngo => ngo.id === values.ngo)?.name || "Unknown NGO";
      
      const newDonation: Donation = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        item: values.foodItem,
        quantity: `${values.quantity} ${values.unit}`,
        ngo: selectedNgo,
        status: "Pending"
      };

      onDonationSubmit(newDonation);
      
      setIsSubmitting(false)
      form.reset()
      setImagePreview(null)
      toast.success("Your food donation has been recorded and the NGO has been notified.")
    }, 1500)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      form.setValue("image", file)
    }
  }

  return (
    <Card className="mb-8 border-green-100 bg-gradient-to-b from-[#D4F9EB]/50 to-white">
      <CardHeader>
        <CardTitle>Log Extra Food</CardTitle>
        <CardDescription>Fill in the details about the food you want to donate</CardDescription>
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
                      <Input placeholder="e.g. Vegetable Curry" {...field} />
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
                        <Input type="number" min="1" placeholder="10" {...field} />
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
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
                            className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                          >
                            {field.value ? format(field.value, "PPP HH:mm") : <span>Pick a date and time</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                        <div className="p-3 border-t">
                          <Input
                            type="time"
                            onChange={(e) => {
                              const date = field.value || new Date()
                              const [hours, minutes] = e.target.value.split(":")
                              date.setHours(Number.parseInt(hours), Number.parseInt(minutes))
                              field.onChange(date)
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an NGO" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ngos.map((ngo) => (
                          <SelectItem key={ngo.id} value={ngo.id}>
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
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Upload Image</FormLabel>
                  <FormControl>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="flex items-center justify-center w-full h-32 border-2 border-dashed rounded-md border-green-200 cursor-pointer hover:bg-green-50/50 transition-colors">
                        <Input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          id="food-image"
                          onChange={handleImageChange}
                        />
                        <label
                          htmlFor="food-image"
                          className="flex flex-col items-center justify-center w-full h-full cursor-pointer"
                        >
                          {!imagePreview ? (
                            <>
                              <ImagePlus className="w-8 h-8 text-green-500 mb-2" />
                              <span className="text-sm text-muted-foreground">Click to upload</span>
                            </>
                          ) : (
                            <div className="relative w-full h-full">
                              <img
                                src={imagePreview || "/placeholder.svg"}
                                alt="Food preview"
                                className="object-cover w-full h-full rounded-md"
                              />
                            </div>
                          )}
                        </label>
                      </div>
                      {imagePreview && (
                        <div className="flex items-center">
                          <p className="text-sm text-muted-foreground">
                            Image uploaded successfully. You can click the upload area again to change the image.
                          </p>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormDescription>Upload a clear image of the food item (optional)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isSubmitting}>
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
  )
}