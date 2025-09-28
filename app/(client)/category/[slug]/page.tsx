import CategoryProducts from "@/components/CategoryProducts";
import Container from "@/components/Container";
import { getCategories } from "@/sanity/queries";
import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const CategoryPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const categories = await getCategories();
  return (
    <div className="min-h-screen bg-gray-50/30 dark:bg-gray-900">
      {/* Breadcrumb Section */}
      <div className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
        <Container className="py-4">
          <div className="flex items-center justify-between">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href="/"
                    className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    Inicio
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href="/shop"
                    className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    Productos
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <span className="text-gray-900 font-medium capitalize dark:text-gray-100">
                    {slug && slug}
                  </span>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <Button
              variant="ghost"
              size="sm"
              asChild
              className="hidden sm:flex text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
            >
              <Link href="/shop" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Volver a productos
              </Link>
            </Button>
          </div>
        </Container>
      </div>
      <div className="py-10">
        <Container>
          <CategoryProducts categories={categories} slug={slug} />
        </Container>
      </div>
    </div>
  );
};

export default CategoryPage;
