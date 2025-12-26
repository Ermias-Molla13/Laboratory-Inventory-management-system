"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import apiClient from "@/lib/apiClient";

interface Equipment {
  id: number;
  name: string;
}

interface Chemical {
  id: number;
  name: string;
}

interface Supplier {
  id: number;
  name: string;
}

export default function TransactionFormPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const isEdit = !!id;

  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [chemicalList, setChemicalList] = useState<Chemical[]>([]);
  const [supplierList, setSupplierList] = useState<Supplier[]>([]);

  const [equipmentId, setEquipmentId] = useState<number | "">("");
  const [chemicalId, setChemicalId] = useState<number | "">("");
  const [supplierId, setSupplierId] = useState<number | "">("");
  const [quantity, setQuantity] = useState<number | "">("");
  const [transactionType, setTransactionType] = useState<
    "IN" | "OUT" | "ADJUSTMENT"
  >("IN");
  const [transactionDate, setTransactionDate] = useState("");
  const [notes, setNotes] = useState("");

  // Fetch options
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [equipRes, chemRes, suppRes] = await Promise.all([
          apiClient.get("/api/equipment"),
          apiClient.get("/api/chemicals"),
          apiClient.get("/api/suppliers"),
        ]);
        setEquipmentList(equipRes.data || []);
        setChemicalList(chemRes.data || []);
        setSupplierList(suppRes.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  // Populate form in edit mode
  useEffect(() => {
    if (!isEdit) return;
    const fetchTransaction = async () => {
      try {
        const res = await apiClient.get(`/api/transactions/${id}`);
        const tx = res.data;
        setEquipmentId(tx.equipment?.id || "");
        setChemicalId(tx.chemical?.id || "");
        setSupplierId(tx.supplier?.id || "");
        setQuantity(tx.quantity || "");
        setTransactionType(tx.transactionType || "IN");
        setTransactionDate(tx.transactionDate?.split("T")[0] || "");
        setNotes(tx.notes || "");
      } catch (err) {
        console.error(err);
        alert("Failed to fetch transaction data");
      }
    };
    fetchTransaction();
  }, [id, isEdit]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !equipmentId ||
      !chemicalId ||
      !supplierId ||
      !quantity ||
      !transactionDate
    )
      return alert("Please fill in all required fields");

    const data = {
      equipmentId,
      chemicalId,
      supplierId,
      quantity: Number(quantity),
      transactionType,
      transactionDate,
      notes,
    };

    try {
      if (isEdit) {
        await apiClient.put(`/api/transactions/${id}`, data);
        alert("Transaction updated successfully!");
      } else {
        await apiClient.post("/api/transactions", data);
        alert("Transaction added successfully!");
      }
      router.push("/transactions");
    } catch (err) {
      console.error(err);
      alert("Failed to save transaction");
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-6 px-4 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/transactions">
            <ArrowLeft className="h-5 w-5 text-slate-700 hover:text-slate-900" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            {isEdit ? "Edit Transaction" : "Add Transaction"}
          </h1>
          <p className="text-slate-500">
            {isEdit
              ? "Update inventory movement"
              : "Record a new inventory movement"}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} noValidate>
        <Card className="shadow-lg border border-gray-200 bg-slate-50">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-blue-700">
              Transaction Details
            </CardTitle>
            <CardDescription className="text-sm text-slate-500">
              Fill in all details about the transaction.
            </CardDescription>
          </CardHeader>

          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Equipment */}
            <div className="flex flex-col space-y-1">
              <Label>Equipment</Label>
              <select
                value={equipmentId}
                onChange={(e) => setEquipmentId(Number(e.target.value) || "")}
                className="w-full rounded border border-gray-300 px-2 py-2 focus:border-blue-500 focus:ring focus:ring-blue-200"
                required
              >
                <option value="">Select equipment</option>
                {equipmentList.map((eq) => (
                  <option key={eq.id} value={eq.id}>
                    {eq.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Chemical */}
            <div className="flex flex-col space-y-1">
              <Label>Chemical</Label>
              <select
                value={chemicalId}
                onChange={(e) => setChemicalId(Number(e.target.value) || "")}
                className="w-full rounded border border-gray-300 px-2 py-2 focus:border-blue-500 focus:ring focus:ring-blue-200"
                required
              >
                <option value="">Select chemical</option>
                {chemicalList.map((chem) => (
                  <option key={chem.id} value={chem.id}>
                    {chem.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Supplier */}
            <div className="flex flex-col space-y-1">
              <Label>Supplier</Label>
              <select
                value={supplierId}
                onChange={(e) => setSupplierId(Number(e.target.value) || "")}
                className="w-full rounded border border-gray-300 px-2 py-2 focus:border-blue-500 focus:ring focus:ring-blue-200"
                required
              >
                <option value="">Select supplier</option>
                {supplierList.map((sup) => (
                  <option key={sup.id} value={sup.id}>
                    {sup.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Quantity */}
            <div className="flex flex-col space-y-1">
              <Label>Quantity</Label>
              <Input
                type="number"
                value={quantity}
                onChange={(e) =>
                  setQuantity(
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
                placeholder="e.g. 10"
                required
                className="border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
              />
            </div>

            {/* Transaction Type */}
            <div className="flex flex-col space-y-1">
              <Label>Transaction Type</Label>
              <select
                value={transactionType}
                onChange={(e) =>
                  setTransactionType(
                    e.target.value as "IN" | "OUT" | "ADJUSTMENT"
                  )
                }
                className="w-full rounded border border-gray-300 px-2 py-2 focus:border-blue-500 focus:ring focus:ring-blue-200"
                required
              >
                <option value="IN">IN</option>
                <option value="OUT">OUT</option>
                <option value="ADJUSTMENT">ADJUSTMENT</option>
              </select>
            </div>

            {/* Date */}
            <div className="flex flex-col space-y-1">
              <Label>Date</Label>
              <Input
                type="date"
                value={transactionDate}
                onChange={(e) => setTransactionDate(e.target.value)}
                required
                className="border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
              />
            </div>

            {/* Notes */}
            <div className="flex flex-col space-y-1 md:col-span-2">
              <Label>Notes</Label>
              <Input
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Optional notes"
                className="border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
              />
            </div>
          </CardContent>

          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline">
              <Link href="/transactions">Cancel</Link>
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-md" type="submit">
              {isEdit ? "Update Transaction" : "Save Transaction"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
