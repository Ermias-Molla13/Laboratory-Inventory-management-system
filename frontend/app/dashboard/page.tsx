"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FlaskConical,
  Microscope,
  Truck,
  AlertTriangle,
  ArrowRight,
  Plus,
} from "lucide-react";
import Link from "next/link";

interface Stat {
  title: string;
  value: number | string;
  description: string;
  icon: React.ElementType;
  color?: string;
}

interface Transaction {
  id: number;
  chemicalName: string;
  type: string;
  quantity: number;
  timestamp: string;
}

interface StockItem {
  id: number;
  name: string;
  quantity: number;
  minQuantity: number;
  expiryDate?: string; // ISO date string
  isLowStock?: boolean;
  isExpired?: boolean;
}

export default function Dashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<Stat[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [dashboardItems, setDashboardItems] = useState<StockItem[]>([]);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://localhost:8081";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }

    async function fetchDashboardData() {
      try {
        // Dashboard stats
        const statsRes = await axios.get(`${API_BASE}/api/dashboard/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats([
          {
            title: "Total Chemicals",
            value: statsRes.data.totalChemicals ?? 0,
            icon: FlaskConical,
            description: "In stock",
          },
          {
            title: "Equipment Items",
            value: statsRes.data.equipmentItems ?? 0,
            icon: Microscope,
            description: "Active units",
          },
          {
            title: "Low Stock Alerts",
            // In this we solve some error low stock alert is not visible before 
            value: statsRes.data.lowChemicalStock + statsRes.data.lowEquipmentStock,
            icon: AlertTriangle,
            description: "Items require reordering",
            color: "text-destructive",
          },
          {
            title: "Active Suppliers",
            value: statsRes.data.activeSuppliers ?? 0,
            icon: Truck,
            description: "Registered partners",
          },
        ]);

        // Recent transactions
        const txRes = await axios.get(
          `${API_BASE}/api/dashboard/transactions/recent`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTransactions(Array.isArray(txRes.data) ? txRes.data : []);

        // Low stock items (existing endpoint)
       const [equipmentRes, chemicalRes] = await Promise.all([
         axios.get(`${API_BASE}/api/dashboard/equipment/low-stock`, {
           headers: { Authorization: `Bearer ${token}` },
         }),
         axios.get(`${API_BASE}/api/dashboard/chemicals/low-stock`, {
           headers: { Authorization: `Bearer ${token}` },
         }),
       ]);
         const lowStockData: StockItem[] = [
           ...(Array.isArray(equipmentRes.data) ? equipmentRes.data : []),
           ...(Array.isArray(chemicalRes.data) ? chemicalRes.data : []),
         ];

        const now = new Date();

        // Include expired items even if quantity > minQuantity
        const filteredItems = lowStockData.map((item) => ({
          ...item,
          isExpired: item.expiryDate ? new Date(item.expiryDate) < now : false,
          isLowStock: item.quantity < item.minQuantity,
        }));

        // Sort: expired first
        filteredItems.sort((a, b) => {
          if (a.isExpired && !b.isExpired) return -1;
          if (!a.isExpired && b.isExpired) return 1;
          return 0;
        });

        setDashboardItems(filteredItems);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboardData();
  }, [router, API_BASE]);

  if (isLoading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin" />
          <p className="text-slate-600 font-medium animate-pulse">
            Loading dashboard...
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent tracking-tight">
            Dashboard
          </h1>
          <p className="text-base text-slate-600 font-medium">
            Welcome back, Admin. Here is your laboratory inventory overview.
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            asChild
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            <Link href="/chemicals/new">
              <Plus className="h-4 w-4 mr-2" /> Add Chemical
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="border-2 border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 bg-transparent"
          >
            <Link href="/transactions">View Reports</Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="relative border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
              <CardTitle className="text-sm font-semibold text-slate-600">
                {stat.title}
              </CardTitle>
              <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center shadow-md">
                <stat.icon
                  className={`h-5 w-5 ${
                    stat.color ? stat.color : "text-blue-600"
                  }`}
                />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <p className="text-sm text-slate-500 mt-2">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-7">
        {/* Recent Transactions */}
        <Card className="lg:col-span-4 border-0 bg-white/90 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500">
          <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-white to-blue-50/30">
            <CardTitle className="text-xl font-bold text-slate-800">
              Recent Transactions
            </CardTitle>
            <CardDescription className="text-slate-600">
              Latest chemical inventory movements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-6">
            {transactions.length ? (
              transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between rounded-xl border border-slate-100 bg-gradient-to-r from-white to-slate-50 px-4 py-3"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center shadow-sm">
                      <FlaskConical className="h-5 w-5 text-blue-600" />
                    </div>
                    <span
                      className={`absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold text-white
      ${
        tx.type === "IN"
          ? "bg-green-600"
          : tx.type === "OUT"
          ? "bg-red-600"
          : "bg-slate-500"
      }`}
                    >
                      {tx.type}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {tx.type}
                      </p>
                      <p className="text-xs text-slate-500">
                        Qty {tx.quantity}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-800">
                      {tx.quantity}
                    </p>
                    <p className="text-xs text-slate-500">
                      {new Date(tx.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-center py-8 text-slate-500">
                No transactions found.
              </p>
            )}
            <Button
              asChild
              variant="ghost"
              className="w-full text-blue-600 font-semibold mt-4"
            >
              <Link href="/transactions">
                View All Transactions
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Low Stock & Expired Items */}
        <Card className="lg:col-span-3 border-0 bg-white/90 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden">
          <CardHeader className="border-b border-red-100 bg-gradient-to-r from-white to-red-50/30 relative z-10">
            <CardTitle className="text-xl font-bold text-red-600 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 animate-pulse" />
              Low Stock & Expired Items
            </CardTitle>
            <CardDescription className="text-slate-600">
              Items that require attention
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-6 relative z-10">
            {dashboardItems.length ? (
              dashboardItems.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between rounded-xl border-2 px-3 py-3 transform hover:scale-[1.02] transition-all duration-300 group ${
                    item.isLowStock
                      ? "border-red-200 bg-red-50"
                      : item.isExpired
                      ? "border-yellow-200 bg-yellow-50"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <AlertTriangle
                      className={`h-5 w-5 animate-pulse ${
                        item.isLowStock
                          ? "text-red-600"
                          : item.isExpired
                          ? "text-yellow-600"
                          : "text-gray-400"
                      }`}
                    />
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {item.name}
                      </p>
                      <p className="text-xs text-slate-600 font-medium">
                        Qty {item.quantity} (Min {item.minQuantity}){" "}
                        {item.isExpired
                          ? `• Expired: ${new Date(
                              item.expiryDate!
                            ).toLocaleDateString()}`
                          : ""}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className={`border-2 ${
                      item.isLowStock
                        ? "border-red-300 text-red-600 hover:bg-red-100"
                        : item.isExpired
                        ? "border-yellow-300 text-yellow-600 hover:bg-yellow-100"
                        : ""
                    }`}
                  >
                    Action
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-center py-8 text-slate-600">
                No low stock or expired items
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
