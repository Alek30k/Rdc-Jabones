"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Facebook, Instagram, Mail, MessageCircle } from "lucide-react";
import Link from "next/link";

const SoapCatalog = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [visibleProducts, setVisibleProducts] = useState(6); // 👈 mostramos 3 al inicio

  // Detecta modo del sistema al cargar
  useEffect(() => {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setDarkMode(true);
    }
  }, []);

  // Cambia la clase del <html> para Tailwind
  useEffect(() => {
    const html = document.documentElement;
    if (darkMode) html.classList.add("dark");
    else html.classList.remove("dark");
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const products = [
    {
      id: 1,
      name: "Avena & Miel",
      subtitle: "Suavidad y nutrición",
      icon: "🍯",
      image: "/avenaymiel.png", // Ruta para tu imagen
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
      image: "/lavanda.png",
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
      name: "Carbón Activado",
      subtitle: "Purificación profunda",
      icon: "⚫",
      image: "/carbon.jpg",
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
      image: "/masajeador.png",
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
    {
      id: 7,
      name: "Café Energizante",
      subtitle: "Exfoliación natural",
      icon: "☕",
      image: "/images/jabon-cafe.jpg",
      ingredients: "Café molido, manteca de cacao, aceite de almendras",
      benefits: [
        "Exfolia la piel eliminando células muertas",
        "Estimula la circulación",
        "Tonifica la piel",
        "Aroma revitalizante",
      ],
      skinType: "Ideal para piel cansada y opaca",
    },
    {
      id: 8,
      name: "Manzanilla Suave",
      subtitle: "Calma y protección",
      icon: "🌼",
      image: "/images/jabon-manzanilla.jpg",
      ingredients: "Extracto de manzanilla, aceite de oliva, manteca de karité",
      benefits: [
        "Reduce enrojecimiento",
        "Protege la barrera cutánea",
        "Efecto calmante",
        "Suaviza la piel",
      ],
      skinType: "Ideal para piel sensible",
    },
    {
      id: 9,
      name: "Eucalipto Refrescante",
      subtitle: "Respira y renueva",
      icon: "🌿",
      image: "/images/jabon-eucalipto.jpg",
      ingredients: "Aceite esencial de eucalipto, menta, aceite de coco",
      benefits: [
        "Refresca y revitaliza",
        "Ayuda a despejar las vías respiratorias",
        "Propiedades antisépticas",
        "Estimula la piel",
      ],
      skinType: "Ideal para piel normal a grasa",
    },
    {
      id: 10,
      name: "Chocolate & Naranja",
      subtitle: "Antioxidante y energizante",
      icon: "🍫",
      image: "/images/jabon-chocolate-naranja.jpg",
      ingredients: "Cacao puro, aceite de naranja, manteca de cacao",
      benefits: [
        "Rico en antioxidantes",
        "Estimula los sentidos",
        "Nutre profundamente",
        "Mejora la elasticidad",
      ],
      skinType: "Ideal para piel seca y madura",
    },
    {
      id: 11,
      name: "Menta Refrescante",
      subtitle: "Frescura instantánea",
      icon: "🌱",
      image: "/menta.png",
      ingredients: "Aceite esencial de menta, aloe vera, aceite de jojoba",
      benefits: [
        "Sensación refrescante inmediata",
        "Calma irritaciones",
        "Efecto energizante",
        "Hidrata suavemente",
      ],
      skinType: "Ideal para piel grasa o mixta",
    },
    {
      id: 12,
      name: "Arcilla Verde",
      subtitle: "Limpieza profunda",
      icon: "🟩",
      image: "/images/jabon-arcilla-verde.jpg",
      ingredients: "Arcilla verde, aceite de árbol de té, romero",
      benefits: [
        "Desintoxica la piel",
        "Absorbe el exceso de grasa",
        "Reduce impurezas",
        "Purifica los poros",
      ],
      skinType: "Ideal para piel grasa y con tendencia acneica",
    },
    {
      id: 13,
      name: "Calendula & Karité",
      subtitle: "Protección y suavidad",
      icon: "🌻",
      image: "/images/jabon-calendula.jpg",
      ingredients: "Flores de caléndula, manteca de karité, aceite de oliva",
      benefits: [
        "Regenera la piel",
        "Protege contra irritaciones",
        "Alivia la resequedad",
        "Nutrición intensa",
      ],
      skinType: "Ideal para piel sensible y seca",
    },
    {
      id: 14,
      name: "Limón Vital",
      subtitle: "Limpieza y frescura",
      icon: "🍋",
      image: "/images/jabon-limon.jpg",
      ingredients: "Aceite esencial de limón, glicerina, aceite de oliva",
      benefits: [
        "Limpieza profunda",
        "Aporta luminosidad",
        "Refresca la piel",
        "Propiedades astringentes",
      ],
      skinType: "Ideal para piel grasa",
    },
    {
      id: 15,
      name: "Pepino Hidratante",
      subtitle: "Frescura y suavidad",
      icon: "🥒",
      image: "/images/jabon-pepino.jpg",
      ingredients: "Extracto de pepino, aloe vera, aceite de almendras",
      benefits: [
        "Refresca y tonifica",
        "Hidrata intensamente",
        "Calma la piel irritada",
        "Deja sensación ligera",
      ],
      skinType: "Ideal para piel seca y sensible",
    },
    {
      id: 16,
      name: "Té Verde Detox",
      subtitle: "Energía antioxidante",
      icon: "🍵",
      image: "/images/jabon-te-verde.jpg",
      ingredients: "Extracto de té verde, aceite de coco, manteca de cacao",
      benefits: [
        "Antioxidante natural",
        "Reduce el envejecimiento prematuro",
        "Purifica la piel",
        "Energiza y revitaliza",
      ],
      skinType: "Ideal para todo tipo de piel",
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
      description: `Humedece la piel, aplica el jabón en movimientos circulares suaves y enjuaga con agua tibia.`,
    },
    {
      icon: "🌊",
      title: "Espuma Ideal",
      description: `Frota el jabón entre tus manos o en una esponja para crear espuma abundante y aplicar mejor el producto.`,
    },
    {
      icon: "🌱",
      title: "Beneficio Eco",
      description: `Nuestros jabones son biodegradables y libres de químicos agresivos, cuidando tu piel y el planeta.`,
    },
    {
      icon: "🌊",
      title: "Espuma Ideal",
      description: `Frota el jabón entre tus manos o en una esponja para crear espuma abundante y aplicar mejor el producto.`,
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
      description: `Sin sulfatos, parabenos ni químicos agresivos. Solo ingredientes puros y naturales seleccionados cuidadosamente.`,
    },
    {
      icon: "💝",
      title: "Hecho a Mano",
      description: `Cada jabón es único, elaborado en pequeños lotes con técnicas tradicionales que preservan las propiedades de los ingredientes.`,
    },
    {
      icon: "🌍",
      title: "Eco-Friendly",
      description: `Empaque mínimo y biodegradable. Proceso de producción sostenible que respeta el medio ambiente.`,
    },
    {
      icon: "✨",
      title: "Base de Glicerina",
      description: `Nuestros jabones están elaborados con base de glicerina vegetal, suave y delicada con la piel.`,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-500">
      {/* BOTÓN DARK MODE */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={toggleDarkMode}
          className="px-4 py-2 rounded-full bg-green-500 dark:bg-gray-700 text-white shadow-lg hover:scale-105 transition-transform"
        >
          {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>
      <div className="max-w-6xl mx-auto bg-white dark:bg-gray-900 shadow-2xl rounded-lg overflow-hidden transition-colors duration-500">
        {/* PORTADA */}
        <div className="bg-gradient-to-br from-green-700 via-green-600 to-green-500 dark:from-gray-800 dark:via-gray-700 dark:to-gray-600 px-6 sm:px-10 py-16 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 left-8 w-4 h-4 bg-white dark:bg-gray-200 rounded-full"></div>
            <div className="absolute top-12 right-12 w-3 h-3 bg-white dark:bg-gray-200 rounded-full"></div>
            <div className="absolute bottom-16 left-16 w-2 h-2 bg-white dark:bg-gray-200 rounded-full"></div>
            <div className="absolute bottom-8 right-8 w-3 h-3 bg-white dark:bg-gray-200 rounded-full"></div>
          </div>

          <div className="relative z-10  gap-5 flex flex-col items-center">
            <Image
              src="/logo.png"
              alt="logo"
              width={140}
              height={40}
              className="mx-auto hover:scale-110 transition-transform duration-300"
            />
            <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-shadow-lg">
              Regalos del Corazón
            </h1>
            <p className="text-xl sm:text-2xl font-semibold mb-2">
              Jabones Artesanales
            </p>
          </div>

          <p className="text-lg sm:text-xl italic mb-6 opacity-90 relative z-10">
            Cuidado Natural para tu Piel
          </p>
          <div className="inline-block text-green-700 dark:text-green-700 bg-white bg-opacity-20 dark:bg-opacity-30 px-6 py-3 rounded-full text-base sm:text-lg relative z-10">
            ✨ Hechos con amor e ingredientes naturales ✨
          </div>
        </div>

        {/* INTRODUCCIÓN */}
        <section className="px-6 sm:px-10 py-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-green-700 dark:text-green-300 mb-6 text-center border-b-4 border-green-300 dark:border-green-600 pb-4">
            Bienvenido a Nuestro Mundo Natural
          </h2>
          <p className="text-center text-base sm:text-lg text-gray-600 dark:text-gray-300 italic max-w-3xl mx-auto">
            {`"Cada jabón es una obra de arte creada con ingredientes naturales
            seleccionados cuidadosamente para nutrir y proteger tu piel de
            manera suave y efectiva."`}
          </p>
        </section>

        {/* PRODUCTOS */}
        <section className="px-6 sm:px-10 py-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-green-700 dark:text-green-300 mb-8 text-center border-b-4 border-green-300 dark:border-green-600 pb-4">
            Nuestra Colección
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.slice(0, visibleProducts).map((product) => (
              <div
                key={product.id}
                className="bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-6 shadow-lg dark:shadow-gray-900 hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 border border-green-200 dark:border-gray-600 flex flex-col"
              >
                {/* Imagen */}
                <div className="relative w-full h-40 sm:h-48 mb-6 rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-700">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Header */}
                <div className="text-center mb-4 flex flex-col items-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-400 to-green-500 dark:from-green-600 dark:to-green-700 rounded-full flex items-center justify-center text-lg sm:text-2xl text-white mb-3">
                    {product.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100">
                    {product.name}
                  </h3>
                  <p className="text-green-600 dark:text-green-300 italic text-xs sm:text-sm">
                    {product.subtitle}
                  </p>
                </div>

                {/* Ingredientes */}
                <div className="bg-green-100 dark:bg-green-900 bg-opacity-50 dark:bg-opacity-30 p-3 rounded-lg mb-4">
                  <h4 className="text-green-700 dark:text-green-300 font-semibold mb-2 text-xs sm:text-sm">
                    Ingredientes principales:
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">
                    {product.ingredients}
                  </p>
                </div>

                {/* Beneficios */}
                <ul className="space-y-2 mb-4">
                  {product.benefits.map((benefit, i) => (
                    <li
                      key={i}
                      className="flex items-start space-x-2 text-xs sm:text-sm"
                    >
                      <span className="text-green-500 dark:text-green-300 mt-1">
                        🌿
                      </span>
                      <span className="text-gray-700 dark:text-gray-200">
                        {benefit}
                      </span>
                    </li>
                  ))}
                </ul>

                <span className="inline-block mt-auto bg-gradient-to-r from-green-400 to-green-500 dark:from-green-600 dark:to-green-700 text-white px-3 py-1 rounded-full text-xs font-semibold text-center">
                  {product.skinType}
                </span>
              </div>
            ))}
          </div>

          {/* BOTÓN VER MÁS */}
          {visibleProducts < products.length && (
            <div className="flex justify-center mt-8">
              <button
                onClick={() => setVisibleProducts((prev) => prev + 6)} // 👈 carga de a 3
                className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-md transition-colors"
              >
                Ver más
              </button>
            </div>
          )}
        </section>

        {/* CONSEJOS */}
        <section className="bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-900 dark:to-gray-800 px-6 sm:px-10 py-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-green-700 dark:text-green-300 mb-8 text-center border-b-4 border-green-300 dark:border-green-600 pb-4">
            Consejos de Uso y Cuidado
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tips.map((tip, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md dark:shadow-gray-900 border-l-4 border-green-400 dark:border-green-600"
              >
                <h4 className="text-green-700 dark:text-green-300 font-semibold mb-3 flex items-center">
                  <span className="mr-2">{tip.icon}</span>
                  {tip.title}
                </h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {tip.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* POR QUÉ ELEGIR */}
        <section className="px-6 sm:px-10 py-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-green-700 dark:text-green-300 mb-8 text-center border-b-4 border-green-300 dark:border-green-600 pb-4">
            ¿Por qué elegir jabones artesanales?
          </h2>

          <p className="text-center text-base sm:text-lg text-gray-600 dark:text-gray-300 italic mb-8 max-w-3xl mx-auto">
            {`"Los jabones artesanales ofrecen beneficios únicos que los productos
            industriales no pueden igualar:"`}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {whyChoose.map((item, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md dark:shadow-gray-900 border-l-4 border-green-400 dark:border-green-600"
              >
                <h4 className="text-green-700 dark:text-green-300 font-semibold mb-3 flex items-center">
                  <span className="mr-2">{item.icon}</span>
                  {item.title}
                </h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CONTACTO */}
        <section className="bg-gradient-to-br from-green-700 to-green-600 dark:from-gray-800 dark:to-gray-700 text-white px-6 sm:px-10 py-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center">
            ¡Conecta con Nosotros!
          </h2>
          <p className="text-center text-base sm:text-lg mb-8">
            Estamos aquí para ayudarte a encontrar el jabón perfecto para tu
            piel
          </p>

          <div className="grid text-green-900  dark:text-white grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link
              href={`https://wa.me/${+543718462342}?text=${"¡Hola! Estoy interesado en un producto de su tienda."}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="bg-white bg-opacity-10 dark:bg-gray-700 p-4 rounded-lg text-center">
                <h4 className=" flex items-center justify-center gap-3 font-semibold mb-2">
                  <MessageCircle className="w-5 h-5" /> WhatsApp
                </h4>
                <p className="text-sm">+54 3718 462342</p>
                <p className="text-xs opacity-90">Consultas y pedidos</p>
              </div>
            </Link>
            <Link
              href={`mailto:rdcjabones@gmail.com`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="bg-white bg-opacity-10 dark:bg-gray-700 p-4 rounded-lg text-center">
                <h4 className="flex items-center justify-center gap-3  font-semibold mb-2">
                  {" "}
                  <Mail className="w-5 h-5" /> Email
                </h4>
                <p className="text-sm">rdcjabones@gmail.com</p>
                <p className="text-xs opacity-90">Atención personalizada</p>
              </div>
            </Link>
            <Link
              href={"https://www.instagram.com"}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="bg-white bg-opacity-10 dark:bg-gray-700 p-4 rounded-lg text-center">
                <h4 className="flex items-center justify-center gap-3  font-semibold mb-2">
                  <Instagram className="w-5 h-5" /> Instagram
                </h4>
                <p className="text-sm">@jabonesartesanales</p>
                <p className="text-xs opacity-90">
                  Síguenos para tips y ofertas
                </p>
              </div>
            </Link>
            <Link
              href={"https://www.facebook.com/profile.php?id=61581624413159"}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="bg-white bg-opacity-10 dark:bg-gray-700 p-4 rounded-lg text-center">
                <p className="text-sm"></p>
                <h4 className="flex items-center justify-center gap-3 font-semibold mb-2">
                  <Facebook className="w-5 h-5" /> Facebook
                </h4>
                <p className="text-sm">RDC Jabones Artesanales </p>
                <p className="text-xs opacity-90">Síguenos en Facebook</p>
              </div>
            </Link>
          </div>

          <p className="text-center mt-8 italic text-sm sm:text-base">
            {`"Gracias por elegir el cuidado natural. Tu piel y el planeta te lo
            agradecerán."`}
          </p>
        </section>
      </div>
    </div>
  );
};

export default SoapCatalog;
