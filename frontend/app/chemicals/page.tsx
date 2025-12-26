"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import apiClient from "@/lib/apiClient";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Search, Trash, Edit, FileText } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Chemical {
  id: number;
  name: string;
  chemicalFormula: string;
  unit?: "ML" | "L";
  quantity: number;
  storageLocation?: string;
  expiryDate?: string;
}
const PAGE_TITLE = "Chemicals Inventory Page";

// Fetch chemicals
const fetchChemicals = async (): Promise<Chemical[]> => {
  try {
    const res = await apiClient.get("/api/chemicals");
    return res.data || [];
  } catch (err) {
    console.error(err);
    return [];
  }
};


export default function ChemicalsPage() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: chemicals = [],
    isLoading,
    error,
  } = useQuery<Chemical[]>({
    queryKey: ["chemicals"],
    queryFn: fetchChemicals,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiClient.delete(`/api/chemicals/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["chemicals"] }),
  });

  if (isLoading) return <p>Loading chemicals...</p>;
  if (error instanceof Error) return <p>Error: {error.message}</p>;

  const filteredChemicals = chemicals.filter((chem) =>
    chem.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Chemicals</h1>
          <p className="text-muted-foreground">
            Manage your laboratory chemical inventory.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" /> Export
          </Button>
          <Button asChild>
            <Link href="/chemicals/new">
              <Plus className="h-4 w-4 mr-2" /> Add Chemical
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium text-blue-800">
            Inventory List
          </CardTitle>
          <div className="flex items-center gap-2 pt-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search chemicals..."
                className="pl-8"
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
                <TableHead>Name</TableHead>
                <TableHead>Formula</TableHead>
                <TableHead className="hidden md:table-cell">Unit</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead className="hidden md:table-cell">Location</TableHead>
                <TableHead>Expiry</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredChemicals.map((chem) => (
                <TableRow key={chem.id}>
                  <TableCell className="font-medium">{chem.name}</TableCell>
                  <TableCell>{chem.chemicalFormula}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {chem.unit || "-"}
                  </TableCell>
                  <TableCell>{chem.quantity}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {chem.storageLocation || "-"}
                  </TableCell>
                  <TableCell>{chem.expiryDate || "-"}</TableCell>
                  <TableCell className="text-right flex justify-end gap-2">
                    {/* Edit: navigate to form with query param */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        router.push(
                          `/chemicals/new?id=${
                            chem.id
                          }&name=${encodeURIComponent(
                            chem.name
                          )}&formula=${encodeURIComponent(
                            chem.chemicalFormula
                          )}&quantity=${chem.quantity}&unit=${
                            chem.unit
                          }&location=${encodeURIComponent(
                            chem.storageLocation || ""
                          )}&expiry=${chem.expiryDate}`
                        )
                      }
                    >
                      <Edit className="h-4 w-4 text-blue-600" />
                      <span className="sr-only">Edit</span>
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        if (confirm(`Delete "${chem.name}"?`)) {
                          deleteMutation.mutate(chem.id);
                        }
                      }}
                    >
                      <Trash className="h-4 w-4 text-red-600" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
