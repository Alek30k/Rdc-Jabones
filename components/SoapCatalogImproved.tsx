"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Facebook,
  Instagram,
  Mail,
  MessageCircle,
  Filter,
  X,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";

type Product = {
  id: number;
  name: string;
  subtitle: string;
  icon: string;
  image: string;
  ingredients: string;
  benefits: string[];
  skinType: string;
  price: number;
  weight: string;
  badges: string[];
  skinTypeCategory:
    | "seca"
    | "grasa"
    | "mixta"
    | "sensible"
    | "normal"
    | "todas";
};

const SoapCatalogImproved = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [visibleProducts, setVisibleProducts] = useState(6);
  const [selectedFilter, setSelectedFilter] = useState<string>("todas");
  const [showFilters, setShowFilters] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    if (darkMode) html.classList.add("dark");
    else html.classList.remove("dark");
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const products: Product[] = [
    {
      id: 1,
      name: "Avena & Miel",
      subtitle: "Suavidad y nutrición",
      icon: "🍯",
      image: "/avenaymiel.png",
      ingredients:
        "Avena coloidal, miel pura, aceite de coco, manteca de karité, vitamina E",
      benefits: [
        "Exfolia suavemente la piel",
        "Hidrata profundamente",
        "Reduce la irritación",
        "Propiedades antibacterianas naturales",
      ],
      skinType: "Ideal para piel sensible y seca",
      skinTypeCategory: "seca",
      price: 2800,
      weight: "100g",
      badges: ["Más Vendido", "Vegano", "Orgánico"],
    },
    {
      id: 2,
      name: "Lavanda Relajante",
      subtitle: "Calma y tranquilidad",
      icon: "💜",
      image: "/lavanda.png",
      ingredients:
        "Aceite esencial de lavanda, flores secas, aceite de oliva, glicerina, vitamina E",
      benefits: [
        "Aromaterapia relajante",
        "Propiedades calmantes",
        "Ayuda a conciliar el sueño",
        "Antiséptico natural",
      ],
      skinType: "Ideal para todo tipo de piel",
      skinTypeCategory: "todas",
      price: 2600,
      weight: "100g",
      badges: ["Vegano", "Relajante"],
    },
    {
      id: 3,
      name: "Carbón Activado",
      subtitle: "Purificación profunda",
      icon: "⚫",
      image: "/carbon.jpg",
      ingredients:
        "Carbón activado, manteca de karité, aceite de árbol de té, vitamina E",
      benefits: [
        "Elimina impurezas y toxinas",
        "Controla la grasa excess",
        "Minimiza los poros",
        "Combate el acné naturalmente",
      ],
      skinType: "Ideal para piel grasa y mixta",
      skinTypeCategory: "grasa",
      price: 2700,
      weight: "100g",
      badges: ["Más Vendido", "Vegano"],
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
      skinTypeCategory: "seca",
      price: 3200,
      weight: "100g",
      badges: ["Premium", "Anti-edad", "Vegano"],
    },
    {
      id: 5,
      name: "Coco & Cúrcuma",
      subtitle: "Brillo natural",
      icon: "🥥",
      image: "/curcuma.jpg",
      ingredients:
        "Aceite de coco virgen, cúrcuma en polvo, leche de coco, vitamina E",
      benefits: [
        "Ilumina el tono de la piel",
        "Propiedades antiinflamatorias",
        "Hidratación profunda",
        "Antioxidante natural",
      ],
      skinType: "Ideal para piel opaca",
      skinTypeCategory: "normal",
      price: 2900,
      weight: "100g",
      badges: ["Vegano", "Iluminador"],
    },
    {
      id: 6,
      name: "Aloe Vera Puro",
      subtitle: "Sanación y frescura",
      icon: "🌿",
      image: "/aloe.jpg",
      ingredients:
        "Gel de aloe vera puro, aceite de jojoba, menta fresca, vitamina E",
      benefits: [
        "Cicatriza heridas menores",
        "Refresca y calma",
        "Hidrata sin engrasar",
        "Perfecto después del sol",
      ],
      skinType: "Ideal para piel irritada",
      skinTypeCategory: "sensible",
      price: 2700,
      weight: "100g",
      badges: ["Vegano", "Refrescante"],
    },
    {
      id: 7,
      name: "Café Energizante",
      subtitle: "Exfoliación natural",
      icon: "☕",
      image: "/cafe.png",
      ingredients:
        "Café molido, manteca de cacao, aceite de almendras, vitamina E",
      benefits: [
        "Exfolia la piel eliminando células muertas",
        "Estimula la circulación",
        "Tonifica la piel",
        "Aroma revitalizante",
      ],
      skinType: "Ideal para piel cansada y opaca",
      skinTypeCategory: "normal",
      price: 2800,
      weight: "100g",
      badges: ["Exfoliante", "Vegano"],
    },
    {
      id: 8,
      name: "Manzanilla Suave",
      subtitle: "Calma y protección",
      icon: "🌼",
      image: "/manzanilla.jpg",
      ingredients:
        "Extracto de manzanilla, aceite de oliva, manteca de karité, vitamina E",
      benefits: [
        "Reduce enrojecimiento",
        "Protege la barrera cutánea",
        "Efecto calmante",
        "Suaviza la piel",
      ],
      skinType: "Ideal para piel sensible",
      skinTypeCategory: "sensible",
      price: 2600,
      weight: "100g",
      badges: ["Vegano", "Hipoalergénico"],
    },
    {
      id: 9,
      name: "Eucalipto Refrescante",
      subtitle: "Respira y renueva",
      icon: "🌿",
      image: "/eucalipto.png",
      ingredients:
        "Aceite esencial de eucalipto, menta, aceite de coco, vitamina E",
      benefits: [
        "Refresca y revitaliza",
        "Ayuda a despejar las vías respiratorias",
        "Propiedades antisépticas",
        "Estimula la piel",
      ],
      skinType: "Ideal para piel normal a grasa",
      skinTypeCategory: "grasa",
      price: 2700,
      weight: "100g",
      badges: ["Vegano", "Refrescante"],
    },
    {
      id: 10,
      name: "Cacao & Naranja",
      subtitle: "Antioxidante y energizante",
      icon: "🍫",
      image: "/chocolate.png",
      ingredients:
        "Cacao puro, aceite de naranja, manteca de cacao, vitamina E",
      benefits: [
        "Rico en antioxidantes",
        "Estimula los sentidos",
        "Nutre profundamente",
        "Mejora la elasticidad",
      ],
      skinType: "Ideal para piel seca y madura",
      skinTypeCategory: "seca",
      price: 2900,
      weight: "100g",
      badges: ["Vegano", "Nutritivo"],
    },
    {
      id: 11,
      name: "Menta Refrescante",
      subtitle: "Frescura instantánea",
      icon: "🌱",
      image: "/menta.png",
      ingredients:
        "Aceite esencial de menta, aloe vera, aceite de jojoba, vitamina E",
      benefits: [
        "Sensación refrescante inmediata",
        "Calma irritaciones",
        "Efecto energizante",
        "Hidrata suavemente",
      ],
      skinType: "Ideal para piel grasa o mixta",
      skinTypeCategory: "mixta",
      price: 2600,
      weight: "100g",
      badges: ["Vegano", "Refrescante"],
    },
    {
      id: 12,
      name: "Romero",
      subtitle: "Energizante y revitalizante",
      icon: "🌿",
      image: "/romero.png",
      ingredients:
        "Aceite esencial de romero, aceite de oliva, coco y manteca de karité, vitamina E",
      benefits: [
        "Estimula la circulación sanguínea",
        "Aporta frescura y vitalidad",
        "Propiedades antibacterianas y antioxidantes",
        "Tonifica y revitaliza la piel",
      ],
      skinType: "Recomendado para piel mixta y fatigada",
      skinTypeCategory: "mixta",
      price: 2700,
      weight: "100g",
      badges: ["Vegano", "Energizante"],
    },
    {
      id: 13,
      name: "Calendula & Karité",
      subtitle: "Protección y suavidad",
      icon: "🌻",
      image: "/calendula.png",
      ingredients:
        "Flores de caléndula, manteca de karité, aceite de oliva, vitamina E",
      benefits: [
        "Regenera la piel",
        "Protege contra irritaciones",
        "Alivia la resequedad",
        "Nutrición intensa",
      ],
      skinType: "Ideal para piel sensible y seca",
      skinTypeCategory: "sensible",
      price: 2800,
      weight: "100g",
      badges: ["Vegano", "Nutritivo"],
    },
    {
      id: 14,
      name: "Limón",
      subtitle: "Limpieza y frescura",
      icon: "🍋",
      image: "/limon.png",
      ingredients:
        "Aceite esencial de limón, glicerina, aceite de oliva, vitamina E",
      benefits: [
        "Limpieza profunda",
        "Aporta luminosidad",
        "Refresca la piel",
        "Propiedades astringentes",
      ],
      skinType: "Ideal para piel grasa",
      skinTypeCategory: "grasa",
      price: 2500,
      weight: "100g",
      badges: ["Vegano", "Purificante"],
    },
    {
      id: 15,
      name: "Miel",
      subtitle: "Hidratación natural",
      icon: "🟨",
      image: "/miel.png",
      ingredients:
        "Miel pura, aceite de almendras dulces, glicerina vegetal, vitamina E",
      benefits: [
        "Hidrata profundamente la piel",
        "Propiedades antibacterianas y calmantes",
        "Aporta suavidad y elasticidad",
        "Restaura el brillo natural de la piel",
      ],
      skinType: "Ideal para piel seca, sensible o irritada",
      skinTypeCategory: "seca",
      price: 2700,
      weight: "100g",
      badges: ["Más Vendido", "Orgánico"],
    },
    {
      id: 16,
      name: "Naranja",
      subtitle: "Energía y frescura",
      icon: "🟧",
      image: "/naranja.png",
      ingredients:
        "Aceite esencial de naranja, ralladura de cáscara de naranja, aceite de coco, vitamina E",
      benefits: [
        "Revitaliza y aporta energía",
        "Aporta luminosidad a la piel",
        "Estimula la circulación",
        "Aroma cítrico refrescante",
      ],
      skinType: "Ideal para piel normal a mixta",
      skinTypeCategory: "normal",
      price: 2600,
      weight: "100g",
      badges: ["Vegano", "Energizante"],
    },
    {
      id: 17,
      name: "Arroz",
      subtitle: "Suavidad y luminosidad",
      icon: "🤍",
      image: "/arroz.png",
      ingredients:
        "Harina de arroz, leche de arroz, aceite de almendras, vitamina E",
      benefits: [
        "Suaviza y unifica el tono de la piel",
        "Aporta luminosidad natural",
        "Nutre en profundidad",
        "Ayuda a mejorar la elasticidad",
      ],
      skinType: "Ideal para todo tipo de piel, especialmente sensible",
      skinTypeCategory: "sensible",
      price: 2700,
      weight: "100g",
      badges: ["Vegano", "Iluminador"],
    },
    {
      id: 18,
      name: "Jazmín",
      subtitle: "Relajación y sensualidad",
      icon: "🌸",
      image: "/jazmin.jpg",
      ingredients:
        "Aceite esencial de jazmín, manteca de karité, aceite de oliva, vitamina E",
      benefits: [
        "Relaja los sentidos y reduce el estrés",
        "Hidrata y suaviza la piel",
        "Aporta un aroma floral delicado y duradero",
        "Estimula la sensación de bienestar",
      ],
      skinType: "Ideal para piel seca y normal",
      skinTypeCategory: "seca",
      price: 2900,
      weight: "100g",
      badges: ["Vegano", "Relajante"],
    },
    {
      id: 19,
      name: "Espirulina",
      subtitle: "Nutrición intensa",
      icon: "🟦",
      image: "/espirulina.jpg",
      ingredients:
        "Espirulina en polvo, aceite de oliva, aceite de coco, manteca de cacao, vitamina E",
      benefits: [
        "Rica en vitaminas y minerales que nutren la piel",
        "Antioxidante natural que protege contra el envejecimiento",
        "Ayuda a mejorar la elasticidad y firmeza de la piel",
        "Promueve una piel luminosa y saludable",
      ],
      skinType: "Ideal para piel seca, opaca o con signos de fatiga",
      skinTypeCategory: "seca",
      price: 3000,
      weight: "100g",
      badges: ["Premium", "Vegano", "Nutritivo"],
    },
    {
      id: 20,
      name: "Coco",
      subtitle: "Hidratación tropical",
      icon: "🥥",
      image: "/coco.jpg",
      ingredients:
        "Aceite de coco, leche de coco, manteca de cacao, vitamina E",
      benefits: [
        "Hidrata intensamente la piel",
        "Restaura la suavidad natural",
        "Protege contra la resequedad",
        "Aroma tropical refrescante",
      ],
      skinType: "Ideal para piel seca y deshidratada",
      skinTypeCategory: "seca",
      price: 2700,
      weight: "100g",
      badges: ["Vegano", "Hidratante"],
    },
    {
      id: 21,
      name: "Mandarina",
      subtitle: "Vitalidad y frescura",
      icon: "🍊",
      image: "/mandarina.jpg",
      ingredients:
        "Aceite esencial de mandarina, ralladura de cáscara de mandarina, aceite de oliva, vitamina E",
      benefits: [
        "Revitaliza y energiza la piel",
        "Aporta frescura y suavidad",
        "Estimula el buen ánimo",
        "Aroma cítrico dulce y delicado",
      ],
      skinType: "Ideal para piel normal y mixta",
      skinTypeCategory: "mixta",
      price: 2600,
      weight: "100g",
      badges: ["Vegano", "Energizante"],
    },
    {
      id: 22,
      name: "Zanahoria",
      subtitle: "Nutrición y luminosidad",
      icon: "🥕",
      image: "/zanahoria.png",
      ingredients:
        "Jugo fresco de zanahoria, aceite de oliva, manteca de karité, vitamina E",
      benefits: [
        "Rico en betacarotenos que regeneran la piel",
        "Aporta un tono saludable y luminoso",
        "Nutre y suaviza profundamente",
        "Protege contra el envejecimiento prematuro",
      ],
      skinType: "Ideal para piel seca, madura o apagada",
      skinTypeCategory: "seca",
      price: 2800,
      weight: "100g",
      badges: ["Vegano", "Anti-edad"],
    },
    {
      id: 23,
      name: "Tutti Frutti",
      subtitle: "Diversión y frescura",
      icon: "🍭",
      image: "/tutti.png",
      ingredients:
        "Aceites vegetales, glicerina, fragancia tutti frutti, colorantes naturales, vitamina E",
      benefits: [
        "Aroma alegre y juvenil",
        "Suaviza e hidrata la piel",
        "Diseño colorido y llamativo",
        "Convierte tu rutina en un momento divertido",
      ],
      skinType: "Ideal para todo tipo de piel",
      skinTypeCategory: "todas",
      price: 2500,
      weight: "100g",
      badges: ["Vegano", "Para Niños"],
    },
    {
      id: 24,
      name: "Manzana Verde",
      subtitle: "Energía y frescura",
      icon: "🍏",
      image: "/manzana.jpg",
      ingredients:
        "Aceite de oliva, aceite de coco, fragancia de manzana verde, manteca de karité, vitamina E",
      benefits: [
        "Refresca y revitaliza la piel",
        "Aroma frutal y energizante",
        "Hidratación ligera",
        "Deja una sensación de limpieza fresca",
      ],
      skinType: "Ideal para piel normal y mixta",
      skinTypeCategory: "normal",
      price: 2600,
      weight: "100g",
      badges: ["Vegano", "Refrescante"],
    },
    {
      id: 25,
      name: "Maicena",
      subtitle: "Suavidad y pureza natural",
      icon: "🌾",
      image: "/maicena.png",
      ingredients:
        "Maicena natural pura, aceite de almendras dulces, manteca de karité, vitamina E",
      benefits: [
        "Calma y suaviza la piel irritada",
        "Absorbe el exceso de grasa sin resecar",
        "Deja una textura aterciopelada y seca al tacto",
        "Ideal para piel sensible o con tendencia a irritarse",
      ],
      skinType: "Ideal para piel sensible y delicada",
      skinTypeCategory: "sensible",
      price: 2500,
      weight: "100g",
      badges: ["Vegano", "Hipoalergénico"],
    },
    {
      id: 26,
      name: "Arroz & Maicena",
      subtitle: "Luminosidad y suavidad extrema",
      icon: "🤍🌾",
      image: "/arrozmaicena.png",
      ingredients:
        "Harina de arroz, maicena natural, aceite de coco, leche vegetal, vitamina E",
      benefits: [
        "Unifica el tono de la piel y mejora su textura",
        "Aporta una suavidad aterciopelada y limpia",
        "Absorbe impurezas sin resecar",
        "Deja la piel luminosa y fresca al instante",
      ],
      skinType: "Ideal para piel sensible, mixta o seca",
      skinTypeCategory: "sensible",
      price: 2700,
      weight: "100g",
      badges: ["Vegano", "Iluminador"],
    },
    {
      id: 27,
      name: "Uva",
      subtitle: "Antioxidante y revitalizante",
      icon: "🍇",
      image: "/uva.png",
      ingredients:
        "Extracto de uva, aceite de semilla de uva, manteca de karité, vitamina E",
      benefits: [
        "Rico en antioxidantes que combaten el envejecimiento prematuro",
        "Hidrata y revitaliza la piel apagada",
        "Aporta firmeza y elasticidad",
        "Deja un aroma frutal suave y natural",
      ],
      skinType: "Ideal para piel madura o con signos de fatiga",
      skinTypeCategory: "seca",
      price: 2900,
      weight: "100g",
      badges: ["Vegano", "Anti-edad"],
    },
    {
      id: 28,
      name: "Maicena & Carbón Activado",
      subtitle: "Equilibrio y pureza natural",
      icon: "⚫🌾",
      image: "/maicenacarbon.png",
      ingredients:
        "Maicena natural, carbón activado vegetal, aceite de coco, manteca de karité, vitamina E",
      benefits: [
        "Limpieza profunda sin resecar la piel",
        "Absorbe el exceso de grasa y toxinas",
        "Calma irritaciones gracias a la maicena",
        "Deja la piel suave, equilibrada y purificada",
      ],
      skinType: "Ideal para piel mixta, grasa o con imperfecciones",
      skinTypeCategory: "mixta",
      price: 2800,
      weight: "100g",
      badges: ["Vegano", "Purificante"],
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
      icon: "📦",
      title: "Almacenamiento",
      description: `Guarda los jabones que no uses en un lugar fresco, seco y oscuro para mantener su aroma y propiedades.`,
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

  const faqs = [
    {
      question: "¿Cuánto dura un jabón de 100g?",
      answer:
        "Con uso diario, un jabón de 100g dura aproximadamente 4-6 semanas. La duración puede variar según la frecuencia de uso y la forma de almacenamiento.",
    },
    {
      question: "¿Son aptos para niños?",
      answer:
        "Sí, la mayoría de nuestros jabones son aptos para niños. Especialmente recomendamos: Manzanilla Suave, Avena & Miel, Caléndula, Maicena y Tutti Frutti que son extra suaves.",
    },
    {
      question: "¿Se pueden usar en el rostro?",
      answer:
        "La mayoría de nuestros jabones son aptos para rostro y cuerpo. Los exfoliantes fuertes (Café, Carbón Activado) recomendamos usarlos 2-3 veces por semana en el rostro.",
    },
    {
      question: "¿Cuánto tiempo duran sin abrirse?",
      answer:
        "Los jabones sin abrir duran entre 6-12 meses en un lugar fresco y seco. Los que contienen ingredientes frescos (zanahoria, frutas) tienen una vida útil de 6 meses.",
    },
    {
      question: "¿Cómo conservo mejor mis jabones?",
      answer:
        "Usa una jabonera con drenaje para que no quede en contacto con el agua. Guárdalos en un lugar ventilado y seco. Entre usos, déjalos secar completamente.",
    },
    {
      question: "¿Son veganos y cruelty-free?",
      answer:
        "Sí, todos nuestros jabones son veganos (no contienen ingredientes de origen animal) y nunca son testados en animales. Los que contienen miel son de origen ético.",
    },
    {
      question: "¿Puedo usar jabones para piel grasa si tengo piel seca?",
      answer:
        "No es recomendable. Los jabones para piel grasa pueden resecar más tu piel. Usa nuestra guía de selección para encontrar el jabón ideal para tu tipo de piel.",
    },
    {
      question: "¿Hacen envíos?",
      answer:
        "Sí, hacemos envíos a todo el país. Contáctanos por WhatsApp para coordinar el envío y conocer los costos según tu ubicación.",
    },
    {
      question: "¿Puedo combinar varios jabones?",
      answer:
        "¡Por supuesto! Puedes alternar jabones según tus necesidades. Por ejemplo: Carbón Activado para el rostro y Coco para el cuerpo, o Lavanda por la noche y Café por la mañana.",
    },
    {
      question: "¿Qué significa que tienen base de glicerina?",
      answer:
        "La glicerina vegetal es un humectante natural que atrae la humedad a la piel. Hace que nuestros jabones sean suaves, no resequen la piel y generen una espuma cremosa.",
    },
  ];

  const skinTypeFilters = [
    { value: "todas", label: "Todos", icon: "✨" },
    { value: "seca", label: "Piel Seca", icon: "💧" },
    { value: "grasa", label: "Piel Grasa", icon: "🌟" },
    { value: "mixta", label: "Piel Mixta", icon: "⚖️" },
    { value: "sensible", label: "Piel Sensible", icon: "🌸" },
    { value: "normal", label: "Piel Normal", icon: "😊" },
  ];

  const getBadgeColor = (badge: string) => {
    const colors: Record<string, string> = {
      "Más Vendido":
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      Vegano:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      Orgánico:
        "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
      Premium:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      "Anti-edad":
        "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
      Relajante:
        "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
      Exfoliante:
        "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      Refrescante:
        "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200",
      Nutritivo:
        "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
      Energizante: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      Hidratante:
        "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      Iluminador:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      Purificante:
        "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
      Hipoalergénico:
        "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200",
      "Para Niños":
        "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
    };
    return (
      colors[badge] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
    );
  };

  const filteredProducts =
    selectedFilter === "todas"
      ? products
      : products.filter((p) => p.skinTypeCategory === selectedFilter);

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

          <div className="relative z-10 gap-5 flex flex-col items-center">
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

        {/* FILTROS */}
        <section className="px-6 sm:px-10 pb-6">
          <div className="bg-green-50 dark:bg-gray-800 rounded-lg p-4 border border-green-200 dark:border-gray-700">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-between w-full text-left"
            >
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-green-600 dark:text-green-400" />
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  Filtrar por tipo de piel
                </span>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-gray-600 dark:text-gray-400 transition-transform ${
                  showFilters ? "rotate-180" : ""
                }`}
              />
            </button>

            {showFilters && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-4">
                {skinTypeFilters.map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => {
                      setSelectedFilter(filter.value);
                      setVisibleProducts(6);
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedFilter === filter.value
                        ? "bg-green-600 text-white shadow-lg scale-105"
                        : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-green-100 dark:hover:bg-gray-600"
                    }`}
                  >
                    <span className="mr-1">{filter.icon}</span>
                    {filter.label}
                  </button>
                ))}
              </div>
            )}

            {selectedFilter !== "todas" && (
              <div className="mt-4 flex items-center justify-between bg-white dark:bg-gray-700 p-3 rounded-lg">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Mostrando {filteredProducts.length} productos para{" "}
                  <strong>
                    {
                      skinTypeFilters.find((f) => f.value === selectedFilter)
                        ?.label
                    }
                  </strong>
                </span>
                <button
                  onClick={() => setSelectedFilter("todas")}
                  className="text-sm text-green-600 dark:text-green-400 hover:underline flex items-center gap-1"
                >
                  <X className="w-4 h-4" />
                  Limpiar filtro
                </button>
              </div>
            )}
          </div>
        </section>

        {/* PRODUCTOS */}
        <section className="px-6 sm:px-10 py-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-green-700 dark:text-green-300 mb-8 text-center border-b-4 border-green-300 dark:border-green-600 pb-4">
            Nuestra Colección
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.slice(0, visibleProducts).map((product) => (
              <div
                key={product.id}
                className="bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-6 shadow-lg dark:shadow-gray-900 hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 border border-green-200 dark:border-gray-600 flex flex-col"
              >
                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {product.badges.map((badge, i) => (
                    <span
                      key={i}
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${getBadgeColor(badge)}`}
                    >
                      {badge}
                    </span>
                  ))}
                </div>

                {/* Imagen */}
                <div className="relative w-full h-40 sm:h-48 mb-6 rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-700">
                  <Image
                    src={product.image || "/placeholder.svg"}
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

                {/* Precio y Peso */}
                <div className="bg-white dark:bg-gray-900 rounded-lg p-3 mb-4 flex justify-between items-center">
                  <div>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      ${product.price}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {product.weight}
                    </p>
                  </div>
                  <Link
                    href={`https://wa.me/${+543718462342}?text=${encodeURIComponent(
                      `¡Hola! Estoy interesado en el jabón ${product.name} ($${product.price} - ${product.weight})`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Pedir
                  </Link>
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
          {visibleProducts < filteredProducts.length && (
            <div className="flex justify-center mt-8">
              <button
                onClick={() => setVisibleProducts((prev) => prev + 6)}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg transition-colors font-semibold"
              >
                Ver más productos ({filteredProducts.length - visibleProducts}{" "}
                restantes)
              </button>
            </div>
          )}
        </section>

        {/* FAQ */}
        <section className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 px-6 sm:px-10 py-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-blue-700 dark:text-blue-300 mb-8 text-center border-b-4 border-blue-300 dark:border-blue-600 pb-4">
            Preguntas Frecuentes
          </h2>

          <div className="max-w-4xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900 overflow-hidden"
              >
                <button
                  onClick={() => setShowFAQ(showFAQ === index ? false : index)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <span className="font-semibold text-gray-800 dark:text-gray-200 pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 transition-transform ${
                      showFAQ === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {showFAQ === index && (
                  <div className="px-6 pb-4 text-gray-600 dark:text-gray-300 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
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

          <div className="grid text-green-900 dark:text-white grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link
              href={`https://wa.me/${+543718462342}?text=${"¡Hola! Estoy interesado en un producto de su tienda."}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="bg-white bg-opacity-10 dark:bg-gray-700 p-4 rounded-lg text-center hover:bg-opacity-20 transition-all">
                <h4 className="flex items-center justify-center gap-3 font-semibold mb-2">
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
              <div className="bg-white bg-opacity-10 dark:bg-gray-700 p-4 rounded-lg text-center hover:bg-opacity-20 transition-all">
                <h4 className="flex items-center justify-center gap-3 font-semibold mb-2">
                  <Mail className="w-5 h-5" /> Email
                </h4>
                <p className="text-sm">rdcjabones@gmail.com</p>
                <p className="text-xs opacity-90">Atención personalizada</p>
              </div>
            </Link>
            <Link
              href={"https://www.instagram.com/rdcjabones/"}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="bg-white bg-opacity-10 dark:bg-gray-700 p-4 rounded-lg text-center hover:bg-opacity-20 transition-all">
                <h4 className="flex items-center justify-center gap-3 font-semibold mb-2">
                  <Instagram className="w-5 h-5" /> Instagram
                </h4>
                <p className="text-sm">@rdcjabones</p>
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
              <div className="bg-white bg-opacity-10 dark:bg-gray-700 p-4 rounded-lg text-center hover:bg-opacity-20 transition-all">
                <h4 className="flex items-center justify-center gap-3 font-semibold mb-2">
                  <Facebook className="w-5 h-5" /> Facebook
                </h4>
                <p className="text-sm">RDC Jabones Artesanales</p>
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

export default SoapCatalogImproved;
