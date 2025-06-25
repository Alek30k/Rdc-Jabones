// components/ProductPromotions.tsx
import React from "react";
// import { twMerge } from "tailwind-merge";
import PriceFormatter from "./PriceFormatter"; // Asegúrate de que la ruta sea correcta

interface ProductPromotionsProps {
  basePrice: number; // El precio base del producto
  shippingCost?: number; // Costo de envío opcional
  pickupCost?: number; // Costo de retiro opcional
  pickupOriginalCost?: number; // Costo original de retiro para mostrar descuento
}

const ProductPromotions: React.FC<ProductPromotionsProps> = ({
  basePrice,
  shippingCost,
  pickupCost,
  pickupOriginalCost,
}) => {
  // Calculamos la cuota promocionada (ejemplo: 6 cuotas con un recargo o simplemente el precio dividido)
  // Aquí puedes ajustar la lógica de cálculo de las cuotas según tus necesidades.
  // Por simplicidad, asumimos que la cuota es el precio base / 6, pero podría incluir un recargo.
  const installmentPrice = basePrice / 6;

  // Precio por kilo (ejemplo, si tu producto tuviera un peso y precio por kilo)
  // Esto es un placeholder; si el precio por kilo se calcula de otra forma o viene del `product`
  // deberías pasarlo como prop o calcularlo aquí con más datos.
  const pricePerKilo = basePrice * 10; // Ejemplo: 8.9% del precio base

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1); // Asume que "mañana" es el día siguiente
  const friday = new Date();
  friday.setDate(friday.getDate() + ((5 - friday.getDay() + 7) % 7)); // Calcula el próximo viernes

  const nextWednesday = new Date();
  nextWednesday.setDate(
    new Date().getDate() + ((3 - new Date().getDay() + 7) % 7) + 7
  ); // Calcula el próximo miércoles

  const arrivalDate = new Date();
  arrivalDate.setDate(arrivalDate.getDate() + 2); // Ejemplo: Llega en 2 días
  const arrivalDay = arrivalDate.toLocaleDateString("es-AR", {
    weekday: "long",
  });

  // Formateador para las fechas de retiro
  const formatPickupDate = (date: Date) => {
    return date.toLocaleDateString("es-AR", {
      weekday: "long",
      day: "numeric",
      month: "short",
    });
  };

  const formattedPickupStartDate = formatPickupDate(friday); // Utiliza el viernes calculado
  const formattedPickupEndDate = formatPickupDate(nextWednesday);

  return (
    <div className="space-y-3 mt-4 text-gray-700 text-sm">
      {/* Cuota promocionada */}
      {basePrice > 0 && (
        <p>
          <span className="font-semibold text-green-700">
            Cuota promocionada
          </span>{" "}
          en 6 cuotas de{" "}
          <span className="font-bold">
            <PriceFormatter amount={installmentPrice} />
          </span>
        </p>
      )}

      {/* Precio por kilo (ejemplo) */}
      {basePrice > 0 && (
        <p>
          Precio por kilo:{" "}
          <span className="font-bold">
            <PriceFormatter amount={pricePerKilo} />
          </span>
        </p>
      )}

      {/* Medios de pago */}
      <p>
        <a href="#" className="text-blue-600 hover:underline">
          Ver los medios de pago
        </a>
      </p>

      {/* Llega por delivery */}
      {shippingCost !== undefined && (
        <p>
          Llega el {arrivalDay} por{" "}
          <span className="font-bold">
            <PriceFormatter amount={shippingCost} />
          </span>
        </p>
      )}

      {/* Tiempo restante para la compra (puedes agregar un contador aquí) */}
      <p className="text-red-600 font-semibold">
        Comprando dentro de los próximos ... (aquí iría un contador)
      </p>

      {/* Retiro en puntos */}
      {pickupCost !== undefined && (
        <p>
          Retirá entre el{" "}
          <span className="font-semibold">{formattedPickupStartDate}</span> y el{" "}
          <span className="font-semibold">{formattedPickupEndDate}</span> en
          correo y otros puntos por{" "}
          <span className="font-bold">
            <PriceFormatter amount={pickupCost} />
          </span>{" "}
          {pickupOriginalCost && pickupOriginalCost > pickupCost && (
            <span className="line-through text-gray-500">
              <PriceFormatter amount={pickupOriginalCost} />
            </span>
          )}
        </p>
      )}
      {pickupCost !== undefined && (
        <p>
          <a href="#" className="text-blue-600 hover:underline">
            Ver en el mapa
          </a>
        </p>
      )}
    </div>
  );
};

export default ProductPromotions;
