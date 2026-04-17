"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import apiClient from "@/lib/api-client";
import { toast } from "sonner";
import Link from "next/link";
import {
  LuShoppingCart as ShoppingCart,
  LuUsers as Users,
  LuPackage as Package,
  LuTrendingUp as TrendingUp,
  LuArrowRight as ArrowRight,
  LuPlus as Plus,
  LuEye as Eye,
} from "react-icons/lu";

interface DashboardStats {
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  totalRevenue: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    totalRevenue: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [ordersRes, customersRes, productsRes, allOrdersRes] =
          await Promise.all([
            apiClient.get("/api/orders/admin/all?limit=1"),
            apiClient.get("/api/customers?limit=1"),
            apiClient.get("/api/products?limit=1"),
            apiClient.get("/api/orders/admin/all?limit=1000"),
          ]);

        const totalRevenue = allOrdersRes.data.data.reduce(
          (sum: number, order: any) => sum + order.total,
          0,
        );

        setStats({
          totalOrders: ordersRes.data.pagination.total,
          totalCustomers: customersRes.data.pagination.total,
          totalProducts: productsRes.data.pagination.total,
          totalRevenue,
        });
      } catch {
        toast.error("Failed to load dashboard stats");
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    {
      label: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: "bg-blue-50 text-blue-600",
      iconBg: "bg-blue-100",
    },
    {
      label: "Total Customers",
      value: stats.totalCustomers,
      icon: Users,
      color: "bg-green-50 text-green-600",
      iconBg: "bg-green-100",
    },
    {
      label: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      color: "bg-purple-50 text-purple-600",
      iconBg: "bg-purple-100",
    },
    {
      label: "Total Revenue",
      value: `MAD ${stats.totalRevenue.toFixed(2)}`,
      icon: TrendingUp,
      color: "bg-amber-50 text-amber-600",
      iconBg: "bg-amber-100",
    },
  ];

  if (isLoading) {
    return (
      <div className="p-6 sm:p-8 space-y-6">
        <div className="animate-shimmer h-8 rounded w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-shimmer h-28 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here&apos;s your store overview.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 stagger-children">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.label}
              className="border-border/50 hover-lift transition-all"
            >
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-muted-foreground">
                    {stat.label}
                  </span>
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${stat.iconBg}`}
                  >
                    <Icon className={`w-4 h-4 ${stat.color.split(" ")[1]}`} />
                  </div>
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="font-serif text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/admin/products">
              <Button
                className="w-full justify-between rounded-xl mb-3"
                variant="outline"
              >
                <span className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Manage Products
                </span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/admin/orders">
              <Button
                className="w-full justify-between rounded-xl mb-3"
                variant="outline"
              >
                <span className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  View All Orders
                </span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/admin/customers">
              <Button
                className="w-full justify-between rounded-xl mb-3"
                variant="outline"
              >
                <span className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  View Customers
                </span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="font-serif text-lg">Store Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between p-3 rounded-xl bg-muted/50">
              <span className="text-muted-foreground">Store Name</span>
              <span className="font-medium">Flowers Your Way</span>
            </div>
            <div className="flex justify-between p-3 rounded-xl bg-muted/50">
              <span className="text-muted-foreground">Status</span>
              <span className="font-medium text-green-600 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                Active
              </span>
            </div>

            <div className="flex justify-between p-3 rounded-xl bg-muted/50">
              <span className="text-muted-foreground">Flat Shipping</span>
              <span className="font-medium">MAD 10.00</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
