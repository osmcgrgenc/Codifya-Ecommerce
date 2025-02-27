import { Metadata } from "next";
import CartContent from "./cart-content";

export const metadata: Metadata = {
  title: "Sepetim | Codifya E-Ticaret",
  description: "Alışveriş sepetinizi görüntüleyin ve düzenleyin",
};

export default function CartPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Sepetim</h1>
      <CartContent />
    </div>
  );
} 