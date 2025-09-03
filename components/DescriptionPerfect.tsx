"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface DescriptionPerfectProps {
  description: string;
  maxLines?: number;
  className?: string;
}

const DescriptionPerfect = ({
  description,
  maxLines = 6,
  className = "",
}: DescriptionPerfectProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);
  const [measurements, setMeasurements] = useState({
    lineHeight: 27,
    collapsedHeight: 0,
    fullHeight: 0,
  });

  useEffect(() => {
    if (textRef.current) {
      const computedStyle = getComputedStyle(textRef.current);
      const lineHeight = Number.parseInt(computedStyle.lineHeight) || 27;
      const collapsedHeight = lineHeight * maxLines;
      const fullHeight = textRef.current.scrollHeight;

      setMeasurements({ lineHeight, collapsedHeight, fullHeight });
      setShowReadMore(fullHeight > collapsedHeight);
    }
  }, [description, maxLines]);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const fadeHeight = measurements.lineHeight * 2.5;

  return (
    <div
      className={`bg-white p-6 rounded-lg shadow-sm mb-5 border border-gray-200 ${className}`}
    >
      <h3 className="text-xl font-semibold mb-4 text-gray-900 font-inter">
        Descripción
      </h3>

      <div className="relative">
        {/* Contenedor principal del texto */}
        <div
          ref={textRef}
          className={`whitespace-pre-line font-inter text-xl font-normal leading-[27px] transition-all duration-500 ease-out ${
            isExpanded ? "max-h-none" : "overflow-hidden"
          }`}
          style={{
            color: "rgba(0,0,0,.55)",
            maxHeight: isExpanded
              ? "none"
              : `${measurements.collapsedHeight}px`,
          }}
        >
          {description}
        </div>

        {/* Sistema de desvanecimiento perfeccionado */}
        {!isExpanded && showReadMore && (
          <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
            {/* Gradiente de fondo ultra suave */}
            <div
              className="absolute bottom-0 left-0 right-0"
              style={{
                height: `${fadeHeight}px`,
                background: `linear-gradient(180deg, 
                  hsla(0,0%,100%,0) 0%,
                  hsla(0,0%,100%,.013) 8.1%,
                  hsla(0,0%,100%,.049) 15.5%,
                  hsla(0,0%,100%,.104) 22.5%,
                  hsla(0,0%,100%,.175) 29%,
                  hsla(0,0%,100%,.259) 35.3%,
                  hsla(0,0%,100%,.352) 41.2%,
                  hsla(0,0%,100%,.450) 47.1%,
                  hsla(0,0%,100%,.550) 52.9%,
                  hsla(0,0%,100%,.648) 58.8%,
                  hsla(0,0%,100%,.741) 64.7%,
                  hsla(0,0%,100%,.825) 71%,
                  hsla(0,0%,100%,.896) 77.5%,
                  hsla(0,0%,100%,.951) 84.5%,
                  hsla(0,0%,100%,.987) 91.9%,
                  hsla(0,0%,100%,1) 100%)`,
              }}
            />

            {/* Texto con desvanecimiento natural */}
            <div
              className="absolute bottom-0 left-0 right-0 whitespace-pre-line font-inter text-xl font-normal leading-[27px]"
              style={{
                height: `${fadeHeight * 0.8}px`,
                color: "rgba(0,0,0,.45)",
                maskImage: `linear-gradient(to bottom, 
                  rgba(0,0,0,1) 0%,
                  rgba(0,0,0,.987) 8.1%,
                  rgba(0,0,0,.951) 15.5%,
                  rgba(0,0,0,.896) 22.5%,
                  rgba(0,0,0,.825) 29%,
                  rgba(0,0,0,.741) 35.3%,
                  rgba(0,0,0,.648) 41.2%,
                  rgba(0,0,0,.550) 47.1%,
                  rgba(0,0,0,.450) 52.9%,
                  rgba(0,0,0,.352) 58.8%,
                  rgba(0,0,0,.259) 64.7%,
                  rgba(0,0,0,.175) 71%,
                  rgba(0,0,0,.104) 77.5%,
                  rgba(0,0,0,.049) 84.5%,
                  rgba(0,0,0,.013) 91.9%,
                  rgba(0,0,0,0) 100%)`,
                WebkitMaskImage: `linear-gradient(to bottom, 
                  rgba(0,0,0,1) 0%,
                  rgba(0,0,0,.987) 8.1%,
                  rgba(0,0,0,.951) 15.5%,
                  rgba(0,0,0,.896) 22.5%,
                  rgba(0,0,0,.825) 29%,
                  rgba(0,0,0,.741) 35.3%,
                  rgba(0,0,0,.648) 41.2%,
                  rgba(0,0,0,.550) 47.1%,
                  rgba(0,0,0,.450) 52.9%,
                  rgba(0,0,0,.352) 58.8%,
                  rgba(0,0,0,.259) 64.7%,
                  rgba(0,0,0,.175) 71%,
                  rgba(0,0,0,.104) 77.5%,
                  rgba(0,0,0,.049) 84.5%,
                  rgba(0,0,0,.013) 91.9%,
                  rgba(0,0,0,0) 100%)`,
                overflow: "hidden",
              }}
            >
              {description
                .split("\n")
                .slice(Math.max(0, maxLines - 3))
                .join("\n")}
            </div>

            {/* Capa de blur micro para realismo */}
            <div
              className="absolute bottom-0 left-0 right-0 whitespace-pre-line font-inter text-xl font-normal leading-[27px]"
              style={{
                height: `${measurements.lineHeight * 1.5}px`,
                color: "rgba(0,0,0,.25)",
                filter: "blur(0.2px)",
                maskImage: `linear-gradient(to bottom, 
                  rgba(0,0,0,.3) 0%,
                  rgba(0,0,0,.2) 25%,
                  rgba(0,0,0,.1) 50%,
                  rgba(0,0,0,.05) 75%,
                  rgba(0,0,0,0) 100%)`,
                WebkitMaskImage: `linear-gradient(to bottom, 
                  rgba(0,0,0,.3) 0%,
                  rgba(0,0,0,.2) 25%,
                  rgba(0,0,0,.1) 50%,
                  rgba(0,0,0,.05) 75%,
                  rgba(0,0,0,0) 100%)`,
                overflow: "hidden",
              }}
            >
              {description.split("\n").slice(-2).join("\n")}
            </div>
          </div>
        )}
      </div>

      {/* Botón con animaciones perfectas */}
      {showReadMore && (
        <div className="mt-4 flex justify-start">
          <button
            onClick={toggleExpanded}
            className="group flex items-center gap-1.5 text-blue-500 hover:text-blue-700 text-sm font-medium transition-all duration-300 font-inter hover:bg-blue-50 px-3 py-1.5 rounded-md -ml-3 active:scale-95"
          >
            <span className="transition-all duration-200">
              {isExpanded ? "Ver menos" : "Ver más"}
            </span>
            <div
              className={`transition-all duration-500 ease-out ${
                isExpanded ? "rotate-180" : "rotate-0"
              } group-hover:scale-110 group-active:scale-90`}
            >
              <ChevronDown className="w-4 h-4" />
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

export default DescriptionPerfect;
