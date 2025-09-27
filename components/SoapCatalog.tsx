import React from "react";
import Image from "next/image";

const SoapCatalog = () => {
  const products = [
    {
      id: 1,
      name: "Avena & Miel",
      subtitle: "Suavidad y nutrición",
      icon: "🍯",
      image: "/images/jabon-avena-miel.jpg", // Ruta para tu imagen
      ingredients:
        "Avena coloidal, miel pura, aceite de coco, manteca de karité",
      benefits: [
        "Exfolia suavemente la piel",
        "Hidrata profundamente",
        "Reduce la irritación",
        "Propiedades antibacterianas naturales",
      ],
      skinType: "Ideal para piel sensible y seca",
    },
    {
      id: 2,
      name: "Lavanda Relajante",
      subtitle: "Calma y tranquilidad",
      icon: "💜",
      image: "/images/jabon-lavanda.jpg",
      ingredients:
        "Aceite esencial de lavanda, flores secas, aceite de oliva, glicerina",
      benefits: [
        "Aromaterápia relajante",
        "Propiedades calmantes",
        "Ayuda a conciliar el sueño",
        "Antiséptico natural",
      ],
      skinType: "Ideal para todo tipo de piel",
    },
    {
      id: 3,
      name: "Carbón Detox",
      subtitle: "Purificación profunda",
      icon: "⚫",
      image: "/images/jabon-carbon.jpg",
      ingredients: "Carbón activado, arcilla bentonita, aceite de árbol de té",
      benefits: [
        "Elimina impurezas y toxinas",
        "Controla la grasa excess",
        "Minimiza los poros",
        "Combate el acné naturalmente",
      ],
      skinType: "Ideal para piel grasa y mixta",
    },
    {
      id: 4,
      name: "Rosa Mosqueta",
      subtitle: "Anti-edad y regeneración",
      icon: "🌹",
      image: "/images/jabon-rosa-mosqueta.jpg",
      ingredients: "Aceite de rosa mosqueta, pétalos de rosa, vitamina E",
      benefits: [
        "Reduce líneas de expresión",
        "Regenera la piel",
        "Atenúa cicatrices",
        "Rica en antioxidantes",
      ],
      skinType: "Ideal para piel madura",
    },
    {
      id: 5,
      name: "Coco & Cúrcuma",
      subtitle: "Brillo natural",
      icon: "🥥",
      image: "/images/jabon-coco-curcuma.jpg",
      ingredients: "Aceite de coco virgen, cúrcuma en polvo, leche de coco",
      benefits: [
        "Ilumina el tono de la piel",
        "Propiedades antiinflamatorias",
        "Hidratación profunda",
        "Antioxidante natural",
      ],
      skinType: "Ideal para piel opaca",
    },
    {
      id: 6,
      name: "Aloe Vera Puro",
      subtitle: "Sanación y frescura",
      icon: "🌿",
      image: "/images/jabon-aloe-vera.jpg",
      ingredients: "Gel de aloe vera puro, aceite de jojoba, menta fresca",
      benefits: [
        "Cicatriza heridas menores",
        "Refresca y calma",
        "Hidrata sin engrasar",
        "Perfecto después del sol",
      ],
      skinType: "Ideal para piel irritada",
    },
  ];

  const tips = [
    {
      icon: "🧼",
      title: "Conservación",
      description: `Mantén tus jabones en un lugar seco y ventilado. Usa una jabonera con drenaje para prolongar su duración.`,
    },
    {
      icon: "💧",
      title: "Aplicación",
      description:
        "Humedece la piel, aplica el jabón en movimientos circulares suaves y enjuaga con agua tibia.",
    },
    {
      icon: "⏰",
      title: "Frecuencia",
      description: `Usa 1-2 veces al día. Para pieles sensibles, comienza con uso alterno hasta que se adapte.`,
    },
    {
      icon: "🌱",
      title: "Beneficio Eco",
      description: `Nuestros jabones son biodegradables y libres de químicos agresivos, cuidando tu piel y el planeta.`,
    },
    {
      icon: "📅",
      title: "Duración",
      description: `Cada jabón dura aproximadamente 4-6 semanas con uso regular. Vida útil de 12 meses desde su fabricación.`,
    },
    {
      icon: "⚠️",
      title: "Precauciones",
      description: `Si experimentas irritación, suspende el uso. Evita el contacto con los ojos. Solo para uso externo.`,
    },
  ];

  const whyChoose = [
    {
      icon: "🌿",
      title: "100% Natural",
      description:
        "Sin sulfatos, parabenos ni químicos agresivos. Solo ingredientes puros y naturales seleccionados cuidadosamente.",
    },
    {
      icon: "💝",
      title: "Hecho a Mano",
      description:
        "Cada jabón es único, elaborado en pequeños lotes con técnicas tradicionales que preservan las propiedades de los ingredientes.",
    },
    {
      icon: "🌍",
      title: "Eco-Friendly",
      description:
        "Empaque mínimo y biodegradable. Proceso de producción sostenible que respeta el medio ambiente.",
    },
    {
      icon: "✨",
      title: "Glicerina Natural",
      description:
        "A diferencia de los jabones comerciales, conservamos la glicerina natural que se produce durante la saponificación.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-lg overflow-hidden">
        {/* PORTADA */}
        <div className="bg-gradient-to-br from-green-700 via-green-600 to-green-500 px-8 py-16 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 left-8 w-4 h-4 bg-white rounded-full"></div>
            <div className="absolute top-12 right-12 w-3 h-3 bg-white rounded-full"></div>
            <div className="absolute bottom-16 left-16 w-2 h-2 bg-white rounded-full"></div>
            <div className="absolute bottom-8 right-8 w-3 h-3 bg-white rounded-full"></div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-shadow-lg">
            Regalos del Corazón
          </h1>
          <p className="text-5xl font-bold mb-4 text-shadow-lg relative z-10">
            Jabones Artesanales
          </p>
          <div className="text-xl italic mb-6 opacity-90 relative z-10">
            {`Cuidado Natural para tu Piel`}
          </div>
          <div className="inline-block bg-white bg-opacity-20 px-6 py-3 rounded-full text-lg relative z-10">
            {`✨ Hechos con amor y ingredientes naturales ✨`}
          </div>
        </div>

        {/* INTRODUCCIÓN */}
        <div className="px-8 py-12">
          <h2 className="text-3xl font-bold text-green-700 mb-8 text-center border-b-4 border-green-300 pb-4">
            Bienvenido a Nuestro Mundo Natural
          </h2>
          <div className="text-center text-lg text-gray-600 italic">
            {`"Cada jabón es una obra de arte creada con ingredientes naturales
            seleccionados cuidadosamente para nutrir y proteger tu piel de
            manera suave y efectiva."`}
          </div>
        </div>

        {/* PRODUCTOS */}
        <div className="px-8 py-12">
          <h2 className="text-3xl font-bold text-green-700 mb-8 text-center border-b-4 border-green-300 pb-4">
            Nuestra Colección
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 border-2 border-green-200"
              >
                {/* Imagen del producto */}
                <div className="relative w-full h-48 mb-6 rounded-xl overflow-hidden bg-gray-200">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  {/* Placeholder mientras no tengas las imágenes */}
                  <div className="absolute inset-0 bg-gradient-to-br from-green-200 to-green-300 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl mb-2">{product.icon}</div>
                      <div className="text-sm text-gray-600 font-medium">
                        Imagen del {product.name}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Header del producto */}
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-500 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl text-white">
                    {product.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-1">
                    {product.name}
                  </h3>
                  <div className="text-green-600 italic text-sm">
                    {product.subtitle}
                  </div>
                </div>

                {/* Ingredientes */}
                <div className="bg-green-100 bg-opacity-50 p-4 rounded-lg mb-4">
                  <h4 className="text-green-700 font-semibold mb-2 text-sm">
                    Ingredientes principales:
                  </h4>
                  <p className="text-gray-600 text-sm">{product.ingredients}</p>
                </div>

                {/* Beneficios */}
                <ul className="space-y-2 mb-4">
                  {product.benefits.map((benefit, index) => (
                    <li
                      key={index}
                      className="flex items-start space-x-2 text-sm"
                    >
                      <span className="text-green-500 mt-1">🌿</span>
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>

                {/* Tipo de piel */}
                <div className="inline-block bg-gradient-to-r from-green-400 to-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  {product.skinType}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CONSEJOS */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 px-8 py-12">
          <h2 className="text-3xl font-bold text-green-700 mb-8 text-center border-b-4 border-green-300 pb-4">
            Consejos de Uso y Cuidado
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tips.map((tip, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-400"
              >
                <h4 className="text-green-700 font-semibold mb-3 flex items-center">
                  <span className="mr-2">{tip.icon}</span>
                  {tip.title}
                </h4>
                <p className="text-gray-600 text-sm">{tip.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* POR QUÉ ELEGIR JABONES ARTESANALES */}
        <div className="px-8 py-12">
          <h2 className="text-3xl font-bold text-green-700 mb-8 text-center border-b-4 border-green-300 pb-4">
            ¿Por qué elegir jabones artesanales?
          </h2>

          <div className="text-center text-lg text-gray-600 italic mb-8">
            Los jabones artesanales ofrecen beneficios únicos que los productos
            industriales no pueden igualar:
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {whyChoose.map((item, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-400"
              >
                <h4 className="text-green-700 font-semibold mb-3 flex items-center">
                  <span className="mr-2">{item.icon}</span>
                  {item.title}
                </h4>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CONTACTO */}
        <div className="bg-gradient-to-br from-green-700 to-green-600 text-white px-8 py-12">
          <h2 className="text-3xl font-bold mb-4 text-center">
            ¡Conecta con Nosotros!
          </h2>
          <p className="text-center text-lg mb-8">
            Estamos aquí para ayudarte a encontrar el jabón perfecto para tu
            piel
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white bg-opacity-10 p-4 rounded-lg text-center">
              <h4 className="font-semibold mb-2">📱 WhatsApp</h4>
              <p className="text-sm">+54 11 XXXX-XXXX</p>
              <p className="text-xs opacity-90">Consultas y pedidos</p>
            </div>

            <div className="bg-white bg-opacity-10 p-4 rounded-lg text-center">
              <h4 className="font-semibold mb-2">📧 Email</h4>
              <p className="text-sm">info@jabonesartesanales.com</p>
              <p className="text-xs opacity-90">Atención personalizada</p>
            </div>

            <div className="bg-white bg-opacity-10 p-4 rounded-lg text-center">
              <h4 className="font-semibold mb-2">📍 Instagram</h4>
              <p className="text-sm">@jabonesartesanales</p>
              <p className="text-xs opacity-90">Síguenos para tips y ofertas</p>
            </div>

            <div className="bg-white bg-opacity-10 p-4 rounded-lg text-center">
              <h4 className="font-semibold mb-2">🚚 Envíos</h4>
              <p className="text-sm">CABA y GBA</p>
              <p className="text-xs opacity-90">Envío gratis +$5000</p>
            </div>
          </div>

          <div className="text-center mt-8 italic">
            "Gracias por elegir el cuidado natural. Tu piel y el planeta te lo
            agradecerán."
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoapCatalog;
