import ProductCard from "@/components/ProductCard";
import Container from "@/components/Container";
import { Search } from "lucide-react";
import { searchProducts } from "@/sanity/queriesSearch";

interface SearchPageProps {
  searchParams: {
    q?: string;
  };
}

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const query = searchParams.q || "";
  const products = query ? await searchProducts(query) : [];

  return (
    <Container className="py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Resultados de búsqueda
        </h1>
        {query && (
          <p className="text-gray-600">
            {products.length > 0
              ? `${products.length} resultado${products.length !== 1 ? "s" : ""} para "${query}"`
              : `No se encontraron resultados para "${query}"`}
          </p>
        )}
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : query ? (
        <div className="text-center py-12">
          <Search className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No se encontraron productos
          </h3>
          <p className="text-gray-600 mb-6">
            Intenta buscar con diferentes palabras clave
          </p>
          <div className="space-y-2 text-sm text-gray-500">
            <p>Sugerencias:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Verifica la ortografía</li>
              <li>Usa términos más generales</li>
              <li>Prueba con sinónimos</li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <Search className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Busca productos
          </h3>
          <p className="text-gray-600">
            Usa la barra de búsqueda para encontrar productos
          </p>
        </div>
      )}
    </Container>
  );
};

export default SearchPage;
