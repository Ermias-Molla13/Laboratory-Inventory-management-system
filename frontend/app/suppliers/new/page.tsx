// app/suppliers/new/page.tsx or app/suppliers/edit/[id]/page.tsx
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
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import apiClient from "@/lib/apiClient";

export default function SupplierFormPage({
  params,
}: {
  params?: { id: string };
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = params?.id || searchParams.get("id"); // detect edit mode

  // Individual state for each field (like Chemical page)
  const [name, setName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");

  const [loading, setLoading] = useState(!!id);

  // Fetch supplier if editing
  useEffect(() => {
    if (!id) return;

    const fetchSupplier = async () => {
      try {
        const res = await apiClient.get(`/api/suppliers/${id}`);
        const supplier = res.data;
        setName(supplier.name || "");
        setContactPerson(supplier.contactPerson || "");
        setEmail(supplier.email || "");
        setPhoneNumber(supplier.phoneNumber || "");
        setAddress(supplier.address || "");
      } catch (err) {
        console.error(err);
        alert("Failed to fetch supplier data");
      } finally {
        setLoading(false);
      }
    };
    fetchSupplier();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim()) return alert("Company name is required");

    const supplierData = {
      name,
      contactPerson,
      email,
      phoneNumber,
      address,
    };

    try {
      if (id) {
        await apiClient.put(`/api/suppliers/${id}`, supplierData);
        alert("Supplier updated successfully!");
      } else {
        await apiClient.post("/api/suppliers", supplierData);
        alert("Supplier added successfully!");
      }
      router.push("/suppliers");
    } catch (err) {
      console.error(err);
      alert("Failed to save supplier");
    }
  };

  if (loading) return <p>Loading supplier data...</p>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/suppliers">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {id ? "Edit Supplier" : "Add Supplier"}
          </h1>
          <p className="text-muted-foreground">
            {id ? "Update supplier information." : "Register a new supplier."}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Supplier Details</CardTitle>
            <CardDescription>
              Enter the supplier contact information.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Company Name</Label>
              <Input
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Contact Person</Label>
              <Input
                name="contactPerson"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Phone</Label>
              <Input
                name="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>

            <div className="space-y-2 col-span-2">
              <Label>Address</Label>
              <Input
                name="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </CardContent>

          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" asChild>
              <Link href="/suppliers">Cancel</Link>
            </Button>
            <Button type="submit">
              {id ? "Update Supplier" : "Save Supplier"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
