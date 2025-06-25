import { twMerge } from "tailwind-merge";

interface Props {
  amount: number | undefined;
  className?: string;
}

const PriceFormatter = ({ amount, className }: Props) => {
  const formattedPrice = new Number(amount).toLocaleString("es-AR", {
    currency: "ARS",
    style: "currency",
    minimumFractionDigits: 0, // Cambiado a 0 para eliminar los decimales
    maximumFractionDigits: 0, // Añadido para asegurar que no haya decimales
  });
  return (
    <span
      className={twMerge("text-sm font-semibold text-darkColor", className)}
    >
      {formattedPrice}
    </span>
  );
};

export default PriceFormatter;
