"use client"

import { useForm, useFormContext } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState, useTransition } from "react"
import { Loader2, Upload, MapPin } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
// import { reportSchema } from "@/lib/schema"
// import { submitReport } from "@/action/submit-report"

export function FormSection() {
  const [isPending, startTransition] = useTransition()
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  
  // const { 
  //   register, 
  //   handleSubmit, 
  //   setValue, 
  //   watch, 
  //   formState: { errors } 
  // } = useForm({
  //   resolver: zodResolver(reportSchema),
  //   defaultValues: {
  //     type: 'lost'
  //   }
  // })

  // const type = watch('type')

  // const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0]
  //   if (!file) return

  //   if (!file.type.startsWith('image/')) {
  //     alert('Please upload an image file')
  //     return
  //   }

  //   if (file.size > 5 * 1024 * 1024) {
  //     alert('Image must be less than 5MB')
  //     return
  //   }

  //   setValue('image', file)
  //   setImagePreview(URL.createObjectURL(file))
  // }

  // const onSubmit = (data: unknown) => {
  //   startTransition(async () => {
  //     const formData = new FormData()
  //     if (data && typeof data === 'object') {
  //       Object.entries(data).forEach(([key, value]) => {
  //         if (value) formData.append(key, value as any)
  //       })
  //     }
  //     await submitReport(formData)
  //   })
  // }

  return (
    <form  className="space-y-6">
      <Tabs>
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="lost" className="text-lg py-3">
            Report Lost Item
          </TabsTrigger>
          <TabsTrigger value="found" className="text-lg py-3">
            Report Found Item
          </TabsTrigger>
        </TabsList>

        <TabsContent value="lost" className="space-y-6">
          <FormFields type="lost" />
        </TabsContent>

        <TabsContent value="found" className="space-y-6">
          <FormFields type="found" />
        </TabsContent>
      </Tabs>

      <div className="space-y-2">
        <Label>Upload Image</Label>
        <input
          type="file"
          id="image-upload"
          accept="image/*"
          className="hidden"
        />
        <label 
          htmlFor="image-upload"
          className="block border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer"
        >
          {imagePreview ? (
            <div className="flex flex-col items-center">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="h-32 w-32 object-cover rounded-md mb-2"
              />
              <p className="text-sm text-gray-500">Click to change image</p>
            </div>
          ) : (
            <>
              <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-500">
                Drag and drop an image, or <span className="text-emerald-600 font-medium">browse</span>
              </p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
            </>
          )}
        </label>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-lg py-6"
        disabled={isPending}
      >
        {isPending ? (
          <span className="flex items-center justify-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </span>
        ) : 'Submit Report'}
      </Button>
    </form>
  )
}

