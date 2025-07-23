"use client"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useEffect, useState } from "react"
import { getRecentDonations } from "@/utils/db/actions"

// Client-only parts

export interface Donation {
  id: string
  item: string
  quantity: string
  unit: string
  ngo: string
  status: string
  date: string
}

export default function DonationHistoryPage() {
  const [donations, setDonations] = useState<Donation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const donationsFromDb = await getRecentDonations()
        const formattedDonations: Donation[] = donationsFromDb.map((donation) => ({
          id: donation.id,
          item: donation.foodItem,
          quantity: donation.quantity.toString(),
          unit: donation.unit,
          ngo: donation.ngo,
          status: donation.status ?? "Pending",
          date: donation.createdAt.toISOString(),
        }))
        setDonations(formattedDonations)
      } catch (error) {
        console.error("Failed to fetch donations:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDonations()
  }, [])

  if (loading) {
    return <div>Loading donation history...</div>
  }

  return <DonationHistory donations={donations} />
}

 function DonationHistory({ donations }: { donations: Donation[] }) {
  const [activeTab, setActiveTab] = useState("all")

  const filteredDonations =
    activeTab === "all"
      ? donations
      : donations.filter((donation) =>
          activeTab === "pending"
            ? donation.status === "Pending"
            : donation.status === "Delivered"
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
                <TableCell>{donation.quantity} {donation.unit}</TableCell>
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
