import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ProductSaleCard({ product, onSell }) {
  return (
    <Card className="p-4 shadow hover:shadow-md transition">
      <CardHeader>
        <CardTitle className="text-lg">{product.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-gray-700">💲 Precio: ${product.pricePerUnit}</p>
        <p
          className="{
  id: p.id_new,
  name: p.name,
  pricePerUnit: p.price_per_unit,
  stock: p.stock,
}
text-gray-700"
        >
          📦 Stock: {product.stock}
        </p>

        <Button className="w-full mt-2" onClick={onSell}>
          Vender
        </Button>
      </CardContent>
    </Card>
  );
}
