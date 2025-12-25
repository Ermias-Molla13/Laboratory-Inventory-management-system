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

export default function NewEquipmentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id"); // if editing
  const isEdit = !!id;

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [status, setStatus] = useState<
    "ACTIVE" | "UNDER_MAINTENANCE" | "DAMAGED" | "RETIRED"
  >("ACTIVE");
  const [quantity, setQuantity] = useState<number | "">("");
//   const [supplier, setSupplier] = useState("");

  // Populate form if editing
  useEffect(() => {
    if (isEdit) {
      setName(searchParams.get("name") || "");
      setCategory(searchParams.get("category") || "");
      setSerialNumber(searchParams.get("serialNumber") || "");
      setStatus((searchParams.get("status") as any) || "ACTIVE");
      setQuantity(Number(searchParams.get("quantity")) || 1);
    //   setSupplier(searchParams.get("supplier") || "");
    }
  }, [isEdit, searchParams]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim()) return alert("Equipment name is required");
    if (!quantity || quantity <= 0)
      return alert("Quantity must be greater than 0");

    // Wrap supplier as object for backend compatibility
    const equipmentData = {
      name,
      category,
      serialNumber,
      status,
      quantity: Number(quantity),
    //   supplier: supplier ? { id: 0, name: supplier } : null,
    };

    try {
      if (isEdit) {
        await apiClient.put(`/api/equipment/${id}`, equipmentData);
        alert("Equipment updated successfully!");
      } else {
        await apiClient.post("/api/equipment", equipmentData);
        alert("Equipment added successfully!");
      }
      router.push("/equipment");
    } catch (err: any) {
      console.error(err);
      alert("Failed to save equipment. See console for details.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/equipment">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isEdit ? "Edit Equipment" : "Add Equipment"}
          </h1>
          <p className="text-muted-foreground">
            {isEdit
              ? "Update equipment information"
              : "Register a new equipment in the inventory"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <Card>
          <CardHeader>
            <CardTitle>Equipment Details</CardTitle>
            <CardDescription>
              Enter the specifications of the equipment.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Microscope"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Optical"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="serialNumber">Serial Number</Label>
              <Input
                id="serialNumber"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                placeholder="e.g. SN12345"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Input
                id="status"
                value={status}
                onChange={(e) =>
                  setStatus(
                    e.target.value as "ACTIVE" | "UNDER_MAINTENANCE" | "DAMAGED"|"RETIRED"
                  )
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
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
              />
            </div>

            {/* <div className="space-y-2">
              <Label htmlFor="supplier">Supplier</Label>
              <Input
                id="supplier"
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                placeholder="e.g. Lab Supplies Co."
              />
            </div> */}
          </CardContent>

          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" asChild>
              <Link href="/equipment">Cancel</Link>
            </Button>
            <Button type="submit">
              {isEdit ? "Update Equipment" : "Save Equipment"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
