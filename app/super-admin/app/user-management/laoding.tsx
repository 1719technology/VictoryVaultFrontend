import type React from "react"
import type { Metadata } from "next"
import { AdminFooter } from "@/components/admin-footer"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export const metadata: Metadata = {
  title: "Super Admin Dashboard - VictoryVault",
  description: "Administrative dashboard for managing users and campaigns",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider defaultOpen={false}>
      {/*<AdminSidebar />*/}
      <SidebarInset className="flex flex-col min-h-screen">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-white shadow-sm">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold text-red-600">VictoryVault Admin Dashboard</h1>
          </div>
        </header>
        <main className="flex-1 overflow-auto bg-gray-50 p-6">{children}</main>
        <AdminFooter />
      </SidebarInset>
    </SidebarProvider>
  )
}
