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
  GitCompare,
  Plus,
  Minus,
  Heart,
  ShoppingCart,
  ArrowLeft,
  Trash2,
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
  skinTypeCategory:
    | "seca"
    | "grasa"
    | "mixta"
    | "sensible"
    | "normal"
    | "todas";
  price: number;
  weight: string;
  badges: string[];
  gallery?: string[]; // Added galleAloery property
};

const SoapCatalogComparison = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [visibleProducts, setVisibleProducts] = useState(6);
  const [selectedFilter, setSelectedFilter] = useState<string>("todas");
  const [showFilters, setShowFilters] = useState(false);
  const [showFAQ, setShowFAQ] = useState<number | false>(false);
  const [compareProducts, setCompareProducts] = useState<Product[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  // Favorites state and logic
  const [favorites, setFavorites] = useState<number[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showProductDetail, setShowProductDetail] = useState(false);

  // Floating menu state
  const [showFloatingMenu, setShowFloatingMenu] = useState(false);

  // Cart state and logic
  type CartItem = {
    product: Product;
    quantity: number;
  };
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);

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

  // Cargar favoritos del localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem("soapFavorites");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Guardar favoritos en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem("soapFavorites", JSON.stringify(favorites));
  }, [favorites]);

  // Cargar carrito del localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("soapCart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem("soapCart", JSON.stringify(cart));
  }, [cart]);

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
      price: 2000,
      weight: "100g",
      badges: ["Más Vendido", "Vegano", "Orgánico"],
      gallery: ["/avenaymiel.png", "/avenaymiel.png", "/avenaymiel.png"],
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
      price: 3000,
      weight: "100g",
      badges: ["Vegano", "Relajante"],
      gallery: ["/lavanda.png", "/lavanda.png", "/lavanda.png"],
    },
    {
      id: 3,
      name: "Carbón Activado",
      subtitle: "Purificación profunda",
      icon: "⚫",
      image: "/carbona.jpg",
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
      price: 2000,
      weight: "100g",
      badges: ["Más Vendido", "Vegano"],
      gallery: ["/carbona.jpg", "/carbona.jpg", "/carbona.jpg"],
    },
    {
      id: 4,
      name: "Rosa Mosqueta",
      subtitle: "Anti-edad y regeneración",
      icon: "🌹",
      image: "/masajeadorr-500x500.png",
      ingredients: "Aceite de rosa mosqueta, pétalos de rosa, vitamina E",
      benefits: [
        "Reduce líneas de expresión",
        "Regenera la piel",
        "Atenúa cicatrices",
        "Rica en antioxidantes",
      ],
      skinType: "Ideal para piel madura",
      skinTypeCategory: "seca",
      price: 3000,
      weight: "100g",
      badges: ["Premium", "Anti-edad", "Vegano"],
      gallery: [
        "/masajeadorr-500x500.png",
        "/masajeadorr-500x500.png",
        "/masajeadorr-500x500.png",
      ],
    },
    {
      id: 5,
      name: "Coco & Cúrcuma",
      subtitle: "Brillo natural",
      icon: "🥥",
      image: "/curycoco.png",
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
      price: 2000,
      weight: "100g",
      badges: ["Vegano", "Iluminador"],
      gallery: ["/curycoco.png", "/curycoco.png", "/curycoco.png"],
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
      price: 2000,
      weight: "100g",
      badges: ["Vegano", "Refrescante"],
      gallery: ["/aloe.jpg", "/aloe.jpg", "/aloe.jpg"],
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
      price: 3000,
      weight: "100g",
      badges: ["Exfoliante", "Vegano"],
      gallery: ["/cafe.png", "/cafe.png", "/cafe.png"],
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
      price: 2000,
      weight: "100g",
      badges: ["Vegano", "Hipoalergénico"],
      gallery: ["/manzanilla.jpg", "/manzanilla.jpg", "/manzanilla.jpg"],
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
      price: 2000,
      weight: "100g",
      badges: ["Vegano", "Refrescante"],
      gallery: ["/eucalipto.png", "/eucalipto.png", "/eucalipto.png"],
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
      price: 2000,
      weight: "100g",
      badges: ["Vegano", "Nutritivo"],
      gallery: ["/chocolate.png", "/chocolate.png", "/chocolate.png"],
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
      price: 2000,
      weight: "100g",
      badges: ["Vegano", "Refrescante"],
      gallery: ["/menta.png", "/menta.png", "/menta.png"],
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
      price: 3000,
      weight: "100g",
      badges: ["Vegano", "Energizante"],
      gallery: ["/romero.png", "/romero.png", "/romero.png"],
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
      price: 2000,
      weight: "100g",
      badges: ["Vegano", "Nutritivo"],
      gallery: ["/calendula.png", "/calendula.png", "/calendula.png"],
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
      price: 2000,
      weight: "100g",
      badges: ["Vegano", "Purificante"],
      gallery: ["/limon.png", "/limon.png", "/limon.png"],
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
      price: 2000,
      weight: "100g",
      badges: ["Más Vendido", "Orgánico"],
      gallery: ["/miel.png", "/miel.png", "/miel.png"],
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
      price: 2000,
      weight: "100g",
      badges: ["Vegano", "Energizante"],
      gallery: ["/naranja.png", "/naranja.png", "/naranja.png"],
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
      price: 3000,
      weight: "100g",
      badges: ["Vegano", "Iluminador"],
      gallery: ["/arroz.png", "/arroz.png", "/arroz.png"],
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
      price: 3000,
      weight: "100g",
      badges: ["Vegano", "Relajante"],
      gallery: ["/jazmin.jpg", "/jazmin.jpg", "/jazmin.jpg"],
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
      gallery: ["/espirulina.jpg", "/espirulina.jpg", "/espirulina.jpg"],
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
      price: 2000,
      weight: "100g",
      badges: ["Vegano", "Hidratante"],
      gallery: ["/coco.jpg", "/coco.jpg", "/coco.jpg"],
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
      price: 3000,
      weight: "100g",
      badges: ["Vegano", "Energizante"],
      gallery: ["/mandarina.jpg", "/mandarina.jpg", "/mandarina.jpg"],
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
      price: 2000,
      weight: "100g",
      badges: ["Vegano", "Anti-edad"],
      gallery: ["/zanahoria.png", "/zanahoria.png", "/zanahoria.png"],
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
      price: 2000,
      weight: "100g",
      badges: ["Vegano", "Para Niños"],
      gallery: ["/tutti.png", "/tutti.png", "/tutti.png"],
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
      price: 2000,
      weight: "100g",
      badges: ["Vegano", "Refrescante"],
      gallery: ["/manzana.jpg", "/manzana.jpg", "/manzana.jpg"],
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
      price: 2000,
      weight: "100g",
      badges: ["Vegano", "Hipoalergénico"],
      gallery: ["/maicena.png", "/maicena.png", "/maicena.png"],
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
      price: 2000,
      weight: "100g",
      badges: ["Vegano", "Iluminador"],
      gallery: ["/arrozmaicena.png", "/arrozmaicena.png", "/arrozmaicena.png"],
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
      price: 2000,
      weight: "100g",
      badges: ["Vegano", "Anti-edad"],
      gallery: ["/uva.png", "/uva.png", "/uva.png"],
    },
    {
      id: 28,
      name: "Cúrcuma & Maicena",
      subtitle: "Equilibrio y luminosidad",
      icon: "✨",
      image: "/curcumamaicena.png",
      ingredients:
        "Cúrcuma natural en polvo, maicena pura, aceite de coco, manteca de karité, vitamina E",
      benefits: [
        "Ilumina y unifica el tono de la piel",
        "Propiedades antiinflamatorias naturales",
        "Absorbe impurezas y calma la piel",
        "Aporta suavidad y frescura duradera",
      ],
      skinType: "Ideal para piel sensible o con manchas",
      skinTypeCategory: "sensible",
      price: 3000,
      weight: "100g",
      badges: ["Vegano", "Iluminador"],
      gallery: [
        "/curcumamaicena.png",
        "/curcumamaicena.png",
        "/curcumamaicena.png",
      ],
    },
    {
      id: 29,
      name: "Vino Tinto Antioxidante",
      subtitle: "Regeneración y juventud",
      icon: "🍷",
      image: "/vino.png",
      ingredients:
        "Extracto de vino tinto, aceite de semilla de uva, manteca de karité, vitamina E",
      benefits: [
        "Rico en antioxidantes naturales",
        "Favorece la regeneración celular",
        "Aporta firmeza y elasticidad a la piel",
        "Previene el envejecimiento prematuro",
      ],
      skinType: "Ideal para piel madura o seca",
      skinTypeCategory: "seca",
      price: 3000,
      weight: "100g",
      badges: ["Vegano", "Anti-edad", "Premium"],
      gallery: ["/vino.png", "/vino.png", "/vino.png"],
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

  const toggleCompare = (product: Product) => {
    const isAlreadyComparing = compareProducts.find((p) => p.id === product.id);

    if (isAlreadyComparing) {
      setCompareProducts(compareProducts.filter((p) => p.id !== product.id));
    } else {
      if (compareProducts.length < 3) {
        setCompareProducts([...compareProducts, product]);
      }
    }
  };

  const isInComparison = (productId: number) => {
    return compareProducts.some((p) => p.id === productId);
  };

  // Favorites logic
  const toggleFavorite = (productId: number) => {
    if (favorites.includes(productId)) {
      setFavorites(favorites.filter((id) => id !== productId));
    } else {
      setFavorites([...favorites, productId]);
    }
  };

  const isFavorite = (productId: number) => {
    return favorites.includes(productId);
  };

  // Cart logic
  const addToCart = (product: Product, quantity = 1) => {
    const existingItem = cart.find((item) => item.product.id === product.id);

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      setCart([...cart, { product, quantity }]);
    }
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(
        cart.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getSubtotal = () => {
    return cart.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const generateWhatsAppMessage = () => {
    let message = "¡Hola! Me gustaría hacer el siguiente pedido:\n\n";

    cart.forEach((item, index) => {
      message += `${index + 1}. ${item.product.name}\n`;
      message += `   Cantidad: ${item.quantity}\n`;
      message += `   Subtotal: $${(item.product.price * item.quantity).toLocaleString()}\n\n`;
    });

    message += `Total: $${getSubtotal().toLocaleString()}\n\n`;
    message += "¿Podrían confirmar disponibilidad y costos de envío?";

    return encodeURIComponent(message);
  };

  const favoriteProducts = products.filter((p) => favorites.includes(p.id));

  const filteredProducts = showFavoritesOnly
    ? favoriteProducts
    : selectedFilter === "todas"
      ? products
      : products.filter((p) => p.skinTypeCategory === selectedFilter);

  const openProductDetail = (product: Product) => {
    setSelectedProduct(product);
    setShowProductDetail(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-500">
      {/* BOTONES SUPERIORES */}
      <div className="fixed top-4 right-4 z-50 flex flex-col sm:flex-row items-end gap-2">
        {/* BOTÓN DARK MODE */}
        <button
          onClick={toggleDarkMode}
          className="px-4 py-2 rounded-full bg-green-500 dark:bg-gray-700 text-white shadow-lg hover:scale-105 transition-transform"
        >
          {darkMode ? "🌞 Light" : "🌙 Dark"}
        </button>
        {/* BOTÓN FAVORITOS */}
        {favorites.length > 0 && (
          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`px-4 py-2 rounded-full shadow-lg hover:scale-105 transition-transform flex items-center gap-2 ${
              showFavoritesOnly
                ? "bg-red-500 text-white"
                : "bg-white dark:bg-gray-700 text-red-500 dark:text-red-400 border-2 border-red-500"
            }`}
          >
            <Heart
              className={`w-4 h-4 ${showFavoritesOnly ? "fill-current" : ""}`}
            />
            <span className="hidden sm:inline">
              Favoritos ({favorites.length})
            </span>
            <span className="sm:hidden">{favorites.length}</span>
          </button>
        )}
      </div>

      {/* BOTÓN FLOTANTE DE COMPARACIÓN */}
      {compareProducts.length > 0 && (
        <button
          onClick={() => setShowComparison(true)}
          className="fixed bottom-24 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-full shadow-2xl hover:scale-105 transition-all flex items-center gap-3 "
        >
          <GitCompare className="w-5 h-5" />
          <span className="font-semibold">
            Comparar ({compareProducts.length})
          </span>
        </button>
      )}

      {/* MENÚ FLOTANTE EXPANDIBLE */}
      <div className="fixed bottom-6 left-6 z-50 flex flex-col-reverse items-end gap-3">
        {/* Botones del menú expandido */}
        {showFloatingMenu && (
          <>
            {/* WhatsApp */}
            <Link
              href={`https://wa.me/${+543718462342}?text=${encodeURIComponent("¡Hola! Estoy interesado en sus productos.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 animate-in fade-in slide-in-from-right duration-300"
            >
              <span className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white px-4 py-2 rounded-lg shadow-lg text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                WhatsApp
              </span>
              <div className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-all">
                <MessageCircle className="w-7 h-7" />
              </div>
            </Link>

            {/* Instagram */}
            <Link
              href="https://www.instagram.com/rdcjabones/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 animate-in fade-in slide-in-from-right duration-300 delay-75"
            >
              <span className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white px-4 py-2 rounded-lg shadow-lg text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Instagram
              </span>
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 hover:scale-110 text-white flex items-center justify-center shadow-2xl transition-all">
                <Instagram className="w-7 h-7" />
              </div>
            </Link>

            {/* Facebook */}
            <Link
              href="https://www.facebook.com/profile.php?id=61581624413159"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 animate-in fade-in slide-in-from-right duration-300 delay-150"
            >
              <span className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white px-4 py-2 rounded-lg shadow-lg text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Facebook
              </span>
              <div className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-all">
                <Facebook className="w-7 h-7" />
              </div>
            </Link>

            {/* Email */}
            <Link
              href="mailto:rdcjabones@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 animate-in fade-in slide-in-from-right duration-300 delay-225"
            >
              <span className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white px-4 py-2 rounded-lg shadow-lg text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Email
              </span>
              <div className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-all">
                <Mail className="w-7 h-7" />
              </div>
            </Link>

            {/* Carrito (si hay items) */}
            {cart.length > 0 && (
              <button
                onClick={() => {
                  setShowCart(true);
                  setShowFloatingMenu(false);
                }}
                className="group flex items-center gap-3 animate-in fade-in slide-in-from-right duration-300 delay-300 "
              >
                <span className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white px-4 py-2 rounded-lg shadow-lg text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Ver Carrito ({getTotalItems()})
                </span>
                <div className="w-14 h-14 rounded-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-all">
                  <ShoppingCart className="w-7 h-7" />
                </div>
              </button>
            )}

            {/* Comparación (si hay productos) */}
            {compareProducts.length > 0 && (
              <button
                onClick={() => {
                  setShowComparison(true);
                  setShowFloatingMenu(false);
                }}
                className="group flex items-center gap-3 animate-in fade-in slide-in-from-right duration-300 delay-375"
              >
                <span className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white px-4 py-2 rounded-lg shadow-lg text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Comparar ({compareProducts.length})
                </span>
                <div className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-all">
                  <GitCompare className="w-7 h-7" />
                </div>
              </button>
            )}
          </>
        )}

        {/* Botón principal toggle */}
        <button
          onClick={() => setShowFloatingMenu(!showFloatingMenu)}
          className={`w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 ${
            showFloatingMenu
              ? "bg-red-500 hover:bg-red-600 "
              : "bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
          } text-white hover:scale-110`}
          aria-label={
            showFloatingMenu ? "Cerrar menú" : "Abrir menú de contacto"
          }
        >
          {showFloatingMenu ? (
            <X className="w-8 h-8 " />
          ) : (
            <MessageCircle className="w-8 h-8" />
          )}
        </button>
      </div>

      {/* BOTÓN FLOTANTE DEL CARRITO */}
      {cart.length > 0 && !showCart && (
        <button
          onClick={() => setShowCart(true)}
          className="fixed bottom-6 right-6 z-50 bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-full shadow-2xl hover:scale-105 transition-all flex items-center gap-3 animate-bounce"
        >
          <ShoppingCart className="w-5 h-5" />
          <span className="font-semibold">
            ({getTotalItems()}) ${getSubtotal().toLocaleString()}
          </span>
        </button>
      )}

      {/* MODAL DE COMPARACIÓN */}
      {showComparison && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-auto">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-auto">
            {/* Header del Modal */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-700 dark:to-blue-600 text-white px-2 py-4 md:px-6 md:py-4 flex justify-between items-center rounded-t-2xl z-10">
              <div className="flex items-center gap-3">
                <GitCompare className="w-6 h-6" />
                <h2 className="text-lg md:text-2xl font-bold">
                  Comparar Jabones
                </h2>
                <span className="bg-white bg-opacity-20 text-green-800 px-2 py-1  rounded-full ">
                  {compareProducts.length} de 3
                </span>
              </div>
              <button
                onClick={() => setShowComparison(false)}
                className="hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Contenido de la Comparación */}
            {compareProducts.length === 0 ? (
              <div className="p-12 text-center">
                <GitCompare className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  Selecciona hasta 3 jabones para compararlos
                </p>
              </div>
            ) : (
              <div className="p-6">
                {/* Vista Desktop - Tabla */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                        <th className="text-left py-4 px-4 text-gray-700 dark:text-gray-300 font-semibold">
                          Característica
                        </th>
                        {compareProducts.map((product) => (
                          <th key={product.id} className="py-4 px-4">
                            <div className="relative">
                              <button
                                onClick={() => toggleCompare(product)}
                                className="absolute top-0 right-0 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                              <div className="relative w-32 h-32 mx-auto mb-3 rounded-xl overflow-hidden">
                                <Image
                                  src={product.image || "/placeholder.svg"}
                                  alt={product.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <h3 className="font-bold text-gray-800 dark:text-gray-200">
                                {product.name}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {product.subtitle}
                              </p>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {/* Precio */}
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <td className="py-4 px-4 font-semibold text-gray-700 dark:text-gray-300">
                          Precio
                        </td>
                        {compareProducts.map((product) => (
                          <td
                            key={product.id}
                            className="py-4 px-4 text-center"
                          >
                            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                              ${product.price}
                            </p>
                            {/* <p className="text-sm text-gray-500">
                              {product.weight}
                            </p> */}
                          </td>
                        ))}
                      </tr>

                      {/* Badges */}
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <td className="py-4 px-4 font-semibold text-gray-700 dark:text-gray-300">
                          Características
                        </td>
                        {compareProducts.map((product) => (
                          <td key={product.id} className="py-4 px-4">
                            <div className="flex flex-wrap gap-2 justify-center">
                              {product.badges.map((badge, i) => (
                                <span
                                  key={i}
                                  className={`px-2 py-1 rounded-full text-xs font-semibold ${getBadgeColor(badge)}`}
                                >
                                  {badge}
                                </span>
                              ))}
                            </div>
                          </td>
                        ))}
                      </tr>

                      {/* Tipo de Piel */}
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <td className="py-4 px-4 font-semibold text-gray-700 dark:text-gray-300">
                          Tipo de Piel
                        </td>
                        {compareProducts.map((product) => (
                          <td
                            key={product.id}
                            className="py-4 px-4 text-center text-sm text-gray-600 dark:text-gray-400"
                          >
                            {product.skinType}
                          </td>
                        ))}
                      </tr>

                      {/* Ingredientes */}
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <td className="py-4 px-4 font-semibold text-gray-700 dark:text-gray-300">
                          Ingredientes
                        </td>
                        {compareProducts.map((product) => (
                          <td
                            key={product.id}
                            className="py-4 px-4 text-sm text-gray-600 dark:text-gray-400"
                          >
                            {product.ingredients}
                          </td>
                        ))}
                      </tr>

                      {/* Beneficios */}
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <td className="py-4 px-4 font-semibold text-gray-700 dark:text-gray-300">
                          Beneficios
                        </td>
                        {compareProducts.map((product) => (
                          <td key={product.id} className="py-4 px-4">
                            <ul className="space-y-2 text-sm text-left">
                              {product.benefits.map((benefit, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="text-green-500 mt-0.5">
                                    ✓
                                  </span>
                                  <span className="text-gray-600 dark:text-gray-400">
                                    {benefit}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </td>
                        ))}
                      </tr>

                      {/* Botón de Pedido */}
                      <tr>
                        <td className="py-4 px-4 font-semibold text-gray-700 dark:text-gray-300">
                          Acción
                        </td>
                        {compareProducts.map((product) => (
                          <td key={product.id} className="py-4 px-4">
                            <Link
                              href={`https://wa.me/${+543718462342}?text=${encodeURIComponent(
                                `¡Hola! Estoy interesado en el jabón ${product.name} ($${product.price} )`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors text-center"
                            >
                              Pedir por WhatsApp
                            </Link>
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Vista Mobile - Cards */}
                <div className="lg:hidden space-y-6">
                  {compareProducts.map((product) => (
                    <div
                      key={product.id}
                      className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 relative border-2 border-gray-200 dark:border-gray-700"
                    >
                      <button
                        onClick={() => toggleCompare(product)}
                        className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-colors z-10"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <div className="relative w-full h-48 mb-4 rounded-xl overflow-hidden">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-1">
                        {product.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {product.subtitle}
                      </p>
                      setCompareProducts
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Precio:
                          </p>
                          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                            $setCompareProducts{product.price}{" "}
                            {/* <span className="text-sm text-gray-500">
                              ({product.weight})
                            </span> */}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Características:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {product.badges.map((badge, i) => (
                              <span
                                key={i}
                                className={`px-2 py-1 rounded-full text-xs font-semibold ${getBadgeColor(badge)}`}
                              >
                                {badge}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Tipo de Piel:
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {product.skinType}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Ingredientes:
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {product.ingredients}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Beneficios:
                          </p>
                          <ul className="space-y-2">
                            {product.benefits.map((benefit, i) => (
                              <li
                                setCompareProducts
                                key={i}
                                className="flex items-start gap-2 text-sm"
                              >
                                <span className="text-green-500 mt-0.5">✓</span>
                                setCompareProducts{" "}
                                <span className="text-gray-600 dark:text-gray-400">
                                  {benefit}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <Link
                          href={`https://wa.me/${+543718462342}?text=${encodeURIComponent(
                            `¡Hola! Estoy interesado en el jabón ${product.name} ($${product.price} )`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-semibold transition-colors text-center"
                        >
                          Pedir por WhatsApp
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Botón para Limpiar Comparación */}
                <div className="mt-6 text-center">
                  <button
                    onClick={() => setCompareProducts([])}
                    className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors"
                  >
                    Limpiar Comparación
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL DE DETALLES DEL PRODUCTO */}
      {showProductDetail && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-auto">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-green-600 to-green-500 text-white px-6 py-4 flex justify-between items-center rounded-t-2xl z-10">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selectedProduct.icon}</span>
                <div>
                  <h2 className="text-2xl font-bold">{selectedProduct.name}</h2>
                  <p className="text-green-100 text-sm">
                    {selectedProduct.subtitle}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowProductDetail(false)}
                className="hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Contenido */}
            <div className="p-6 lg:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Columna Izquierda - Imagen y Badges */}
                <div>
                  {/* Imagen Principal */}
                  <div className="relative w-full h-80 rounded-2xl overflow-hidden mb-6 bg-gray-100 dark:bg-gray-800 group">
                    <Image
                      src={selectedProduct.image || "/placeholder.svg"}
                      alt={selectedProduct.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {selectedProduct.badges.map((badge, i) => (
                      <span
                        key={i}
                        className={`px-3 py-1.5 rounded-full text-sm font-semibold ${getBadgeColor(badge)}`}
                      >
                        {badge}
                      </span>
                    ))}
                  </div>

                  {/* Precio y Peso */}
                  <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6 border-2 border-green-200 dark:border-gray-600">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          Precio
                        </p>
                        <p className="text-4xl font-bold text-green-600 dark:text-green-400">
                          ${selectedProduct.price.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        {/* <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          Peso
                        </p> */}
                        {/* <p className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                          {selectedProduct.weight}
                        </p> */}
                      </div>
                    </div>

                    {/* Botones de acción */}
                    <div className="space-y-3 ">
                      <button
                        onClick={() => {
                          addToCart(selectedProduct);
                          setShowProductDetail(false);
                          setShowCart(true);
                        }}
                        className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 shadow-lg"
                      >
                        <ShoppingCart className="w-5 h-5" />
                        Añadir al carrito
                      </button>

                      <Link
                        href={`https://wa.me/${+543718462342}?text=${encodeURIComponent(
                          `¡Hola! Quiero más información sobre el jabón ${selectedProduct.name} ($${selectedProduct.price} )`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-white dark:bg-gray-700 border-2 border-green-600 text-green-600 dark:text-green-400 px-6 py-4 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 hover:bg-green-50 dark:hover:bg-gray-600"
                      >
                        <MessageCircle className="w-5 h-5" />
                        Consultar por WhatsApp
                      </Link>

                      <button
                        onClick={() => toggleFavorite(selectedProduct.id)}
                        className={`w-full px-6 py-4 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 ${
                          isFavorite(selectedProduct.id)
                            ? "bg-red-500 text-white hover:bg-red-600"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-gray-600"
                        }`}
                      >
                        <Heart
                          className={`w-5 h-5 ${isFavorite(selectedProduct.id) ? "fill-current" : ""}`}
                        />
                        {isFavorite(selectedProduct.id)
                          ? "Quitar de favoritos"
                          : "Agregar a favoritos"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Columna Derecha - Información */}
                <div className="space-y-6">
                  {/* Tipo de Piel */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                      <span className="text-green-600 dark:text-green-400">
                        🎯
                      </span>
                      Tipo de Piel
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 bg-green-50 dark:bg-gray-800 p-4 rounded-lg border-l-4 border-green-500">
                      {selectedProduct.skinType}
                    </p>
                  </div>

                  {/* Ingredientes */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                      <span className="text-green-600 dark:text-green-400">
                        🌿
                      </span>
                      Ingredientes Principales
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg leading-relaxed">
                      {selectedProduct.ingredients}
                    </p>
                  </div>

                  {/* Beneficios */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                      <span className="text-green-600 dark:text-green-400">
                        ✨
                      </span>
                      Beneficios
                    </h3>
                    <ul className="space-y-3">
                      {selectedProduct.benefits.map((benefit, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-3 text-gray-700 dark:text-gray-300 bg-gradient-to-r from-green-50 to-white dark:from-gray-800 dark:to-gray-700 p-3 rounded-lg border-l-4 border-green-400"
                        >
                          <span className="text-green-500 dark:text-green-400 mt-0.5 text-xl">
                            ✓
                          </span>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Modo de Uso */}
                  <div className="bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20 p-5 rounded-xl border border-blue-200 dark:border-blue-700">
                    <h3 className="text-lg font-bold text-blue-800 dark:text-blue-300 mb-3 flex items-center gap-2">
                      <span>💡</span>
                      Modo de Uso
                    </h3>
                    <ol className="space-y-2 text-gray-700 dark:text-gray-300">
                      <li className="flex items-start gap-2">
                        <span className="font-semibold text-blue-600 dark:text-blue-400">
                          1.
                        </span>
                        <span>Humedece tu piel con agua tibia</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-semibold text-blue-600 dark:text-blue-400">
                          2.
                        </span>
                        <span>
                          Aplica el jabón en movimientos circulares suaves
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-semibold text-blue-600 dark:text-blue-400">
                          3.
                        </span>
                        <span>
                          Deja actuar unos segundos para que los ingredientes
                          penetren
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-semibold text-blue-600 dark:text-blue-400">
                          4.
                        </span>
                        <span>Enjuaga con abundante agua</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-semibold text-blue-600 dark:text-blue-400">
                          5.
                        </span>
                        <span>Seca con una toalla suave dando toquecitos</span>
                      </li>
                    </ol>
                  </div>

                  {/* Conservación */}
                  <div className="bg-amber-50 dark:bg-amber-900 dark:bg-opacity-20 p-5 rounded-xl border border-amber-200 dark:border-amber-700">
                    <h3 className="text-lg font-bold text-amber-800 dark:text-amber-300 mb-3 flex items-center gap-2">
                      <span>🧼</span>
                      Consejos de Conservación
                    </h3>
                    <ul className="space-y-2 text-gray-700 dark:text-gray-300 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-amber-500">•</span>
                        <span>Guarda en un lugar seco y ventilado</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-500">•</span>
                        <span>Usa una jabonera con drenaje</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-500">•</span>
                        <span>Evita el contacto prolongado con el agua</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-500">•</span>
                        <span>
                          Duración aproximada: 4-6 semanas con uso diario
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DEL CARRITO */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-auto">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-green-600 to-green-500 text-white px-6 py-4 flex justify-between items-center rounded-t-2xl z-10 ">
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-6 h-6" />
                <h2 className="text-lg md:text-2xl font-bold">Mi Carrito</h2>
                <span className="bg-white bg-opacity-20 text-green-800 px-3 py-1 rounded-full ">
                  {getTotalItems()} items
                </span>
              </div>
              <button
                onClick={() => setShowCart(false)}
                className="hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Contenido del Carrito */}
            {cart.length === 0 ? (
              <div className="p-12 text-center">
                <ShoppingCart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 dark:text-gray-400 text-lg mb-6">
                  Tu carrito está vacío
                </p>
                <button
                  onClick={() => setShowCart(false)}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full font-semibold transition-colors"
                >
                  Seguir comprando
                </button>
              </div>
            ) : (
              <div className="p-0 md:p-6">
                {/* Lista de productos */}
                <div className="space-y-4 mb-6">
                  {cart.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex gap-4 bg-gray-50 dark:bg-gray-800 py-4 px-0 md:p-6 rounded-lg border border-gray-200 dark:border-gray-700"
                    >
                      {/* Imagen */}
                      <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                        <Image
                          src={item.product.image || "/placeholder.svg"}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-800 dark:text-gray-200">
                          {item.product.name}
                        </h3>
                        {/* <p className="text-sm text-gray-600 dark:text-gray-400">
                          {item.product.weight}
                        </p> */}
                        <p className="text-lg font-bold text-green-600 dark:text-green-400 mt-1">
                          ${item.product.price.toLocaleString()}
                        </p>
                      </div>

                      {/* Controles de cantidad */}
                      <div className="flex flex-col items-end gap-2 p-1">
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-red-500 hover:text-red-600 p-1"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="flex items-center gap-0 md:gap-2 bg-white dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600">
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity - 1)
                            }
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-l-lg transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-3 font-semibold min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity + 1)
                            }
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-r-lg transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 p-2 mt-2 bg-green-50 dark:bg-gray-800 rounded-lg">
                          $
                          {(
                            item.product.price * item.quantity
                          ).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Resumen */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 p-6 space-y-3">
                  <div className="flex justify-between text-lg">
                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                      Subtotal:
                    </span>
                    <span className="font-bold text-gray-800 dark:text-gray-200">
                      ${getSubtotal().toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>Total de productos:</span>
                    <span>{getTotalItems()} unidades</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                    * El costo de envío se calculará al confirmar el pedido
                  </p>
                </div>

                {/* Botones de acción */}
                <div className="mt-6 space-y-3">
                  <Link
                    href={`https://wa.me/${+543718462342}?text=${generateWhatsAppMessage()}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-xl font-semibold transition-colors text-center flex items-center justify-center gap-2 shadow-lg"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Enviar pedido por WhatsApp
                  </Link>

                  <div className="flex gap-3">
                    <button
                      onClick={clearCart}
                      className="flex-1 bg-red-100 dark:bg-red-900 dark:bg-opacity-20 text-red-600 dark:text-white px-4 py-3 rounded-xl font-semibold hover:bg-red-200 dark:hover:bg-red-500 dark:hover:bg-opacity-30 transition-colors"
                    >
                      Vaciar carrito
                    </button>
                    <button
                      onClick={() => setShowCart(false)}
                      className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-3 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                      Seguir comprando
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto bg-white dark:bg-gray-900 shadow-2xl rounded-lg overflow-hidden transition-colors duration-500">
        {/* PORTADA */}
        <div className="bg-gradient-to-br from-green-700 via-green-600 to-green-500 px-6 py-16 text-center text-white">
          <Image
            src="/logo.png"
            alt="logo"
            width={140}
            height={40}
            className="mx-auto mb-4"
          />
          <h1 className="text-4xl font-bold mb-2">Regalos del Corazón</h1>
          <p className="text-2xl font-semibold">Jabones Artesanales</p>
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
                      setShowFavoritesOnly(false); // Desactivar filtro de favoritos al cambiar filtro de piel
                      setVisibleProducts(6);
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedFilter === filter.value && !showFavoritesOnly
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

            {(selectedFilter !== "todas" || showFavoritesOnly) && (
              <div className="mt-4 flex items-center justify-between bg-white dark:bg-gray-700 p-3 rounded-lg">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {showFavoritesOnly
                    ? `Mostrando ${favoriteProducts.length} productos favoritos`
                    : `Mostrando ${filteredProducts.length} productos para ${skinTypeFilters.find((f) => f.value === selectedFilter)?.label}`}
                </span>
                <button
                  onClick={() => {
                    setSelectedFilter("todas");
                    setShowFavoritesOnly(false);
                  }}
                  className="text-sm text-green-600 dark:text-green-400 hover:underline flex items-center gap-1"
                >
                  <X className="w-4 h-4" />
                  Limpiar filtros
                </button>
              </div>
            )}
          </div>
        </section>

        {/* PRODUCTOS */}
        <section className="px-6 sm:px-10 py-12">
          <div className="flex items-center justify-between mb-6">
            {showFavoritesOnly && (
              <button
                onClick={() => setShowFavoritesOnly(false)}
                className="text-green-600 dark:text-green-400 hover:underline flex items-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Volver a todos los productos
              </button>
            )}
            <h2 className="text-2xl sm:text-3xl font-bold text-green-700 dark:text-green-300 mb-0 text-center flex-grow border-b-4 border-green-300 dark:border-green-600 pb-4">
              {showFavoritesOnly ? "Mis Favoritos" : "Nuestra Colección"}
            </h2>
            {
              showFavoritesOnly && (
                <div className="w-40"></div>
              ) /* Placeholder to balance the header */
            }
          </div>

          {/* Mensaje si no hay favoritos */}
          {showFavoritesOnly && favorites.length === 0 && (
            <div className="p-12 text-center">
              <Heart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-6">
                Tu lista de favoritos está vacía
              </p>
              <button
                onClick={() => {
                  setShowFavoritesOnly(false);
                  setSelectedFilter("todas"); // Resetear filtro de piel al explorar
                }}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full font-semibold transition-colors"
              >
                Explorar productos
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.slice(0, visibleProducts).map((product) => (
              <div
                key={product.id}
                onClick={() => openProductDetail(product)}
                className={`bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-6 shadow-lg dark:shadow-gray-900 hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 border-2 ${
                  isInComparison(product.id)
                    ? "border-blue-500 dark:border-blue-400"
                    : isFavorite(product.id)
                      ? "border-red-500 dark:border-red-400"
                      : "border-green-200 dark:border-gray-600"
                } flex flex-col relative`}
              >
                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-3 ">
                  {" "}
                  {/* Added mt-12 to make space for favorite/compare buttons */}
                  {product.badges.map((badge, i) => (
                    <span
                      key={i}
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${getBadgeColor(badge)}`}
                    >
                      {badge}
                    </span>
                  ))}
                  {/* Botón de Comparar */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCompare(product);
                    }}
                    disabled={
                      !isInComparison(product.id) && compareProducts.length >= 3
                    }
                    className={`absolute top-3 right-3 z-10 p-2 rounded-full transition-all ${
                      isInComparison(product.id)
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : compareProducts.length >= 3
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-gray-600"
                    }`}
                    title={
                      isInComparison(product.id)
                        ? "Quitar de comparación"
                        : "Agregar a comparación"
                    }
                  >
                    {isInComparison(product.id) ? (
                      <Minus className="w-5 h-5" />
                    ) : (
                      <Plus className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* Imagen */}
                <div className="relative w-full h-40 sm:h-48 mb-6 rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-700 group">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                  {/* Botón Favorito - top left */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(product.id);
                    }}
                    className={`absolute top-3 right-3 z-10 p-2 rounded-full transition-all ${
                      isFavorite(product.id)
                        ? "bg-red-500 text-white hover:bg-red-600"
                        : "bg-white dark:bg-gray-700 text-red-500 dark:text-red-300 hover:bg-red-50 dark:hover:bg-gray-600"
                    }`}
                    title={
                      isFavorite(product.id)
                        ? "Quitar de favoritos"
                        : "Agregar a favoritos"
                    }
                  >
                    <Heart
                      className={`w-5 h-5 ${isFavorite(product.id) ? "fill-current" : ""}`}
                    />
                  </button>
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
                    {/* <p className="text-xs text-gray-500 dark:text-gray-400">
                      {product.weight}
                    </p> */}
                  </div>
                  <Link
                    href={`https://wa.me/${+543718462342}?text=${encodeURIComponent(
                      `¡Hola! Estoy interesado en el jabón ${product.name} ($${product.price} )`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className=" bg-white dark:bg-gray-800 border-2 border-green-600 text-green-600 dark:text-green-400 px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 hover:bg-green-50 dark:hover:bg-gray-700"
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
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(product);
                  }}
                  className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Añadir al carrito
                </button>
              </div>
            ))}
          </div>

          {/* BOTÓN VER MÁS */}
          {visibleProducts < filteredProducts.length && !showFavoritesOnly && (
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

export default SoapCatalogComparison;
