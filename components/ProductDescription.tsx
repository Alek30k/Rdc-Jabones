import { PortableText } from "@portabletext/react";
import type { Product } from "@/sanity.types";

interface ProductDescriptionProps {
  product: Product | null | undefined;
}

const ProductDescription = ({ product }: ProductDescriptionProps) => {
  if (!product) return null;

  // Componentes personalizados para el PortableText
  const portableTextComponents = {
    block: {
      normal: ({ children }: any) => (
        <p className="mb-4 text-gray-700 leading-relaxed">{children}</p>
      ),
      h1: ({ children }: any) => (
        <h1 className="text-2xl font-bold mb-4 text-gray-900">{children}</h1>
      ),
      h2: ({ children }: any) => (
        <h2 className="text-xl font-semibold mb-3 text-gray-900">{children}</h2>
      ),
      h3: ({ children }: any) => (
        <h3 className="text-lg font-medium mb-2 text-gray-900">{children}</h3>
      ),
      blockquote: ({ children }: any) => (
        <blockquote className="border-l-4 border-green-500 pl-4 italic text-gray-600 my-4">
          {children}
        </blockquote>
      ),
    },
    list: {
      bullet: ({ children }: any) => (
        <ul className="list-disc list-inside mb-4 space-y-1">{children}</ul>
      ),
      number: ({ children }: any) => (
        <ol className="list-decimal list-inside mb-4 space-y-1">{children}</ol>
      ),
    },
    listItem: {
      bullet: ({ children }: any) => (
        <li className="text-gray-700">{children}</li>
      ),
      number: ({ children }: any) => (
        <li className="text-gray-700">{children}</li>
      ),
    },
    marks: {
      strong: ({ children }: any) => (
        <strong className="font-semibold text-gray-900">{children}</strong>
      ),
      em: ({ children }: any) => <em className="italic">{children}</em>,
      underline: ({ children }: any) => <u className="underline">{children}</u>,
      link: ({ children, value }: any) => (
        <a
          href={value.href}
          className="text-green-600 hover:text-green-800 underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      ),
    },
  };

  return (
    <div className="space-y-4">
      {/* Descripción Rica (Recomendado) */}
      {product.richDescription && (
        <div className="prose prose-green max-w-none">
          <PortableText
            value={product.richDescription}
            components={portableTextComponents}
          />
        </div>
      )}

      {/* Descripción Simple con saltos de línea */}
      {product.description && !product.richDescription && (
        <div className="space-y-2">
          {product.description.split("\n").map((paragraph, index) => (
            <p key={index} className="text-gray-700 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      )}

      {/* Fallback si no hay descripción */}
      {!product.description && !product.richDescription && (
        <p className="text-gray-500 italic">No hay descripción disponible.</p>
      )}
    </div>
  );
};

export default ProductDescription;
