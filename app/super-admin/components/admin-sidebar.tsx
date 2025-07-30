"use client"

import type * as React from "react"
import {
  Users,
  FileText,
  BarChart3,
  Settings,
  Shield,
  PlayIcon as Campaign,
  Home,
  ChevronRight,
  ChevronLeft,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"

const navigationItems = [
  {
    title: "Overview",
    items: [
      {
        title: "Dashboard",
        url: "/admin",
        icon: Home,
      },
      {
        title: "Analytics",
        url: "/admin/analytics",
        icon: BarChart3,
      },
    ],
  },
  {
    title: "User Management",
    items: [
      {
        title: "Registration Review",
        url: "/admin/registrations",
        icon: FileText,
      },
      {
        title: "User Profiles",
        url: "/admin/users",
        icon: Users,
      },
    ],
  },
  {
    title: "Campaign Management",
    items: [
      {
        title: "All Campaigns",
        url: "/admin/campaigns",
        icon: Campaign,
      },
    ],
  },
  {
    title: "System",
    items: [
      {
        title: "Settings",
        url: "/admin/settings",
        icon: Settings,
      },
    ],
  },
]

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { state, toggleSidebar } = useSidebar()

  return (
    <Sidebar variant="inset" collapsible="icon" {...props}>
      <SidebarHeader className="border-b border-gray-200 bg-white">
        <div className="flex items-center gap-2 px-4 py-3">
          <Shield className="h-6 w-6 text-red-600 flex-shrink-0" />
          <div
            className={`flex flex-col transition-opacity duration-200 ${
              state === "collapsed" ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
            }`}
          >
            <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">VictoryVault</span>
            <span className="text-xs text-gray-500 whitespace-nowrap">Super Admin</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-white">
        {navigationItems.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel className="text-xs font-medium text-gray-500 uppercase tracking-wider px-3">
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = pathname === item.url
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={state === "collapsed" ? item.title : undefined}
                      >
                        <Link
                          href={item.url}
                          className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                            isActive
                              ? "bg-red-50 text-red-700 border-r-2 border-red-600"
                              : "text-gray-700 hover:bg-gray-50 hover:text-red-600"
                          }`}
                        >
                          <item.icon
                            className={`h-4 w-4 flex-shrink-0 ${isActive ? "text-red-600" : "text-gray-500"}`}
                          />
                          <span
                            className={`transition-opacity duration-200 whitespace-nowrap ${
                              state === "collapsed" ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
                            }`}
                          >
                            {item.title}
                          </span>
                          {isActive && state === "expanded" && (
                            <ChevronRight className="h-3 w-3 ml-auto text-red-600 flex-shrink-0" />
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="bg-white border-t border-gray-200 p-2">
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="h-8 w-8 p-0 hover:bg-gray-100 transition-colors duration-200"
            title={state === "collapsed" ? "Expand sidebar" : "Collapse sidebar"}
          >
            {state === "collapsed" ? (
              <ChevronRight className="h-4 w-4 text-gray-600" />
            ) : (
              <ChevronLeft className="h-4 w-4 text-gray-600" />
            )}
          </Button>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
