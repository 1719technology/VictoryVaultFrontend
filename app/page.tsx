import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, DollarSign, ArrowRight, Heart, Shield, Target } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export default function HomePage() {
  const featuredCandidates = [
    {
      id: 1,
      name: "Sarah Johnson",
      office: "U.S. Senate",
      state: "Texas",
      raised: "$2.4M",
      goal: "$5M",
      percentage: 48,
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: 2,
      name: "Mike Thompson",
      office: "Governor",
      state: "Florida",
      raised: "$1.8M",
      goal: "$3M",
      percentage: 60,
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: 3,
      name: "Lisa Chen",
      office: "U.S. House",
      state: "Arizona",
      raised: "$450K",
      goal: "$800K",
      percentage: 56,
      image: "/placeholder.svg?height=200&width=200",
    },
  ]

  const causes = [
    {
      title: "Border Security Initiative",
      description: "Supporting enhanced border security measures",
      raised: "$890K",
      supporters: "12,400",
    },
    {
      title: "Small Business Relief Fund",
      description: "Helping small businesses recover and thrive",
      raised: "$1.2M",
      supporters: "8,900",
    },
    {
      title: "Veterans Support Program",
      description: "Providing resources for our nation's heroes",
      raised: "$650K",
      supporters: "15,600",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Empower Conservative
              <span className="block text-blue-100">Leadership</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-red-100 max-w-3xl mx-auto">
              Join thousands of patriots supporting conservative candidates and causes across America. Your contribution
              makes a difference in preserving our values and freedoms.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100 text-lg px-8 py-3">
                <DollarSign className="mr-2 h-5 w-5" />
                Make a Donation
              </Button>
              <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100 text-lg px-8 py-3">
                <Users className="mr-2 h-5 w-5" />
                Join the Movement
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="h-8 w-8 text-red-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900">$24.8M</div>
              <div className="text-gray-600">Total Raised</div>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900">156K</div>
              <div className="text-gray-600">Active Donors</div>
            </div>
            <div className="text-center">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-red-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900">342</div>
              <div className="text-gray-600">Candidates Supported</div>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900">89%</div>
              <div className="text-gray-600">Win Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Candidates */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Candidates</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Support conservative leaders who will fight for our values in Washington and beyond
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredCandidates.map((candidate) => (
              <Card key={candidate.id} className="hover:shadow-lg transition-shadow border-red-100">
                <CardHeader className="text-center">
                  <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 rounded-full"></div>
                  <CardTitle className="text-xl text-gray-900">{candidate.name}</CardTitle>
                  <CardDescription className="text-red-600 font-semibold">
                    {candidate.office} • {candidate.state}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Raised: {candidate.raised}</span>
                      <span>Goal: {candidate.goal}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-red-600 h-2 rounded-full" style={{ width: `${candidate.percentage}%` }}></div>
                    </div>
                    <div className="text-center mt-2 text-sm text-gray-600">
                      {candidate.percentage}% of goal reached
                    </div>
                  </div>
                  <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                    Support {candidate.name.split(" ")[0]}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Causes Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Conservative Causes</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Support the issues that matter most to preserving American values and freedoms
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {causes.map((cause, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow border-blue-100">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900">{cause.title}</CardTitle>
                  <CardDescription>{cause.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{cause.raised}</div>
                      <div className="text-sm text-gray-600">raised</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">{cause.supporters}</div>
                      <div className="text-sm text-gray-600">supporters</div>
                    </div>
                  </div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    <Heart className="mr-2 h-4 w-4" />
                    Support This Cause
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-800 to-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Make a Difference?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of patriots who are already supporting conservative candidates and causes. Every contribution
            helps secure our future.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white text-lg px-8 py-3">
              <DollarSign className="mr-2 h-5 w-5" />
              Donate Today
            </Button>
            <Button size="lg" className="border-white text-white hover:bg-white hover:text-blue-900 text-lg px-8 py-3"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
