"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Download, Plus, Trash2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  AddProductSchema,
  ProductCategorySchema,
  productCategorySchema,
} from "@/lib/zod";
import { LoadingButton } from "@/components/loading-button";
import { useBulkAddProducts } from "@/hooks/use-products";

export type BulkItem = AddProductSchema & { id: string };

export default function BulkAddPage() {
  const { mutateAsync: bulkAddProducts } = useBulkAddProducts();
  const [items, setItems] = useState<BulkItem[]>([
    {
      id: uuidv4(),
      name: "",
      sku: "",
      category: "Others",
      quantity: 0,
      price: 0,
      storageLocation: "",
      reorderLevel: 0,
      supplier: "",
      description: "",
    },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addRow = () => {
    const newItem: BulkItem = {
      id: uuidv4(),
      name: "",
      sku: "",
      category: "Others",
      quantity: 0,
      price: 0,
      storageLocation: "",
      reorderLevel: 0,
      supplier: "",
      description: "",
    };
    setItems([...items, newItem]);
  };

  const removeRow = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const updateItem = (
    id: string,
    field: keyof BulkItem,
    value: string | number
  ) => {
    setItems(
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]:
                field === "quantity" ||
                field === "price" ||
                field === "reorderLevel"
                  ? Number(value)
                  : value,
            }
          : item
      )
    );
  };

  const handleCSVImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const csv = e.target?.result as string;
      const lines = csv.split("\n");
      const headers = lines[0].split(",").map((h) => h.trim());

      const importedItems: BulkItem[] = [];
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(",").map((v) => v.trim());
        if (values.length >= headers.length && values[0]) {
          const item: BulkItem = {
            id: Date.now().toString() + i,
            name: values[0] || "",
            sku: values[1] || "",
            category: (values[2] as ProductCategorySchema) || "Others",
            quantity: Number(values[3]) || 0,
            price: Number(values[4]) || 0,
            storageLocation: values[5] || "",
            reorderLevel: Number(values[6]) || 0,
            supplier: values[7] || "",
            description: values[8] || "",
          };
          importedItems.push(item);
        }
      }

      if (importedItems.length > 0) {
        setItems(importedItems);
        toast.success("CSV imported successfully", {
          description: `Imported ${importedItems.length} items from CSV file.`,
        });
      }
    };
    reader.readAsText(file);
  };

  const downloadTemplate = () => {
    const headers = [
      "Name",
      "SKU",
      "Category",
      "Quantity",
      "Price",
      "Storage Location",
      "Reorder Level",
      "Supplier",
      "Description",
    ];
    const sampleData = [
      "Wireless Headphones,WH001,Electronics,50,79.99,A1-B2,10,TechSupplier,High-quality wireless headphones",
      "USB Cable,USB001,Electronics,100,12.99,A2-C1,20,CableSupplier,USB-C to USB-A cable",
    ];

    const csvContent = [headers.join(","), ...sampleData].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "inventory_template.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate items
    const validItems = items.filter((item) => item.name && item.sku);
    if (validItems.length === 0) {
      toast.error("No valid items", {
        description: "Please add at least one item with name and SKU.",
      });
      setIsSubmitting(false);
      return;
    }

    const { successful, failed } = await bulkAddProducts(validItems);
    if (failed.length > 0) {
      toast.error("Some items failed to add", {
        description: `Failed to add ${failed.length} items.`,
      });
    }

    toast.success("Items added successfully", {
      description: `Successfully added ${successful.length} items to inventory.`,
    });

    setIsSubmitting(false);
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold">Bulk Add Items</span>
        </div>
      </header>
      <main className="flex flex-1 flex-col p-4 md:p-8">
        <Card className="mx-auto w-full max-w-7xl">
          <CardHeader>
            <CardTitle>Bulk Add Inventory Items</CardTitle>
            <CardDescription>
              Add multiple items to your inventory at once, either manually or
              by importing a CSV file.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="manual" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="manual">Manual Entry</TabsTrigger>
                <TabsTrigger value="import">CSV Import</TabsTrigger>
              </TabsList>

              <TabsContent value="manual" className="space-y-4">
                <div className="flex justify-between items-center">
                  <Button onClick={addRow} size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Row
                  </Button>
                  <div className="text-sm text-muted-foreground">
                    {items.length} item{items.length !== 1 ? "s" : ""} ready to
                    add
                  </div>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[200px]">Name *</TableHead>
                          <TableHead className="w-[150px]">SKU *</TableHead>
                          <TableHead className="w-[120px]">Category</TableHead>
                          <TableHead className="w-[100px]">Quantity</TableHead>
                          <TableHead className="w-[100px]">Price</TableHead>
                          <TableHead className="w-[120px]">Location</TableHead>
                          <TableHead className="w-[100px]">Reorder</TableHead>
                          <TableHead className="w-[120px]">Supplier</TableHead>
                          <TableHead className="w-[200px]">
                            Description
                          </TableHead>
                          <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {items.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <Input
                                placeholder="Item name"
                                value={item.name}
                                onChange={(e) =>
                                  updateItem(item.id, "name", e.target.value)
                                }
                                required
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                placeholder="SKU/Barcode"
                                value={item.sku}
                                onChange={(e) =>
                                  updateItem(item.id, "sku", e.target.value)
                                }
                                required
                              />
                            </TableCell>
                            <TableCell>
                              <Select
                                value={item.category}
                                onValueChange={(value) =>
                                  updateItem(item.id, "category", value)
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Category" />
                                </SelectTrigger>
                                <SelectContent>
                                  {productCategorySchema.options.map(
                                    (category) => (
                                      <SelectItem
                                        key={category}
                                        value={category}
                                      >
                                        {category}
                                      </SelectItem>
                                    )
                                  )}
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                min="0"
                                placeholder="0"
                                value={item.quantity || ""}
                                onChange={(e) =>
                                  updateItem(
                                    item.id,
                                    "quantity",
                                    e.target.value
                                  )
                                }
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="0.00"
                                value={item.price || ""}
                                onChange={(e) =>
                                  updateItem(item.id, "price", e.target.value)
                                }
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                placeholder="Storage Location"
                                value={item.storageLocation}
                                onChange={(e) =>
                                  updateItem(
                                    item.id,
                                    "storageLocation",
                                    e.target.value
                                  )
                                }
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                min="0"
                                placeholder="0"
                                value={item.reorderLevel || ""}
                                onChange={(e) =>
                                  updateItem(
                                    item.id,
                                    "reorderLevel",
                                    e.target.value
                                  )
                                }
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                placeholder="Supplier"
                                value={item.supplier}
                                onChange={(e) =>
                                  updateItem(
                                    item.id,
                                    "supplier",
                                    e.target.value
                                  )
                                }
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                placeholder="Description"
                                value={item.description}
                                onChange={(e) =>
                                  updateItem(
                                    item.id,
                                    "description",
                                    e.target.value
                                  )
                                }
                              />
                            </TableCell>
                            <TableCell>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeRow(item.id)}
                                disabled={items.length === 1}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="flex flex-col gap-4 justify-between mt-6">
                    <Button variant="outline" asChild>
                      <Link href="/">Cancel</Link>
                    </Button>
                    <LoadingButton pending={isSubmitting} type="submit">
                      {`Add ${
                        items.filter((item) => item.name && item.sku).length
                      } Items`}
                    </LoadingButton>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="import" className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-end gap-4">
                    <div className="flex-1">
                      <Label htmlFor="csv-file">Import CSV File</Label>
                      <Input
                        id="csv-file"
                        type="file"
                        accept=".csv"
                        onChange={handleCSVImport}
                        className="mt-2"
                      />
                    </div>
                    <Button variant="outline" onClick={downloadTemplate}>
                      <Download className="mr-2 h-4 w-4" />
                      Download Template
                    </Button>
                  </div>

                  <div className="rounded-lg border p-4 bg-muted/50">
                    <h4 className="font-medium mb-2">
                      CSV Format Requirements:
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• First row should contain headers</li>
                      <li>• Required columns: Name, SKU</li>
                      <li>
                        • Optional columns: Category, Quantity, Price, Location,
                        Reorder Level, Supplier, Description
                      </li>
                      <li>• Use commas to separate values</li>
                      <li>
                        • Download the template above for the correct format
                      </li>
                    </ul>
                  </div>

                  {items.length > 0 && items[0].name && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Preview Imported Items</h4>
                        <div className="text-sm text-muted-foreground">
                          {items.length} item{items.length !== 1 ? "s" : ""}{" "}
                          imported
                        </div>
                      </div>

                      <div className="overflow-x-auto max-h-96">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Name</TableHead>
                              <TableHead>SKU</TableHead>
                              <TableHead>Category</TableHead>
                              <TableHead>Quantity</TableHead>
                              <TableHead>Price</TableHead>
                              <TableHead>Location</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {items.map((item) => (
                              <TableRow key={item.id}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{item.sku}</TableCell>
                                <TableCell>{item.category}</TableCell>
                                <TableCell>{item.quantity}</TableCell>
                                <TableCell>${item.price.toFixed(2)}</TableCell>
                                <TableCell>{item.storageLocation}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>

                      <div className="flex flex-col gap-4">
                        <LoadingButton
                          pending={isSubmitting}
                          onClick={handleSubmit}
                        >
                          {`Add ${items.length} Items`}
                        </LoadingButton>
                        <Button className="w-full" variant="outline" asChild>
                          <Link href="/">Cancel</Link>
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
