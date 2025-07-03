import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Flag, Shield, Users, Target, CheckCircle, DollarSign, Award } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export default function AboutPage() {
  const stats = [
    {
      icon: DollarSign,
      value: "$2.8B+",
      label: "Total Raised",
      description: "Empowering conservative campaigns nationwide",
    },
    {
      icon: Users,
      value: "4.2M+",
      label: "Active Donors",
      description: "Patriots supporting our cause",
    },
    {
      icon: Target,
      value: "15,000+",
      label: "Campaigns Supported",
      description: "From local races to federal elections",
    },
    {
      icon: Award,
      value: "92%",
      label: "Success Rate",
      description: "Winning elections that matter",
    },
  ]

  const values = [
    {
      icon: Shield,
      title: "Security First",
      description:
        "Bank-level encryption and security protocols protect every donation and donor's personal information.",
    },
    {
      icon: Flag,
      title: "Conservative Values",
      description:
        "Dedicated to supporting candidates and causes that champion traditional American principles and freedoms.",
    },
    {
      icon: Users,
      title: "Grassroots Power",
      description:
        "Empowering everyday Americans to make their voices heard through strategic political contributions.",
    },
    {
      icon: Target,
      title: "Strategic Impact",
      description: "Maximizing the effectiveness of every dollar donated to create meaningful political change.",
    },
  ]

  const teamMembers = [
    {
      name: "Sarah Mitchell",
      role: "Chief Executive Officer",
      bio: "Former campaign strategist with 15+ years in Republican politics",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      name: "David Rodriguez",
      role: "Chief Technology Officer",
      bio: "Cybersecurity expert ensuring platform integrity and donor protection",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      name: "Jennifer Walsh",
      role: "Director of Operations",
      bio: "Campaign finance specialist with expertise in FEC compliance",
      image: "/placeholder.svg?height=200&width=200",
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
            <h1 className="text-4xl md:text-6xl font-bold mb-6">About VictoryVault</h1>
            <p className="text-xl md:text-2xl mb-8 text-red-100 max-w-3xl mx-auto">
              America's premier conservative fundraising platform, empowering patriots to support the candidates and
              causes that will preserve our nation's founding principles.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
 <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              VictoryVault exists to level the playing field in American politics by providing conservative candidates and
              causes with the same powerful fundraising tools that have long been available to the left. We believe that
              every American deserves representation that reflects their values, and we're committed to making that
              vision a reality through innovative technology and unwavering dedication to conservative principles.
            </p>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-red-50 rounded-lg p-8">
            <blockquote className="text-xl text-gray-800 italic text-center">
              "Democracy works best when all voices can be heard. VictoryVault ensures that conservative Americans have the
              platform they need to support the leaders who will fight for their values and their future."
            </blockquote>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
 <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Impact</h2>
            <p className="text-xl text-gray-600">
              Since our founding, VictoryVault has become the backbone of conservative fundraising in America
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="h-8 w-8 text-red-600" />
                  </div>
                  <CardTitle className="text-3xl font-bold text-gray-900">{stat.value}</CardTitle>
                  <CardDescription className="text-lg font-semibold text-gray-700">{stat.label}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{stat.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
 <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything we do is guided by these fundamental principles that define who we are and what we stand for
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow border-red-100">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center">
                      <value.icon className="h-6 w-6 text-red-600" />
                    </div>
                    <CardTitle className="text-xl text-gray-900">{value.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
 <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How VictoryVault Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform makes it simple and secure for conservatives to support the candidates and causes they
              believe in
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Discover Candidates</h3>
              <p className="text-gray-600">
                Browse conservative candidates and causes from local races to federal elections, all vetted for their
                commitment to conservative principles.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-red-600">2</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Make Your Donation</h3>
              <p className="text-gray-600">
                Contribute securely with our bank-level encryption, choosing from one-time gifts or recurring donations
                to maximize your impact.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Track Your Impact</h3>
              <p className="text-gray-600">
                Follow your supported candidates' progress, receive updates on their campaigns, and see how your
                contributions are making a difference.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
 <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Leadership Team</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Meet the experienced professionals leading VictoryVault's mission to empower conservative voices
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-32 h-32 mx-auto mb-4 bg-gray-200 rounded-full"></div>
                  <CardTitle className="text-xl text-gray-900">{member.name}</CardTitle>
                  <CardDescription className="text-red-600 font-semibold">{member.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Security & Trust */}
      <section className="py-16 bg-gradient-to-r from-blue-800 to-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <Shield className="h-16 w-16 mx-auto mb-6 text-blue-200" />
 <h2 className="text-3xl md:text-4xl font-bold mb-6">Security & Trust</h2>
            <p className="text-xl text-blue-100 mb-8">
              Your security and privacy are our top priorities. VictoryVault employs industry-leading security measures to
              protect your personal information and ensure your donations reach their intended recipients.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            <div className="flex items-start space-x-4">
              <CheckCircle className="h-6 w-6 text-green-400 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-2">Bank-Level Encryption</h3>
                <p className="text-blue-100">All transactions are protected with 256-bit SSL encryption</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <CheckCircle className="h-6 w-6 text-green-400 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-2">FEC Compliance</h3>
                <p className="text-blue-100">Full compliance with federal election campaign finance laws</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <CheckCircle className="h-6 w-6 text-green-400 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-2">Verified Recipients</h3>
                <p className="text-blue-100">All candidates and causes are thoroughly vetted before approval</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <CheckCircle className="h-6 w-6 text-green-400 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-2">24/7 Monitoring</h3>
                <p className="text-blue-100">Continuous security monitoring and fraud prevention</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-red-600 to-red-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Join the Conservative Movement</h2>
          <p className="text-xl mb-8 text-red-100">
            Be part of the solution. Support conservative candidates and causes that will preserve American values for
            future generations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100 text-lg px-8 py-3">
              <DollarSign className="mr-2 h-5 w-5" />
              Start Donating
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-red-600 text-lg px-8 py-3"
            >
              <Users className="mr-2 h-5 w-5" />
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
