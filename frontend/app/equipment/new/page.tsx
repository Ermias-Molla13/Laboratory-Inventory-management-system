"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import apiClient from "@/lib/apiClient";
import { useQueryClient } from "@tanstack/react-query";

export default function NewEquipmentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const id = searchParams.get("id");
  const isEdit = !!id;

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [status, setStatus] = useState<
    "ACTIVE" | "UNDER_MAINTENANCE" | "DAMAGED" | "RETIRED"
  >("ACTIVE");
  const [quantity, setQuantity] = useState<number | "">("");

  useEffect(() => {
    if (isEdit) {
      setName(searchParams.get("name") || "");
      setCategory(searchParams.get("category") || "");
      setSerialNumber(searchParams.get("serialNumber") || "");
      setStatus((searchParams.get("status") as any) || "ACTIVE");
      setQuantity(Number(searchParams.get("quantity")) || 1);
    }
  }, [isEdit, searchParams]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.replace("/login");
  }, [router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim()) return alert("Equipment name is required");
    if (!quantity || quantity <= 0)
      return alert("Quantity must be greater than 0");

    const equipmentData = {
      name,
      category,
      serialNumber,
      status,
      quantity: Number(quantity),
    };

    try {
      let response;
      if (isEdit) {
        response = await apiClient.put(`/api/equipment/${id}`, equipmentData);
      } else {
        response = await apiClient.post("/api/equipment", equipmentData);
      }

      const savedEquipment = response.data;

      // ✅ Unified cache update
      queryClient.setQueryData(["equipments"], (oldData: any) => {
        if (!oldData) return [savedEquipment];
        // If update, replace the item
        const exists = oldData.find((eq: any) => eq.id === savedEquipment.id);
        if (exists) {
          return oldData.map((eq: any) =>
            eq.id === savedEquipment.id ? savedEquipment : eq
          );
        }
        // If add, append the new item
        return [...oldData, savedEquipment];
      });

      alert(
        isEdit
          ? "Equipment updated successfully!"
          : "Equipment added successfully!"
      );
      router.push("/equipment");
    } catch (err: any) {
      console.error(err);
      alert("Failed to save equipment. See console for details.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="hover:bg-blue-50"
          >
            <Link href="/equipment">
              <ArrowLeft className="h-4 w-4 text-blue-600" />
            </Link>
          </Button>

          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              {isEdit ? "Edit Equipment" : "Add Equipment"}
            </h1>
            <p className="text-slate-500">
              {isEdit
                ? "Update equipment information"
                : "Register new laboratory equipment"}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <Card className="border-blue-100 shadow-sm">
            <CardHeader>
              <CardTitle className="text-blue-800">Equipment Details</CardTitle>
              <CardDescription>
                Enter specifications and current status.
              </CardDescription>
            </CardHeader>

            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-700">
                  Equipment Name
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Microscope"
                  className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category" className="text-slate-700">
                  Category
                </Label>
                <Input
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Optical"
                  className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="serialNumber" className="text-slate-700">
                  Serial Number
                </Label>
                <Input
                  id="serialNumber"
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                  placeholder="SN-12345"
                  className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity" className="text-slate-700">
                  Quantity
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                  placeholder="e.g. 5"
                  className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="status" className="text-slate-700">
                  Equipment Status
                </Label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full rounded-md border border-blue-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="UNDER_MAINTENANCE">Under Maintenance</option>
                  <option value="DAMAGED">Damaged</option>
                  <option value="RETIRED">Retired</option>
                </select>
              </div>
            </CardContent>

            <CardFooter className="flex justify-end gap-3 border-t border-blue-100">
              <Button
                variant="outline"
                asChild
                className="border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                <Link href="/equipment">Cancel</Link>
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white shadow"
              >
                {isEdit ? "Update Equipment" : "Save Equipment"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  );
}
