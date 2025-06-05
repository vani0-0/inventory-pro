"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
  CreditCard,
} from "lucide-react";

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
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { CartItem, ProductCashier } from "@/types/product.type";
import { formatCurrency } from "@/lib/utils";
import { LoadingButton } from "@/components/loading-button";
import { useAddSale } from "@/hooks/use-cart";
import { PaymentMethodType } from "@prisma/client";
import { useGetProductsForSale } from "@/hooks/use-products";

export default function CashierPage() {
  const { mutateAsync: createSale } = useAddSale();
  const { data: products, isLoading } = useGetProductsForSale();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>("CASH");
  const [amountPaid, setAmountPaid] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;
  const change = Number.parseFloat(amountPaid) - total;

  if (isLoading || !products) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading products...</p>
      </div>
    );
  }

  const addToCart = (product: ProductCashier) => {
    const existingItem = cart.find((item) => item.sku === product.sku);

    if (existingItem) {
      if (existingItem.quantity >= product.stock) {
        toast.error("Insufficient stock", {
          description: `Only ${product.stock} units available`,
        });
        return;
      }
      updateQuantity(existingItem.id, existingItem.quantity + 1);
    } else {
      const newItem: CartItem = {
        id: product.id,
        name: product.name,
        sku: product.sku,
        price: product.price,
        quantity: 1,
        total: product.price,
      };
      setCart([...cart, newItem]);
    }

    toast.info("Item added", {
      description: `${product.name} added to cart`,
    });
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
      return;
    }

    setCart(
      cart.map((item) => {
        if (item.id === id) {
          const product = products.find((p) => p.sku === item.sku);
          if (product && newQuantity > product.stock) {
            toast.warning("Insufficient stock", {
              description: `Only ${product.stock} units available`,
            });
            return item;
          }
          return {
            ...item,
            quantity: newQuantity,
            total: item.price * newQuantity,
          };
        }
        return item;
      })
    );
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
    setCustomerName("");
    setAmountPaid("");
  };

  const handlePayment = async () => {
    if (cart.length === 0) {
      toast.error("Empty cart", {
        description: "Please add items to the cart before processing payment",
      });
      return;
    }

    if (
      paymentMethod === "CASH" &&
      (Number.parseFloat(amountPaid) < total || !amountPaid)
    ) {
      toast.error("Insufficient payment", {
        description: "Please enter a valid payment amount",
      });
      return;
    }
    try {
      setIsProcessing(true);

      await createSale({
        cart,
        customerName,
        paymentMethod,
        amountPaid:
          paymentMethod === "CASH" ? Number.parseFloat(amountPaid) : 0,
      });

      toast.success("Payment successful", {
        description: `Transaction completed for ${formatCurrency(total)}`,
      });
    } catch (error) {
      toast.error("Something went wrong", {
        description: JSON.stringify(error, null, 2),
      });
    } finally {
      setIsProcessing(false);
      setShowPaymentDialog(false);
      clearCart();
    }
  };

  const paymentMethodOptions = [
    { label: "Cash", value: PaymentMethodType.CASH },
    { label: "Credit Card", value: PaymentMethodType.CREDIT_CARD },
    { label: "Debit Card", value: PaymentMethodType.DEBIT_CARD },
    { label: "Digital Payment", value: PaymentMethodType.ONLINE },
  ];

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
          <ShoppingCart className="h-5 w-5" />
          <span className="text-lg font-semibold">Cashier Terminal</span>
        </div>
        <div className="ml-auto">
          <Button
            variant="outline"
            onClick={clearCart}
            disabled={cart.length === 0}
          >
            Clear Cart
          </Button>
        </div>
      </header>

      <main className="flex flex-1 p-4 md:p-6 gap-6">
        {/* Left Panel - Product Scanning */}
        <div className="flex-1 space-y-6">
          {/* <Card>
            <CardHeader>
              <CardTitle>Scan Products</CardTitle>
              <CardDescription>
                Scan barcodes or search for products to add to cart
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="scan-input">Barcode Scanner / Search</Label>
                <Input
                  ref={scanInputRef}
                  id="scan-input"
                  placeholder="Scan barcode or enter product SKU"
                  value={scanInput}
                  onChange={(e) => setScanInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && scanInput.trim()) {
                      handleScanProduct(scanInput.trim());
                      setScanInput("");
                    }
                  }}
                  autoFocus
                />
              </div>
              <Button
                onClick={() => handleScanProduct(scanInput)}
                disabled={!scanInput.trim()}
                className="w-full"
              >
                Add to Cart
              </Button>
            </CardContent>
          </Card> */}

          <Card>
            <CardHeader>
              <CardTitle>Quick Add Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {products.slice(0, 6).map((product) => (
                  <Button
                    key={product.id}
                    variant="outline"
                    className="justify-start h-auto p-3"
                    onClick={() => addToCart(product)}
                    disabled={product.stock <= 0}
                  >
                    <div className="text-left">
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {formatCurrency(product.price)} • Stock: {product.stock}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Cart and Checkout */}
        <div className="w-96 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Shopping Cart</CardTitle>
              <CardDescription>{cart.length} items</CardDescription>
            </CardHeader>
            <CardContent>
              {cart.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Cart is empty</p>
                  <p className="text-sm">Scan products to add them</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="max-h-64 overflow-y-auto">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between py-2 border-b"
                      >
                        <div className="flex-1">
                          <div className="font-medium text-sm">{item.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {formatCurrency(item.price)} each
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-6 w-6"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm">
                            {item.quantity}
                          </span>
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-6 w-6"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6 text-red-500"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="w-16 text-right text-sm font-medium">
                          {formatCurrency(item.total)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {cart.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (8%):</span>
                    <span>{formatCurrency(tax)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customer-name">
                    Customer Name (Optional)
                  </Label>
                  <Input
                    id="customer-name"
                    placeholder="Enter customer name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>

                <Dialog
                  open={showPaymentDialog}
                  onOpenChange={setShowPaymentDialog}
                >
                  <DialogTrigger asChild>
                    <Button className="w-full" size="lg">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Process Payment
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Process Payment</DialogTitle>
                      <DialogDescription>
                        Complete the transaction for ${total.toFixed(2)}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Payment Method</Label>
                        <Select
                          value={paymentMethod}
                          onValueChange={(value) =>
                            setPaymentMethod(value as PaymentMethodType)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {paymentMethodOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {paymentMethod === "CASH" && (
                        <div className="space-y-2">
                          <Label htmlFor="amount-paid">Amount Paid</Label>
                          <Input
                            id="amount-paid"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={amountPaid}
                            onChange={(e) => setAmountPaid(e.target.value)}
                          />
                          {amountPaid &&
                            Number.parseFloat(amountPaid) >= total && (
                              <div className="text-sm text-green-600">
                                Change: {formatCurrency(change)}
                              </div>
                            )}
                        </div>
                      )}

                      <div className="bg-muted p-3 rounded-lg">
                        <div className="text-sm space-y-1">
                          <div className="flex justify-between">
                            <span>Items:</span>
                            <span>{cart.length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <span>{formatCurrency(subtotal)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Tax:</span>
                            <span>{formatCurrency(tax)}</span>
                          </div>
                          <div className="flex justify-between font-bold">
                            <span>Total:</span>
                            <span>{formatCurrency(total)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setShowPaymentDialog(false)}
                        >
                          Cancel
                        </Button>
                        <LoadingButton
                          pending={isProcessing}
                          onClick={handlePayment}
                        >
                          Complete Payment
                        </LoadingButton>
                      </div>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
