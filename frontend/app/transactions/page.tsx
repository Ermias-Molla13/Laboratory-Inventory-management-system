"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  Plus,
  Edit,
  Trash,
  ArrowDownLeft,
  ArrowUpRight,
  FileText,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import apiClient from "@/lib/apiClient";
import { useRouter } from "next/navigation";

/* ---------- Export Libraries ---------- */
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

/* -------------------- Types -------------------- */
interface EntityRef {
  id: number;
  name?: string;
}

interface Transaction {
  id: number;
  equipment?: EntityRef;
  chemical?: EntityRef;
  supplier?: EntityRef;
  quantity: number;
  transactionType: "IN" | "OUT" | "ADJUSTMENT";
  transactionDate: string;
  notes?: string;
}

/* -------------------- Page -------------------- */
export default function TransactionsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  /* ---------- Auth Guard ---------- */
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      router.replace("/login");
    } else {
      setToken(storedToken);
      setIsAuthChecked(true);
    }
  }, [router]);

  /* ---------- Fetch Transactions ---------- */
  const fetchTransactions = async (): Promise<Transaction[]> => {
    if (!token) return [];
    const res = await apiClient.get("/api/transactions", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data ?? [];
  };

  const {
    data: transactions = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["transactions"],
    queryFn: fetchTransactions,
    enabled: isAuthChecked,
  });

  /* ---------- Delete ---------- */
  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      apiClient.delete(`/api/transactions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["transactions"] }),
  });

  /* ---------- Helpers ---------- */
  const getName = (e?: EntityRef) => e?.name || "-";

  const filteredTransactions = transactions.filter((tx) => {
    const q = searchTerm.toLowerCase();
    return (
      getName(tx.equipment).toLowerCase().includes(q) ||
      getName(tx.chemical).toLowerCase().includes(q) ||
      getName(tx.supplier).toLowerCase().includes(q)
    );
  });

  /* ---------- Export PDF ---------- */
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Transaction Report", 14, 15);

    autoTable(doc, {
      startY: 20,
      head: [
        [
          "Equipment",
          "Chemical",
          "Supplier",
          "Quantity",
          "Type",
          "Date",
          "Notes",
        ],
      ],
      body: filteredTransactions.map((tx) => [
        getName(tx.equipment),
        getName(tx.chemical),
        getName(tx.supplier),
        tx.quantity,
        tx.transactionType,
        new Date(tx.transactionDate).toLocaleDateString(),
        tx.notes || "-",
      ]),
    });

    doc.save("transactions.pdf");
  };

  /* ---------- Export Excel ---------- */
  const handleExportExcel = () => {
    const data = filteredTransactions.map((tx) => ({
      Equipment: getName(tx.equipment),
      Chemical: getName(tx.chemical),
      Supplier: getName(tx.supplier),
      Quantity: tx.quantity,
      Type: tx.transactionType,
      Date: new Date(tx.transactionDate).toLocaleDateString(),
      Notes: tx.notes || "-",
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");

    const buffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([buffer], {
      type: "application/octet-stream",
    });

    saveAs(blob, "transactions.xlsx");
  };

  /* ---------- UI States ---------- */
  if (!isAuthChecked) return null;
  if (isLoading) return <p>Loading transactions...</p>;
  if (error instanceof Error) return <p>Error: {error.message}</p>;

  /* -------------------- UI -------------------- */
  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-bold">Transactions</h1>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="border-blue-200 text-blue-700 hover:bg-blue-50"
              onClick={handleExportPDF}
            >
              <FileText className="h-4 w-4 mr-2" />
              Export PDF
            </Button>

            <Button
              variant="outline"
              className="border-green-200 text-green-700 hover:bg-green-50"
              onClick={handleExportExcel}
            >
              <FileText className="h-4 w-4 mr-2" />
              Export Excel
            </Button>

            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white shadow"
              onClick={() => router.push("/transactions/new")}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Transaction
            </Button>
          </div>
        </div>

        {/* Table */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Transaction History</CardTitle>

              <div className="relative w-64">
                <Search className="absolute left-2 top-2 h-4 w-4 text-gray-400" />
                <Input
                  className="pl-8"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Equipment</TableHead>
                  <TableHead>Chemical</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredTransactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell>{getName(tx.equipment)}</TableCell>
                    <TableCell>{getName(tx.chemical)}</TableCell>
                    <TableCell>{getName(tx.supplier)}</TableCell>
                    <TableCell>{tx.quantity}</TableCell>

                    <TableCell>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${
                          tx.transactionType === "IN"
                            ? "bg-green-100 text-green-700"
                            : "bg-orange-100 text-orange-700"
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

                    <TableCell>
                      {new Date(tx.transactionDate).toLocaleDateString()}
                    </TableCell>

                    <TableCell>{tx.notes || "-"}</TableCell>

                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            router.push(`/transactions/new?id=${tx.id}`)
                          }
                        >
                          <Edit className="h-4 w-4 text-blue-600" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            if (confirm("Delete this transaction?")) {
                              deleteMutation.mutate(tx.id);
                            }
                          }}
                        >
                          <Trash className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
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
