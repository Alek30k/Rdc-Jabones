import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 my-10">
      <h1 className="text-3xl font-bold mb-6">Política de Privacidad</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        En Regalos del corazón usamos cookies para mejorar tu experiencia de
        compra, analizar el tráfico y personalizar contenido. Las cookies son
        pequeños archivos de datos que se almacenan en tu dispositivo.
      </p>
      <h2 className="text-xl font-semibold mb-4">¿Qué cookies usamos?</h2>
      <ul className="list-disc pl-6 mb-4 text-gray-600 dark:text-gray-300">
        <li>
          <strong>Cookies esenciales:</strong> Necesarias para el funcionamiento
          del sitio (e.g., carrito de compras).
        </li>
        <li>
          <strong>Cookies de análisis:</strong> Nos ayudan a entender cómo usas
          nuestro sitio (e.g., Google Analytics).
        </li>
        <li>
          <strong>Cookies de personalización:</strong> Mejoran tu experiencia
          con contenido relevante.
        </li>
      </ul>
      <h2 className="text-xl font-semibold mb-4">¿Cómo gestionar cookies?</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        Puedes gestionar las cookies en la configuración de tu navegador.
        También puedes contactarnos en{" "}
        <a
          href="mailto:info@jabonartenatural.com"
          className="text-blue-600 hover:underline"
        >
          info@regalosdelcorazon.com
        </a>{" "}
        para más información.
      </p>
      <p className="text-gray-600 dark:text-gray-300">
        Al usar nuestro sitio, aceptas nuestra política de cookies. Consulta más
        detalles en nuestra{" "}
        <Link
          href="/terms"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          página de términos y condiciones
        </Link>
        .
      </p>
    </div>
  );
}
