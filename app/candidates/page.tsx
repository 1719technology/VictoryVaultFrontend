"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Search, MapPin, DollarSign, Users, Filter, ArrowRight, Star } from "lucide-react"
import Link from "next/link"

interface Candidate {
  id: string
  name: string
  office: string
  state: string
  party: string
  incumbent: boolean
  raised: string
  goal: string
  percentage: number
  supporters: number
  image: string
  description: string
  priority: "high" | "medium" | "low"
  electionDate: string
}

export default function CandidatesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedState, setSelectedState] = useState("")
  const [selectedOffice, setSelectedOffice] = useState("")
  const [sortBy, setSortBy] = useState("priority")
  const [showFilters, setShowFilters] = useState(false)

  // Sample candidates data
  const candidates: Candidate[] = [
    {
      id: "1",
      name: "Sarah Johnson",
      office: "U.S. Senate",
      state: "Texas",
      party: "Republican",
      incumbent: false,
      raised: "$2.4M",
      goal: "$5M",
      percentage: 48,
      supporters: 12400,
      image: "/placeholder.svg?height=200&width=200",
      description: "Conservative leader fighting for border security and economic freedom",
      priority: "high",
      electionDate: "2024-11-05",
    },
    {
      id: "2",
      name: "Mike Thompson",
      office: "Governor",
      state: "Florida",
      party: "Republican",
      incumbent: false,
      raised: "$1.8M",
      goal: "$3M",
      percentage: 60,
      supporters: 8900,
      image: "/placeholder.svg?height=200&width=200",
      description: "Pro-business conservative with a proven track record",
      priority: "high",
      electionDate: "2024-11-05",
    },
    {
      id: "3",
      name: "Lisa Chen",
      office: "U.S. House",
      state: "Arizona",
      party: "Republican",
      incumbent: true,
      raised: "$450K",
      goal: "$800K",
      percentage: 56,
      supporters: 5600,
      image: "/placeholder.svg?height=200&width=200",
      description: "Defending conservative values in Congress",
      priority: "medium",
      electionDate: "2024-11-05",
    },
    {
      id: "4",
      name: "Robert Davis",
      office: "U.S. Senate",
      state: "Ohio",
      party: "Republican",
      incumbent: false,
      raised: "$3.2M",
      goal: "$6M",
      percentage: 53,
      supporters: 18700,
      image: "/placeholder.svg?height=200&width=200",
      description: "America First conservative fighting for working families",
      priority: "high",
      electionDate: "2024-11-05",
    },
    {
      id: "5",
      name: "Jennifer Martinez",
      office: "Governor",
      state: "Nevada",
      party: "Republican",
      incumbent: false,
      raised: "$1.1M",
      goal: "$2.5M",
      percentage: 44,
      supporters: 7200,
      image: "/placeholder.svg?height=200&width=200",
      description: "Small business owner committed to fiscal responsibility",
      priority: "medium",
      electionDate: "2024-11-05",
    },
    {
      id: "6",
      name: "David Wilson",
      office: "U.S. House",
      state: "Georgia",
      party: "Republican",
      incumbent: true,
      raised: "$680K",
      goal: "$1.2M",
      percentage: 57,
      supporters: 9100,
      image: "/placeholder.svg?height=200&width=200",
      description: "Conservative champion for Georgia families",
      priority: "medium",
      electionDate: "2024-11-05",
    },
    {
      id: "7",
      name: "Amanda Foster",
      office: "U.S. House",
      state: "North Carolina",
      party: "Republican",
      incumbent: false,
      raised: "$320K",
      goal: "$750K",
      percentage: 43,
      supporters: 4800,
      image: "/placeholder.svg?height=200&width=200",
      description: "Military veteran fighting for conservative principles",
      priority: "high",
      electionDate: "2024-11-05",
    },
    {
      id: "8",
      name: "James Rodriguez",
      office: "Governor",
      state: "New Mexico",
      party: "Republican",
      incumbent: false,
      raised: "$890K",
      goal: "$2M",
      percentage: 45,
      supporters: 6300,
      image: "/placeholder.svg?height=200&width=200",
      description: "Border security advocate and fiscal conservative",
      priority: "medium",
      electionDate: "2024-11-05",
    },
    {
      id: "9",
      name: "Patricia White",
      office: "U.S. Senate",
      state: "Montana",
      party: "Republican",
      incumbent: true,
      raised: "$1.9M",
      goal: "$4M",
      percentage: 48,
      supporters: 11200,
      image: "/placeholder.svg?height=200&width=200",
      description: "Defending Montana values in Washington",
      priority: "high",
      electionDate: "2024-11-05",
    },
    {
      id: "10",
      name: "Kevin Brown",
      office: "U.S. House",
      state: "Wisconsin",
      party: "Republican",
      incumbent: false,
      raised: "$410K",
      goal: "$900K",
      percentage: 46,
      supporters: 5900,
      image: "/placeholder.svg?height=200&width=200",
      description: "Conservative businessman fighting for Wisconsin",
      priority: "medium",
      electionDate: "2024-11-05",
    },
    {
      id: "11",
      name: "Maria Gonzalez",
      office: "U.S. House",
      state: "California",
      party: "Republican",
      incumbent: false,
      raised: "$720K",
      goal: "$1.5M",
      percentage: 48,
      supporters: 8400,
      image: "/placeholder.svg?height=200&width=200",
      description: "Fighting to bring conservative values to California",
      priority: "high",
      electionDate: "2024-11-05",
    },
    {
      id: "12",
      name: "Thomas Anderson",
      office: "Governor",
      state: "Virginia",
      party: "Republican",
      incumbent: false,
      raised: "$2.1M",
      goal: "$4M",
      percentage: 53,
      supporters: 14600,
      image: "/placeholder.svg?height=200&width=200",
      description: "Conservative leader with executive experience",
      priority: "high",
      electionDate: "2024-11-05",
    },
  ]

  const states = [
    "Alabama",
    "Alaska",
    "Arizona",
    "Arkansas",
    "California",
    "Colorado",
    "Connecticut",
    "Delaware",
    "Florida",
    "Georgia",
    "Hawaii",
    "Idaho",
    "Illinois",
    "Indiana",
    "Iowa",
    "Kansas",
    "Kentucky",
    "Louisiana",
    "Maine",
    "Maryland",
    "Massachusetts",
    "Michigan",
    "Minnesota",
    "Mississippi",
    "Missouri",
    "Montana",
    "Nebraska",
    "Nevada",
    "New Hampshire",
    "New Jersey",
    "New Mexico",
    "New York",
    "North Carolina",
    "North Dakota",
    "Ohio",
    "Oklahoma",
    "Oregon",
    "Pennsylvania",
    "Rhode Island",
    "South Carolina",
    "South Dakota",
    "Tennessee",
    "Texas",
    "Utah",
    "Vermont",
    "Virginia",
    "Washington",
    "West Virginia",
    "Wisconsin",
    "Wyoming",
  ]

  const offices = ["U.S. Senate", "U.S. House", "Governor", "Lt. Governor", "Attorney General", "Secretary of State"]

  const filteredCandidates = useMemo(() => {
    const filtered = candidates.filter((candidate) => {
      const matchesSearch =
        candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.office.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesState = !selectedState || candidate.state === selectedState
      const matchesOffice = !selectedOffice || candidate.office === selectedOffice

      return matchesSearch && matchesState && matchesOffice
    })

    // Sort candidates
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "priority":
          const priorityOrder = { high: 3, medium: 2, low: 1 }
          return priorityOrder[b.priority] - priorityOrder[a.priority]
        case "raised":
          return Number.parseFloat(b.raised.replace(/[$M,K]/g, "")) - Number.parseFloat(a.raised.replace(/[$M,K]/g, ""))
        case "name":
          return a.name.localeCompare(b.name)
        case "state":
          return a.state.localeCompare(b.state)
        default:
          return 0
      }
    })

    return filtered
  }, [candidates, searchTerm, selectedState, selectedOffice, sortBy])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <Star className="h-3 w-3 fill-current" />
      case "medium":
        return <Star className="h-3 w-3" />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navigation />

      {/* Header */}
      <section className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">Conservative Candidates</h1>
            <p className="text-lg md:text-xl text-red-100 max-w-3xl mx-auto mb-8">
              Support Republican candidates fighting for conservative values across America
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="bg-white/20 px-4 py-2 rounded-lg">
                <span className="text-sm">Total Candidates: {candidates.length}</span>
              </div>
              <div className="bg-white/20 px-4 py-2 rounded-lg">
                <span className="text-sm">States Represented: {new Set(candidates.map((c) => c.state)).size}</span>
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
                placeholder="Search candidates, states, or offices..."
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
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="state-filter" className="text-sm font-medium text-gray-700">
                      State
                    </Label>
                    <select
                      id="state-filter"
                      value={selectedState}
                      onChange={(e) => setSelectedState(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                    >
                      <option value="">All States</option>
                      {states.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="office-filter" className="text-sm font-medium text-gray-700">
                      Office
                    </Label>
                    <select
                      id="office-filter"
                      value={selectedOffice}
                      onChange={(e) => setSelectedOffice(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                    >
                      <option value="">All Offices</option>
                      {offices.map((office) => (
                        <option key={office} value={office}>
                          {office}
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
                      <option value="name">Name</option>
                      <option value="state">State</option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchTerm("")
                        setSelectedState("")
                        setSelectedOffice("")
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
            Showing {filteredCandidates.length} of {candidates.length} candidates
          </div>
        </div>

        {/* Candidates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCandidates.map((candidate) => (
            <Card key={candidate.id} className="hover:shadow-lg transition-shadow border-red-100">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg text-gray-900 truncate">{candidate.name}</CardTitle>
                      <CardDescription className="flex items-center text-red-600 font-semibold">
                        <MapPin className="mr-1 h-3 w-3" />
                        {candidate.office} • {candidate.state}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(candidate.priority)}`}
                    >
                      {getPriorityIcon(candidate.priority)}
                      <span className="ml-1 capitalize">{candidate.priority}</span>
                    </span>
                    {candidate.incumbent && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Incumbent
                      </span>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 line-clamp-2">{candidate.description}</p>

                {/* Fundraising Progress */}
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Raised: {candidate.raised}</span>
                    <span>Goal: {candidate.goal}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-red-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${candidate.percentage}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-gray-600">{candidate.percentage}% of goal</span>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="mr-1 h-3 w-3" />
                      {candidate.supporters.toLocaleString()} supporters
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 pt-2">
                  <Link href={`/donate?candidate=${candidate.id}`} className="flex-1">
                    <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                      <DollarSign className="mr-2 h-4 w-4" />
                      Donate
                    </Button>
                  </Link>
                  <Link href={`/candidates/${candidate.id}`}>
                    <Button variant="outline" className="border-gray-300 hover:border-red-500">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredCandidates.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No candidates found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search terms or filters</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setSelectedState("")
                setSelectedOffice("")
              }}
              className="border-gray-300 hover:border-red-500"
            >
              Clear All Filters
            </Button>
          </div>
        )}

        {/* Load More (for future pagination) */}
        {filteredCandidates.length > 0 && (
          <div className="text-center mt-12">
            <Button variant="outline" className="border-gray-300 hover:border-red-500">
              Load More Candidates
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

// "use client";

// import React, { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardContent,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Search } from "lucide-react";
// import Link from "next/link";
// import { Navigation } from "@/components/navigation";
// import { Footer } from "@/components/footer";

// interface Campaign {
//   id: number;
//   title: string;
//   description: string;
//   goal: number;
//   end_date: string;
//   photo: string;
//   email: string;
// }

// export default function CandidatesPage() {
//   const [campaigns, setCampaigns] = useState<Campaign[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [searchTerm, setSearchTerm] = useState("");

//   const API = process.env.NEXT_PUBLIC_API_BASE_URL!;
//   const KEY = process.env.NEXT_PUBLIC_API_KEY!;

//   useEffect(() => {
//     async function load() {
//       try {
//         const res = await fetch(`${API}/api/v1/all_campaign`, {
//           headers: { "x-api-key": KEY },
//         });
//          console.log(res);
//         if (!res.ok) throw new Error(`Error ${res.status}`);
//         const json = await res.json();
//         const list: Campaign[] = Array.isArray(json)
//           ? json
//           : Array.isArray((json as any).campaigns)
//             ? (json as any).campaigns
//             : [];
//         setCampaigns(list);
//       } catch (e: any) {
//         setError(e.message);
//       } finally {
//         setLoading(false);
//       }
//     }
//     load();
//   }, [API, KEY]);
 

//   const filtered = campaigns.filter((c) =>
//     c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     c.description.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   if (loading) {
//     return (
//       <div className="flex min-h-screen items-center justify-center">
//         <p>Loading campaigns…</p>
//       </div>
//     );
//   }
//   if (error) {
//     return (
//       <div className="flex min-h-screen items-center justify-center">
//         <p className="text-red-600">Error: {error}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
//       <Navigation />

//       {/* Header */}
//       <section className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white py-12">
//         <div className="max-w-4xl mx-auto px-4 text-center">
//           <h1 className="text-4xl font-bold mb-2">Campaigns</h1>
//           <p className="text-lg opacity-80">
//             Browse our active campaigns and make a difference today
//           </p>
//         </div>
//       </section>

//       {/* Search */}
//       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//         <div className="relative max-w-md mx-auto">
//           <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//           <Input
//             type="text"
//             placeholder="Search by title or description…"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="pl-10"
//           />
//         </div>
//       </div>

//       {/* Cards */}
//       <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {filtered.map((c) => (
//           <Card key={c.id} className="border shadow-sm">
//             {/* Photo */}
//             {c.photo && (
//               <img
//                 src={`${API}/uploads/${c.photo}`}
//                 alt={c.title}
//                 className="w-full h-40 object-cover rounded-t"
//               />
//             )}
//             <CardHeader>
//               <CardTitle className="truncate">{c.title}</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-2">
//               <p className="text-sm text-gray-700 line-clamp-3">
//                 {c.description}
//               </p>
//               <div className="flex justify-between text-sm text-gray-600">
//                 <span>Goal: ${c.goal.toLocaleString()}</span>
//                 <span>
//                   Ends:{" "}
//                   {new Date(c.end_date).toLocaleDateString(undefined, {
//                     year: "numeric",
//                     month: "short",
//                     day: "numeric",
//                   })}
//                 </span>
//               </div>
//               <div className="flex justify-between items-center pt-4">
//                 <span className="text-xs text-gray-500">Contact: {c.email}</span>
//                 <Link href={`/candidates/${c.id}`}>
//                   <Button className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 text-sm">
//                     View Details
//                   </Button>
//                 </Link>
//               </div>
//             </CardContent>
//           </Card>
//         ))}

//         {filtered.length === 0 && (
//           <p className="col-span-full text-center text-gray-500">
//             No campaigns found.
//           </p>
//         )}
//       </div>

//       <Footer />
//     </div>
//   );
// }
