// "use client"

// import { useState } from "react"
// import { Badge } from "@/components/ui/badge"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// // Sample data for demonstration
// const donationHistory = [
//   {
//     id: "1",
//     date: "2023-04-05T14:30:00",
//     item: "Vegetable Biryani",
//     quantity: "25 plates",
//     ngo: "Food For All",
//     status: "Delivered",
//   },
//   {
//     id: "2",
//     date: "2023-04-04T16:45:00",
//     item: "Mixed Fruit Salad",
//     quantity: "5 kgs",
//     ngo: "Hope Kitchen",
//     status: "Delivered",
//   },
//   {
//     id: "3",
//     date: "2023-04-04T10:15:00",
//     item: "Sandwich Platter",
//     quantity: "30 servings",
//     ngo: "Community Food Bank",
//     status: "Pending",
//   },
//   {
//     id: "4",
//     date: "2023-04-03T18:00:00",
//     item: "Pasta with Sauce",
//     quantity: "15 boxes",
//     ngo: "Hunger Relief Foundation",
//     status: "Delivered",
//   },
//   {
//     id: "5",
//     date: "2023-04-02T12:30:00",
//     item: "Lentil Soup",
//     quantity: "10 liters",
//     ngo: "Meals On Wheels",
//     status: "Pending",
//   },
// ]

// export function DonationHistory() {
//   const [activeTab, setActiveTab] = useState("all")

//   const filteredDonations =
//     activeTab === "all"
//       ? donationHistory
//       : donationHistory.filter((donation) =>
//           activeTab === "pending" ? donation.status === "Pending" : donation.status === "Delivered",
//         )

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Donation History</CardTitle>
//         <CardDescription>Track your previous food donations</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <Tabs defaultValue="all" onValueChange={setActiveTab}>
//           <TabsList className="mb-4">
//             <TabsTrigger value="all">All</TabsTrigger>
//             <TabsTrigger value="pending">Pending</TabsTrigger>
//             <TabsTrigger value="delivered">Delivered</TabsTrigger>
//           </TabsList>
//           <TabsContent value="all" className="m-0">
//             <DonationTable donations={filteredDonations} />
//           </TabsContent>
//           <TabsContent value="pending" className="m-0">
//             <DonationTable donations={filteredDonations} />
//           </TabsContent>
//           <TabsContent value="delivered" className="m-0">
//             <DonationTable donations={filteredDonations} />
//           </TabsContent>
//         </Tabs>
//       </CardContent>
//     </Card>
//   )
// }

// function DonationTable({ donations }: { donations: typeof donationHistory }) {
//   return (
//     <div className="rounded-md border">
//       <Table>
//         <TableHeader>
//           <TableRow>
//             <TableHead>Date</TableHead>
//             <TableHead>Item</TableHead>
//             <TableHead>Quantity</TableHead>
//             <TableHead>NGO</TableHead>
//             <TableHead>Status</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {donations.length === 0 ? (
//             <TableRow>
//               <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
//                 No donations found
//               </TableCell>
//             </TableRow>
//           ) : (
//             donations.map((donation) => (
//               <TableRow key={donation.id} className="group hover:bg-green-50/50 transition-colors">
//                 <TableCell>
//                   {new Date(donation.date).toLocaleDateString("en-US", {
//                     month: "short",
//                     day: "numeric",
//                     hour: "2-digit",
//                     minute: "2-digit",
//                   })}
//                 </TableCell>
//                 <TableCell className="font-medium">{donation.item}</TableCell>
//                 <TableCell>{donation.quantity}</TableCell>
//                 <TableCell>{donation.ngo}</TableCell>
//                 <TableCell>
//                   <Badge
//                     variant={donation.status === "Delivered" ? "default" : "outline"}
//                     className={
//                       donation.status === "Delivered"
//                         ? "bg-green-500 hover:bg-green-600"
//                         : "text-amber-600 border-amber-300 bg-amber-50"
//                     }
//                   >
//                     {donation.status}
//                   </Badge>
//                 </TableCell>
//               </TableRow>
//             ))
//           )}
//         </TableBody>
//       </Table>
//     </div>
//   )
// }



"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useState } from "react"

export interface Donation {
  id: string;
  date: string;
  item: string;
  quantity: string;
  ngo: string;
  status: string;
}

interface DonationHistoryProps {
  donations: Donation[];
}

export function DonationHistory({ donations }: DonationHistoryProps) {
  const [activeTab, setActiveTab] = useState("all")

  const filteredDonations =
    activeTab === "all"
      ? donations
      : donations.filter((donation) =>
          activeTab === "pending" ? donation.status === "Pending" : donation.status === "Delivered",
        )

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Donation History</CardTitle>
        <CardDescription>Track your previous food donations</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="delivered">Delivered</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="m-0">
            <DonationTable donations={filteredDonations} />
          </TabsContent>
          <TabsContent value="pending" className="m-0">
            <DonationTable donations={filteredDonations} />
          </TabsContent>
          <TabsContent value="delivered" className="m-0">
            <DonationTable donations={filteredDonations} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

function DonationTable({ donations }: { donations: Donation[] }) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Item</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>NGO</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {donations.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                No donations found
              </TableCell>
            </TableRow>
          ) : (
            donations.map((donation) => (
              <TableRow key={donation.id} className="group hover:bg-green-50/50 transition-colors">
                <TableCell>
                  {new Date(donation.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </TableCell>
                <TableCell className="font-medium">{donation.item}</TableCell>
                <TableCell>{donation.quantity}</TableCell>
                <TableCell>{donation.ngo}</TableCell>
                <TableCell>
                  <Badge
                    variant={donation.status === "Delivered" ? "default" : "outline"}
                    className={
                      donation.status === "Delivered"
                        ? "bg-green-500 hover:bg-green-600"
                        : "text-amber-600 border-amber-300 bg-amber-50"
                    }
                  >
                    {donation.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}