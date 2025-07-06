// "use client";

// import { motion } from "framer-motion"
// import { useUser } from "@clerk/nextjs";
// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { createLostItemReport } from "@/utils/db/actions";
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { toast } from "sonner";
// import { Loader2, MapPin } from "lucide-react";

// const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

// export default function ReportLostItemPage() {
//   const { user } = useUser();
//   const [imagePreview, setImagePreview] = useState<string | null>(null);
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isGettingLocation,setIsGettingLocation] = useState(false);
//   const [locationStatus, setLocationStatus] = useState("Get Location");

//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     category: "",
//     locationLost: "",
//     Geolocation: {
//       lat: 0,
//       lng: 0,
//     },
//     tags: [] as string[],
//     phoneNumber: "",
//     imageUrl: "",
//   });

//   const handleGetLocation = () => {
//     if (!navigator.geolocation) {
//       setLocationStatus("Geolocation is not supported by your browser.");
//       toast.error("GeoLocation is not supported by your browser");
//       return;
//     }

//     setLocationStatus("Getting location...");
//     setIsGettingLocation(true)

//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         const { latitude, longitude } = position.coords;
//         const coordsArray = [latitude, longitude];
//         setFormData((prev) => ({
//           ...prev,
//           Geolocation: {
//             lat: latitude,
//             lng: longitude,
//           },
//         }));
//         setLocationStatus("success!");
//         setIsGettingLocation(false)
//         toast("Location retrived successfully");
//       },
//       (error) => {
//         switch (error.code) {
//           case error.PERMISSION_DENIED:
//             setLocationStatus(
//               "Permission denied. Please allow location access."
//             );
//             toast.error("Permission denied. Please allow location access.");
//             break;
//           case error.POSITION_UNAVAILABLE:
//             setLocationStatus("Location information is unavailable.");
//             toast.error("Location information is unavailable.");
//             break;
//           case error.TIMEOUT:
//             setLocationStatus("The request to get user location timed out.");
//             toast.error("The request to get user location timed out.");
//             break;
//           default:
//             setLocationStatus("An unknown error occurred.");
//             toast.error("An unknown error occurred.");
//             break;
//         }
//       }
//     );
//   };

//   const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     setIsGenerating(true);

//     try {
//       // Convert to Base64
//       const reader = new FileReader();
//       const base64 = await new Promise<string>((resolve, reject) => {
//         reader.onload = () => resolve(reader.result as string);
//         reader.onerror = reject;
//         reader.readAsDataURL(file);
//       });

//       const readFileAsBase64 = (file: File): Promise<string> => {
//         return new Promise((resolve, reject) => {
//           const reader = new FileReader();
//           reader.onload = () => resolve(reader.result as string);
//           reader.onerror = reject;
//           reader.readAsDataURL(file);
//         });
//       };

//       const base64Data = await readFileAsBase64(file);

//       const imageParts = [
//         {
//           inlineData: {
//             data: base64Data.split(",")[1],
//             mimeType: file.type,
//           },
//         },
//       ];

//       // Upload to Cloudinary
//       const cloudinaryFormData = new FormData();
//       cloudinaryFormData.append("file", base64);
//       cloudinaryFormData.append(
//         "upload_preset",
//         process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
//       );

//       const cloudinaryRes = await fetch(
//         `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
//         { method: "POST", body: cloudinaryFormData }
//       );
//       const cloudinaryData = await cloudinaryRes.json();

//       // Generate content using Gemini
//       const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//       const prompt = `You are an expert in lost and found identification. Analyze this image and provide:
// 1. A short and descriptive title for the item (maximum 5 words)
// 2. A detailed description of the item, including its appearance, possible use, and any unique identifiers (3–5 sentences)
// 3. A list of relevant tags or keywords that describe the item (5–7 keywords, comma-separated)

// Respond *only* with a JSON object, without any additional text or formatting characters. Example format:
// {
//   "title": "short title here",
//   "description": "detailed description here",
//   "tags": ["tag1", "tag2", "tag3", ...]
// }
// `;

