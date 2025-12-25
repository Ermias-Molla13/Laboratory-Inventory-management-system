"use client";

import { useState, useEffect } from "react";
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
import { useSearchParams, useRouter } from "next/navigation";

export default function NewChemicalPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const id = searchParams.get("id"); // If editing

  const [name, setName] = useState("");
  const [chemicalFormula, setChemicalFormula] = useState("");
  const [quantity, setQuantity] = useState<number | "">("");
  const [unit, setUnit] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [storageLocation, setStorageLocation] = useState("");

  // Populate form if editing
  useEffect(() => {
    if (id) {
      const fetchChemical = async () => {
        try {
          const res = await apiClient.get(`/api/chemicals/${id}`);
          const chem = res.data;
          setName(chem.name || "");
          setChemicalFormula(chem.chemicalFormula || "");
          setQuantity(chem.quantity || "");
          setUnit(chem.unit || "");
          setExpiryDate(chem.expiryDate || "");
          setStorageLocation(chem.storageLocation || "");
        } catch (err) {
          console.error("Failed to fetch chemical:", err);
        }
      };
      fetchChemical();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim()) return alert("Chemical name is required");
    if (!chemicalFormula.trim()) return alert("Chemical formula is required");
    if (!quantity) return alert("Quantity is required");
    if (!unit.trim()) return alert("Unit is required");
    if (!expiryDate.trim()) return alert("Expiry date is required");
    if (!storageLocation.trim()) return alert("Storage location is required");

    const chemicalData = {
      name,
      chemicalFormula,
      quantity: Number(quantity),
      unit,
      expiryDate,
      storageLocation,
    };

    try {
      if (id) {
        // Update chemical
        await apiClient.put(`/api/chemicals/${id}`, chemicalData);
        alert("Chemical updated successfully!");
      } else {
        // Add new chemical
        await apiClient.post("/api/chemicals", chemicalData);
        alert("Chemical added successfully!");
      }
      router.push("/chemicals");
    } catch (err) {
      console.error(err);
      alert("Failed to save chemical");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/chemicals">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {id ? "Edit Chemical" : "Add Chemical"}
          </h1>
          <p className="text-muted-foreground">
            {id
              ? "Update chemical information"
              : "Register a new chemical in the inventory"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <Card>
          <CardHeader>
            <CardTitle>Chemical Details</CardTitle>
            <CardDescription>
              Enter the specifications of the chemical.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Chemical Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sulfuric Acid"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="chemicalFormula">Chemical Formula</Label>
              <Input
                id="chemicalFormula"
                value={chemicalFormula}
                onChange={(e) => setChemicalFormula(e.target.value)}
                placeholder="e.g. H2SO4"
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
                placeholder="e.g. 25.5"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <Input
                id="unit"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="e.g. L"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input
                id="expiryDate"
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="storageLocation">Storage Location</Label>
              <Input
                id="storageLocation"
                value={storageLocation}
                onChange={(e) => setStorageLocation(e.target.value)}
                placeholder="e.g. Chemical Storage Room A"
              />
            </div>
          </CardContent>

          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" asChild>
              <Link href="/chemicals">Cancel</Link>
            </Button>

            <Button className="text-orange-700" type="submit">
              {id ? "Update Chemical" : "Save Chemical"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
