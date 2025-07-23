"use client"

import { DonationForm } from "./Components/Donate-form"
import DonationHistoryPage from "./Components/Donation-history"
import { NGOTestimonials } from "./Components/Ngo-Testimonials"


export default function DonatePage() {

  return (
    <div className="container mx-auto mt-16 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Donate Extra Food to NGOs</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Ensure no food goes to waste. We connect extra canteen meals with nearby NGOs to feed those in need.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <DonationForm  />
            <DonationHistoryPage/>
          </div>
          <div className="md:col-span-1">
            <NGOTestimonials />
          </div>
        </div>
      </div>
    </div>
  )
}