//       const result = await model.generateContentStream([prompt, ...imageParts]);

//       let fullResponse = "";
//       for await (const chunk of result.stream) {
//         fullResponse += chunk.text();
//       }

//       // Clean and extract JSON
//       let jsonString = fullResponse.trim();
//       const match = jsonString.match(/```json\s*([\s\S]*?)```/i);
//       if (match && match[1]) {
//         jsonString = match[1].trim();
//       } else {
//         jsonString = jsonString.replace(/```/g, "").trim();
//       }

//       let generatedData;
//       try {
//         generatedData = JSON.parse(jsonString);
//       } catch (error) {
//         console.error("JSON Parse Error:", error);
//         alert("Failed to process image analysis. Please try again.");
//         return;
//       }

//       setImagePreview(cloudinaryData.secure_url);
//       setFormData((prev) => ({
//         ...prev,
//         title: generatedData.title,
//         description: generatedData.description,
//         tags: generatedData.tags,
//         imageUrl: cloudinaryData.secure_url,
//       }));
//     } catch (error) {
//       console.error("Upload failed:", error);
//       alert("Image processing failed. Please try again.");
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!user) {
//       alert("Please sign in to submit a report");
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       console.log(formData, user.id);
//       await createLostItemReport(formData, user.id);
//       setFormData({
//         title: "",
//         description: "",
//         category: "",
//         locationLost: "",
//         Geolocation: {
//           lat: 0,
//           lng: 0,
//         },
//         tags: [],
//         phoneNumber: "",
//         imageUrl: "",
//       });
//       setImagePreview(null);
//       toast.success("Your Report has been submitted");
//     } catch (error) {
//       console.error("Submission failed:", error);
//       toast.error("Failed to submit report. Please try again.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1,
//       },
//     },
//   }

//   const itemVariants = {
//     hidden: { y: 20, opacity: 0 },
//     visible: {
//       y: 0,
//       opacity: 1,
//       transition: {
//         type: "spring",
//         stiffness: 300,
//         damping: 24,
//       },
//     },
//   }

//   return (
//     <motion.div 
//     initial="hidden"
//       animate="visible"
//       variants={containerVariants}
//       className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
//       >
//       <form onSubmit={handleSubmit}>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {/* left coloumn  */}
//           <div className="space-y-6">
//             {/* personal information  */}
//             <motion.div variants={itemVariants} className="space-y-4">
//           <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
//           </div>
//           <div className="space-y-2">
//                 <Label htmlFor="phone">Phone Number</Label>
//                 <Input
//                   id="phone"
//                   type="tel"
//                   value={formData.phoneNumber}
//                   onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
//                   required
//                   placeholder="+9183838576"
//                   className="rounded-xl shadow-sm focus:ring-emerald-600 focus:border-emerald-600"
//                   required
//                 />
//                 <p className="text-sm text-gray-500">We'll contact you if someone finds your item</p>
//                 </div>
//                 </motion.div>

//                 {/* item details  */}
//                 <motion.div variants={itemVariants} className="space-y-4">
//                 <h2 className="text-xl font-semibold text-gray-800">Item Details</h2>


//                 <div className="space-y-2">
//                 <Label htmlFor="category">Category</Label>
//                 <Select
//                   value={formData.category}
//                   onValueChange={(value) => setFormData({ ...formData, category: value })}
//                   required
//                 >
//                   <SelectTrigger className="rounded-xl shadow-sm focus:ring-emerald-600 focus:border-emerald-600">
//                     <SelectValue placeholder="Select a category" />
//                   </SelectTrigger>
//                   <SelectContent className="rounded-xl">
//                   <SelectItem value="electronics">Electronics</SelectItem>
//                 <SelectItem value="documents">Documents</SelectItem>
//                 <SelectItem value="jewelry">Jewelry</SelectItem>
//                 <SelectItem value="clothing">Clothing</SelectItem>
//                 <SelectItem value="bags">Bags</SelectItem>
//                 <SelectItem value="other">Other</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="Location">Last Seen Location</Label>
//                 <Input
//                   id="location"
//                   value={formData.locationLost}
//                   onChange={(e) => setFormData({ ...formData, locationLost: e.target.value })}
//                   placeholder="Where did you last see this item?"
//                   className="rounded-xl shadow-sm focus:ring-emerald-600 focus:border-emerald-600"
//                   required
//                 />
//               </div>
//               </motion.div>

//               <div className="space-y-2">
//                 <div className="flex justify-between items-center">
//                   <Label htmlFor="geolocation">Geolocation</Label>
//                   <Button
//                     type="button"
//                     variant="outline"
//                     size="sm"
//                     onClick={handleGetLocation}
//                     disabled={isGettingLocation}
//                     className="text-emerald-600 border-emerald-600 hover:bg-emerald-50"
//                   >
//                     {isGettingLocation ? (
//                       <>
//                         <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                         Getting...
//                       </>
//                     ) : (
//                       <>
//                         <MapPin className="mr-2 h-4 w-4" />
//                         Get Location
//                       </>
//                     )}
//                   </Button>
//                 </div>
//                 <Input
//                   id="geolocation"
//                   value={formData.Geolocation.lat + ", " + formData.Geolocation.lng}
//                   readOnly
//                   placeholder="Coordinates will appear here"
//                   className="rounded-xl shadow-sm bg-gray-50"
//                 />
//               </div>
//             </motion.div>
//           </div>

//           {/* Right Column  */}
//           <div className="space-y-6">
//             {/* Image Upload */}
//             <motion.div variants={itemVariants} className="space-y-4">
//               <h2 className="text-xl font-semibold text-gray-800">Upload Image</h2>



//               <div
//   className="border-2 border-dashed rounded-2xl p-6 text-center transition-all hover:border-emerald-600 hover:bg-emerald-50/50 focus-within:border-emerald-600 focus-within:bg-emerald-50/50"
// >
//   {imagePreview ? (
//     <div className="space-y-4">
//       <div className="relative mx-auto w-full max-w-xs overflow-hidden rounded-xl shadow-md">
//         <img
//           src={imagePreview}
//           alt="Preview"
//           className="w-full h-auto object-cover"
//         />
//       </div>
//       <Button
//         type="button"
//         variant="outline"
//         size="sm"
//         onClick={() => {
//           setFormData({
//             ...formData,
//             image: null,
//             imagePreview: "",
//             title: "",
//             description: "",
//             tags: "",
//           })
//         }}
//       >
//         Remove Image
//       </Button>
//     </div>
//   ) : (
//     <div className="space-y-4">
//       <div className="mx-auto w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
//         <Upload className="h-6 w-6 text-emerald-600" />
//       </div>
//       <div>
//         <p className="text-sm font-medium text-gray-900">Click below to upload an image</p>
//         <p className="text-xs text-gray-500 mt-1">PNG, JPG or JPEG up to 5MB</p>
//       </div>
//       <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
//         Browse Files
//       </Button>
//       <input
//         type="file"
//         id="image"
//         accept="image/*"
//         onChange={handleImageUpload}
//         className="hidden"
//         disabled={isGenerating}
//       />
//     </div>
//   )}
// </div>

//             </motion.div>


//       </form>
//     </motion.div>
//   );
// }















// "use client";

// import { useUser } from "@clerk/nextjs";
// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { createLostItemReport } from "@/utils/db/actions";
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { toast } from "sonner";

// const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

// export default function ReportLostItemPage() {
//   const { user } = useUser();
//   const [imagePreview, setImagePreview] = useState<string | null>(null);
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [locationStatus, setLocationStatus] = useState("Get Location");

//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     category: "",
//     locationLost: "",
//     Geolocation: {
//       lat: 0,
//       lng: 0,
//     },
//     tags: [] as string[],
//     phoneNumber: "",
//     imageUrl: "",
//   });

//   const handleGetLocation = () => {
//     if (!navigator.geolocation) {
//       setLocationStatus("Geolocation is not supported by your browser.");
//       toast.error("GeoLocation is not supported by your browser");
//       return;
//     }

//     setLocationStatus("Getting location...");

//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         const { latitude, longitude } = position.coords;
//         const coordsArray = [latitude, longitude];
//         setFormData((prev) => ({
//           ...prev,
//           Geolocation: {
//             lat: latitude,
//             lng: longitude,
//           },
//         }));
//         setLocationStatus("success!");
//         toast("Location retrived successfully");
//       },
//       (error) => {
//         switch (error.code) {
//           case error.PERMISSION_DENIED:
//             setLocationStatus(
//               "Permission denied. Please allow location access."
//             );
//             toast.error("Permission denied. Please allow location access.");
//             break;
//           case error.POSITION_UNAVAILABLE:
//             setLocationStatus("Location information is unavailable.");
//             toast.error("Location information is unavailable.");
//             break;
//           case error.TIMEOUT:
//             setLocationStatus("The request to get user location timed out.");
//             toast.error("The request to get user location timed out.");
//             break;
//           default:
//             setLocationStatus("An unknown error occurred.");
//             toast.error("An unknown error occurred.");
//             break;
//         }
//       }
//     );
//   };

//   const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     setIsGenerating(true);

//     try {
//       // Convert to Base64
//       const reader = new FileReader();
//       const base64 = await new Promise<string>((resolve, reject) => {
//         reader.onload = () => resolve(reader.result as string);
//         reader.onerror = reject;
//         reader.readAsDataURL(file);
//       });

//       const readFileAsBase64 = (file: File): Promise<string> => {
//         return new Promise((resolve, reject) => {
//           const reader = new FileReader();
//           reader.onload = () => resolve(reader.result as string);
//           reader.onerror = reject;
//           reader.readAsDataURL(file);
//         });
//       };

//       const base64Data = await readFileAsBase64(file);

//       const imageParts = [
//         {
//           inlineData: {
//             data: base64Data.split(",")[1],
//             mimeType: file.type,
//           },
//         },
//       ];

//       // Upload to Cloudinary
//       const cloudinaryFormData = new FormData();
//       cloudinaryFormData.append("file", base64);
//       cloudinaryFormData.append(
//         "upload_preset",
//         process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
//       );

//       const cloudinaryRes = await fetch(
//         `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
//         { method: "POST", body: cloudinaryFormData }
//       );
//       const cloudinaryData = await cloudinaryRes.json();

//       // Generate content using Gemini
//       const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//       const prompt = `You are an expert in lost and found identification. Analyze this image and provide:
// 1. A short and descriptive title for the item (maximum 5 words)
// 2. A detailed description of the item, including its appearance, possible use, and any unique identifiers (3–5 sentences)
// 3. A list of relevant tags or keywords that describe the item (5–7 keywords, comma-separated)

// Respond *only* with a JSON object, without any additional text or formatting characters. Example format:
// {
//   "title": "short title here",
//   "description": "detailed description here",
//   "tags": ["tag1", "tag2", "tag3", ...]
// }
// `;

//       const result = await model.generateContentStream([prompt, ...imageParts]);

//       let fullResponse = "";
//       for await (const chunk of result.stream) {
//         fullResponse += chunk.text();
//       }

//       // Clean and extract JSON
//       let jsonString = fullResponse.trim();
//       const match = jsonString.match(/```json\s*([\s\S]*?)```/i);
//       if (match && match[1]) {
//         jsonString = match[1].trim();
//       } else {
//         jsonString = jsonString.replace(/```/g, "").trim();
//       }

//       let generatedData;
//       try {
//         generatedData = JSON.parse(jsonString);
//       } catch (error) {
//         console.error("JSON Parse Error:", error);
//         alert("Failed to process image analysis. Please try again.");
//         return;
//       }

//       setImagePreview(cloudinaryData.secure_url);
//       setFormData((prev) => ({
//         ...prev,
//         title: generatedData.title,
//         description: generatedData.description,
//         tags: generatedData.tags,
//         imageUrl: cloudinaryData.secure_url,
//       }));
//     } catch (error) {
//       console.error("Upload failed:", error);
//       alert("Image processing failed. Please try again.");
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!user) {
//       alert("Please sign in to submit a report");
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       console.log(formData, user.id);
//       await createLostItemReport(formData, user.id);
//       setFormData({
//         title: "",
//         description: "",
//         category: "",
//         locationLost: "",
//         Geolocation: {
//           lat: 0,
//           lng: 0,
//         },
//         tags: [],
//         phoneNumber: "",
//         imageUrl: "",
//       });
//       setImagePreview(null);
//       toast.success("Your Report has been submitted");
//     } catch (error) {
//       console.error("Submission failed:", error);
//       toast.error("Failed to submit report. Please try again.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="max-w-2xl mx-auto p-6">
//       <h1 className="text-3xl font-bold mb-8">Report Lost Item</h1>

//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div>
//           <Label htmlFor="image">Upload Item Photo</Label>
//           <Input
//             type="file"
//             id="image"
//             accept="image/*"
//             onChange={handleImageUpload}
//             className="mt-2"
//             disabled={isGenerating}
//           />
//           <div>{isGenerating ? "Processing..." : ""}</div>
//           {imagePreview && (
//             <div className="mt-4 w-48 h-48 border rounded-lg overflow-hidden">
//               <img
//                 src={imagePreview}
//                 alt="Preview"
//                 className="w-full h-full object-cover"
//               />
//             </div>
//           )}
//         </div>

//         <div className="space-y-4">
//           <div>
//             <Label htmlFor="title">Item Title</Label>
//             <Input
//               id="title"
//               value={formData.title}
//               disabled={isGenerating}
//               onChange={(e) =>
//                 setFormData({ ...formData, title: e.target.value })
//               }
//               required
//             />
//           </div>

//           <div>
//             <Label htmlFor="description">Description</Label>
//             <Textarea
//               id="description"
//               disabled={isGenerating}
//               value={formData.description}
//               onChange={(e) =>
//                 setFormData({ ...formData, description: e.target.value })
//               }
//               rows={4}
//               required
//             />
//           </div>

//           <div>
//             <Label>Category</Label>
//             <Select
//               value={formData.category}
//               onValueChange={(value) =>
//                 setFormData({ ...formData, category: value })
//               }
//               required
//             >
//               <SelectTrigger>
//                 <SelectValue placeholder="Select category" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="electronics">Electronics</SelectItem>
//                 <SelectItem value="documents">Documents</SelectItem>
//                 <SelectItem value="jewelry">Jewelry</SelectItem>
//                 <SelectItem value="clothing">Clothing</SelectItem>
//                 <SelectItem value="bags">Bags</SelectItem>
//                 <SelectItem value="other">Other</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           <div>
//             <Label htmlFor="GeoLocation">GeoLocation</Label>
//             <Input
//               id="geolocation"
//               value={formData.Geolocation.lat + ", " + formData.Geolocation.lng}
//               readOnly
//             />
//             <Button onClick={handleGetLocation} type="button">
//               {locationStatus}
//             </Button>
//           </div>

//           <div>
//             <Label htmlFor="location">Location Lost</Label>
//             <Input
//               id="location"
//               value={formData.locationLost}
//               onChange={(e) =>
//                 setFormData({ ...formData, locationLost: e.target.value })
//               }
//               required
//             />
//           </div>

//           <div>
//             <Label htmlFor="phone">Contact Number</Label>
//             <Input
//               id="phone"
//               type="tel"
//               value={formData.phoneNumber}
//               onChange={(e) =>
//                 setFormData({ ...formData, phoneNumber: e.target.value })
//               }
//               required
//               placeholder="Enter contact number for recovery"
//             />
//           </div>
//         </div>

//         <Button
//           type="submit"
//           className="w-full"
//           disabled={isGenerating || isSubmitting}
//         >
//           {isSubmitting ? "Processing..." : "Submit Report"}
//         </Button>
//       </form>
//     </div>
//   );
// }






















"use client";

import { useUser } from "@clerk/nextjs";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Upload, MapPin, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { createLostItemReport, testDbConnection } from "@/utils/db/actions";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { toast } from "sonner";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

const categories = [
  { value: "electronics", label: "Electronics" },
  { value: "documents", label: "Documents" },
  { value: "jewelry", label: "Jewelry" },
  { value: "clothing", label: "Clothing" },
  { value: "bags", label: "Bags" },
  { value: "other", label: "Other" },
];

export default function ReportLostItemForm() {
  const { user } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [locationStatus, setLocationStatus] = useState("Get Location");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    locationLost: "",
    Geolocation: {
      lat: 0,
      lng: 0,
    },
    tags: [] as string[],
    phoneNumber: "",
    imageUrl: "",
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

     function WakeDbOnLoad() {
    useEffect(() => {
      const wakeDb = async () => {
        const res = await testDbConnection();
        console.log('Wake DB Result:', res);
  
        if (!res.success) {
          console.error('❌ Neon DB failed to wake:', res.error);
        } else {
          console.log('✅ Neon DB is awake and responding.');
        }
      };
  
      wakeDb();
    }, []);
  
    return null; // or return some loader/UI if you want
  }

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus("Geolocation not supported");
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setLocationStatus("Getting location...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setFormData((prev) => ({
          ...prev,
          Geolocation: {
            lat: latitude,
            lng: longitude,
          },
        }));
        setLocationStatus("Location retrieved");
        toast.success("Location retrieved successfully");
      },
      (error) => {
        let errorMessage = "Failed to get location";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Permission denied. Please allow location access.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out";
            break;
        }
        setLocationStatus(errorMessage);
        toast.error(errorMessage);
      }
    );
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsGenerating(true);

    try {
      // Create image preview
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to Cloudinary
      const cloudinaryFormData = new FormData();
      cloudinaryFormData.append("file", reader.result as string);
      cloudinaryFormData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
      );

      const cloudinaryRes = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
        { method: "POST", body: cloudinaryFormData }
      );
      const cloudinaryData = await cloudinaryRes.json();

      // Generate content using Gemini
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const base64Data = (reader.result as string).split(",")[1];
      
      const imageParts = [
        {
          inlineData: {
            data: base64Data,
            mimeType: file.type,
          },
        },
      ];

      const prompt = `You are an expert in lost and found identification. Analyze this image and provide:
1. A short and descriptive title for the item (maximum 5 words)
2. A detailed description of the item, including its appearance, possible use, and any unique identifiers (3–5 sentences)
3. A list of relevant tags or keywords that describe the item (5–7 keywords, comma-separated)

Respond *only* with a JSON object, without any additional text or formatting characters. Example format:
{
  "title": "short title here",
  "description": "detailed description here",
  "tags": ["tag1", "tag2", "tag3", ...]
}
`;

      const result = await model.generateContentStream([prompt, ...imageParts]);
      let fullResponse = "";
      for await (const chunk of result.stream) {
        fullResponse += chunk.text();
      }

      // Clean and extract JSON
      let jsonString = fullResponse.trim();
      const match = jsonString.match(/```json\s*([\s\S]*?)```/i);
      if (match && match[1]) {
        jsonString = match[1].trim();
      } else {
        jsonString = jsonString.replace(/```/g, "").trim();
      }

      const generatedData = JSON.parse(jsonString);

      setFormData((prev) => ({
        ...prev,
        title: generatedData.title,
        description: generatedData.description,
        tags: generatedData.tags,
        imageUrl: cloudinaryData.secure_url,
      }));
      toast.success("Image processed and details generated");
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Image processing failed. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please sign in to submit a report");
      return;
    }

    setIsSubmitting(true);
    try {
      await createLostItemReport(formData, user.id);
      setFormData({
        title: "",
        description: "",
        category: "",
        locationLost: "",
        Geolocation: { lat: 0, lng: 0 },
        tags: [],
        phoneNumber: "",
        imageUrl: "",
      });
      setImagePreview(null);
      toast.success("Your report has been submitted successfully");
    } catch (error) {
      console.error("Submission failed:", error);
      toast.error("Failed to submit report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="bg-white rounded-2xl shadow-lg p-6 md:p-8 max-w-2xl mx-auto"
    >
      <h1 className="text-3xl font-bold mb-8">Report Lost Item</h1>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <motion.div variants={itemVariants} className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
              <div className="space-y-2">
                <Label htmlFor="phone">Contact Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, phoneNumber: e.target.value })
                  }
                  placeholder="(123) 456-7890"
                  className="rounded-xl shadow-sm"
                  required
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">Item Details</h2>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger className="rounded-xl shadow-sm">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location Lost</Label>
                <Input
                  id="location"
                  value={formData.locationLost}
                  onChange={(e) =>
                    setFormData({ ...formData, locationLost: e.target.value })
                  }
                  placeholder="Where did you last see this item?"
                  className="rounded-xl shadow-sm"
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="geolocation">Geolocation</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleGetLocation}
                    disabled={locationStatus.startsWith("Getting")}
                  >
                    {locationStatus.startsWith("Getting") ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {locationStatus}
                      </>
                    ) : (
                      <>
                        <MapPin className="mr-2 h-4 w-4" />
                        {locationStatus}
                      </>
                    )}
                  </Button>
                </div>
                <Input
                  id="geolocation"
                  value={`${formData.Geolocation.lat.toFixed(6)}, ${formData.Geolocation.lng.toFixed(6)}`}
                  readOnly
                  className="rounded-xl shadow-sm bg-gray-50"
                />
              </div>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <motion.div variants={itemVariants} className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">Upload Image</h2>
              <div
                className={cn(
                  "border-2 border-dashed rounded-2xl p-6 text-center transition-all",
                  "hover:border-emerald-600 hover:bg-emerald-50/50"
                )}
              >
                {imagePreview ? (
                  <div className="space-y-4">
                    <div className="relative mx-auto w-full max-w-xs overflow-hidden rounded-xl shadow-md">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-auto object-cover"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setImagePreview(null);
                        setFormData((prev) => ({
                          ...prev,
                          imageUrl: "",
                          title: "",
                          description: "",
                          tags: [],
                        }));
                      }}
                    >
                      Remove Image
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="mx-auto w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                      <Upload className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Drag and drop your image here or click to browse
                      </p>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG or JPEG up to 5MB</p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isGenerating}
                    >
                      Browse Files
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">Generated Details</h2>
                {isGenerating && (
                  <div className="flex items-center text-sm text-emerald-600">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Item Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className={cn("rounded-xl shadow-sm", isGenerating && "animate-pulse")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className={cn("rounded-xl shadow-sm min-h-[100px]", isGenerating && "animate-pulse")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  value={formData.tags.join(", ")}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value.split(", ") })
                  }
                  className={cn("rounded-xl shadow-sm", isGenerating && "animate-pulse")}
                />
              </div>
            </motion.div>
          </div>
        </div>

        <motion.div variants={itemVariants} className="mt-8 flex justify-center">
          <Button
            type="submit"
            disabled={isSubmitting || !imagePreview}
            className="w-full md:w-auto px-8 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md transition-all hover:shadow-lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Report"
            )}
          </Button>
        </motion.div>
      </form>
    </motion.div>
  );
}