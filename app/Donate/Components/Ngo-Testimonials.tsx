import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Quote } from "lucide-react"

const testimonials = [
  {
    id: "1",
    name: "Food For All",
    role: "Serving 500+ people daily",
    content:
      "The college canteen donations have been a game-changer for our organization. We're now able to serve fresh, nutritious meals to more people in need.",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    name: "Hope Kitchen",
    role: "Community outreach program",
    content:
      "Thanks to this initiative, we've reduced food waste while helping those who need it most. The quality of donations has been exceptional.",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "3",
    name: "Meals On Wheels",
    role: "Elderly support service",
    content:
      "Our elderly beneficiaries look forward to these meals. The variety and quality of food from the college canteen has made a real difference.",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

export function NGOTestimonials() {
  return (
    <div className="space-y-4">
      <Card className="border-green-100 bg-gradient-to-b from-[#D4F9EB]/50 to-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">NGO Testimonials</CardTitle>
          <CardDescription>Hear from our partner organizations</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-4">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="p-4 rounded-lg bg-white border border-green-100 transition-all duration-300 hover:shadow-md hover:-translate-y-1"
              >
                <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10 border-2 border-green-100">
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
                <div className="mt-3 relative">
                  <Quote className="absolute -top-1 -left-1 h-4 w-4 text-green-300 opacity-50" />
                  <p className="text-sm pl-4 text-muted-foreground">{testimonial.content}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-green-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Impact Gallery</CardTitle>
          <CardDescription>See how your donations help</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-2 gap-1">
            <img
              src="/Ngo.jpg?height=120&width=160"
              alt="NGO volunteers"
              className="w-full h-32 object-cover hover:opacity-90 transition-opacity rounded-2xl"
            />
            <img
              src="/donate.jpeg?height=120&width=160"
              alt="Food distribution"
              className="w-full h-32 object-cover hover:opacity-90 transition-opacity"
            />
            <img
              src="/FoodDistribution.jpg?height=120&width=160"
              alt="Happy recipients"
              className="w-full h-32 object-cover hover:opacity-90 transition-opacity"
            />
            <img
              src="/deliver.jpeg?height=120&width=160"
              alt="Happy recipients"
              className="w-full h-32 object-cover hover:opacity-90 transition-opacity rounded-2xl"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

