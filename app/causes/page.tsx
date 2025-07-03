"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import {
  Search,
  Shield,
  DollarSign,
  Users,
  Filter,
  ArrowRight,
  Flag,
  Building,
  GraduationCap,
  Heart,
  Briefcase,
  Home,
  Scale,
  Clock,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"

interface Cause {
  id: string
  title: string
  description: string
  category: string
  level: "federal" | "state" | "local"
  priority: "urgent" | "high" | "medium" | "low"
  raised: string
  goal: string
  percentage: number
  supporters: number
  deadline?: string
  location?: string
  icon: any
  tags: string[]
  impact: string
}

export default function CausesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedLevel, setSelectedLevel] = useState("")
  const [selectedPriority, setSelectedPriority] = useState("")
  const [sortBy, setSortBy] = useState("priority")
  const [showFilters, setShowFilters] = useState(false)

  // Sample causes data
  const causes: Cause[] = [
    {
      id: "1",
      title: "Border Security Initiative",
      description:
        "Supporting enhanced border security measures including physical barriers, technology upgrades, and increased Border Patrol funding to protect American communities.",
      category: "National Security",
      level: "federal",
      priority: "urgent",
      raised: "$2.8M",
      goal: "$5M",
      percentage: 56,
      supporters: 18400,
      deadline: "2024-12-31",
      icon: Shield,
      tags: ["Immigration", "Security", "Law Enforcement"],
      impact: "Securing 2,000+ miles of border",
    },
    {
      id: "2",
      title: "Small Business Tax Relief",
      description:
        "Advocating for reduced tax burdens on small businesses to stimulate economic growth and job creation across America.",
      category: "Economy",
      level: "federal",
      priority: "high",
      raised: "$1.9M",
      goal: "$3.5M",
      percentage: 54,
      supporters: 12800,
      icon: Briefcase,
      tags: ["Taxes", "Business", "Economy"],
      impact: "Supporting 500K+ small businesses",
    },
    {
      id: "3",
      title: "School Choice Expansion",
      description:
        "Promoting educational freedom through voucher programs and charter school expansion to give parents more options for their children's education.",
      category: "Education",
      level: "state",
      priority: "high",
      raised: "$890K",
      goal: "$1.5M",
      percentage: 59,
      supporters: 9600,
      location: "Multiple States",
      icon: GraduationCap,
      tags: ["Education", "Parental Rights", "Freedom"],
      impact: "Benefiting 100K+ students",
    },
    {
      id: "4",
      title: "Veterans Healthcare Support",
      description:
        "Improving healthcare services and mental health support for our nation's veterans through increased funding and program expansion.",
      category: "Veterans Affairs",
      level: "federal",
      priority: "high",
      raised: "$1.4M",
      goal: "$2.5M",
      percentage: 56,
      supporters: 15200,
      icon: Heart,
      tags: ["Veterans", "Healthcare", "Mental Health"],
      impact: "Serving 250K+ veterans",
    },
    {
      id: "5",
      title: "Energy Independence Project",
      description:
        "Promoting American energy independence through domestic oil and gas production, pipeline infrastructure, and reduced regulatory barriers.",
      category: "Energy",
      level: "federal",
      priority: "high",
      raised: "$2.1M",
      goal: "$4M",
      percentage: 53,
      supporters: 14700,
      icon: TrendingUp,
      tags: ["Energy", "Independence", "Jobs"],
      impact: "Creating 50K+ energy jobs",
    },
    {
      id: "6",
      title: "Second Amendment Defense",
      description:
        "Protecting constitutional gun rights and opposing restrictive firearm legislation that infringes on law-abiding citizens' rights.",
      category: "Constitutional Rights",
      level: "federal",
      priority: "urgent",
      raised: "$1.7M",
      goal: "$3M",
      percentage: 57,
      supporters: 22100,
      deadline: "2024-11-01",
      icon: Scale,
      tags: ["Constitution", "Gun Rights", "Freedom"],
      impact: "Protecting rights of 100M+ gun owners",
    },
    {
      id: "7",
      title: "Property Tax Relief",
      description:
        "Fighting for lower property taxes to help homeowners and families keep more of their hard-earned money.",
      category: "Taxes",
      level: "local",
      priority: "medium",
      raised: "$420K",
      goal: "$800K",
      percentage: 53,
      supporters: 6800,
      location: "Texas Counties",
      icon: Home,
      tags: ["Property Tax", "Homeowners", "Local"],
      impact: "Helping 75K+ homeowners",
    },
    {
      id: "8",
      title: "Election Integrity Initiative",
      description:
        "Ensuring secure and transparent elections through voter ID requirements, signature verification, and poll monitoring programs.",
      category: "Election Security",
      level: "state",
      priority: "urgent",
      raised: "$1.3M",
      goal: "$2.2M",
      percentage: 59,
      supporters: 16900,
      deadline: "2024-10-15",
      location: "Swing States",
      icon: Flag,
      tags: ["Elections", "Integrity", "Democracy"],
      impact: "Securing elections in 15 states",
    },
    {
      id: "9",
      title: "Religious Freedom Protection",
      description:
        "Defending the right to religious expression and protecting faith-based organizations from government overreach.",
      category: "Constitutional Rights",
      level: "federal",
      priority: "high",
      raised: "$980K",
      goal: "$1.8M",
      percentage: 54,
      supporters: 11400,
      icon: Building,
      tags: ["Religious Freedom", "First Amendment", "Faith"],
      impact: "Protecting 300K+ faith organizations",
    },
    {
      id: "10",
      title: "Anti-Crime Initiative",
      description:
        "Supporting law enforcement with increased funding, training, and resources to combat rising crime rates in urban areas.",
      category: "Law Enforcement",
      level: "local",
      priority: "urgent",
      raised: "$750K",
      goal: "$1.5M",
      percentage: 50,
      supporters: 8900,
      location: "Major Cities",
      deadline: "2024-12-01",
      icon: Shield,
      tags: ["Crime", "Police", "Safety"],
      impact: "Supporting 500+ police departments",
    },
    {
      id: "11",
      title: "Parental Rights in Education",
      description:
        "Ensuring parents have a voice in their children's education and curriculum decisions at the local school board level.",
      category: "Education",
      level: "local",
      priority: "high",
      raised: "$560K",
      goal: "$1M",
      percentage: 56,
      supporters: 7200,
      location: "School Districts",
      icon: GraduationCap,
      tags: ["Parents", "Education", "Local Control"],
      impact: "Empowering 200K+ parents",
    },
    {
      id: "12",
      title: "Healthcare Freedom Act",
      description:
        "Promoting free-market healthcare solutions and opposing government-controlled healthcare systems that limit patient choice.",
      category: "Healthcare",
      level: "federal",
      priority: "medium",
      raised: "$1.1M",
      goal: "$2M",
      percentage: 55,
      supporters: 10600,
      icon: Heart,
      tags: ["Healthcare", "Free Market", "Patient Choice"],
      impact: "Benefiting 50M+ patients",
    },
  ]

  const categories = [
    "National Security",
    "Economy",
    "Education",
    "Veterans Affairs",
    "Energy",
    "Constitutional Rights",
    "Taxes",
    "Election Security",
    "Law Enforcement",
    "Healthcare",
  ]

  const levels = ["federal", "state", "local"]
  const priorities = ["urgent", "high", "medium", "low"]

  const filteredCauses = useMemo(() => {
    const filtered = causes.filter((cause) => {
      const matchesSearch =
        cause.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cause.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cause.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cause.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesCategory = !selectedCategory || cause.category === selectedCategory
      const matchesLevel = !selectedLevel || cause.level === selectedLevel
      const matchesPriority = !selectedPriority || cause.priority === selectedPriority

      return matchesSearch && matchesCategory && matchesLevel && matchesPriority
    })

    // Sort causes
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "priority":
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 }
          return priorityOrder[b.priority] - priorityOrder[a.priority]
        case "raised":
          return Number.parseFloat(b.raised.replace(/[$M,K]/g, "")) - Number.parseFloat(a.raised.replace(/[$M,K]/g, ""))
        case "supporters":
          return b.supporters - a.supporters
        case "deadline":
          if (!a.deadline && !b.deadline) return 0
          if (!a.deadline) return 1
          if (!b.deadline) return -1
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
        case "title":
          return a.title.localeCompare(b.title)
        default:
          return 0
      }
    })

    return filtered
  }, [searchTerm, selectedCategory, selectedLevel, selectedPriority, sortBy])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800 border-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "federal":
        return "bg-blue-100 text-blue-800"
      case "state":
        return "bg-green-100 text-green-800"
      case "local":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDeadline = (deadline?: string) => {
    if (!deadline) return null
    const date = new Date(deadline)
    const now = new Date()
    const diffTime = date.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) return "Deadline passed"
    if (diffDays === 0) return "Due today"
    if (diffDays === 1) return "Due tomorrow"
    if (diffDays <= 30) return `${diffDays} days left`
    return date.toLocaleDateString()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navigation />

      {/* Header */}
      <section className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">Conservative Causes</h1>
            <p className="text-lg md:text-xl text-red-100 max-w-3xl mx-auto mb-8">
              Support the issues that matter most to preserving American values and freedoms
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="bg-white/20 px-4 py-2 rounded-lg">
                <span className="text-sm">Active Causes: {causes.length}</span>
              </div>
              <div className="bg-white/20 px-4 py-2 rounded-lg">
                <span className="text-sm">
                  Total Supporters: {causes.reduce((sum, cause) => sum + cause.supporters, 0).toLocaleString()}
                </span>
              </div>
              <div className="bg-white/20 px-4 py-2 rounded-lg">
                <span className="text-sm">Funds Raised: $12.8M+</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-6">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search causes, categories, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-300 focus:border-red-500 focus:ring-red-500"
              />
            </div>

            {/* Filter Toggle */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="border-gray-300 hover:border-red-500"
            >
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>

          {/* Filters */}
          {showFilters && (
            <Card className="border-gray-200 mb-6">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div>
                    <Label htmlFor="category-filter" className="text-sm font-medium text-gray-700">
                      Category
                    </Label>
                    <select
                      id="category-filter"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                    >
                      <option value="">All Categories</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="level-filter" className="text-sm font-medium text-gray-700">
                      Level
                    </Label>
                    <select
                      id="level-filter"
                      value={selectedLevel}
                      onChange={(e) => setSelectedLevel(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                    >
                      <option value="">All Levels</option>
                      {levels.map((level) => (
                        <option key={level} value={level}>
                          {level.charAt(0).toUpperCase() + level.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="priority-filter" className="text-sm font-medium text-gray-700">
                      Priority
                    </Label>
                    <select
                      id="priority-filter"
                      value={selectedPriority}
                      onChange={(e) => setSelectedPriority(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                    >
                      <option value="">All Priorities</option>
                      {priorities.map((priority) => (
                        <option key={priority} value={priority}>
                          {priority.charAt(0).toUpperCase() + priority.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="sort-filter" className="text-sm font-medium text-gray-700">
                      Sort By
                    </Label>
                    <select
                      id="sort-filter"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                    >
                      <option value="priority">Priority</option>
                      <option value="raised">Funds Raised</option>
                      <option value="supporters">Supporters</option>
                      <option value="deadline">Deadline</option>
                      <option value="title">Title</option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchTerm("")
                        setSelectedCategory("")
                        setSelectedLevel("")
                        setSelectedPriority("")
                        setSortBy("priority")
                      }}
                      className="w-full border-gray-300 hover:border-red-500"
                    >
                      Clear Filters
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Results Count */}
          <div className="text-sm text-gray-600 mb-4">
            Showing {filteredCauses.length} of {causes.length} causes
          </div>
        </div>

        {/* Causes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCauses.map((cause) => {
            const IconComponent = cause.icon
            const deadline = formatDeadline(cause.deadline)

            return (
              <Card key={cause.id} className="hover:shadow-lg transition-shadow border-red-100">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="bg-red-100 p-2 rounded-lg">
                        <IconComponent className="h-5 w-5 text-red-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg text-gray-900 line-clamp-2">{cause.title}</CardTitle>
                        <CardDescription className="text-gray-600">{cause.category}</CardDescription>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(cause.priority)}`}
                    >
                      {cause.priority.charAt(0).toUpperCase() + cause.priority.slice(1)}
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(cause.level)}`}
                    >
                      {cause.level.charAt(0).toUpperCase() + cause.level.slice(1)}
                    </span>
                    {deadline && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        <Clock className="mr-1 h-3 w-3" />
                        {deadline}
                      </span>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600 line-clamp-3">{cause.description}</p>

                  {/* Impact */}
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-blue-900">Impact: {cause.impact}</p>
                  </div>

                  {/* Location */}
                  {cause.location && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Building className="mr-1 h-3 w-3" />
                      {cause.location}
                    </div>
                  )}

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {cause.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Fundraising Progress */}
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Raised: {cause.raised}</span>
                      <span>Goal: {cause.goal}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-red-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${cause.percentage}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-gray-600">{cause.percentage}% of goal</span>
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="mr-1 h-3 w-3" />
                        {cause.supporters.toLocaleString()} supporters
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2 pt-2">
                    <Link href={`/donate?cause=${cause.id}`} className="flex-1">
                      <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                        <DollarSign className="mr-2 h-4 w-4" />
                        Support
                      </Button>
                    </Link>
                    <Link href={`/causes/${cause.id}`}>
                      <Button variant="outline" className="border-gray-300 hover:border-red-500">
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* No Results */}
        {filteredCauses.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No causes found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search terms or filters</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setSelectedCategory("")
                setSelectedLevel("")
                setSelectedPriority("")
              }}
              className="border-gray-300 hover:border-red-500"
            >
              Clear All Filters
            </Button>
          </div>
        )}

        {/* Load More */}
        {filteredCauses.length > 0 && (
          <div className="text-center mt-12">
            <Button variant="outline" className="border-gray-300 hover:border-red-500">
              Load More Causes
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
