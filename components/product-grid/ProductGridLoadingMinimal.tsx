"use client";

import { Sparkles } from "lucide-react";
import Container from "../Container";

const ProductGridLoadingMinimal = () => {
  return (
    <Container className="flex flex-col lg:px-0 my-10">
      {/* Tab bar simple */}
      <div className="flex justify-center mb-6">
        <div className="flex space-x-1 bg-gray-50 p-1 rounded-full">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-10 bg-gray-200 rounded-full animate-pulse"
              style={{
                width:
                  i === 1
                    ? "80px"
                    : i === 2
                      ? "100px"
                      : i === 3
                        ? "90px"
                        : "85px",
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Loading central minimalista */}
      <div className="flex flex-col items-center justify-center py-20 space-y-6">
        {/* Jabón simple */}
        <div className="relative">
          <div className="w-16 h-12 bg-gradient-to-br from-pink-300 to-blue-300 rounded-lg shadow-lg animate-pulse">
            <div className="absolute inset-1 bg-gradient-to-br from-white/40 to-transparent rounded-md"></div>
          </div>
          <Sparkles
            className="absolute -top-2 -right-2 w-4 h-4 text-pink-400 animate-spin"
            style={{ animationDuration: "2s" }}
          />
        </div>

        {/* Texto elegante */}
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold text-gray-700">
            Cargando productos
          </h3>
          <div className="flex justify-center space-x-1">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Button skeleton */}
      <div className="text-center">
        <div className="h-12 bg-gray-200 rounded-full animate-pulse w-64 mx-auto"></div>
      </div>
    </Container>
  );
};

export default ProductGridLoadingMinimal;
