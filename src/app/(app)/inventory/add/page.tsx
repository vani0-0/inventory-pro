"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingButton } from "@/components/loading-button";
import { addProductSchema, AddProductSchema } from "@/lib/zod";
import { useAddProduct } from "@/hooks/use-products";
import { toast } from "sonner";

export default function AddItemPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mutateAsync: addProduct } = useAddProduct();
  const form = useForm<AddProductSchema>({
    resolver: zodResolver(addProductSchema),
    defaultValues: {
      name: "",
      sku: "",
      category: "Electronics",
      storageLocation: "",
      quantity: 0,
      price: 0,
      reorderLevel: 0,
      supplier: "",
      description: "",
    },
  });

  const handleSubmit = async (values: AddProductSchema) => {
    const id = toast.loading("Adding item...");
    setIsSubmitting(true);

    try {
      await addProduct(values);
      form.reset();
      toast.success("Item added successfully!", { id });
    } catch (error) {
      console.error("Failed to add item:", error);
      toast.error("Failed to add item. Please try again.", { id });
    }

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
          <span className="text-lg font-semibold">Add Inventory Item</span>
        </div>
      </header>
      <main className="flex flex-1 flex-col p-4 md:p-8">
        <Card className="mx-auto w-full max-w-2xl">
          <CardHeader>
            <CardTitle>Add New Item</CardTitle>
            <CardDescription>
              Add a new item to your inventory with barcode information.
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Item Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter item name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="sku"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SKU / Barcode</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter SKU or barcode"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Electronics">
                              Electronics
                            </SelectItem>
                            <SelectItem value="Clothing">Clothing</SelectItem>
                            <SelectItem value="Foods & Beverages">
                              Foods & Beverages
                            </SelectItem>
                            <SelectItem value="Office Supplies">
                              Office Supplies
                            </SelectItem>
                            <SelectItem value="Others">Others</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="storageLocation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Storage Location</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter storage location"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            value={field.value || 0}
                            onChange={(e) => {
                              const value = Number(e.target.value);
                              field.onChange(value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            value={field.value || 0}
                            onChange={(e) => {
                              const value = Number(e.target.value);
                              field.onChange(value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="reorderLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reorder Level</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            value={field.value || 0}
                            onChange={(e) => {
                              const value = Number(e.target.value);
                              field.onChange(value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="supplier"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Supplier</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter supplier name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter item description"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <LoadingButton pending={isSubmitting}>Add Item</LoadingButton>
                <Button className="w-full" variant="outline" asChild>
                  <Link href="/">Cancel</Link>
                </Button>
              </CardContent>
            </form>
          </Form>
        </Card>
      </main>
    </div>
  );
}
