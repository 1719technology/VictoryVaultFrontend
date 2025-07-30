"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  FileText,
  PlayIcon as Campaign,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react";

interface UserData {
  isActive: boolean;
}

interface CampaignItem {
  status: string;
}

interface AuditLogEntry {
  id: number;
  type: "registration" | "campaign" | "user" | string;
  user: string;
  action: string;
  time: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    pausedUsers: 0,
    pendingRegistrations: 0,
    totalCampaigns: 0,
    activeCampaigns: 0,
    pausedCampaigns: 0,
    recentActivity: [] as AuditLogEntry[],
  });

  useEffect(() => {
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
    const token = localStorage.getItem("superAdminToken");

    // Redirect if no token
    if (!token) {
      router.push("/super-admin/login");
      return;
    }

    const fetchData = async () => {
      try {
        const [usersRes, campaignsRes, activityRes] = await Promise.all([
          fetch(`${API_BASE}/api/v1/admin/users`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }).then((res) => res.json()),

          fetch(`${API_BASE}/api/v1/all_campaign`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }).then((res) => res.json()),

          fetch(`${API_BASE}/api/v1/admin/audit-logs`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }).then((res) => res.json()),
        ]);

        const users = Array.isArray(usersRes?.data) ? usersRes.data : [];
        const campaigns = Array.isArray(campaignsRes?.data) ? campaignsRes.data : [];
        const auditLogs = Array.isArray(activityRes?.data) ? activityRes.data : [];

        const activeUsers = users.filter((u: UserData) => u.isActive).length;
        const pausedUsers = users.length - activeUsers;
        const activeCampaigns = campaigns.filter((c: CampaignItem) => c.status === "active").length;
        const pausedCampaigns = campaigns.filter((c: CampaignItem) => c.status === "paused").length;

        setStats((prev) => ({
          ...prev,
          totalUsers: users.length,
          activeUsers,
          pausedUsers,
          totalCampaigns: campaigns.length,
          activeCampaigns,
          pausedCampaigns,
          recentActivity: auditLogs,
        }));
      } catch (error) {
        console.error("Dashboard stats error:", error);
      }
    };

    fetchData();
  }, [router]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage users, campaigns, and review registrations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Export Data
          </Button>
          <Button size="sm" className="bg-red-600 hover:bg-red-700">
            System Settings
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary" className="text-xs">
                {stats.activeUsers} Active
              </Badge>
              <Badge variant="outline" className="text-xs">
                {stats.pausedUsers} Paused
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
            <FileText className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingRegistrations}</div>
            <p className="text-xs text-gray-600 mt-2">Registration documents awaiting review</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
            <Campaign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCampaigns}</div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                {stats.activeCampaigns} Active
              </Badge>
              <Badge variant="outline" className="text-xs">
                {stats.pausedCampaigns} Paused
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Healthy</div>
            <p className="text-xs text-gray-600 mt-2">All systems operational</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/registration-review">
              <Button variant="outline" className="h-20 flex-col gap-2 bg-red-100 hover:bg-red-300 w-full">
                <FileText className="h-5 w-5" />
                Review Registrations
              </Button>
            </Link>
            <Link href="/user-management">
              <Button variant="outline" className="h-20 flex-col gap-2 bg-red-100 hover:bg-red-300 w-full">
                <Users className="h-5 w-5" />
                Manage Users
              </Button>
            </Link>
            <Link href="/campaign-management">
              <Button variant="outline" className="h-20 flex-col gap-2 bg-red-100 hover:bg-red-300 w-full">
                <Campaign className="h-5 w-5" />
                Manage Campaigns
              </Button>
            </Link>
            <Button variant="outline" className="h-20 flex-col gap-2 bg-red-100 hover:bg-red-300">
              <AlertTriangle className="h-5 w-5" />
              System Alerts
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest administrative actions and events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentActivity.length > 0 ? (
                stats.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full ${activity.type === "registration"
                          ? "bg-orange-500"
                          : activity.type === "campaign"
                            ? "bg-blue-500"
                            : "bg-green-500"
                          }`}
                      />
                      <div>
                        <p className="font-medium text-sm">{activity.user}</p>
                        <p className="text-xs text-gray-600">{activity.action}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No recent activity found.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Action Required
            </CardTitle>
            <CardDescription>Items that need immediate attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <div>
                  <p className="font-medium text-sm">Registration Reviews</p>
                  <p className="text-xs text-gray-600">{stats.pendingRegistrations} documents pending</p>
                </div>
                <Link href="/admin/registrations">
                  <Button size="sm" variant="outline">
                    Review
                  </Button>
                </Link>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div>
                  <p className="font-medium text-sm">System Backup</p>
                  <p className="text-xs text-gray-600">Last backup: 2 days ago</p>
                </div>
                <Button size="sm" variant="outline">
                  Backup Now
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}