function FormFields({ type }: { type: 'lost' | 'found' }) {
  const { register, formState: { errors }, setValue } = useFormContext()

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={`${type}-title`}>Item Name</Label>
          <Input 
            id={`${type}-title`} 
            placeholder="e.g., Blue Backpack" 
            {...register('title')}
          />
          {errors.title && (
            <p className="text-sm text-red-500">
              {errors.title.message?.toString()}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor={`${type}-category`}>Category</Label>
          <Select onValueChange={(value) => setValue('category', value)}>
            <SelectTrigger id={`${type}-category`}>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="electronics">Electronics</SelectItem>
              <SelectItem value="clothing">Clothing</SelectItem>
              <SelectItem value="accessories">Accessories</SelectItem>
              <SelectItem value="books">Books</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          {errors.category && (
            <p className="text-sm text-red-500">
              {errors.category.message?.toString()}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${type}-location`}>
          {type === 'lost' ? 'Location Lost' : 'Location Found'}
        </Label>
        <div className="flex gap-2">
          <Input 
            id={`${type}-location`} 
            placeholder="e.g., Library, 2nd floor" 
            className="flex-1" 
            {...register('location')}
          />
          <Button type="button" variant="outline" className="flex-shrink-0">
            <MapPin className="h-4 w-4 mr-2" />
            Map
          </Button>
        </div>
        {errors.location && (
          <p className="text-sm text-red-500">
            {errors.location.message?.toString()}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${type}-description`}>Description</Label>
        <Textarea 
          id={`${type}-description`} 
          placeholder="Provide details about the item..." 
          rows={4} 
          {...register('description')}
        />
        {errors.description && (
          <p className="text-sm text-red-500">
            {errors.description.message?.toString()}
          </p>
        )}
      </div>
    </>
  )
}








// "use client";
// import { useState, useCallback, useEffect } from "react";
// import { MapPin, Upload, CheckCircle, Loader } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { useRouter } from "next/navigation";
// import { toast } from "react-hot-toast";
// import { createLostItem, createUser, getUserByEmail } from "@/lib/db-action";

// const geminiApiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
// // const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

// // const libraries: Libraries = ["places"];

// export default function ReportPage() {
//   const [user, setUser] = useState<{
//     id: number;
//     email: string;
//     name: string;
//   } | null>(null);
//   const router = useRouter();

//   const [reports, setReports] = useState<
//     Array<{
//       id: number;
//       title: string;
//       description: string;
//       category: string;
//       locationLost: string;
//       createdAt: string;
//     }>
//   >([]);

//   const [newReport, setNewReport] = useState({
//     userId: "",
//     title: "",
//     description: "",
//     category: "",
//     locationLost: "",
//   });

//   const [file, setFile] = useState<File | null>(null);
//   const [preview, setPreview] = useState<string | null>(null);
//   const [verificationStatus, setVerificationStatus] = useState<
//     "idle" | "verifying" | "success" | "failure"
//   >("idle");
//   const [verificationResult, setVerificationResult] = useState<{
//     title: string,
//     description: string,
//     category: string,
//   } | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // const [searchBox, setSearchBox] =
//   //   useState<google.maps.places.SearchBox | null>(null);

//   // const { isLoaded } = useJsApiLoader({
//   //   id: 'google-map-script',
//   //   googleMapsApiKey: googleMapsApiKey!,
//   //   libraries: libraries
//   // });

//   // const onLoad = useCallback((ref: google.maps.places.SearchBox) => {
//   //   setSearchBox(ref);
//   // }, []);

//   // const onPlacesChanged = () => {
//   //   if (searchBox) {
//   //     const places = searchBox.getPlaces();
//   //     if (places && places.length > 0) {
//   //       const place = places[0];
//   //       setNewReport(prev => ({
//   //         ...prev,
//   //         location: place.formatted_address || '',
//   //       }));
//   //     }
//   //   }
//   // };

//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;
//     setNewReport({ ...newReport, [name]: value });
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       const selectedFile = e.target.files[0];
//       setFile(selectedFile);
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         setPreview(e.target?.result as string);
//       };
//       reader.readAsDataURL(selectedFile);
//     }
//   };

//   const readFileAsBase64 = (file: File): Promise<string> => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.onload = () => resolve(reader.result as string);
//       reader.onerror = reject;
//       reader.readAsDataURL(file);
//     });
//   };

//   const handleVerify = async () => {
//     if (!file) return;

//     setVerificationStatus("verifying");

//     try {
//       const genAI = new GoogleGenerativeAI(geminiApiKey!);
//       const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//       const base64Data = await readFileAsBase64(file);

//       const imageParts = [
//         {
//           inlineData: {
//             data: base64Data.split(",")[1],
//             mimeType: file.type,
//           },
//         },
//       ];

     
//       const prompt = `You are an expert in item categorization and description. Analyze this image and provide:
//       1. A title that briefly describes the item (e.g., "Black Leather Bag with Keychain").
//       2. A detailed description of the item, focusing on its appearance and notable features (e.g., "A black leather bag with a small red keychain attached to the zipper. The bag has a rectangular shape with silver metal zippers and a shoulder strap. The material appears to be high-quality leather, and it seems well-maintained.").
//       3. The category of the item, which could be one of the following: 
//         - Electronics
//         - Clothing & Accessories
//         - Bags & Luggage
//         - Jewelry & Watches
//         - Books & Stationery
//         - Home Goods & Furniture
//         - Tools & Equipment
//         - Miscellaneous

//       Respond *only* with a JSON object, without any additional text or formatting characters. Example format:
//       {
//         "title": "title of the item",
//         "description": "detailed description of the item",
//         "category": "category of the item"
//       }`;


//       const result = await model.generateContent([prompt, ...imageParts]);
//       const response = await result.response;
//       const rawText = response.text();
//       const text = rawText.replace(/```json|```/g, "").trim();
//       console.log(text)

//       try {
//         const parsedResult = JSON.parse(text);
//         if (
//           parsedResult.title &&
//           parsedResult.description &&
//           parsedResult.category
//         ) {
//           setVerificationResult(parsedResult);
//           setVerificationStatus("success");
//           setNewReport({
//             ...newReport,
//             userId:user?.id ",
//             title: parsedResult.title,
//             description: parsedResult.description,
//             category: parsedResult.category,
//           });
//         } else {
//           console.error("Invalid verification result:", parsedResult);
//           setVerificationStatus("failure");
//         }
//       } catch (error) {
//         console.error("Failed to parse JSON response:", text);
//         setVerificationStatus("failure");
//       }
//     } catch (error) {
//       console.error("Error verifying waste:", error);
//       setVerificationStatus("failure");
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (verificationStatus !== "success" || !user) {
//       toast.error("Please verify the waste before submitting or log in.");
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       const report = (await createLostItem(
//         ...newReport,
//         preview || undefined,
//         verificationResult ? JSON.stringify(verificationResult) : undefined
//       )) as any;

//       const formattedReport = {
//         id: report.id,
//         location: report.location,
//         wasteType: report.wasteType,
//         amount: report.amount,
//         createdAt: report.createdAt.toISOString().split("T")[0],
//       };

//       setReports([formattedReport, ...reports]);
//       setNewReport({ location: "", type: "", amount: "" });
//       setFile(null);
//       setPreview(null);
//       setVerificationStatus("idle");
//       setVerificationResult(null);

//       toast.success(
//         `Report submitted successfully! You've earned points for reporting waste.`
//       );
//     } catch (error) {
//       console.error("Error submitting report:", error);
//       toast.error("Failed to submit report. Please try again.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   useEffect(() => {
//     const checkUser = async () => {
//       const email = localStorage.getItem("userEmail");
//       if (email) {
//         let user = await getUserByEmail(email);
//         if (!user) {
//           user = await createUser(email, "Anonymous User");
//         }
//         setUser(user);

//         const recentReports = (await getRecentReports()) as any;
//         const formattedReports = recentReports?.map((report: any) => ({
//           ...report,
//           createdAt: report.createdAt.toISOString().split("T")[0],
//         }));
//         setReports(formattedReports);
//       } else {
//         router.push("/login");
//       }
//     };
//     checkUser();
//   }, [router]);

//   return (
//     <div className="w-full h-full my-gradient first-letter: bg-white">
//     <div className="p-8 max-w-4xl mx-auto">
//       <h1 className="text-3xl flex justify-center items-center font-semibold mb-6 text-gray-800">
//         Report waste
//       </h1>

//       <form
//         onSubmit={handleSubmit}
//         className="bg-green-100 p-8 rounded-2xl shadow-lg mb-12"
//       >
//         <div className="mb-8">
//           <label
//             htmlFor="waste-image"
//             className="block text-lg font-medium text-gray-700 mb-2"
//           >
//             Upload Waste Image
//           </label>
//           <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-green-500 transition-colors duration-300">
//             <div className="space-y-1 text-center">
//               <Upload className="mx-auto h-12 w-12 text-gray-400" />
//               <div className="flex text-sm text-gray-600">
//                 <label
//                   htmlFor="waste-image"
//                   className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-green-500"
//                 >
//                   <span>Upload a file</span>
//                   <input
//                     id="waste-image"
//                     name="waste-image"
//                     type="file"
//                     className="sr-only"
//                     onChange={handleFileChange}
//                     accept="image/*"
//                   />
//                 </label>
//                 <p className="pl-1">or drag and drop</p>
//               </div>
//               <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
//             </div>
//           </div>
//         </div>

//         {preview && (
//           <div className="mt-4 mb-8">
//             <img
//               src={preview}
//               alt="Waste preview"
//               className="max-w-full h-auto rounded-xl shadow-md"
//             />
//           </div>
//         )}

//         <Button
//           type="button"
//           onClick={handleVerify}
//           className="w-full mb-8 bg-green-700 hover:bg-blue-700 text-white py-3 text-lg rounded-xl transition-colors cursor-pointer duration-300"
//           disabled={!file || verificationStatus === "verifying"}
//         >
//           {verificationStatus === "verifying" ? (
//             <>
//               <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
//               Verifying...
//             </>
//           ) : (
//             "Verify Waste"
//           )}
//         </Button>

//         {verificationStatus === "success" && verificationResult && (
//           <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-8 rounded-r-xl">
//             <div className="flex items-center">
//               <CheckCircle className="h-6 w-6 text-green-400 mr-3" />
//               <div>
//                 <h3 className="text-lg font-medium text-green-800">
//                   Verification Successful
//                 </h3>
//                 <div className="mt-2 text-sm text-green-700">
//                   <p>Waste Type: {verificationResult.wasteType}</p>
//                   <p>Quantity: {verificationResult.quantity}</p>
//                   <p>
//                     Confidence:{" "}
//                     {(verificationResult.confidence * 100).toFixed(2)}%
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
//           <div>
//             <label
//               htmlFor="location"
//               className="block text-sm font-medium text-gray-700 mb-1"
//             >
//               Location
//             </label>
//             {/* {isLoaded ? (
//               <StandaloneSearchBox
//                 onLoad={onLoad}
//                 onPlacesChanged={onPlacesChanged}
//               >
//                 <input
//                   type="text"
//                   id="location"
//                   name="location"
//                   value={newReport.location}
//                   onChange={handleInputChange}
//                   required
//                   className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
//                   placeholder="Enter waste location"
//                 />
//               </StandaloneSearchBox>
//             ) : ( )}*/}
//             <input
//               type="text"
//               id="location"
//               name="location"
//               value={newReport.location}
//               onChange={handleInputChange}
//               required
//               className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 text-gray-500"
//               placeholder="Enter waste location"
//             />
//           </div>
//           <div>
//             <label
//               htmlFor="type"
//               className="block text-sm font-medium text-gray-700 mb-1"
//             >
//               Waste Type
//             </label>
//             <input
//               type="text"
//               id="type"
//               name="type"
//               value={newReport.type}
//               onChange={handleInputChange}
//               required
//               className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 bg-gray-100 text-gray-500"
//               placeholder="Verified waste type"
//               readOnly
//             />
//           </div>
//           <div>
//             <label
//               htmlFor="amount"
//               className="block text-sm font-medium text-gray-700 mb-1"
//             >
//               Estimated Amount
//             </label>
//             <input
//               type="text"
//               id="amount"
//               name="amount"
//               value={newReport.amount}
//               onChange={handleInputChange}
//               required
//               className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 bg-gray-100 text-gray-500"
//               placeholder="Verified amount"
//               readOnly
//             />
//           </div>
//         </div>
//         <Button
//           type="submit"
//           className="w-full bg-green-600 hover:bg-blue-700 text-white py-3 text-lg rounded-xl transition-colors duration-300 flex items-center justify-center"
//           disabled={isSubmitting}
//         >
//           {isSubmitting ? (
//             <>
//               <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
//               Submitting...
//             </>
//           ) : (
//             "Submit Report"
//           )}
//         </Button>
//       </form>

//       <h2 className="text-3xl flex justify-center items-center font-semibold mb-6 text-gray-800">
//         Recent Reports
//       </h2>
//       <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
//         <div className="max-h-96 overflow-y-auto">
//           <table className="w-full">
//             <thead className="bg-gray-50 sticky top-0">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Location
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Type
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Amount
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Date
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {reports.map((report) => (
//                 <tr key={report.id} className="hover:bg-gray-50 transition-colors duration-200">
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     <MapPin className="inline-block w-4 h-4 mr-2 text-green-500" />
//                     {report.location}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{report.wasteType}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{report.amount}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{report.createdAt}</td>
//                 </tr>
//               ))}

//               {/* {reports && reports.length > 0 ? (
//                 reports.map((report) => (
//                   <tr
//                     key={report.id}
//                     className="hover:bg-gray-50 transition-colors duration-200"
//                   >
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       <MapPin className="inline-block w-4 h-4 mr-2 text-green-500" />
//                       {report.location}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
//                       {report.wasteType}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
//                       {report.amount}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
//                       {report.createdAt}
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan={4} className="text-center py-4">
//                     No Reports Available
//                   </td>
//                 </tr>
//               )} */}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   </div>
//   );
// }