"use client";

import Container from "@/components/Container";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "./ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Product } from "@/sanity.types";

const BreadcrumbComponent = ({ product }: { product: Product | null }) => {
  return (
    <div className=" bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300 border-b">
      <Container className="">
        <div className="flex items-center justify-between">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  href="/"
                  className="text-gray-600  bg-white  dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300 hover:text-gray-900"
                >
                  Inicio
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink
                  href="/shop"
                  className="text-gray-600  bg-white  dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300 hover:text-gray-900"
                >
                  Productos
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <span className="text-gray-900  bg-white  dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300 font-medium line-clamp-1">
                  {product?.name}
                </span>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <Button variant="ghost" size="sm" asChild className="hidden sm:flex">
            <Link href="/shop" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Volver a productos
            </Link>
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default BreadcrumbComponent;
