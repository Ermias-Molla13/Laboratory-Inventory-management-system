"use client";

import { useState,useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Download,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import apiClient from "@/lib/apiClient";
import { useRouter } from "next/navigation";

interface Transaction {
  id: number;
  equipment: { id: number; name: string };
  chemical: { id: number; name: string };
  supplier: { id: number; name: string };
  quantity: number;
  transactionType: "IN" | "OUT" | "ADJUSTMENT";
  transactionDate: string;
  notes?: string;
}

// Fetch transactions from backend
const fetchTransactions = async (): Promise<Transaction[]> => {
  const res = await apiClient.get("/api/transactions");
  return res.data || [];
};

export default function TransactionsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: transactions = [],
    isLoading,
    error,
  } = useQuery<Transaction[]>({
    queryKey: ["transactions"],
    queryFn: fetchTransactions,
  });

  useEffect(() => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.replace("/login");
        return;
      }})

  if (isLoading) return <p>Loading transactions...</p>;
  if (error instanceof Error) return <p>Error: {error.message}</p>;

  const filteredTransactions = transactions.filter(
    (tx) =>
      tx.chemical?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.equipment?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.supplier?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Transactions
            </h1>
            <p className="text-slate-500">
              View history of inventory movements.
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {/* Add Transaction Button */}
            <Button
              className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700"
              onClick={() => router.push("/transactions/new")}
            >
              <Plus className="h-4 w-4" /> Add Transaction
            </Button>

            {/* Export Report */}
            <Button className="flex items-center gap-2 border-blue-400 text-blue-700 hover:bg-blue-50">
              <Download className="h-4 w-4" /> Export Report
            </Button>
          </div>
        </div>

        <Card className="shadow-lg border border-blue-100">
          <CardHeader className="pb-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <CardTitle className="text-lg font-semibold text-blue-800">
              Transaction History
            </CardTitle>

            <div className="relative flex-1 max-w-sm mt-4 md:mt-0">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                type="search"
                placeholder="Search transactions..."
                className="pl-8 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>

          <CardContent className="overflow-x-auto">
            <Table className="min-w-full border-collapse">
              <TableHeader>
                <TableRow className="bg-blue-50 text-blue-700">
                  <TableHead>Equipment</TableHead>
                  <TableHead>Chemical</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredTransactions.map((tx) => (
                  <TableRow
                    key={tx.id}
                    className="hover:bg-blue-50 transition-colors duration-150"
                  >
                    <TableCell className="font-medium text-slate-800">
                      {tx.equipment?.name || "-"}
                    </TableCell>
                    <TableCell className="text-slate-700">
                      {tx.chemical?.name || "-"}
                    </TableCell>
                    <TableCell className="text-slate-700">
                      {tx.supplier?.name || "-"}
                    </TableCell>
                    <TableCell className="text-center font-semibold text-slate-900">
                      {tx.quantity}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                          tx.transactionType === "IN"
                            ? "bg-green-100 text-green-800"
                            : "bg-orange-100 text-orange-800"
                        }`}
                      >
                        {tx.transactionType === "IN" ? (
                          <ArrowDownLeft className="h-3 w-3" />
                        ) : (
                          <ArrowUpRight className="h-3 w-3" />
                        )}
                        {tx.transactionType}
                      </span>
                    </TableCell>
                    <TableCell className="text-slate-500">
                      {tx.transactionDate}
                    </TableCell>
                    <TableCell className="text-slate-700">
                      {tx.notes || "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
